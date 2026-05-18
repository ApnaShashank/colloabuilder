
export const fallbackLessons: any = {
  html: [
    {
      topic: "intro-to-html",
      title: "Introduction to HTML",
      order: 1,
      content: {
        english: "HTML (HyperText Markup Language) is the standard markup language for web pages. It provides the skeletal structure of every website. Browsers read HTML to know what content to display.",
        hinglish: "HTML web pages banane ki main language hai. Yeh website ka dhancha (skeleton) taiyar karti hai. Browser HTML ko read karke content dikhata hai."
      },
      codeSample: {
        language: "html",
        filename: "index.html",
        code: "<!DOCTYPE html>\n<html>\n<body>\n  <h1>Welcome</h1>\n</body>\n</html>"
      }
    },
    {
      topic: "html-elements",
      title: "Elements & Tags",
      order: 2,
      content: {
        english: "HTML elements are defined by tags. Most elements have a start tag and an end tag. Attributes provide extra info about elements.",
        hinglish: "HTML elements tags se bante hain. Inme start aur end tag hota hai. Attributes se hum extra settings add karte hain."
      },
      codeSample: {
        language: "html",
        filename: "elements.html",
        code: "<p class='intro'>This is an element with an attribute.</p>"
      }
    },
    {
        topic: "html-headings",
        title: "Headings (h1-h6)",
        order: 3,
        content: {
          english: "Headings go from <h1> to <h6>. <h1> is the most important for SEO.",
          hinglish: "Headings h1 se h6 tak hoti hain. h1 sabse important heading hoti hai SEO ke liye."
        },
        codeSample: { language: "html", code: "<h1>Heading 1</h1>\n<h2>Heading 2</h2>", filename: "headings.html" }
    },
    {
        topic: "html-paragraphs",
        title: "Paragraphs",
        order: 4,
        content: {
          english: "The <p> tag defines a paragraph of text. Browsers add margin automatically.",
          hinglish: "<p> tag se hum paragraph likhte hain. Isme automatically thodi space add ho jati hai."
        },
        codeSample: { language: "html", code: "<p>Hello readers.</p>", filename: "p.html" }
    },
    {
        topic: "html-links",
        title: "Links (Hyperlinks)",
        order: 5,
        content: {
          english: "Links are made with the <a> tag. 'href' specifies the destination.",
          hinglish: "Links <a> tag se bante hain. Destination ke liye 'href' use hota hai."
        },
        codeSample: { language: "html", code: "<a href='https://google.com'>Search</a>", filename: "link.html" }
    },
    {
        topic: "html-images",
        title: "Images",
        order: 6,
        content: {
          english: "Images use the <img> tag. 'src' is the path and 'alt' is for accessibility.",
          hinglish: "Images <img> se lagti hain. 'src' me image ka link hota hai."
        },
        codeSample: { language: "html", code: "<img src='pic.jpg' alt='Description'>", filename: "img.html" }
    },
    {
        topic: "html-lists",
        title: "Lists (Ordered & Unordered)",
        order: 7,
        content: {
          english: "<ul> is for bulleted lists, <ol> is for numbered lists. <li> defines each item.",
          hinglish: "<ul> se bullets aur <ol> se numbers aate hain. List item ke liye <li> use hota hai."
        },
        codeSample: { language: "html", code: "<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n</ul>", filename: "list.html" }
    },
    {
        topic: "html-tables",
        title: "Tables",
        order: 8,
        content: {
          english: "Tables display data in rows (tr) and cells (td). Headers use (th).",
          hinglish: "Tables <table> se bante hain. Rows ke liye <tr> aur cells ke liye <td> use hota hai."
        },
        codeSample: { language: "html", code: "<table>\n  <tr><th>Name</th></tr>\n  <tr><td>Aman</td></tr>\n</table>", filename: "table.html" }
    },
    {
        topic: "html-forms",
        title: "Forms & Inputs",
        order: 9,
        content: {
          english: "Forms collect user data. Use <input>, <textarea>, and <button>.",
          hinglish: "Forms user ka data lene ke liye hote hain. Inme text inputs aur buttons hote hain."
        },
        codeSample: { language: "html", code: "<form>\n  <input type='text' placeholder='Name'>\n  <button>Go</button>\n</form>", filename: "form.html" }
    },
    {
        topic: "html-semantic",
        title: "Semantic HTML",
        order: 10,
        content: {
          english: "Semantic elements like <article>, <header>, and <footer> explain their content to the browser.",
          hinglish: "Semantic elements browser ko content ka sahi matlab samjhate hain."
        },
        codeSample: { language: "html", code: "<header>\n  <h1>My Site</h1>\n</header>", filename: "semantic.html" }
    }
  ],
  css: [
    {
      topic: "intro-to-css",
      title: "Introduction to CSS",
      order: 1,
      content: {
        english: "CSS styles your HTML. It controls colors, layouts, and responsiveness.",
        hinglish: "CSS se hum HTML elements ko style karte hain. Isse colors aur layout change hote hain."
      },
      codeSample: { language: "css", code: "body { background: #f4f4f4; }", filename: "style.css" }
    },
    {
        topic: "css-selectors",
        title: "Selectors",
        order: 2,
        content: {
          english: "Selectors target HTML elements. Element, .class, and #id are the most common.",
          hinglish: "Selectors se elements ko pakda jata hai. Class aur ID sabse zyada use hote hain."
        },
        codeSample: { language: "css", code: "p { color: blue; }\n.btn { padding: 10px; }", filename: "selectors.css" }
    },
    {
        topic: "css-box-model",
        title: "Box Model",
        order: 3,
        content: {
          english: "Everything is a box. It has margin, border, padding, and content.",
          hinglish: "CSS me har cheez ek box hai jisme margin, border aur padding hoti hai."
        },
        codeSample: { language: "css", code: "div { margin: 10px; border: 1px solid; }", filename: "box.css" }
    },
    {
        topic: "css-flexbox",
        title: "Flexbox",
        order: 4,
        content: {
          english: "Flexbox aligns items in a 1D row or column layout.",
          hinglish: "Flexbox se hum items ko line me align karte hain easily."
        },
        codeSample: { language: "css", code: ".row { display: flex; justify-content: center; }", filename: "flex.css" }
    },
    {
        topic: "css-grid",
        title: "Grid",
        order: 5,
        content: {
          english: "Grid is a 2D layout system for rows and columns.",
          hinglish: "Grid 2D layouts banane ke liye hota hai."
        },
        codeSample: { language: "css", code: ".grid { display: grid; grid-template-columns: 1fr 1fr; }", filename: "grid.css" }
    },
    {
        topic: "css-position",
        title: "Positioning",
        order: 6,
        content: {
          english: "Position sets where an element appears: relative, absolute, fixed, or sticky.",
          hinglish: "Position se element kahan dikhega ye fix hota hai."
        },
        codeSample: { language: "css", code: ".top { position: fixed; top: 0; }", filename: "pos.css" }
    }
  ],
  javascript: [
    {
      topic: "intro-to-js",
      title: "Introduction to JavaScript",
      order: 1,
      content: {
        english: "JS adds interactivity. It can handle clicks, fetch data, and update UI.",
        hinglish: "JS se website interactive banti hai. Isse events aur data handle hota hai."
      },
      codeSample: { language: "javascript", code: "console.log('Hello');", filename: "script.js" }
    },
    {
        topic: "js-variables",
        title: "Variables (let, const)",
        order: 2,
        content: {
          english: "Use let for changes and const for fixed values.",
          hinglish: "Change hone wali values ke liye let aur fixed ke liye const use karein."
        },
        codeSample: { language: "javascript", code: "const site = 'Colloabuilder';\nlet age = 21;", filename: "var.js" }
    },
    {
        topic: "js-functions",
        title: "Functions",
        order: 3,
        content: {
          english: "Functions are blocks of reusable code.",
          hinglish: "Functions code ko reuse karne ke liye blocks hote hain."
        },
        codeSample: { language: "javascript", code: "const greet = () => 'Hello!';", filename: "func.js" }
    },
    {
        topic: "js-dom",
        title: "DOM Manipulation",
        order: 4,
        content: {
          english: "The DOM allows JS to talk to HTML elements.",
          hinglish: "DOM ke zariye hum HTML elements ko change kar sakte hain."
        },
        codeSample: { language: "javascript", code: "document.body.style.color = 'red';", filename: "dom.js" }
    },
    {
        topic: "js-async",
        title: "Async/Await",
        order: 5,
        content: {
          english: "Async code lets you run tasks without blocking the main thread.",
          hinglish: "Async code bina ruke tasks background me karta hai."
        },
        codeSample: { language: "javascript", code: "const data = await fetch(url);", filename: "async.js" }
    }
  ],
  react: [
    {
        topic: "intro-to-react",
        title: "Intro to React",
        order: 1,
        content: {
          english: "React is component-based UI library.",
          hinglish: "React components se UI banane ki library hai."
        },
        codeSample: { language: "javascript", code: "function App() { return <h1>Hi</h1>; }", filename: "App.js" }
    },
    {
        topic: "react-usestate",
        title: "useState Hook",
        order: 2,
        content: {
          english: "useState manages data within a component.",
          hinglish: "useState component ka data manage karta hai."
        },
        codeSample: { language: "javascript", code: "const [val, setVal] = useState(0);", filename: "State.js" }
    },
    {
        topic: "react-jsx",
        title: "JSX Syntax",
        order: 3,
        content: {
          english: "JSX allows HTML in JavaScript. Use {} for JS logic.",
          hinglish: "JSX se hum JS me HTML likhte hain."
        },
        codeSample: { language: "javascript", code: "const el = <div>{2+2}</div>;", filename: "JSX.js" }
    }
  ],
  nextjs: [
    {
        topic: "intro-to-nextjs",
        title: "Intro to Next.js",
        order: 1,
        content: {
          english: "Next.js is a React framework for production.",
          hinglish: "Next.js production level React framework hai."
        },
        codeSample: { language: "javascript", code: "export default function Page() { return <h1>Home</h1>; }", filename: "page.js" }
    },
    {
        topic: "nextjs-server-components",
        title: "Server Components",
        order: 2,
        content: {
          english: "Server Components render on the server for performance.",
          hinglish: "Server components fast loading ke liye server pe bante hain."
        },
        codeSample: { language: "javascript", code: "async function App() { return <div>Data</div>; }", filename: "Comp.js" }
    }
  ],
  tailwind: [
    {
        topic: "intro-to-tailwind",
        title: "Intro to Tailwind",
        order: 1,
        content: {
          english: "Tailwind is utility-first CSS.",
          hinglish: "Tailwind classes se styling karne ka framework hai."
        },
        codeSample: { language: "html", code: "<div class='p-4 bg-blue-500'></div>", filename: "tailwind.html" }
    }
  ]
};

// Aliases
fallbackLessons.reactjs = fallbackLessons.react;
fallbackLessons.tailwindcss = fallbackLessons.tailwind;
fallbackLessons.js = fallbackLessons.javascript;
fallbackLessons.javascriptjs = fallbackLessons.javascript;
fallbackLessons.nextjsjs = fallbackLessons.nextjs;
fallbackLessons.tailwindjs = fallbackLessons.tailwind;
fallbackLessons.htmljs = fallbackLessons.html;
fallbackLessons.cssjs = fallbackLessons.css;
fallbackLessons.nextjs = fallbackLessons.nextjs;
fallbackLessons.react = fallbackLessons.react;
fallbackLessons.tailwind = fallbackLessons.tailwind;
