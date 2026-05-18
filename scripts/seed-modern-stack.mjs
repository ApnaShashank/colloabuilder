import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/genzclub";

const LessonSchema = new mongoose.Schema({
    category: String,
    topic: String,
    title: String,
    order: Number,
    content: {
        english: String,
        hinglish: String,
    },
    codeSample: {
        language: String,
        code: String,
        filename: String,
    }
}, { timestamps: true });

const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);

const MODERN_STACK_DATA = [
    // ==================== TAILWIND CSS ====================
    {
        category: "tailwind",
        topic: "intro-to-tailwind",
        title: "Introduction to Tailwind CSS",
        order: 1,
        content: {
            english: "Tailwind CSS is a utility-first CSS framework. Unlike Bootstrap, it doesn't give you pre-built components (like .btn). Instead, it gives you utility classes (like flex, pt-4, text-center) that you use to build your own components directly in your HTML. It is highly customizable and very fast for prototyping and production.",
            hinglish: "Tailwind CSS ek utility-first CSS framework hai. Yeh Bootstrap ki tarah pre-built components nahi deta, balki utility classes deta hai (jaise flex, pt-4, text-center). Aap in classes ko HTML mein use karke apna design bana sakte hain. Yeh bahut fast aur customizable hai."
        },
        codeSample: {
            language: "html",
            filename: "tailwind-basic.html",
            code: "<div class=\"p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4\">\n  <div class=\"shrink-0\">\n    <img class=\"h-12 w-12\" src=\"/img/logo.svg\" alt=\"ChitChat Logo\">\n  </div>\n  <div>\n    <div class=\"text-xl font-medium text-black\">ChitChat</div>\n    <p class=\"text-slate-500\">You have a new message!</p>\n  </div>\n</div>"
        }
    },
    {
        category: "tailwind",
        topic: "utility-first-concept",
        title: "Utility-First Concept",
        order: 2,
        content: {
            english: "Utility-first means building complex designs from a constrained set of primitive utilities. This avoids the 'CSS bloat' problem where you keep adding new CSS for every new component. In Tailwind, you rarely need to write custom CSS. Classes follow a predictable naming convention: m- for margin, p- for padding, bg- for background, etc.",
            hinglish: "Utility-first ka matlab hai basic utility classes se complex designs banana. Isse har component ke liye naya CSS likhne ki zaroorat nahi padti, jisse code clean rehta hai. Tailwind mein classes ka naming pattern simple hai: m- matlab margin, p- matlab padding, bg- matlab background."
        },
        codeSample: {
            language: "html",
            filename: "utilities.html",
            code: "<!-- Margin and Padding -->\n<div class=\"m-4 p-8 bg-blue-500\">Box</div>\n\n<!-- Colors and Text -->\n<p class=\"text-red-600 font-bold uppercase\">Warning!</p>\n\n<!-- Hover states -->\n<button class=\"bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded\">\n  Hover Me\n</button>"
        }
    },
    {
        category: "tailwind",
        topic: "responsive-design-tailwind",
        title: "Responsive Design in Tailwind",
        order: 3,
        content: {
            english: "Tailwind uses mobile-first responsive modifiers. By default, a class applies to all screen sizes. To target a specific screen size, prefix the class with a breakpoint name like sm:, md:, lg:, or xl:. Example: 'w-full md:w-1/2' means full width on mobile and half width on medium screens and up.",
            hinglish: "Tailwind mobile-first approach follow karta hai. Responsive design ke liye hum modifiers use karte hain jaise sm:, md:, lg:. Agar aap 'w-full md:w-1/2' likhte hain, toh mobile pe full width dikhega aur medium screens pe half width."
        },
        codeSample: {
            language: "html",
            filename: "responsive.html",
            code: "<div class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4\">\n  <div class=\"bg-indigo-500 p-4\">Item 1</div>\n  <div class=\"bg-indigo-500 p-4\">Item 2</div>\n  <div class=\"bg-indigo-500 p-4\">Item 3</div>\n  <div class=\"bg-indigo-500 p-4\">Item 4</div>\n</div>"
        }
    },

    // ==================== REACT JS ====================
    {
        category: "react",
        topic: "what-is-react",
        title: "What is React?",
        order: 1,
        content: {
            english: "React is a JavaScript library for building user interfaces, primarily for single-page applications. It's component-based, meaning you break your UI into small, reusable pieces called components. React uses a 'Virtual DOM' to efficiently update the real DOM, making your apps fast and responsive.",
            hinglish: "React ek JavaScript library hai user interfaces banane ke liye. Yeh component-based hai, jiska matlab hai ki aap apne UI ko chhote pieces mein divide kar sakte hain. React 'Virtual DOM' use karta hai jo fast updates ensure karta hai."
        },
        codeSample: {
            language: "javascript",
            filename: "App.js",
            code: "import React from 'react';\n\nfunction App() {\n  return (\n    <div>\n      <h1>Hello React!</h1>\n      <p>Building components is fun.</p>\n    </div>\n  );\n}\n\nexport default App;"
        }
    },
    {
        category: "react",
        topic: "jsx-syntax",
        title: "Understanding JSX",
        order: 2,
        content: {
            english: "JSX stands for JavaScript XML. It allows you to write HTML-like code inside JavaScript. While it looks like HTML, it's actually transformed into regular JavaScript. Rules: only one parent element, use className instead of class, and use {} to embed JavaScript expressions.",
            hinglish: "JSX ka matlab hai JavaScript XML. Yeh aapko JavaScript ke andar HTML likhne ki facility deta hai. Rules: hamesha ek parent element hona chahiye, class ki jagah className use karein, aur JavaScript variables ke liye curly braces {} use karein."
        },
        codeSample: {
            language: "javascript",
            filename: "JSXExample.jsx",
            code: "const name = 'Rume AI';\nconst element = (\n  <div className=\"container\">\n    <h2>Welcome to {name}</h2>\n    <p>Sum of 2 + 2 is {2 + 2}</p>\n  </div>\n);"
        }
    },
    {
        category: "react",
        topic: "react-hooks-usestate",
        title: "React Hooks: useState",
        order: 3,
        content: {
            english: "Hooks are functions that let you 'hook into' React state and lifecycle features from function components. useState is the most common hook. it returns an array with two elements: the current state value and a function to update it. When state changes, React re-renders the component.",
            hinglish: "Hooks functions hain jo aapko state aur lifecycle features use karne dete hain. useState sabse basic hook hai. Yeh ek array return karta hai jisme ek state value hoti hai aur doosra use update karne ka function. State change hone pe React component ko re-render karta hai."
        },
        codeSample: {
            language: "javascript",
            filename: "Counter.jsx",
            code: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n"
        }
    },

    // ==================== NEXT.JS ====================
    {
        category: "nextjs",
        topic: "intro-to-nextjs",
        title: "Introduction to Next.js",
        order: 1,
        content: {
            english: "Next.js is a React framework for production. It provides features like Server-Side Rendering (SSR), Static Site Generation (SSG), and file-based routing. It's optimized for performance and SEO, making it the top choice for building modern web applications with React.",
            hinglish: "Next.js ek React framework hai production ke liye. Isme Server-Side Rendering (SSR) aur Static Site Generation (SSG) jaise features milte hain. Yeh SEO aur performance ke liye best hai."
        },
        codeSample: {
            language: "javascript",
            filename: "page.js",
            code: "export default function Home() {\n  return (\n    <main>\n      <h1>Welcome to Next.js!</h1>\n      <p>The framework for the Web.</p>\n    </main>\n  );\n}\n"
        }
    },
    {
        category: "nextjs",
        topic: "file-based-routing",
        title: "File-Based Routing",
        order: 2,
        content: {
            english: "In Next.js, routes are determined by the folder structure in the 'app' directory. For example, 'app/about/page.js' creates an '/about' route. Dynamic routes use square brackets, like 'app/blog/[id]/page.js', which targets '/blog/1', '/blog/2', etc.",
            hinglish: "Next.js mein routes folders ke hisaab se bante hain. Agar aap 'app/about' folder mein 'page.js' banate hain, toh '/about' route ban jayega. Dynamic routes ke liye hum square brackets [] use karte hain."
        },
        codeSample: {
            language: "javascript",
            filename: "app/dashboard/settings/page.js",
            code: "// This creates the /dashboard/settings route\nexport default function Settings() {\n  return <h1>Settings Page</h1>;\n}\n\n// Dynamic route: app/user/[id]/page.js\nexport function UserPage({ params }) {\n  return <div>User ID: {params.id}</div>;\n}"
        }
    },
    {
        category: "nextjs",
        topic: "server-components",
        title: "Server vs Client Components",
        order: 3,
        content: {
            english: "By default, every component in the App Router is a Server Component. They are rendered on the server and result in smaller bundle sizes. If you need interactivity (onClick, useState, etc.), you must add the 'use client' directive at the very top of your file.",
            hinglish: "Next.js App Router mein by default sab Server Components hote hain. Isse bundle size kam hota hai. Agar aapko interactivity chahiye (buttons, forms), toh aapko file ke top pe 'use client' likhna padega."
        },
        codeSample: {
            language: "javascript",
            filename: "InteractiveButton.jsx",
            code: "'use client';\n\nimport { useState } from 'react';\n\nexport default function Button() {\n  const [active, setActive] = useState(false);\n  return (\n    <button onClick={() => setActive(!active)}>\n      {active ? 'ON' : 'OFF'}\n    </button>\n  );\n}"
        }
    }
];

async function seed() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected Successfully.");

        for (const data of MODERN_STACK_DATA) {
            await Lesson.findOneAndUpdate(
                { topic: data.topic, category: data.category },
                data,
                { upsert: true, new: true }
            );
        }

        console.log("Modern stack lessons seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seed();
