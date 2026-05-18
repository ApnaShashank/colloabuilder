import mongoose, { Schema } from "mongoose";

const LessonSchema = new Schema({
  category: { type: String, required: true },
  topic: { type: String, required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  content: {
    english: { type: String, required: true },
    hinglish: { type: String, required: true },
  },
  codeSample: {
    language: { type: String },
    code: { type: String },
    filename: { type: String },
  }
}, { timestamps: true });

LessonSchema.index({ category: 1, topic: 1 }, { unique: true });

const Lesson = mongoose.models.Lesson || mongoose.model("Lesson", LessonSchema);
export default Lesson;
