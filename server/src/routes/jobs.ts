import express from "express";
import Job from "../models/Job";

const router = express.Router();

const fallbackJobs = [
  // --- CAREERS (Full-time) ---
  {
    title: "Senior Full Stack Developer",
    company: "TechFlow Systems",
    location: "Remote",
    type: "Full-time",
    workMode: "Remote",
    experienceLevel: "Senior",
    description: "Build next-gen cloud architectures using Node.js, React, and MongoDB. Lead a team of 5 developers and drive technical decisions.",
    tags: ["node.js", "react", "cloud", "aws"],
    url: "https://example.com/apply-1",
    createdAt: new Date()
  },
  {
    title: "Frontend Engineer (React)",
    company: "Pixel Perfect UI",
    location: "Bangalore, India",
    type: "Full-time",
    workMode: "Hybrid",
    experienceLevel: "Mid",
    description: "Craft beautiful, high-performance user interfaces. Expert knowledge of React and Tailwind CSS required.",
    tags: ["react", "tailwind", "typescript"],
    url: "https://example.com/apply-2",
    createdAt: new Date()
  },
  {
    title: "Backend Specialist",
    company: "DataKernel",
    location: "Remote",
    type: "Full-time",
    workMode: "Remote",
    experienceLevel: "Mid",
    description: "Design scalable APIs and manage distributed systems. Strong experience with Python/Go and SQL/NoSQL databases.",
    tags: ["python", "go", "postgresql", "redis"],
    url: "https://example.com/apply-3",
    createdAt: new Date()
  },
  {
    title: "Cloud Architect",
    company: "SkyHigh Solutions",
    location: "Hyderabad",
    type: "Full-time",
    workMode: "Hybrid",
    experienceLevel: "Senior",
    description: "Architect secure and scalable cloud infrastructure. Focus on cost optimization and high availability.",
    tags: ["aws", "azure", "terraform", "security"],
    url: "https://example.com/apply-6",
    createdAt: new Date()
  },
  {
    title: "Mobile App Developer (Flutter)",
    company: "AppZen",
    location: "Remote",
    type: "Full-time",
    workMode: "Remote",
    experienceLevel: "Mid",
    description: "Create cross-platform mobile apps for millions of users using Flutter and Firebase.",
    tags: ["flutter", "dart", "firebase"],
    url: "https://example.com/apply-7",
    createdAt: new Date()
  },

  // --- INTERNSHIPS ---
  {
    title: "Software Engineering Intern",
    company: "Innovate AI",
    location: "Hyderabad",
    type: "Internship",
    workMode: "On-site",
    experienceLevel: "Entry",
    description: "Join our core product team and work on production features. Great learning environment for students.",
    tags: ["javascript", "git", "react"],
    url: "https://example.com/intern-1",
    createdAt: new Date()
  },
  {
    title: "Summer Intern 2024",
    company: "Global Tech Labs",
    location: "Remote",
    type: "Internship",
    workMode: "Remote",
    experienceLevel: "Entry",
    description: "Intensive 3-month program covering the full software development lifecycle. Mentorship from senior architects.",
    tags: ["python", "java", "agile"],
    url: "https://example.com/intern-2",
    createdAt: new Date()
  },
  {
    title: "Product Management Intern",
    company: "GrowthStack",
    location: "Remote",
    type: "Internship",
    workMode: "Remote",
    experienceLevel: "Entry",
    description: "Learn how to build products that users love. Work on market research, user stories, and roadmapping.",
    tags: ["product", "analytics", "jira"],
    url: "https://example.com/intern-5",
    createdAt: new Date()
  },
  {
    title: "Cybersecurity Intern",
    company: "SafeNet",
    location: "Bangalore",
    type: "Internship",
    workMode: "On-site",
    experienceLevel: "Entry",
    description: "Learn the basics of penetration testing and network security. Assist in security audits.",
    tags: ["security", "networking", "linux"],
    url: "https://example.com/intern-6",
    createdAt: new Date()
  },

  // --- HACKATHONS ---
  {
    title: "Global Web3 Hackathon 2024",
    company: "ChainLink Protocol",
    location: "Global",
    type: "Hackathon",
    workMode: "Remote",
    experienceLevel: "Any",
    description: "Build the future of decentralized finance. $50k prize pool and mentorship from industry leaders.",
    tags: ["web3", "solidity", "blockchain"],
    url: "https://devpost.com/hackathon-1",
    createdAt: new Date()
  },
  {
    title: "AI Innovation Sprint",
    company: "OpenAI Partners",
    location: "San Francisco / Remote",
    type: "Hackathon",
    workMode: "Hybrid",
    experienceLevel: "Any",
    description: "48-hour sprint to build revolutionary AI tools. Winners get $10k and cloud credits.",
    tags: ["ai", "gpt-4", "llm"],
    url: "https://devpost.com/hackathon-2",
    createdAt: new Date()
  },
  {
    title: "Open Source HackFest",
    company: "GitHub Community",
    location: "Virtual",
    type: "Hackathon",
    workMode: "Remote",
    experienceLevel: "Any",
    description: "Contribute to popular open-source projects. Earn exclusive swags and recognition.",
    tags: ["open-source", "git", "community"],
    url: "https://devpost.com/hackathon-4",
    createdAt: new Date()
  },
  {
    title: "EdTech Innovation Challenge",
    company: "FutureLearn",
    location: "Delhi",
    type: "Hackathon",
    workMode: "On-site",
    experienceLevel: "Any",
    description: "Build the next generation of learning tools. Prize pool of ₹5,00,000.",
    tags: ["edtech", "react", "node"],
    url: "https://devpost.com/hackathon-5",
    createdAt: new Date()
  }
];

