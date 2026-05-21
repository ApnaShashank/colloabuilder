import mongoose, { Schema } from "mongoose";

const RoadmapSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, default: "Beginner" },
  status: { type: String, enum: ["In Progress", "Completed", "Paused"], default: "In Progress" },
  progress: { type: Number, default: 0 },
  milestones: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      completed: { type: Boolean, default: false },
      resources: [
        {
          title: { type: String, required: true },
          url: { type: String, required: true },
          type: { type: String, enum: ["Video", "Article", "Course", "Documentation", "Tool"], default: "Article" }
        }
      ],
      dailySchedule: [
        {
          day: { type: Number },
          task: { type: String },
          hours: { type: Number }
        }
      ]
    }
  ],
  skills: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Roadmap: mongoose.Model<any> = mongoose.models.Roadmap || mongoose.model("Roadmap", RoadmapSchema);
export default Roadmap;
