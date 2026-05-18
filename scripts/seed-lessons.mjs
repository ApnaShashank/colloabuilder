import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Lesson from '../server/src/models/Lesson.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/colloabuilder";

const lessons = [
  // HTML Lessons
  {
    category: 'html',
    topic: 'intro',
    title: 'Introduction to HTML',
    order: 1,
    content: {
      english: "HTML stands for HyperText Markup Language. It is the standard markup language for creating Web pages. HTML describes the structure of a Web page and consists of a series of elements.",
      hinglish: "HTML ka matlab HyperText Markup Language hai. Ye web pages banane ke liye standard markup language hai. HTML se hum web page ka structure decide karte hain."
    },
    codeSample: {
      language: "html",
      code: "<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n\n<h1>My First Heading</h1>\n<p>My first paragraph.</p>\n\n</body>\n</html>",
      filename: "index.html"
    }
  },
  {
    category: 'html',
    topic: 'elements',
    title: 'HTML Elements',
    order: 2,
    content: {
      english: "An HTML element is defined by a start tag, some content, and an end tag. Examples include <h1>, <p>, and <a>.",
      hinglish: "HTML element ek start tag, content, aur end tag se banta hai. Jaise <h1>, <p>, aur <a>."
    },
    codeSample: {
      language: "html",
      code: "<h2>This is a Heading</h2>\n<p>This is a paragraph.</p>\n<a href='https://google.com'>This is a link</a>",
      filename: "elements.html"
    }
  },
  // CSS Lessons
  {
    category: 'css',
    topic: 'intro',
    title: 'CSS Basics',
    order: 1,
    content: {
      english: "CSS (Cascading Style Sheets) is the language we use to style an HTML document. CSS describes how HTML elements should be displayed on screen.",
      hinglish: "CSS (Cascading Style Sheets) wo language hai jiska use hum HTML document ko style karne ke liye karte hain. CSS batata hai ki HTML elements screen par kaise dikhenge."
    },
    codeSample: {
      language: "css",
      code: "body {\n  background-color: lightblue;\n}\nh1 {\n  color: white;\n  text-align: center;\n}\np {\n  font-family: verdana;\n  font-size: 20px;\n}",
      filename: "style.css"
    }
  }
];

async function seedLessons() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing lessons
    await Lesson.deleteMany({ category: { $in: ['html', 'css', 'javascript', 'react', 'nextjs', 'tailwind'] } });
    console.log("Cleared existing lessons.");

    // Insert new lessons
    await Lesson.insertMany(lessons);
    console.log("Seeded lessons successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedLessons();