router.get("/", async (req, res) => {
  try {
    const { q, type, workMode, experienceLevel, location, tags, page = "1", limit = "20" } = req.query;
    
    const filter: Record<string, any> = {};

    if (type) filter.type = type;
    if (workMode) filter.workMode = workMode;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (tags) filter.tags = { $in: (tags as string).split(",").map((t) => t.trim()) };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ];
    }

    const p = parseInt(page as string);
    const l = parseInt(limit as string);

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l);

    // If database has no jobs for this specific filter (or overall)
    if (jobs.length === 0) {
      // Filter fallbacks based on requested type if any
      let filteredFallbacks = fallbackJobs;
      if (type) {
        filteredFallbacks = fallbackJobs.filter(j => j.type.toLowerCase() === (type as string).toLowerCase());
      }
      
      // If we still have no fallbacks (e.g. searching for specific keywords), just return empty
      // but if the user just wants the list (no q), return the relevant fallbacks
      if (!q && filteredFallbacks.length > 0) {
        return res.json({ 
          success: true, 
          jobs: filteredFallbacks.slice(0, l), 
          total: filteredFallbacks.length, 
          page: 1, 
          limit: l,
          isFallback: true 
        });
      }
    }

    res.json({ success: true, jobs, total, page: p, limit: l });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai-search", async (req, res) => {
  try {
    if (!process.env.TAVILY_API_KEY) {
      return res.status(400).json({ error: "AI Search API key not configured" });
    }
    const params = req.body;
    const query = buildJobQuery(params);

    const [serpResults, tavilyResults] = await Promise.all([
      searchWithSerpApi(query).catch(() => []),
      searchWithTavily(query).catch(() => []),
    ]);

    const jobsToSave: any[] = [];
    const serpLimit = 5;
    for (const r of serpResults.slice(0, serpLimit)) {
      jobsToSave.push(parseSerpApiResult(r, params));
    }

    const tavilyLimit = 5;
    for (const r of tavilyResults.slice(0, tavilyLimit)) {
       const isDuplicate = jobsToSave.some(j => j.title === r.title && j.company === r.company);
       if (!isDuplicate) {
         jobsToSave.push(parseTavilyResult(r, params));
       }
    }

    const savedJobs: any[] = [];
    for (const jobData of jobsToSave) {
      try {
        const q = jobData.url
          ? { url: jobData.url }
          : { title: jobData.title, company: jobData.company };

        const saved = await Job.findOneAndUpdate(
          q,
          { $setOnInsert: { ...jobData, createdAt: new Date() } },
          { upsert: true, returnDocument: "after" }
        );
        savedJobs.push(saved);
      } catch {
        // Skip duplicate entries
      }
    }

    res.json({ success: true, jobs: savedJobs, total: savedJobs.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper functions (buildJobQuery, searchWithTavily, etc. should be added here or in a separate file)
function buildJobQuery(params: any): string {
  const parts: string[] = [];
  const currentMonthYear = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });

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

  parts.push(`hiring ${currentMonthYear}`);
  parts.push("newly posted");
  
  return parts.join(" ");
}

async function searchWithTavily(query: string): Promise<any[]> {
  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.TAVILY_API_KEY}` },
      body: JSON.stringify({
        query: `${query} -site:indeed.com`,
        search_depth: "advanced",
        max_results: 15,
        days: 14,
        include_domains: [
          "linkedin.com", "glassdoor.com", "wellfound.com", 
          "levels.fyi", "cryptojobslist.com", "remoteok.com", 
          "weworkremotely.com", "lever.co", "greenhouse.io"
        ],
      }),
    });
    if (!res.ok) return [];
    const data: any = await res.json();
    return data.results || [];
  } catch (err) {
    return [];
  }
}

async function searchWithSerpApi(query: string): Promise<any[]> {
  try {
    let url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query + " :today")}&api_key=${process.env.SERPAPI_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data: any = await res.json();
    return data.jobs_results || [];
  } catch (err) {
    return [];
  }
}

function parseTavilyResult(result: any, params: any): any {
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

function parseSerpApiResult(result: any, params: any): any {
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

export default router;
