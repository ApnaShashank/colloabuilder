import mongoose, { Schema } from "mongoose";

const SystemConfigSchema = new Schema({
  key: { type: String, required: true, unique: true, default: "main_config" },
  maintenanceMode: { type: Boolean, default: false },
  siteName: { type: String, default: "Colloabuilder" },
  allowSignups: { type: Boolean, default: true },
  debugMode: { type: Boolean, default: false },
  
  // Learn Mode settings: which categories are pro
  proCategories: { type: [String], default: ["nextjs", "tailwind"] },
  
  // Jobs settings: how many times free tier can run AI job searches
  maxFreeAiJobSearches: { type: Number, default: 3 },
  
  // Practice settings: how many free practice submissions/problems a user can try
  maxFreePracticeProblems: { type: Number, default: 5 },
  
  // Which practice difficulties are pro
  proPracticeDifficulties: { type: [String], default: ["Hard"] },
});

export default mongoose.models.SystemConfig || mongoose.model("SystemConfig", SystemConfigSchema);
