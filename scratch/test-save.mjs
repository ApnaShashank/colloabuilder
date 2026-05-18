import connectDB from "../lib/db.js";
import Project from "../lib/models/Project.js";

async function run() {
  await connectDB();
  try {
    const project = await Project.findOne();
    if (!project) {
      console.log("No project found");
      process.exit(0);
    }
    console.log("Found project:", project._id);
    project.set("files", { "index.html": "<h1>Hello</h1>" });
    await project.save();
    console.log("Save successful!");
  } catch (err) {
    console.error("SAVE ERROR DETAILS:", err);
  }
  process.exit(0);
}

run();
