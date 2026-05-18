import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Problem from "../lib/models/Problem";

// Import datasets
import { EASY_PROBLEMS } from "./problems/easy";
import { MEDIUM_PROBLEMS } from "./problems/medium";
import { HARD_PROBLEMS } from "./problems/hard";

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/genzclub";

async function seed() {
  try {
    console.log("🚀 Starting comprehensive problem seeding...");
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected Successfully.");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("🗑️ Existing problems cleared.");

    const ALL_PROBLEMS = [
      ...EASY_PROBLEMS,
      ...MEDIUM_PROBLEMS,
      ...HARD_PROBLEMS
    ];

    console.log(`📦 Preparing to seed ${ALL_PROBLEMS.length} problems...`);
    console.log(`  - Easy: ${EASY_PROBLEMS.length}`);
    console.log(`  - Medium: ${MEDIUM_PROBLEMS.length}`);
    console.log(`  - Hard: ${HARD_PROBLEMS.length}`);

    // Insert in batches of 50 to avoid any database timeouts
    const BATCH_SIZE = 50;
    for (let i = 0; i < ALL_PROBLEMS.length; i += BATCH_SIZE) {
      const batch = ALL_PROBLEMS.slice(i, i + BATCH_SIZE);
      await Problem.insertMany(batch);
      console.log(`  ✅ Seeded batch ${Math.floor(i / BATCH_SIZE) + 1} (${i + 1} to ${Math.min(i + BATCH_SIZE, ALL_PROBLEMS.length)})`);
    }

    console.log("\n🎉 All 150 problems successfully seeded to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
}

seed();
