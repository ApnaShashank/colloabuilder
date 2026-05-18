import express from "express";
import Lesson from "../models/Lesson";
import { fallbackLessons } from "../data/fallback-lessons";

const router = express.Router();

// Get lessons for a category or a specific lesson
router.get("/", async (req, res) => {
  try {
    const { category, topic } = req.query;

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: "Category is required" });
    }

    const categoryKey = category.toLowerCase().replace("js", "").replace("css", "");
    const normalizedCategory = category.toLowerCase();
    
    // Find in fallbacks first for rich content
    const categoryFallbacks = fallbackLessons[normalizedCategory] || fallbackLessons[categoryKey] || [];

    if (topic && typeof topic === 'string') {
      // Check database first
      let lesson = await Lesson.findOne({ 
        category: { $regex: new RegExp(`^${category}$`, "i") }, 
        topic: { $regex: new RegExp(`^${topic}$`, "i") } 
      });

      if (!lesson) {
        // Find in fallbacks
        lesson = categoryFallbacks.find((l: any) => l.topic.toLowerCase() === topic.toLowerCase());
      }

      if (!lesson) {
        // Generate dynamic fallback if still not found
        return res.json({ 
          lesson: {
            _id: `dynamic-${category}-${topic}`,
            title: topic.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" "),
            category,
            topic,
            content: {
              english: `Learn about ${topic.replace(/-/g, " ")} in our ${category} module. This section covers key concepts and practical implementations.`,
              hinglish: `${category} ke is module mein ${topic.replace(/-/g, " ")} ke baare mein seekhein. Yeh section important concepts aur implementations cover karta hai.`
            },
            codeSample: {
              language: "javascript",
              code: `// ${topic} implementation\nconsole.log("Learning ${topic} in ${category}");`,
              filename: "example.js"
            }
          } 
        });
      }
      return res.json({ lesson });
    }

    // List view
    const dbLessons = await Lesson.find({ 
      category: { $regex: new RegExp(`^${category}$`, "i") } 
    }).sort({ order: 1 }).select("topic title order");
    
    if (dbLessons.length === 0) {
      // Return fallbacks if DB is empty
      return res.json({ success: true, lessons: categoryFallbacks.map(({topic, title, order}) => ({topic, title, order})) });
    }

    res.json({ success: true, lessons: dbLessons });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
