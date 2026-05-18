import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  category: "html" | "css" | "javascript" | "react" | "nextjs" | "tailwind";
  topic: string; // url-friendly slug e.g. "intro-to-html"
  title: string;
  order: number;
  content: {
    english: string;
    hinglish: string;
  };
  codeSample?: {
    language: string;
    code: string;
    filename: string;
  };
  resources?: {
    label: string;
    url: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["html", "css", "javascript", "react", "nextjs", "tailwind"],
    },
    topic: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    content: {
      english: { type: String, required: true },
      hinglish: { type: String, required: true },
    },
    codeSample: {
      language: { type: String },
      code: { type: String },
      filename: { type: String },
    },
    resources: [
      {
        label: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Add index for faster category filtering
LessonSchema.index({ category: 1, order: 1 });

export default mongoose.models.Lesson || mongoose.model<ILesson>("Lesson", LessonSchema);
