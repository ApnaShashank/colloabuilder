import connectDB from "../lib/db";
import Lesson from "../lib/models/Lesson";

const HTML_SEED_PART2 = [
  // ==================== HTML HEADINGS ====================
  {
    category: "html",
    topic: "html-headings",
    title: "HTML Headings (h1-h6)",
    order: 6,
    content: {
      english: `HTML provides six levels of headings, from h1 (most important) to h6 (least important):

Heading Levels:
• <h1> - Main heading (use only once per page)
• <h2> - Subheading
• <h3> - Sub-subheading
• <h4> - Fourth level
• <h5> - Fifth level
• <h6> - Smallest heading

Best Practices:
• Use only ONE h1 per page
• Don't skip levels (h1 → h2 → h3)
• Headings help with SEO
• Screen readers use headings for navigation
• Don't use headings just to make text big

Default Sizes (browser dependent):
• h1: 32px
• h2: 24px
• h3: 18.72px
• h4: 16px
• h5: 13.28px
• h6: 10.72px`,
      hinglish: `HTML mein six levels ke headings hote hain, h1 (sabse important) se h6 (least important) tak:

Heading Levels:
• <h1> - Main heading (ek page mein sirf EK baar use karein)
• <h2> - Subheading
• <h3> - Sub-subheading
• <h4> - Fourth level
• <h5> - Fifth level
• <h6> - Smallest heading

Best Practices:
• Ek page mein sirf EK h1 use karein
• Levels skip na karein (h1 → h2 → h3)
• Headings SEO mein help karti hain
• Screen readers headings ko navigation ke liye use karte hain
• Sirf text bada karne ke liye headings use na karein`,
    },
    codeSample: {
      language: "html",
      code: `<h1>Main Heading - Most Important</h1>
<h2>Subheading</h2>
<h3>Sub-subheading</h3>
<h4>Fourth Level Heading</h4>
<h5>Fifth Level Heading</h5>
<h6>Sixth Level - Least Important</h6>

<!-- Wrong Practice -->
<h1>Main</h1>
<h3>Skipped h2!</h3> <!-- Don't do this -->

<!-- Right Practice -->
<h1>Main</h1>
<h2>Section</h2>
<h3>Subsection</h3>`,
      filename: "headings.html",
    },
  },

  // ==================== HTML PARAGRAPHS ====================
  {
    category: "html",
    topic: "html-paragraphs",
    title: "HTML Paragraphs",
    order: 7,
    content: {
      english: `The <p> tag defines a paragraph in HTML:

Paragraph Features:
• Browser automatically adds spacing
• Block-level element (takes full width)
• Always start on a new line

Important Notes:
• Browsers ignore extra spaces
• Browsers ignore extra blank lines
• Use CSS for custom spacing
• Lines wrap automatically

Common Mistake:
• Don't use multiple <br> tags for spacing
• Don't use empty <p></p> for gaps
• Use CSS margin/padding instead

Paragraph with inline elements:
• Can contain text, links, images
• Cannot contain block elements (div, h1)
• Inline elements: <a>, <strong>, <em>, <span>`,
      hinglish: `<p> tag HTML mein paragraph define karta hai:

Paragraph Features:
• Browser automatically spacing add karta hai
• Block-level element (full width leta hai)
• Hamesha new line par start hota hai

Important Notes:
• Browsers extra spaces ignore karte hain
• Browsers extra blank lines ignore karte hain
• Custom spacing ke liye CSS use karein
• Lines automatically wrap hoti hain

Common Mistake:
• Spacing ke liye multiple <br> tags use na karein
• Gaps ke liye empty <p></p> use na karein
• CSS margin/padding use karein`,
    },
    codeSample: {
      language: "html",
      code: `<!-- Basic Paragraph -->
<p>This is a paragraph of text.</p>
<p>This is another paragraph.</p>

<!-- Paragraph with inline elements -->
<p>This is <strong>bold</strong> and this is <em>italic</em> text.</p>
<p>Visit <a href="#">our website</a> for more info.</p>

<!-- Browser ignores extra spaces -->
<p>This     has     extra     spaces</p>
<!-- Displays as: This has extra spaces -->`,
      filename: "paragraphs.html",
    },
  },

  // ==================== HTML TEXT FORMATTING ====================
  {
    category: "html",
    topic: "html-text-formatting",
    title: "HTML Text Formatting",
    order: 8,
    content: {
      english: `HTML provides many tags for formatting text:

Semantic Formatting (meaning + styling):
• <strong> - Important text (bold)
• <em> - Emphasized text (italic)
• <mark> - Highlighted text
• <del> - Deleted text (strikethrough)
• <ins> - Inserted text (underline)
• <sub> - Subscript (H₂O)
• <sup> - Superscript (x²)

Non-Semantic (styling only):
• <b> - Bold text (no importance)
• <i> - Italic text (no emphasis)
• <u> - Underlined text
• <small> - Smaller text
• <big> - Bigger text (deprecated)

Other Formatting:
• <abbr> - Abbreviation
• <blockquote> - Long quotation
• <q> - Short quotation
• <cite> - Citation/title of work
• <dfn> - Definition term
• <code> - Code snippet
• <pre> - Preformatted text
• <kbd> - Keyboard input
• <samp> - Sample output
• <var> - Variable`,
      hinglish: `HTML mein text formatting ke liye bahut saare tags hain:

Semantic Formatting (meaning + styling):
• <strong> - Important text (bold)
• <em> - Emphasized text (italic)
• <mark> - Highlighted text
• <del> - Deleted text (strikethrough)
• <ins> - Inserted text (underline)
• <sub> - Subscript (H₂O)
• <sup> - Superscript (x²)

Non-Semantic (sirf styling):
• <b> - Bold text (koi importance nahi)
• <i> - Italic text (koi emphasis nahi)
• <u> - Underlined text
• <small> - Smaller text
• <big> - Bigger text (deprecated)`,
    },
    codeSample: {
      language: "html",
      code: `<!-- Semantic Formatting -->
<p><strong>Very important!</strong></p>
<p>This is <em>emphasized</em> text</p>
<p>Remember to <mark>highlight</mark> this</p>
<p>Price: <del>$100</del> <ins>$50</ins></p>
<p>Water formula: H<sub>2</sub>O</p>
<p>Area: x<sup>2</sup> + y<sup>2</sup></p>

<!-- Code Formatting -->
<code>console.log("Hello")</code>
<pre>
  Multiple
  Lines
  Preserved
</pre>
<kbd>Ctrl</kbd> + <kbd>C</kbd> to copy`,
      filename: "text-formatting.html",
    },
  },

  // ==================== HTML COMMENTS ====================
  {
    category: "html",
    topic: "html-comments",
    title: "HTML Comments",
    order: 9,
    content: {
      english: `Comments are used to explain code and are not displayed in the browser:

Comment Syntax:
<!-- This is a comment -->

Uses of Comments:
• Explain complex code sections
• Temporarily disable code
• Add notes for developers
• Document sections
• TODO reminders

Comment Rules:
• Cannot be nested
• Visible in "View Source"
• Not visible on rendered page
• Can span multiple lines

Best Practices:
• Use comments to explain WHY, not WHAT
• Keep comments updated
• Don't over-comment obvious code
• Use for debugging (temporary)`,
      hinglish: `Comments code ko explain karne ke liye use hote hain aur browser mein display nahi hote:

Comment Syntax:
<!-- Yeh ek comment hai -->

Uses of Comments:
• Complex code sections ko explain karein
• Code ko temporarily disable karein
• Developers ke liye notes add karein
• Sections document karein
• TODO reminders

Comment Rules:
• Nested nahi ho sakte
• "View Source" mein dikhte hain
• Rendered page par nahi dikhte
• Multiple lines tak ho sakte hain

Best Practices:
• WHAT nahi, WHY explain karein
• Comments ko updated rakhein
• Obvious code ko over-comment na karein
• Debugging ke liye use karein (temporary)`,
    },
    codeSample: {
      language: "html",
      code: `<!-- Single line comment -->
<p>This is visible</p>

<!-- 
  Multi-line comment
  This paragraph is hidden
-->
<p>This is also visible</p>

<!-- TODO: Add more content here -->
<!-- FIXME: Check responsiveness -->

<!-- Comment out code temporarily -->
<!-- <div class="old-section">
  <p>Deprecated content</p>
</div> -->`,
      filename: "comments.html",
    },
  },
];

export async function seedHTMLLessonsPart2() {
  try {
    await connectDB();
    await Lesson.insertMany(HTML_SEED_PART2);
    console.log(`✅ Successfully seeded ${HTML_SEED_PART2.length} more HTML lessons!`);
    return { success: true, count: HTML_SEED_PART2.length };
  } catch (error) {
    console.error("❌ HTML Seeding Error:", error);
    return { success: false, error };
  }
}

if (require.main === module) {
  seedHTMLLessonsPart2().then((result) => {
    console.log(result);
    process.exit(0);
  });
}
