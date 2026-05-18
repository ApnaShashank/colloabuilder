import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Job from "@/lib/models/Job";
import User from "@/lib/models/User";
import SystemConfig from "@/lib/models/SystemConfig";
import { getSession } from "@/lib/auth";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

function buildJobQuery(params: Record<string, string>): string {
  const parts: string[] = [];
  const currentMonthYear = new Date().toLocaleString("en-US", { month: "long", year: "numeric" }); // e.g., "April 2026"

  if (params.q) parts.push(params.q);
  if (params.type && params.type !== "Any") {
    if (params.type === "Internship") parts.push("internship program");
    else if (params.type === "Hackathon") parts.push("hackathon event bounty 2024");
    else parts.push(params.type + " job");
  }
  
  if (params.workMode && params.workMode !== "Any") parts.push(params.workMode);
  if (params.experienceLevel && params.experienceLevel !== "Any") parts.push(params.experienceLevel + " level");
  if (params.location) parts.push("in " + params.location);
  if (params.tags) parts.push(params.tags);

  // Focus on 2026 and specific freshness
  parts.push(`hiring ${currentMonthYear}`);
  parts.push("newly posted");
  
  return parts.join(" ");
}

async function searchWithTavily(query: string): Promise<any[]> {
  try {
    // Adding sites like LinkedIn, Wellfound, and major ATS platforms to increase diversity
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TAVILY_API_KEY}` },
      body: JSON.stringify({
        query: `${query} -site:indeed.com`, // Encourage non-indeed results from Tavily
        search_depth: "advanced",
        max_results: 15,
        days: 14, // Force freshness within last 14 days
        include_domains: [
          "linkedin.com", "glassdoor.com", "wellfound.com", 
          "levels.fyi", "cryptojobslist.com", "remoteok.com", 
          "weworkremotely.com", "lever.co", "greenhouse.io"
        ],
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Tavily error:", err);
    return [];
  }
}

async function searchWithSerpApi(query: string): Promise<any[]> {
  try {
    // Adding 'date_posted' chips to SerpAPI if supported, but typically adding keywords works best
    // Google Jobs parameters: ltype=1 for remote
    let url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query + " :today")}&api_key=${SERPAPI_KEY}`;
    
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.jobs_results || [];
  } catch (err) {
    console.error("SerpAPI error:", err);
    return [];
  }
}

function parseTavilyResult(result: any, params: Record<string, string>): any {
  const titleMatch = result.title?.match(/^(.+?)\s*[-|–]\s*(.+)$/);
  const title = titleMatch ? titleMatch[1].trim() : result.title || params.q || "Software Engineer";
  const company = titleMatch ? titleMatch[2].trim() : "Company";

  return {
    title,
    company,
    location: params.location || "Remote",
    workMode: params.workMode !== "Any" ? params.workMode : "Remote",
    type: params.type !== "Any" ? params.type : "Full-time",
    experienceLevel: params.experienceLevel !== "Any" ? params.experienceLevel : "Mid",
    description: result.content?.slice(0, 1000) || result.snippet || "Job details available via the application link.",
    url: result.url || "",
    tags: params.tags ? params.tags.split(",").map((t: string) => t.trim()) : [],
    source: "ai_tavily",
    sourceRaw: JSON.stringify(result),
    isActive: true,
  };
}

function parseSerpApiResult(result: any, params: Record<string, string>): any {
  return {
    title: result.title || params.q || "Software Engineer",
    company: result.company_name || "Company",
    location: result.location || params.location || "Remote",
    workMode: params.workMode !== "Any" ? params.workMode : "Remote",
    type: params.type !== "Any" ? params.type : "Full-time",
    experienceLevel: params.experienceLevel !== "Any" ? params.experienceLevel : "Mid",
    salary: result.detected_extensions?.salary_range || "",
    description: result.description?.slice(0, 1000) || "Job details available via the application link.",
    url: result.related_links?.[0]?.link || result.job_link || "",
    tags: params.tags ? params.tags.split(",").map((t: string) => t.trim()) : [],
    source: "ai_serpapi",
    sourceRaw: JSON.stringify(result),
    isActive: true,
  };
}

export async function POST(req: Request) {
  try {
    const params = await req.json();
    await connectDB();

    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ADMIN_EMAIL = "shashank8808108802@gmail.com";
    const isTargetAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isAdmin = user.isAdmin || isTargetAdmin;

    // Fetch dynamic limits from DB
    let config = await SystemConfig.findOne({ key: "main_config" });
    const maxFree = config?.maxFreeAiJobSearches ?? 3;

    if (!isAdmin && user.plan !== "pro") {
      if ((user.aiJobSearchCount || 0) >= maxFree) {
        return NextResponse.json({
          error: "pro_required",
          message: `You have reached your limit of ${maxFree} free AI searches. Upgrade to Pro for unlimited searches!`,
          aiJobSearchCount: user.aiJobSearchCount,
          maxFree
        }, { status: 403 });
      }

      // Increment search usage
      user.aiJobSearchCount = (user.aiJobSearchCount || 0) + 1;
      await user.save();
    }

    const query = buildJobQuery(params);

    // Run both searches in parallel for maximum diversity
    const [serpResults, tavilyResults] = await Promise.all([
      searchWithSerpApi(query),
      searchWithTavily(query),
    ]);

    const jobsToSave: any[] = [];

    // Prioritize SerpAPI for core jobs but limit to avoid Indeed saturation if present
    const serpLimit = 5;
    for (const r of serpResults.slice(0, serpLimit)) {
      jobsToSave.push(parseSerpApiResult(r, params));
    }

    // Always include Tavily results for source diversity (niche boards)
    const tavilyLimit = 5;
    for (const r of tavilyResults.slice(0, tavilyLimit)) {
       // Avoid simple duplicates if possible (rudimentary check by title/company)
       const isDuplicate = jobsToSave.some(j => j.title === r.title && j.company === r.company);
       if (!isDuplicate) {
         jobsToSave.push(parseTavilyResult(r, params));
       }
    }

    if (jobsToSave.length === 0) {
      return NextResponse.json({
        success: true,
        jobs: [],
        message: "No results found. Try different keywords.",
      });
    }

    // Save to DB (upsert by URL to avoid duplicates)
    const savedJobs: any[] = [];
    for (const jobData of jobsToSave) {
      try {
        const query = jobData.url
          ? { url: jobData.url }
          : { title: jobData.title, company: jobData.company };

        const saved = await Job.findOneAndUpdate(
          query,
          { $setOnInsert: { ...jobData, createdAt: new Date() } },
          { upsert: true, new: true }
        );
        savedJobs.push(saved);
      } catch {
        // Skip duplicate entries
      }
    }

    return NextResponse.json({ success: true, jobs: savedJobs, total: savedJobs.length });
  } catch (error) {
    console.error("AI job search error:", error);
    return NextResponse.json({ error: "AI Search failed" }, { status: 500 });
  }
}
