import connectDB from "../lib/db";
import Lesson from "../lib/models/Lesson";

const HTML_SEED_DATA = [
  // ==================== SECTION 1: HTML BASICS ====================
  {
    category: "html",
    topic: "what-is-html",
    title: "What is HTML?",
    order: 1,
    content: {
      english: `HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using a system of tags and attributes.

HTML Elements:
• HTML documents consist of HTML elements
• Each element has an opening tag, content, and closing tag
• Elements tell the browser how to display content

HTML Document Structure:
• <!DOCTYPE html> - Document type declaration
• <html> - Root element
• <head> - Metadata container
• <body> - Visible content container

Key Points:
• HTML is NOT a programming language
• HTML uses markup tags
• Browsers read HTML and render web pages
• HTML works with CSS and JavaScript`,
      hinglish: `HTML (HyperText Markup Language) web pages banane ki standard markup language hai. Yeh tags aur attributes ka use karke web page ka structure describe karta hai.

HTML Elements:
• HTML documents HTML elements se bane hote hain
• Har element mein opening tag, content, aur closing tag hota hai
• Elements browser ko batate hain ki content kaise dikhana hai

HTML Document Structure:
• <!DOCTYPE html> - Document type declaration
• <html> - Root element (sabse upar)
• <head> - Metadata container (title, meta tags)
• <body> - Visible content container (jo dikhta hai)

Important Points:
• HTML programming language NAHI hai
• HTML markup tags use karta hai
• Browsers HTML padhte hain aur web pages render karte hain
• HTML CSS aur JavaScript ke saath kaam karta hai`,
    },
    codeSample: {
      language: "html",
      code: `<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to HTML</h1>
    <p>This is my first web page!</p>
</body>
</html>`,
      filename: "index.html",
    },
  },
  {
    category: "html",
    topic: "html-editors",
    title: "HTML Editors",
    order: 2,
    content: {
      english: `To write HTML code, you need a text editor. Here are the most popular options:

Free HTML Editors:
1. VS Code (Visual Studio Code) - Most Popular
   • Free, open-source
   • Extensions for HTML/CSS/JS
   • Auto-completion and syntax highlighting

2. Sublime Text
   • Fast and lightweight
   • Great for quick edits

3. Notepad++ (Windows)
   • Simple and easy to use
   • Good for beginners

Online Editors:
• CodePen.io - Live preview
• JSFiddle.net - Test code online
• Replit.com - Full development environment

Recommended Setup:
• Install VS Code
• Add extensions: Live Server, Prettier, Auto Close Tag
• Use Live Server for real-time preview`,
      hinglish: `HTML code likhne ke liye aapko ek text editor chahiye. Yahan sabse popular options hain:

Free HTML Editors:
1. VS Code (Visual Studio Code) - Sabse Popular
   • Free aur open-source
   • HTML/CSS/JS ke liye extensions
   • Auto-completion aur syntax highlighting

2. Sublime Text
   • Fast aur lightweight
   • Quick edits ke liye best

3. Notepad++ (Windows)
   • Simple aur easy to use
   • Beginners ke liye accha

Online Editors:
• CodePen.io - Live preview ke saath
• JSFiddle.net - Online code test karein
• Replit.com - Full development environment

Recommended Setup:
• VS Code install karein
• Extensions add karein: Live Server, Prettier, Auto Close Tag
• Real-time preview ke liye Live Server use karein`,
    },
    codeSample: {
      language: "html",
      code: `<!-- VS Code mein HTML file banayein -->
<!-- File > New File > Save as "index.html" -->

<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello from VS Code!</h1>
</body>
</html>`,
      filename: "editor-setup.html",
    },
  },
  {
    category: "html",
    topic: "html-basic-structure",
    title: "HTML Basic Structure",
    order: 3,
    content: {
      english: `Every HTML page follows a basic structure:

Document Type (<!DOCTYPE html>):
• Tells browser this is HTML5 document
• Must be first line of every HTML file

<html> Element:
• Root element that wraps entire page
• Has lang attribute for language

<head> Section:
• Contains metadata (not visible)
• <title> - Browser tab title
• <meta> - Character encoding, viewport
• <link> - External CSS files
• <style> - Internal CSS

<body> Section:
• Contains all visible content
• Headings, paragraphs, images, links, etc.
• Everything user sees goes here

Best Practices:
• Always use proper indentation
• Include lang attribute in <html>
• Set charset to UTF-8
• Add viewport meta for mobile`,
      hinglish: `Har HTML page ek basic structure follow karta hai:

Document Type (<!DOCTYPE html>):
• Browser ko batata hai yeh HTML5 document hai
• Har HTML file ki first line mein hona chahiye

<html> Element:
• Root element jo pure page ko wrap karta hai
• Language ke liye lang attribute hota hai

<head> Section:
• Metadata contain karta hai (visible nahi hota)
• <title> - Browser tab ka title
• <meta> - Character encoding, viewport
• <link> - External CSS files
• <style> - Internal CSS

<body> Section:
• Saara visible content yahan hota hai
• Headings, paragraphs, images, links, etc.
• Jo kuch user ko dikhta hai woh yahan jata hai

Best Practices:
• Hamesha proper indentation use karein
• <html> mein lang attribute add karein
• Charset UTF-8 set karein
• Mobile ke liye viewport meta add karein`,
    },
    codeSample: {
      language: "html",
      code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Welcome!</h1>
    <p>This is a basic HTML structure.</p>
</body>
</html>`,
      filename: "basic-structure.html",
    },
  },
  {
    category: "html",
    topic: "html-elements",
    title: "HTML Elements",
    order: 4,
    content: {
      english: `HTML Elements are the building blocks of web pages:

Element Structure:
• Opening tag: <tagname>
• Content: Text or other elements
• Closing tag: </tagname>

Example: <p>This is a paragraph</p>

Types of Elements:
1. Container Elements (have content):
   • <div>, <p>, <h1>, <section>
   • Have opening AND closing tags

2. Empty Elements (self-closing):
   • <br>, <hr>, <img>, <input>
   • Only have opening tag

Nested Elements:
• Elements can contain other elements
• Proper nesting is important
• Example: <div><p>Text</p></div>

Element vs Tag:
• Tag: <p> or </p>
• Element: Complete <p>Text</p>`,
      hinglish: `HTML Elements web pages ke building blocks hote hain:

Element Structure:
• Opening tag: <tagname>
• Content: Text ya dusre elements
• Closing tag: </tagname>

Example: <p>Yeh ek paragraph hai</p>

Types of Elements:
1. Container Elements (content hote hain):
   • <div>, <p>, <h1>, <section>
   • Opening AUR closing tags dono hote hain

2. Empty Elements (self-closing):
   • <br>, <hr>, <img>, <input>
   • Sirf opening tag hota hai

Nested Elements:
• Elements ke andar dusre elements ho sakte hain
• Proper nesting zaroori hai
• Example: <div><p>Text</p></div>

Element vs Tag:
• Tag: <p> ya </p>
• Element: Complete <p>Text</p>`,
    },
    codeSample: {
      language: "html",
      code: `<!-- Container Element -->
<p>This is a paragraph element</p>

<!-- Nested Elements -->
<div>
    <h2>Heading</h2>
    <p>Paragraph inside div</p>
</div>

<!-- Empty Elements -->
<br>
<hr>
<img src="photo.jpg" alt="Photo">`,
      filename: "elements.html",
    },
  },
  {
    category: "html",
    topic: "html-attributes",
    title: "HTML Attributes",
    order: 5,
    content: {
      english: `Attributes provide additional information about HTML elements:

Attribute Syntax:
• Added to opening tag
• Format: attribute="value"
• Example: <a href="url">Link</a>

Common Attributes:
1. id - Unique identifier
   • <div id="main">
   
2. class - Group styling
   • <p class="text-large">
   
3. style - Inline CSS
   • <h1 style="color: red">
   
4. title - Tooltip text
   • <p title="Info">

Global Attributes (work on all elements):
• id, class, style, title
• hidden, tabindex
• data-* (custom data)

Attribute Tips:
• Values usually in quotes
• Some attributes are boolean (disabled, required)
• Case-insensitive but lowercase recommended`,
      hinglish: `Attributes HTML elements ke baare mein additional information dete hain:

Attribute Syntax:
• Opening tag mein add hote hain
• Format: attribute="value"
• Example: <a href="url">Link</a>

Common Attributes:
1. id - Unique identifier (pehchaan)
   • <div id="main">
   
2. class - Group styling ke liye
   • <p class="text-large">
   
3. style - Inline CSS
   • <h1 style="color: red">
   
4. title - Tooltip text
   • <p title="Info">

Global Attributes (sab elements par kaam karte hain):
• id, class, style, title
• hidden, tabindex
• data-* (custom data)

Attribute Tips:
• Values usually quotes mein hote hain
• Kuch attributes boolean hote hain (disabled, required)
• Case-insensitive par lowercase recommended`,
    },
    codeSample: {
      language: "html",
      code: `<!-- ID Attribute -->
<h1 id="main-title">Welcome</h1>

<!-- Class Attribute -->
<p class="highlight important">Text</p>

<!-- Style Attribute -->
<div style="background: blue; color: white">

<!-- Title Attribute (hover par dikhta hai) -->
<p title="This is helpful info">Hover me</p>

<!-- Multiple Attributes -->
<a href="https://example.com" target="_blank" class="link">Click</a>`,
      filename: "attributes.html",
    },
  },
];

export async function seedHTMLLessons() {
  try {
    await connectDB();
    
    // Delete existing HTML lessons to avoid duplicates
    await Lesson.deleteMany({ category: "html" });
    
    await Lesson.insertMany(HTML_SEED_DATA);
    console.log(`✅ Successfully seeded ${HTML_SEED_DATA.length} HTML lessons!`);
    return { success: true, count: HTML_SEED_DATA.length };
  } catch (error) {
    console.error("❌ HTML Seeding Error:", error);
    return { success: false, error };
  }
}

// Run if executed directly
if (require.main === module) {
  seedHTMLLessons().then((result) => {
    console.log(result);
    process.exit(0);
  });
}
