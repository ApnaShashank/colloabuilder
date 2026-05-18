import connectDB from "../lib/db";
import Lesson from "../lib/models/Lesson";

const createHtmlLesson = (
    order: number,
    topic: string,
    title: string,
    english: string,
    hinglish: string,
    code: string,
    filename = `${topic}.html`
) => ({
    category: "html",
    topic,
    title,
    order,
    content: { english, hinglish },
    codeSample: {
        language: "html",
        filename,
        code,
    },
});

const HTML_ADDITIONAL_LESSONS = [
    createHtmlLesson(
        25,
        "html-styles",
        "HTML Styles",
        "The style attribute adds inline CSS directly to an element. It can control color, background-color, font-size, font-family, text-align, border, margin, padding, width, and height. Inline styles are useful for quick examples, but real projects should prefer external CSS files because they are cleaner and easier to maintain.",
        "Style attribute se kisi element par direct inline CSS lagti hai. Isse color, background-color, font-size, font-family, text-align, border, margin, padding, width, height control kar sakte hain. Quick examples ke liye useful hai, lekin real projects me external CSS better hoti hai.",
        "<h1 style='color: blue; text-align: center;'>Styled Heading</h1>\n<p style='font-size: 18px; background-color: #f2f2f2;'>This paragraph has inline CSS.</p>\n<div style='padding: 16px; border: 1px solid #ccc;'>Box with spacing</div>"
    ),
    createHtmlLesson(
        26,
        "html-quotations",
        "HTML Quotations",
        "HTML has quotation and citation tags for meaningful text: blockquote for long quotes, q for short inline quotes, cite for a work title, abbr for abbreviations, address for contact information, and bdo for changing text direction. These tags improve meaning, accessibility, and search engine understanding.",
        "HTML me quotation aur citation ke liye meaningful tags hote hain: blockquote long quote ke liye, q inline quote ke liye, cite work title ke liye, abbr abbreviation ke liye, address contact info ke liye, aur bdo text direction ke liye.",
        "<blockquote cite='https://example.com'>\n  Learning by doing is powerful.\n</blockquote>\n<p>He said, <q>Practice every day.</q></p>\n<p><abbr title='HyperText Markup Language'>HTML</abbr> structures web pages.</p>\n<cite>Clean Code</cite>\n<address>Contact: hello@example.com</address>"
    ),
    createHtmlLesson(
        27,
        "html-colors",
        "HTML Colors",
        "HTML colors are usually applied with CSS using color names, RGB, HEX, HSL, RGBA, and HSLA values. color changes text color, background-color changes the background, and border-color changes borders. Use consistent color systems and maintain enough contrast for readability.",
        "HTML colors normally CSS se apply hote hain: color names, RGB, HEX, HSL, RGBA, HSLA values. color text ka color change karta hai, background-color background ka, aur border-color borders ka. Readability ke liye contrast maintain karein.",
        "<h1 style='color: tomato;'>Color Name</h1>\n<p style='color: rgb(40, 90, 180);'>RGB color</p>\n<p style='background-color: #f1f5f9;'>HEX background</p>\n<div style='border: 3px solid hsl(150, 70%, 35%);'>HSL border</div>"
    ),
    createHtmlLesson(
        28,
        "html-rgb-hex-hsl",
        "HTML RGB, HEX, and HSL",
        "RGB defines colors with red, green, and blue values from 0 to 255. HEX is a shorter hexadecimal form like #ff0000. HSL defines hue, saturation, and lightness, which is often easier for creating color variations. RGBA and HSLA add alpha transparency.",
        "RGB me red, green, blue values 0 se 255 tak hoti hain. HEX short hexadecimal form hai jaise #ff0000. HSL hue, saturation, lightness use karta hai, jo variations banana easy karta hai. RGBA aur HSLA transparency add karte hain.",
        "<p style='color: rgb(255, 0, 0);'>RGB red</p>\n<p style='color: #00aa55;'>HEX green</p>\n<p style='color: hsl(220, 80%, 50%);'>HSL blue</p>\n<p style='background: rgba(0, 0, 0, 0.15);'>Transparent background</p>"
    ),
    createHtmlLesson(
        29,
        "html-css",
        "HTML CSS",
        "CSS can be added to HTML in three ways: inline CSS with the style attribute, internal CSS inside a style tag in head, and external CSS with a linked .css file. External CSS is best for production because it keeps HTML clean and lets many pages share the same styles.",
        "HTML me CSS teen tarike se add hoti hai: inline style attribute se, internal head ke style tag me, aur external .css file link karke. Production me external CSS best hoti hai kyunki HTML clean rehta hai aur multiple pages same styles share kar sakte hain.",
        "<head>\n  <link rel='stylesheet' href='styles.css'>\n  <style>\n    h1 { color: navy; }\n  </style>\n</head>\n<body>\n  <h1>Internal CSS</h1>\n  <p style='color: green;'>Inline CSS</p>\n</body>"
    ),
    createHtmlLesson(
        30,
        "html-link-colors",
        "HTML Link Colors",
        "Links can be styled with CSS pseudo-classes. a:link styles normal links, a:visited styles visited links, a:hover styles links on mouse hover, and a:active styles the click moment. Keep link styling obvious so users can identify clickable text quickly.",
        "Links ko CSS pseudo-classes se style karte hain. a:link normal links ke liye, a:visited visited links ke liye, a:hover hover ke liye, aur a:active click moment ke liye hota hai. Link styling clear rakhein taki clickable text easily samajh aaye.",
        "<style>\n  a:link { color: blue; }\n  a:visited { color: purple; }\n  a:hover { color: orange; text-decoration: underline; }\n  a:active { color: red; }\n</style>\n<a href='https://example.com'>Visit Example</a>"
    ),
    createHtmlLesson(
        31,
        "html-link-bookmarks",
        "HTML Link Bookmarks",
        "Bookmarks let users jump to a section on the same page. Add an id to the target element and link to it with href='#id'. This is useful for table of contents links, long documentation pages, FAQs, and single-page navigation.",
        "Bookmarks user ko same page ke kisi section par jump karne dete hain. Target element par id add karein aur href='#id' se link karein. Yeh table of contents, long docs, FAQ aur single-page navigation ke liye useful hai.",
        "<nav>\n  <a href='#chapter-1'>Chapter 1</a>\n  <a href='#chapter-2'>Chapter 2</a>\n</nav>\n\n<h2 id='chapter-1'>Chapter 1</h2>\n<p>First section...</p>\n\n<h2 id='chapter-2'>Chapter 2</h2>\n<p>Second section...</p>"
    ),
    createHtmlLesson(
        32,
        "html-image-map",
        "HTML Image Map",
        "Image maps make different parts of one image clickable. Use img with usemap, then define a map with area elements. area supports shapes like rect, circle, and poly. Always add alt text because image maps can be difficult for accessibility.",
        "Image map ek image ke different parts ko clickable banata hai. img me usemap lagta hai, phir map ke andar area elements define hote hain. area me rect, circle, poly shapes use hote hain. Accessibility ke liye alt text zaroor add karein.",
        "<img src='workspace.jpg' alt='Workspace' usemap='#workmap'>\n\n<map name='workmap'>\n  <area shape='rect' coords='34,44,270,350' href='laptop.html' alt='Laptop'>\n  <area shape='circle' coords='337,300,44' href='coffee.html' alt='Coffee'>\n</map>"
    ),
    createHtmlLesson(
        33,
        "html-background-images",
        "HTML Background Images",
        "Background images should usually be added with CSS, not the old background attribute. Use background-image, background-size, background-position, and background-repeat. For real content images, use img; for decoration, use CSS backgrounds.",
        "Background images normally CSS se add karni chahiye, old background attribute se nahi. background-image, background-size, background-position, background-repeat use karein. Real content image ke liye img use karein; decoration ke liye CSS background.",
        "<style>\n  .hero {\n    min-height: 300px;\n    background-image: url('hero.jpg');\n    background-size: cover;\n    background-position: center;\n  }\n</style>\n<section class='hero'>\n  <h1>Welcome</h1>\n</section>"
    ),
    createHtmlLesson(
        34,
        "html-picture-element",
        "HTML Picture Element",
        "The picture element lets the browser choose the best image for screen size or format support. Use source elements with media or type attributes, and always include an img fallback. This is useful for responsive images and modern formats like WebP or AVIF.",
        "Picture element browser ko screen size ya format support ke hisaab se best image choose karne deta hai. source elements me media ya type attributes use hote hain, aur hamesha img fallback add karein. Responsive images aur WebP/AVIF ke liye useful hai.",
        "<picture>\n  <source media='(min-width: 900px)' srcset='large.jpg'>\n  <source media='(min-width: 600px)' srcset='medium.jpg'>\n  <source type='image/webp' srcset='photo.webp'>\n  <img src='small.jpg' alt='Responsive example'>\n</picture>"
    ),
    createHtmlLesson(
        35,
        "html-favicon",
        "HTML Favicon",
        "A favicon is the small icon shown in browser tabs, bookmarks, and shortcuts. Add it in the head using link rel='icon'. Common formats are .ico, .png, and .svg. You can also add apple-touch-icon for mobile home screen icons.",
        "Favicon browser tab, bookmarks aur shortcuts me dikhne wala chhota icon hota hai. Head me link rel='icon' se add karte hain. Common formats .ico, .png, .svg hain. Mobile home screen ke liye apple-touch-icon bhi add kar sakte hain.",
        "<head>\n  <link rel='icon' href='/favicon.ico'>\n  <link rel='icon' type='image/png' href='/favicon.png'>\n  <link rel='apple-touch-icon' href='/apple-touch-icon.png'>\n</head>"
    ),
    createHtmlLesson(
        36,
        "html-page-title",
        "HTML Page Title",
        "The title tag sets the browser tab title, search result title, and default bookmark name. Every page should have a unique, descriptive title. Keep it short, clear, and related to the page content for better usability and SEO.",
        "Title tag browser tab title, search result title aur default bookmark name set karta hai. Har page ka unique aur descriptive title hona chahiye. Better usability aur SEO ke liye short, clear aur page content se related title rakhein.",
        "<head>\n  <title>HTML Tutorial - Learn Web Structure</title>\n  <meta name='description' content='Learn HTML basics, forms, media, and semantic structure.'>\n</head>"
    ),
    createHtmlLesson(
        37,
        "html-table-borders",
        "HTML Table Borders",
        "Table borders are styled with CSS. Use border on table, th, and td, and border-collapse: collapse to merge double borders. Avoid the old border attribute in modern code. Use padding and text-align to make tables readable.",
        "Table borders CSS se style hote hain. table, th, td par border lagayein aur double borders merge karne ke liye border-collapse: collapse use karein. Modern code me old border attribute avoid karein. Readability ke liye padding aur text-align use karein.",
        "<style>\n  table, th, td { border: 1px solid #333; }\n  table { border-collapse: collapse; }\n  th, td { padding: 8px 12px; }\n</style>\n<table>\n  <tr><th>Name</th><th>Score</th></tr>\n  <tr><td>Ana</td><td>95</td></tr>\n</table>"
    ),
    createHtmlLesson(
        38,
        "html-table-sizes",
        "HTML Table Sizes",
        "Table size can be controlled with CSS width and height. Set table width to 100% for responsive layouts and control column width on th or td. Avoid fixed widths when content needs to work on small screens.",
        "Table size CSS width aur height se control hoti hai. Responsive layout ke liye table width 100% rakh sakte hain aur column width th ya td par set kar sakte hain. Small screens ke liye fixed widths avoid karein.",
        "<style>\n  table { width: 100%; }\n  th:first-child { width: 60%; }\n  td { height: 44px; }\n</style>\n<table>\n  <tr><th>Topic</th><th>Status</th></tr>\n  <tr><td>HTML</td><td>Done</td></tr>\n</table>"
    ),
    createHtmlLesson(
        39,
        "html-table-headers",
        "HTML Table Headers",
        "Use th for header cells and td for data cells. Use thead, tbody, and tfoot to group table sections. The scope attribute helps assistive technologies understand whether a header applies to a row or column.",
        "Header cells ke liye th aur data cells ke liye td use karein. Table sections group karne ke liye thead, tbody, tfoot use hote hain. scope attribute assistive technologies ko batata hai header row ya column ke liye hai.",
        "<table>\n  <thead>\n    <tr><th scope='col'>Name</th><th scope='col'>Role</th></tr>\n  </thead>\n  <tbody>\n    <tr><th scope='row'>Riya</th><td>Designer</td></tr>\n    <tr><th scope='row'>Aman</th><td>Developer</td></tr>\n  </tbody>\n</table>"
    ),
    createHtmlLesson(
        40,
        "html-table-padding-spacing",
        "HTML Table Padding & Spacing",
        "Cell padding controls space inside cells. border-spacing controls space between cells when border-collapse is separate. Modern tables use CSS padding, border-spacing, text-align, and vertical-align for clean presentation.",
        "Cell padding cells ke andar ka space control karta hai. border-spacing cells ke beech ka space control karta hai jab border-collapse separate ho. Modern tables me CSS padding, border-spacing, text-align aur vertical-align use karein.",
        "<style>\n  table { border-collapse: separate; border-spacing: 8px; }\n  th, td { padding: 12px; text-align: left; vertical-align: top; }\n</style>\n<table>\n  <tr><th>Feature</th><th>Use</th></tr>\n  <tr><td>Padding</td><td>Inside space</td></tr>\n</table>"
    ),
    createHtmlLesson(
        41,
        "html-colspan-rowspan",
        "HTML Colspan & Rowspan",
        "colspan lets one cell span multiple columns. rowspan lets one cell span multiple rows. They are useful for grouped headers and summary tables, but avoid overusing them because complex merged tables are harder to read and less accessible.",
        "colspan ek cell ko multiple columns tak span karne deta hai. rowspan ek cell ko multiple rows tak span karne deta hai. Grouped headers aur summary tables ke liye useful hai, lekin overuse na karein kyunki complex merged tables read aur access karna hard hota hai.",
        "<table border='1'>\n  <tr><th colspan='2'>Full Name</th><th>Age</th></tr>\n  <tr><td>Riya</td><td>Sharma</td><td rowspan='2'>21</td></tr>\n  <tr><td>Aman</td><td>Verma</td></tr>\n</table>"
    ),
    createHtmlLesson(
        42,
        "html-table-styling",
        "HTML Table Styling",
        "Tables can be styled with striped rows, hover states, borders, captions, alignment, and responsive wrappers. Use caption for a table title and CSS for visual styling. Keep data tables simple and scannable.",
        "Tables ko striped rows, hover states, borders, captions, alignment aur responsive wrappers ke saath style kar sakte hain. Table title ke liye caption use karein aur visual style ke liye CSS. Data tables simple aur scannable rakhein.",
        "<style>\n  caption { font-weight: bold; margin-bottom: 8px; }\n  tr:nth-child(even) { background: #f8fafc; }\n  tr:hover { background: #e0f2fe; }\n</style>\n<table>\n  <caption>Marks</caption>\n  <tr><th>Name</th><th>Marks</th></tr>\n  <tr><td>Neha</td><td>88</td></tr>\n</table>"
    ),
    createHtmlLesson(
        43,
        "html-table-colgroup",
        "HTML Table Colgroup",
        "colgroup and col let you style entire table columns at once. This is useful when a column needs a fixed width or background color. colgroup belongs directly inside table, before thead, tbody, tr, th, or td.",
        "colgroup aur col se poore table columns ko ek saath style kar sakte hain. Jab kisi column ko fixed width ya background color chahiye ho tab useful hai. colgroup table ke andar thead, tbody, tr, th, td se pehle aata hai.",
        "<table>\n  <colgroup>\n    <col style='background: #f1f5f9; width: 60%;'>\n    <col style='background: #ecfeff;'>\n  </colgroup>\n  <tr><th>Topic</th><th>Level</th></tr>\n  <tr><td>HTML</td><td>Beginner</td></tr>\n</table>"
    ),
    createHtmlLesson(
        44,
        "html-block-inline",
        "HTML Block & Inline",
        "Block elements start on a new line and take full available width, like div, p, h1, section, and article. Inline elements stay within the current line and take only needed width, like span, a, strong, em, and img. Understanding this helps layout and spacing.",
        "Block elements new line se start hote hain aur full available width lete hain, jaise div, p, h1, section, article. Inline elements current line me rehte hain aur sirf needed width lete hain, jaise span, a, strong, em, img. Layout aur spacing ke liye yeh samajhna zaroori hai.",
        "<div>Block element</div>\n<p>Paragraph is block.</p>\n<p>This has <span>inline span</span> and <a href='#'>inline link</a>.</p>\n<strong>Strong is inline</strong>\n<em>Em is inline</em>"
    ),
    createHtmlLesson(
        45,
        "html-classes",
        "HTML Classes",
        "The class attribute groups elements for CSS and JavaScript. Multiple elements can share the same class, and one element can have multiple classes separated by spaces. Classes are the most common way to apply reusable styling.",
        "class attribute CSS aur JavaScript ke liye elements ko group karta hai. Multiple elements same class share kar sakte hain, aur ek element par spaces se separated multiple classes ho sakti hain. Reusable styling ke liye classes sabse common hain.",
        "<style>\n  .card { border: 1px solid #ddd; padding: 16px; }\n  .featured { background: #fff7ed; }\n</style>\n<div class='card featured'>Featured card</div>\n<div class='card'>Normal card</div>"
    ),
    createHtmlLesson(
        46,
        "html-id",
        "HTML Id",
        "The id attribute gives an element a unique identifier. Use it for bookmarks, labels, and JavaScript selection. An id should be unique on a page, while classes can be reused. Use clear names like main-title, signup-form, or footer-nav.",
        "id attribute kisi element ko unique identifier deta hai. Bookmarks, labels aur JavaScript selection ke liye use hota hai. Page par id unique honi chahiye, jabki classes reuse ho sakti hain. main-title, signup-form jaise clear names use karein.",
        "<h1 id='main-title'>Dashboard</h1>\n<a href='#main-title'>Back to top</a>\n\n<label for='email'>Email</label>\n<input id='email' type='email'>\n\n<script>\n  document.getElementById('main-title').textContent = 'Welcome';\n</script>"
    ),
    createHtmlLesson(
        47,
        "html-buttons",
        "HTML Buttons",
        "The button element creates clickable actions. Types are button, submit, and reset. Inside forms, button defaults to submit, so set type='button' for non-submit actions. Buttons can contain text, icons, or inline elements and should have accessible labels.",
        "button element clickable actions banata hai. Types hain button, submit, reset. Forms ke andar button default submit hota hai, isliye non-submit action ke liye type='button' set karein. Buttons me text, icons ya inline elements ho sakte hain aur accessible labels hone chahiye.",
        "<button type='button'>Normal Button</button>\n<button type='submit'>Submit Form</button>\n<button type='reset'>Reset Form</button>\n\n<button type='button' aria-label='Close'>\n  <span aria-hidden='true'>x</span>\n</button>"
    ),
    createHtmlLesson(
        48,
        "html-javascript",
        "HTML JavaScript",
        "JavaScript is added with the script tag. It can be inline, internal, or external with src. Use defer for scripts that should run after HTML parsing. Place scripts carefully to avoid blocking page rendering.",
        "JavaScript script tag se add hota hai. Yeh inline, internal ya external src ke saath ho sakta hai. HTML parse hone ke baad script chalani ho to defer use karein. Page rendering block na ho isliye scripts carefully place karein.",
        "<button id='btn'>Click</button>\n\n<script>\n  document.getElementById('btn').addEventListener('click', function () {\n    alert('Clicked!');\n  });\n</script>\n\n<script src='app.js' defer></script>"
    ),
    createHtmlLesson(
        49,
        "html-file-paths",
        "HTML File Paths",
        "File paths tell HTML where a resource is located. Relative paths point from the current file, absolute paths start from a domain or root, and parent paths use ../. Use organized folders like images, css, and js to keep projects clean.",
        "File paths HTML ko batate hain resource kahan located hai. Relative paths current file se point karte hain, absolute paths domain ya root se start hote hain, aur parent paths ../ use karte hain. Project clean rakhne ke liye images, css, js folders organize karein.",
        "<img src='images/logo.png' alt='Logo'>\n<link rel='stylesheet' href='/css/styles.css'>\n<script src='../js/app.js'></script>\n<a href='https://example.com/about'>Absolute URL</a>"
    ),
    createHtmlLesson(
        50,
        "html-layout",
        "HTML Layout",
        "A webpage layout is usually built with semantic elements such as header, nav, main, section, article, aside, and footer. CSS controls the visual layout with Flexbox, Grid, and responsive rules. HTML should describe structure; CSS should handle placement.",
        "Webpage layout normally semantic elements se banta hai jaise header, nav, main, section, article, aside, footer. Visual layout CSS Flexbox, Grid aur responsive rules se control hota hai. HTML structure describe kare; placement CSS handle kare.",
        "<header>Header</header>\n<nav>Navigation</nav>\n<main>\n  <section>\n    <article>Main content</article>\n  </section>\n  <aside>Sidebar</aside>\n</main>\n<footer>Footer</footer>"
    ),
    createHtmlLesson(
        51,
        "html-responsive",
        "HTML Responsive",
        "Responsive HTML starts with the viewport meta tag and flexible content. Images should use max-width: 100%, picture/srcset for responsive choices, and layouts should adapt with CSS media queries. Avoid fixed-width layouts on mobile.",
        "Responsive HTML viewport meta tag aur flexible content se start hota hai. Images ke liye max-width: 100%, responsive choices ke liye picture/srcset, aur layouts ke liye CSS media queries use karein. Mobile par fixed-width layouts avoid karein.",
        "<head>\n  <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n</head>\n<style>\n  img { max-width: 100%; height: auto; }\n</style>\n<img src='photo.jpg' alt='Responsive image'>"
    ),
    createHtmlLesson(
        52,
        "html-computercode",
        "HTML Computercode",
        "HTML has tags for displaying code and technical text: code for code fragments, pre for preformatted blocks, kbd for keyboard input, samp for program output, and var for variables. Use pre with code for multi-line code examples.",
        "Code aur technical text dikhane ke liye HTML me tags hain: code code fragments ke liye, pre preformatted blocks ke liye, kbd keyboard input ke liye, samp program output ke liye, aur var variables ke liye. Multi-line code ke liye pre ke andar code use karein.",
        "<p>Use <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>\n<p>The variable <var>x</var> stores a value.</p>\n<samp>Build completed</samp>\n<pre><code>function greet() {\n  return 'Hello';\n}</code></pre>"
    ),
    createHtmlLesson(
        53,
        "html-style-guide",
        "HTML Style Guide",
        "A good HTML style guide keeps code readable. Use lowercase tag names, quote attribute values, close elements, indent nested elements, use meaningful names, add alt text, avoid long inline styles, and validate your HTML regularly.",
        "Good HTML style guide code ko readable rakhta hai. Lowercase tag names use karein, attribute values quote karein, elements close karein, nested elements indent karein, meaningful names use karein, alt text add karein, long inline styles avoid karein, HTML validate karein.",
        "<!DOCTYPE html>\n<html lang='en'>\n  <head>\n    <title>Clean HTML</title>\n  </head>\n  <body>\n    <main class='page-content'>\n      <img src='team.jpg' alt='Team working together'>\n    </main>\n  </body>\n</html>"
    ),
    createHtmlLesson(
        54,
        "html-entities",
        "HTML Entities",
        "Entities display reserved or special characters. For example, use &lt; for <, &gt; for >, &amp; for &, &quot; for double quotes, and &nbsp; for non-breaking space. Entities prevent the browser from treating text as HTML syntax.",
        "Entities reserved ya special characters display karte hain. Jaise &lt; se <, &gt; se >, &amp; se &, &quot; se double quotes, aur &nbsp; se non-breaking space. Entities browser ko text ko HTML syntax samajhne se bachate hain.",
        "<p>Use &lt;h1&gt; for a heading.</p>\n<p>Tom &amp; Jerry</p>\n<p>Price: 100&nbsp;USD</p>\n<p>Quote: &quot;Hello&quot;</p>"
    ),
    createHtmlLesson(
        55,
        "html-symbols",
        "HTML Symbols",
        "HTML symbols can be written using entity names or numeric codes. Common symbols include copyright, registered trademark, euro, arrows, mathematical symbols, and card symbols. Use symbols when the character is hard to type or may need reliable encoding.",
        "HTML symbols entity names ya numeric codes se likhe ja sakte hain. Common symbols me copyright, registered trademark, euro, arrows, mathematical symbols aur card symbols aate hain. Jab character type karna hard ho ya reliable encoding chahiye ho tab symbols use karein.",
        "<p>&copy; 2026 Company</p>\n<p>&reg; Registered</p>\n<p>&euro; 49</p>\n<p>&larr; Back | Next &rarr;</p>\n<p>&hearts; Favorite</p>"
    ),
    createHtmlLesson(
        56,
        "html-emojis",
        "HTML Emojis",
        "Emojis are characters from the UTF-8 character set. To display them correctly, include meta charset='UTF-8' in the head. Emojis can be typed directly or written with numeric character references, but avoid relying on them as the only way to communicate meaning.",
        "Emojis UTF-8 character set ke characters hain. Unhe correctly display karne ke liye head me meta charset='UTF-8' include karein. Emojis direct type kar sakte hain ya numeric character references se likh sakte hain, lekin meaning communicate karne ka only method na banayein.",
        "<head>\n  <meta charset='UTF-8'>\n</head>\n<p>Great job &#128640;</p>\n<p>Completed &#9989;</p>\n<button aria-label='Save'>Save &#128190;</button>"
    ),
    createHtmlLesson(
        57,
        "html-charsets",
        "HTML Charsets",
        "The charset tells the browser how to decode characters. UTF-8 is the standard for modern websites because it supports English, Hindi, symbols, and emojis. Put meta charset='UTF-8' near the top of the head.",
        "Charset browser ko batata hai characters kaise decode karne hain. Modern websites ke liye UTF-8 standard hai kyunki yeh English, Hindi, symbols aur emojis support karta hai. meta charset='UTF-8' ko head ke top ke paas rakhein.",
        "<!DOCTYPE html>\n<html lang='en'>\n<head>\n  <meta charset='UTF-8'>\n  <title>UTF-8 Page</title>\n</head>\n<body>\n  <p>Namaste and Hello!</p>\n</body>\n</html>"
    ),
    createHtmlLesson(
        58,
        "html-url-encode",
        "HTML URL Encode",
        "URL encoding converts unsafe characters into percent-encoded values. Spaces become %20 or + in query strings, and characters like #, ?, &, and = have special meanings in URLs. Encoding keeps links and form submissions reliable.",
        "URL encoding unsafe characters ko percent-encoded values me convert karta hai. Spaces %20 ya query strings me + ban sakte hain, aur #, ?, &, = ka URLs me special meaning hota hai. Encoding links aur form submissions ko reliable rakhti hai.",
        "<a href='search.html?q=html%20forms'>Search HTML forms</a>\n<a href='mailto:test@example.com?subject=Hello%20World'>Email</a>\n<form action='/search' method='GET'>\n  <input name='q' value='HTML basics'>\n</form>"
    ),
    createHtmlLesson(
        59,
        "html-vs-xhtml",
        "HTML vs XHTML",
        "XHTML is a stricter XML-based version of HTML. It requires properly nested elements, lowercase tags, quoted attributes, and closed empty elements. Modern websites mostly use HTML5, but XHTML rules can still help you write clean markup.",
        "XHTML HTML ka stricter XML-based version hai. Isme properly nested elements, lowercase tags, quoted attributes aur closed empty elements required hote hain. Modern websites mostly HTML5 use karti hain, lekin XHTML rules clean markup likhne me help karte hain.",
        "<!-- HTML5 style -->\n<input type='text' required>\n<br>\n\n<!-- XHTML-style strictness -->\n<input type='text' required='required' />\n<br />"
    ),
    createHtmlLesson(
        60,
        "html-form-attributes",
        "HTML Form Attributes",
        "Important form attributes include action, method, target, autocomplete, novalidate, enctype, name, and accept-charset. GET is useful for search/query data, POST is used for private or changing data. Use multipart/form-data for file uploads.",
        "Important form attributes hain action, method, target, autocomplete, novalidate, enctype, name, accept-charset. GET search/query data ke liye useful hai, POST private ya changing data ke liye. File uploads ke liye multipart/form-data use karein.",
        "<form action='/signup' method='POST' autocomplete='on'>\n  <input name='email' type='email' required>\n  <button type='submit'>Create account</button>\n</form>\n\n<form action='/upload' method='POST' enctype='multipart/form-data'>\n  <input type='file' name='avatar'>\n</form>"
    ),
    createHtmlLesson(
        61,
        "html-input-attributes",
        "HTML Input Attributes",
        "Input attributes control behavior and validation: value, placeholder, required, readonly, disabled, min, max, step, minlength, maxlength, pattern, multiple, accept, autocomplete, autofocus, checked, and list. Use semantic input types and native validation first.",
        "Input attributes behavior aur validation control karte hain: value, placeholder, required, readonly, disabled, min, max, step, minlength, maxlength, pattern, multiple, accept, autocomplete, autofocus, checked, list. Pehle semantic input types aur native validation use karein.",
        "<input type='text' placeholder='Username' minlength='3' maxlength='20' required>\n<input type='number' min='1' max='10' step='1'>\n<input type='file' accept='image/*' multiple>\n<input type='checkbox' checked>\n<input type='text' pattern='[A-Za-z]{3,}'>"
    ),
    createHtmlLesson(
        62,
        "html-input-form-attributes",
        "HTML Input Form Attributes",
        "Input elements can override their parent form using form-related attributes: formaction, formmethod, formenctype, formtarget, formnovalidate, and form. This allows different submit buttons to send the same form to different endpoints.",
        "Input elements apne parent form ko form-related attributes se override kar sakte hain: formaction, formmethod, formenctype, formtarget, formnovalidate, form. Isse same form ke different submit buttons different endpoints par data bhej sakte hain.",
        "<form id='profile' action='/save' method='POST'>\n  <input name='name' required>\n  <button type='submit'>Save</button>\n  <button type='submit' formaction='/preview' formtarget='_blank'>Preview</button>\n  <button type='submit' formnovalidate>Save Draft</button>\n</form>"
    ),
    createHtmlLesson(
        63,
        "html-canvas",
        "HTML Canvas",
        "The canvas element provides a drawing surface for JavaScript. It is used for charts, games, image editing, and custom graphics. Canvas content is bitmap-based and needs JavaScript to draw shapes, text, images, and animations.",
        "Canvas element JavaScript ke liye drawing surface provide karta hai. Charts, games, image editing aur custom graphics ke liye use hota hai. Canvas content bitmap-based hota hai aur shapes, text, images, animations draw karne ke liye JavaScript chahiye.",
        "<canvas id='myCanvas' width='300' height='150' style='border:1px solid #ccc;'></canvas>\n<script>\n  const canvas = document.getElementById('myCanvas');\n  const ctx = canvas.getContext('2d');\n  ctx.fillStyle = 'tomato';\n  ctx.fillRect(20, 20, 120, 60);\n</script>"
    ),
    createHtmlLesson(
        64,
        "html-svg",
        "HTML SVG",
        "SVG creates vector graphics that stay sharp at any size. SVG can draw shapes like circle, rect, line, path, and text. Unlike canvas, SVG elements are part of the DOM, so they can be styled with CSS and accessed with JavaScript.",
        "SVG vector graphics banata hai jo kisi bhi size par sharp rehte hain. SVG circle, rect, line, path aur text jaise shapes draw kar sakta hai. Canvas ke unlike SVG elements DOM ka part hote hain, isliye CSS aur JavaScript se style/access ho sakte hain.",
        "<svg width='200' height='120' viewBox='0 0 200 120'>\n  <rect x='10' y='10' width='180' height='100' fill='#e0f2fe' stroke='#0284c7' />\n  <circle cx='60' cy='60' r='30' fill='tomato' />\n  <text x='105' y='65'>SVG</text>\n</svg>"
    ),
    createHtmlLesson(
        65,
        "html-media",
        "HTML Media",
        "HTML media includes images, audio, video, iframes, and embedded content. Choose the right element for the content: img for images, video for videos, audio for sound, iframe for external pages, and embed/object for special resources when needed.",
        "HTML media me images, audio, video, iframes aur embedded content aata hai. Content ke hisaab se right element choose karein: images ke liye img, videos ke liye video, sound ke liye audio, external pages ke liye iframe, aur special resources ke liye embed/object.",
        "<img src='photo.jpg' alt='Team photo'>\n<video controls src='intro.mp4'></video>\n<audio controls src='music.mp3'></audio>\n<iframe src='https://example.com' title='Embedded page'></iframe>"
    ),
    createHtmlLesson(
        66,
        "html-plugins",
        "HTML Plug-ins",
        "Older web pages used plugins and elements like object and embed for media, PDFs, Flash, or applets. Modern web development avoids plugins and uses native HTML5 elements like video, audio, canvas, SVG, and iframe instead.",
        "Old web pages plugins aur object/embed elements use karte the media, PDFs, Flash ya applets ke liye. Modern web development plugins avoid karta hai aur native HTML5 elements jaise video, audio, canvas, SVG, iframe use karta hai.",
        "<!-- Modern preferred approach -->\n<iframe src='document.pdf' title='PDF preview'></iframe>\n\n<!-- Legacy-style embeds still exist -->\n<embed src='document.pdf' type='application/pdf' width='600' height='400'>\n<object data='document.pdf' type='application/pdf'></object>"
    ),
    createHtmlLesson(
        67,
        "html-youtube",
        "HTML YouTube",
        "YouTube videos are embedded with iframe. Use the embed URL format, set width and height, add a descriptive title, and include allowfullscreen when needed. Use loading='lazy' for videos below the first screen.",
        "YouTube videos iframe se embed hote hain. Embed URL format use karein, width aur height set karein, descriptive title add karein, aur zaroorat ho to allowfullscreen include karein. First screen ke neeche videos ke liye loading='lazy' use karein.",
        "<iframe\n  width='560'\n  height='315'\n  src='https://www.youtube.com/embed/dQw4w9WgXcQ'\n  title='YouTube video player'\n  loading='lazy'\n  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'\n  allowfullscreen>\n</iframe>"
    ),
    createHtmlLesson(
        68,
        "html-web-apis",
        "HTML Web APIs",
        "Web APIs let HTML pages access browser features with JavaScript. Common APIs include Geolocation, Drag and Drop, Web Storage, Web Workers, Server-Sent Events, Canvas, Fetch, History, and Clipboard. APIs should be used with permissions and graceful fallbacks.",
        "Web APIs HTML pages ko JavaScript ke through browser features access karne dete hain. Common APIs hain Geolocation, Drag and Drop, Web Storage, Web Workers, Server-Sent Events, Canvas, Fetch, History, Clipboard. APIs permissions aur graceful fallbacks ke saath use karein.",
        "<button id='locate'>Get Location</button>\n<script>\n  document.getElementById('locate').onclick = function () {\n    if ('geolocation' in navigator) {\n      navigator.geolocation.getCurrentPosition(console.log);\n    }\n  };\n</script>"
    ),
    createHtmlLesson(
        69,
        "html-geolocation",
        "HTML Geolocation",
        "The Geolocation API gets the user's location after permission. Use navigator.geolocation.getCurrentPosition for one-time location and watchPosition for continuous tracking. Always explain why you need location and handle denial or errors.",
        "Geolocation API permission ke baad user ki location get karta hai. One-time location ke liye navigator.geolocation.getCurrentPosition aur continuous tracking ke liye watchPosition use karein. Hamesha explain karein location kyun chahiye aur denial/errors handle karein.",
        "<button onclick='getLocation()'>Show Location</button>\n<p id='output'></p>\n<script>\nfunction getLocation() {\n  navigator.geolocation.getCurrentPosition(\n    (pos) => output.textContent = pos.coords.latitude + ', ' + pos.coords.longitude,\n    () => output.textContent = 'Location permission denied'\n  );\n}\n</script>"
    ),
    createHtmlLesson(
        70,
        "html-drag-drop",
        "HTML Drag and Drop",
        "The Drag and Drop API lets users drag elements and drop them into valid targets. Make an element draggable='true', listen to dragstart, allow drop with dragover.preventDefault(), then handle drop. It is useful for boards, file uploads, and builders.",
        "Drag and Drop API user ko elements drag karke valid targets me drop karne deta hai. Element par draggable='true' lagayein, dragstart listen karein, dragover.preventDefault() se drop allow karein, phir drop handle karein. Boards, file uploads aur builders ke liye useful hai.",
        "<div id='item' draggable='true'>Drag me</div>\n<div id='dropzone' style='min-height:80px;border:1px dashed #999;'>Drop here</div>\n<script>\nitem.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', item.id));\ndropzone.addEventListener('dragover', e => e.preventDefault());\ndropzone.addEventListener('drop', e => dropzone.appendChild(document.getElementById(e.dataTransfer.getData('text/plain'))));\n</script>"
    ),
    createHtmlLesson(
        71,
        "html-web-storage",
        "HTML Web Storage",
        "Web Storage stores data in the browser. localStorage keeps data after the browser closes, while sessionStorage clears data when the tab closes. Values are stored as strings, so use JSON.stringify and JSON.parse for objects.",
        "Web Storage browser me data store karta hai. localStorage browser close hone ke baad bhi data rakhta hai, jabki sessionStorage tab close hone par clear ho jata hai. Values strings ke roop me store hoti hain, objects ke liye JSON.stringify aur JSON.parse use karein.",
        "<script>\n  localStorage.setItem('theme', 'dark');\n  const theme = localStorage.getItem('theme');\n\n  const user = { name: 'Riya' };\n  localStorage.setItem('user', JSON.stringify(user));\n  const saved = JSON.parse(localStorage.getItem('user'));\n</script>"
    ),
    createHtmlLesson(
        72,
        "html-web-workers",
        "HTML Web Workers",
        "Web Workers run JavaScript in the background without blocking the main page. They are useful for heavy calculations. A worker communicates with the main page using postMessage and message events. Workers cannot directly access the DOM.",
        "Web Workers JavaScript ko background me run karte hain bina main page block kiye. Heavy calculations ke liye useful hain. Worker main page se postMessage aur message events ke through communicate karta hai. Workers DOM ko directly access nahi kar sakte.",
        "<script>\n  const worker = new Worker('worker.js');\n  worker.postMessage({ task: 'start' });\n  worker.onmessage = (event) => {\n    console.log('Worker result:', event.data);\n  };\n</script>\n\n<!-- worker.js: self.onmessage = e => self.postMessage('Done'); -->"
    ),
    createHtmlLesson(
        73,
        "html-server-sent-events",
        "HTML Server-Sent Events",
        "Server-Sent Events allow a server to push updates to the browser over a single HTTP connection. Use EventSource in JavaScript. SSE is good for live notifications, scores, logs, or dashboards where the server sends updates and the browser only listens.",
        "Server-Sent Events server ko browser par single HTTP connection ke through updates push karne dete hain. JavaScript me EventSource use hota hai. SSE live notifications, scores, logs ya dashboards ke liye good hai jahan server updates bhejta hai aur browser listen karta hai.",
        "<div id='feed'></div>\n<script>\n  const source = new EventSource('/events');\n  source.onmessage = function (event) {\n    feed.innerHTML += '<p>' + event.data + '</p>';\n  };\n  source.onerror = function () {\n    console.log('SSE connection error');\n  };\n</script>"
    ),
    createHtmlLesson(
        74,
        "html-accessibility",
        "HTML Accessibility",
        "Accessible HTML helps everyone use your site. Use semantic elements, labels for inputs, alt text for images, correct heading order, keyboard-friendly controls, descriptive link text, sufficient color contrast, and ARIA only when native HTML cannot express the meaning.",
        "Accessible HTML sab users ko site use karne me help karta hai. Semantic elements, inputs ke liye labels, images ke liye alt text, correct heading order, keyboard-friendly controls, descriptive link text, color contrast, aur ARIA sirf tab use karein jab native HTML meaning express na kar sake.",
        "<label for='email'>Email address</label>\n<input id='email' type='email' required>\n\n<img src='chart.png' alt='Monthly sales increased by 20 percent'>\n\n<button type='button' aria-label='Close dialog'>x</button>\n<a href='/pricing'>View pricing plans</a>"
    ),
    createHtmlLesson(
        75,
        "html-seo-basics",
        "HTML SEO Basics",
        "SEO-friendly HTML uses meaningful titles, meta descriptions, one clear h1, structured headings, semantic landmarks, descriptive links, alt text, canonical links, and fast-loading media. Search engines and users both benefit from clear page structure.",
        "SEO-friendly HTML me meaningful titles, meta descriptions, ek clear h1, structured headings, semantic landmarks, descriptive links, alt text, canonical links aur fast-loading media use hota hai. Clear page structure se search engines aur users dono ko benefit milta hai.",
        "<head>\n  <title>HTML Forms Tutorial</title>\n  <meta name='description' content='Learn HTML forms, inputs, labels, and validation.'>\n  <link rel='canonical' href='https://example.com/html-forms'>\n</head>\n<body>\n  <main>\n    <h1>HTML Forms Tutorial</h1>\n  </main>\n</body>"
    ),
];

const createCssLesson = (
    order: number,
    topic: string,
    title: string,
    focus: string,
    code: string
) => ({
    category: "css",
    topic,
    title,
    order,
    content: {
        english: `${title} focuses on ${focus}. Learn the property names, common values, browser behavior, and when to use the feature in real layouts. Keep CSS readable by grouping related rules and testing changes in the browser.`,
        hinglish: `${title} me ${focus} par focus hota hai. Property names, common values, browser behavior aur real layouts me kab use karna hai yeh samjhein. CSS ko readable rakhne ke liye related rules group karein aur browser me test karein.`,
    },
    codeSample: {
        language: "css",
        filename: `${topic}.css`,
        code,
    },
});

const CSS_ADDITIONAL_LESSONS = [
    createCssLesson(16, "css-how-to", "CSS How To", "inline, internal, and external CSS setup", "/* External CSS is preferred */\n.card {\n  padding: 16px;\n  background: white;\n}\n\n/* Internal CSS goes inside <style> */\n/* Inline CSS goes inside style='' */"),
    createCssLesson(17, "css-comments", "CSS Comments", "writing helpful notes inside stylesheets", "/* Page layout */\n.wrapper {\n  max-width: 1120px;\n  margin: 0 auto;\n}\n\n/* TODO: improve mobile spacing */"),
    createCssLesson(18, "css-errors", "CSS Errors", "debugging invalid selectors, missing braces, and unsupported values", ".box {\n  color: blue;\n  padding: 16px;\n}\n\n/* Check DevTools when a rule is crossed out */"),
    createCssLesson(19, "css-rgb", "CSS RGB Colors", "rgb and rgba color values", ".alert {\n  color: rgb(185, 28, 28);\n  background: rgba(254, 226, 226, 0.8);\n}"),
    createCssLesson(20, "css-hex", "CSS HEX Colors", "hexadecimal color notation", ".brand {\n  color: #2563eb;\n  background-color: #eff6ff;\n  border-color: #93c5fd;\n}"),
    createCssLesson(21, "css-hsl", "CSS HSL Colors", "hue, saturation, lightness, and alpha", ".badge {\n  color: hsl(160, 84%, 25%);\n  background: hsl(160, 84%, 95%);\n}"),
    createCssLesson(22, "css-background-color", "CSS Background Color", "solid background colors for sections and components", "body {\n  background-color: #f8fafc;\n}\n.card {\n  background-color: white;\n}"),
    createCssLesson(23, "css-background-image", "CSS Background Image", "decorative image backgrounds", ".hero {\n  background-image: url('/images/hero.jpg');\n  background-size: cover;\n  background-position: center;\n}"),
    createCssLesson(24, "css-background-repeat", "CSS Background Repeat", "controlling repeated background images", ".pattern {\n  background-image: url('/pattern.png');\n  background-repeat: repeat-x;\n}"),
    createCssLesson(25, "css-background-attachment", "CSS Background Attachment", "fixed and scrolling backgrounds", ".banner {\n  background-image: url('/bg.jpg');\n  background-attachment: fixed;\n}"),
    createCssLesson(26, "css-background-shorthand", "CSS Background Shorthand", "combining background values into one rule", ".hero {\n  background: #111 url('/hero.jpg') center / cover no-repeat;\n}"),
    createCssLesson(27, "css-border-style", "CSS Border Style", "solid, dashed, dotted, double, and none borders", ".box {\n  border-style: dashed;\n  border-width: 2px;\n  border-color: #64748b;\n}"),
    createCssLesson(28, "css-border-width", "CSS Border Width", "thin, medium, thick, and custom border widths", ".card {\n  border-style: solid;\n  border-width: 1px 2px 4px 2px;\n}"),
    createCssLesson(29, "css-border-color", "CSS Border Color", "setting border colors per side", ".notice {\n  border: 1px solid #cbd5e1;\n  border-left-color: #2563eb;\n}"),
    createCssLesson(30, "css-border-sides", "CSS Border Sides", "styling individual border sides", ".panel {\n  border-top: 4px solid #22c55e;\n  border-bottom: 1px solid #e5e7eb;\n}"),
    createCssLesson(31, "css-border-shorthand", "CSS Border Shorthand", "writing border width, style, and color together", ".button {\n  border: 2px solid #111827;\n}"),
    createCssLesson(32, "css-rounded-borders", "CSS Rounded Borders", "border-radius for soft corners and pills", ".pill {\n  border-radius: 999px;\n}\n.card {\n  border-radius: 8px;\n}"),
    createCssLesson(33, "css-margins", "CSS Margins", "outer spacing around elements", ".section {\n  margin: 32px auto;\n  max-width: 960px;\n}\n.title {\n  margin-bottom: 12px;\n}"),
    createCssLesson(34, "css-margin-collapse", "CSS Margin Collapse", "how vertical margins combine between block elements", ".stack > * {\n  margin-block: 0;\n}\n.stack > * + * {\n  margin-top: 16px;\n}"),
    createCssLesson(35, "css-padding", "CSS Padding", "inner spacing inside elements", ".card {\n  padding: 24px;\n}\n.button {\n  padding: 10px 16px;\n}"),
    createCssLesson(36, "css-box-sizing", "CSS Box Sizing", "including padding and border inside element width", "* {\n  box-sizing: border-box;\n}\n.input {\n  width: 100%;\n  padding: 12px;\n}"),
    createCssLesson(37, "css-height-width", "CSS Height and Width", "fixed and fluid sizing", ".sidebar {\n  width: 280px;\n}\n.hero {\n  min-height: 60vh;\n}"),
    createCssLesson(38, "css-min-max", "CSS Min and Max Size", "min-width, max-width, min-height, and max-height", ".container {\n  width: min(100% - 32px, 1120px);\n  min-height: 400px;\n}"),
    createCssLesson(39, "css-outline", "CSS Outline", "focus outlines outside the border box", ".button:focus-visible {\n  outline: 3px solid #60a5fa;\n  outline-offset: 3px;\n}"),
    createCssLesson(40, "css-outline-offset", "CSS Outline Offset", "spacing outlines away from elements", ".link:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 4px;\n}"),
    createCssLesson(41, "css-text-color", "CSS Text Color", "setting readable foreground colors", "body {\n  color: #111827;\n}\n.muted {\n  color: #6b7280;\n}"),
    createCssLesson(42, "css-text-align", "CSS Text Alignment", "left, right, center, justify, and start alignment", ".hero {\n  text-align: center;\n}\n.article {\n  text-align: start;\n}"),
    createCssLesson(43, "css-text-decoration", "CSS Text Decoration", "underlines, overlines, and line-through styles", "a {\n  text-decoration: underline;\n  text-underline-offset: 4px;\n}\n.old-price {\n  text-decoration: line-through;\n}"),
    createCssLesson(44, "css-text-transform", "CSS Text Transform", "uppercase, lowercase, and capitalize text", ".eyebrow {\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n}"),
    createCssLesson(45, "css-text-spacing", "CSS Text Spacing", "line-height, letter-spacing, word-spacing, and indentation", "p {\n  line-height: 1.7;\n}\n.intro {\n  text-indent: 2rem;\n}"),
    createCssLesson(46, "css-text-shadow", "CSS Text Shadow", "adding depth or contrast to text", ".hero-title {\n  color: white;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);\n}"),
    createCssLesson(47, "css-font-family", "CSS Font Family", "choosing font stacks and fallbacks", "body {\n  font-family: Inter, Arial, sans-serif;\n}\ncode {\n  font-family: 'Fira Code', monospace;\n}"),
    createCssLesson(48, "css-font-size", "CSS Font Size", "using readable font sizes", "body {\n  font-size: 16px;\n}\nh1 {\n  font-size: 2rem;\n}"),
    createCssLesson(49, "css-font-style-weight", "CSS Font Style and Weight", "italic, normal, bold, and numeric weights", ".quote {\n  font-style: italic;\n}\n.heading {\n  font-weight: 800;\n}"),
    createCssLesson(50, "css-google-fonts", "CSS Google Fonts", "loading external web fonts", "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');\nbody {\n  font-family: 'Inter', sans-serif;\n}"),
    createCssLesson(51, "css-font-shorthand", "CSS Font Shorthand", "combining font-style, weight, size, line-height, and family", ".lead {\n  font: italic 700 1.25rem/1.6 Georgia, serif;\n}"),
    createCssLesson(52, "css-icons", "CSS Icons", "styling icon fonts and inline icons", ".icon {\n  width: 1em;\n  height: 1em;\n  color: #2563eb;\n  vertical-align: middle;\n}"),
    createCssLesson(53, "css-links", "CSS Links", "styling link states clearly", "a {\n  color: #2563eb;\n}\na:hover {\n  color: #1d4ed8;\n}\na:focus-visible {\n  outline: 2px solid currentColor;\n}"),
    createCssLesson(54, "css-link-buttons", "CSS Link Buttons", "making links look like actions while staying semantic", ".link-button {\n  display: inline-block;\n  padding: 10px 16px;\n  background: #111827;\n  color: white;\n  border-radius: 6px;\n}"),
    createCssLesson(55, "css-lists", "CSS Lists", "list markers, spacing, and custom list styles", "ul {\n  list-style-type: square;\n  padding-left: 1.5rem;\n}\nli + li {\n  margin-top: 8px;\n}"),
    createCssLesson(56, "css-tables", "CSS Tables", "borders, spacing, alignment, and readable table rows", "table {\n  width: 100%;\n  border-collapse: collapse;\n}\nth, td {\n  padding: 12px;\n  border-bottom: 1px solid #e5e7eb;\n}"),
    createCssLesson(57, "css-table-responsive", "CSS Responsive Tables", "horizontal scrolling for wide tables", ".table-wrap {\n  overflow-x: auto;\n}\ntable {\n  min-width: 640px;\n}"),
    createCssLesson(58, "css-visibility", "CSS Visibility", "hiding elements while preserving or removing layout space", ".hidden-space {\n  visibility: hidden;\n}\n.removed {\n  display: none;\n}"),
    createCssLesson(59, "css-max-width", "CSS Max-width", "limiting readable content width", ".content {\n  max-width: 720px;\n  margin-inline: auto;\n}"),
    createCssLesson(60, "css-position-static-relative", "CSS Static and Relative Position", "normal flow and relative offsets", ".badge {\n  position: relative;\n  top: -2px;\n}"),
    createCssLesson(61, "css-position-fixed-absolute", "CSS Fixed and Absolute Position", "positioning elements relative to viewport or nearest positioned ancestor", ".modal-close {\n  position: absolute;\n  top: 12px;\n  right: 12px;\n}\n.toolbar {\n  position: fixed;\n  bottom: 0;\n}"),
    createCssLesson(62, "css-position-sticky", "CSS Sticky Position", "elements that stick while scrolling", ".toc {\n  position: sticky;\n  top: 16px;\n}"),
    createCssLesson(63, "css-z-index", "CSS Z-index", "stacking positioned elements", ".overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 50;\n}"),
    createCssLesson(64, "css-overflow", "CSS Overflow", "scrolling or clipping extra content", ".scroll-box {\n  max-height: 240px;\n  overflow: auto;\n}"),
    createCssLesson(65, "css-float-clear", "CSS Float and Clear", "legacy image wrapping and clearing floats", "img.float-left {\n  float: left;\n  margin-right: 16px;\n}\n.clearfix::after {\n  content: '';\n  display: block;\n  clear: both;\n}"),
    createCssLesson(66, "css-inline-block", "CSS Inline-block", "inline flow with block sizing", ".tag {\n  display: inline-block;\n  padding: 4px 10px;\n  margin: 4px;\n}"),
    createCssLesson(67, "css-align", "CSS Align", "horizontal and vertical centering patterns", ".center {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}"),
    createCssLesson(68, "css-combinators", "CSS Combinators", "descendant, child, adjacent, and sibling selectors", ".card > h2 {\n  margin-top: 0;\n}\nh2 + p {\n  margin-top: 8px;\n}"),
    createCssLesson(69, "css-pseudo-classes", "CSS Pseudo-classes", "styling states like hover, focus, first-child, and nth-child", "button:hover {\n  background: #1d4ed8;\n}\nli:nth-child(even) {\n  background: #f8fafc;\n}"),
    createCssLesson(70, "css-pseudo-elements", "CSS Pseudo-elements", "styling generated parts like before, after, first-line, and selection", ".quote::before {\n  content: '“';\n  color: #94a3b8;\n}\n::selection {\n  background: #bfdbfe;\n}"),
    createCssLesson(71, "css-opacity", "CSS Opacity", "making elements transparent", ".disabled {\n  opacity: 0.5;\n}\n.overlay {\n  background: rgba(0, 0, 0, 0.6);\n}"),
    createCssLesson(72, "css-navigation-bars", "CSS Navigation Bars", "building horizontal and vertical nav layouts", ".nav {\n  display: flex;\n  gap: 16px;\n  align-items: center;\n}\n.nav a {\n  text-decoration: none;\n}"),
    createCssLesson(73, "css-dropdowns", "CSS Dropdowns", "showing menus on hover or focus", ".menu { position: relative; }\n.submenu {\n  display: none;\n  position: absolute;\n}\n.menu:focus-within .submenu,\n.menu:hover .submenu {\n  display: block;\n}"),
    createCssLesson(74, "css-image-gallery", "CSS Image Gallery", "responsive image grids", ".gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));\n  gap: 12px;\n}\n.gallery img { width: 100%; }"),
    createCssLesson(75, "css-image-sprites", "CSS Image Sprites", "using one image file for multiple icons", ".sprite {\n  width: 24px;\n  height: 24px;\n  background-image: url('/sprite.png');\n}\n.icon-home { background-position: 0 0; }"),
    createCssLesson(76, "css-attribute-selectors", "CSS Attribute Selectors", "targeting elements by attribute values", "input[type='email'] {\n  border-color: #2563eb;\n}\na[href^='https']::after {\n  content: ' external';\n}"),
    createCssLesson(77, "css-forms", "CSS Forms", "styling inputs, labels, selects, and form states", "label {\n  display: block;\n  margin-bottom: 6px;\n}\ninput, select, textarea {\n  width: 100%;\n  padding: 10px;\n}"),
    createCssLesson(78, "css-input-focus", "CSS Input Focus", "visible focus states and input icons", "input:focus {\n  outline: 2px solid #60a5fa;\n  border-color: #2563eb;\n}\n.input-icon { padding-left: 36px; }"),
    createCssLesson(79, "css-counters", "CSS Counters", "automatic numbering with CSS", ".steps {\n  counter-reset: step;\n}\n.steps li::before {\n  counter-increment: step;\n  content: counter(step) '. ';\n}"),
    createCssLesson(80, "css-units", "CSS Units", "absolute and relative units like px, rem, em, %, vw, and vh", ".card {\n  padding: 1rem;\n  width: 90%;\n  min-height: 50vh;\n}"),
    createCssLesson(81, "css-inheritance", "CSS Inheritance", "how some properties pass from parent to child", "body {\n  color: #111827;\n  font-family: Arial, sans-serif;\n}\nbutton {\n  font: inherit;\n}"),
    createCssLesson(82, "css-specificity", "CSS Specificity", "how browsers decide which rule wins", ".button { color: blue; }\n.card .button { color: green; }\n#primary-button { color: red; }"),
    createCssLesson(83, "css-important", "CSS !important", "overriding normal cascade rules carefully", ".utility-hidden {\n  display: none !important;\n}\n/* Use sparingly */"),
    createCssLesson(84, "css-math-functions", "CSS Math Functions", "calc, min, max, and clamp", ".title {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n}\n.layout {\n  width: calc(100% - 32px);\n}"),
    createCssLesson(85, "css-optimization", "CSS Optimization", "smaller, cleaner, faster stylesheets", "/* Prefer reusable classes */\n.card {\n  padding: 16px;\n  border: 1px solid #e5e7eb;\n}\n/* Remove unused CSS in production */"),
    createCssLesson(86, "css-accessibility", "CSS Accessibility", "focus states, contrast, reduced motion, and readable layouts", ":focus-visible {\n  outline: 3px solid #2563eb;\n}\n@media (prefers-reduced-motion: reduce) {\n  * { animation: none; transition: none; }\n}"),
    createCssLesson(87, "css-website-layout", "CSS Website Layout", "common page structures with header, sidebar, content, and footer", ".page {\n  display: grid;\n  grid-template-columns: 260px 1fr;\n  min-height: 100vh;\n}\nmain { padding: 24px; }"),
    createCssLesson(88, "css-border-images", "CSS Border Images", "using images as borders", ".frame {\n  border: 16px solid transparent;\n  border-image: url('/border.png') 30 round;\n}"),
    createCssLesson(89, "css-multiple-backgrounds", "CSS Multiple Backgrounds", "layering more than one background", ".hero {\n  background-image: linear-gradient(#0008, #0008), url('/hero.jpg');\n  background-size: cover;\n}"),
    createCssLesson(90, "css-gradients", "CSS Gradients", "linear, radial, and conic gradients", ".banner {\n  background: linear-gradient(135deg, #2563eb, #22c55e);\n}\n.pie {\n  background: conic-gradient(red, yellow, lime, red);\n}"),
    createCssLesson(91, "css-shadows", "CSS Shadows", "box-shadow and text-shadow", ".card {\n  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);\n}\n.title {\n  text-shadow: 0 1px 2px #0004;\n}"),
    createCssLesson(92, "css-text-effects", "CSS Text Effects", "overflow, wrapping, clipping, and long words", ".truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.long-word { overflow-wrap: anywhere; }"),
    createCssLesson(93, "css-custom-fonts", "CSS Custom Fonts", "loading local font files with @font-face", "@font-face {\n  font-family: 'BrandSans';\n  src: url('/fonts/brand.woff2') format('woff2');\n}\nbody { font-family: 'BrandSans', sans-serif; }"),
    createCssLesson(94, "css-2d-transforms", "CSS 2D Transforms", "translate, rotate, scale, and skew", ".card:hover {\n  transform: translateY(-4px) scale(1.02);\n}\n.icon { transform: rotate(15deg); }"),
    createCssLesson(95, "css-3d-transforms", "CSS 3D Transforms", "perspective and 3D rotation", ".scene { perspective: 800px; }\n.card {\n  transform: rotateY(20deg);\n  transform-style: preserve-3d;\n}"),
    createCssLesson(96, "css-transition-timing", "CSS Transition Timing", "duration, delay, and easing curves", ".button {\n  transition: transform 200ms ease, background-color 200ms ease;\n}\n.button:hover { transform: translateY(-2px); }"),
    createCssLesson(97, "css-animation-properties", "CSS Animation Properties", "keyframes, duration, iteration count, and direction", "@keyframes pulse {\n  50% { opacity: 0.5; }\n}\n.loader {\n  animation: pulse 1s ease-in-out infinite;\n}"),
    createCssLesson(98, "css-tooltips", "CSS Tooltips", "hover and focus helper labels", ".tooltip { position: relative; }\n.tooltip:hover::after {\n  content: attr(data-tip);\n  position: absolute;\n  top: 100%;\n  left: 0;\n}"),
    createCssLesson(99, "css-image-effects", "CSS Image Effects", "filters, overlays, object-fit, and image presentation", ".avatar {\n  width: 96px;\n  aspect-ratio: 1;\n  object-fit: cover;\n  border-radius: 50%;\n  filter: saturate(1.1);\n}"),
    createCssLesson(100, "css-variables-media-queries", "CSS Variables & Media Queries", "custom properties and responsive overrides", ":root {\n  --space: 16px;\n  --brand: #2563eb;\n}\n.card { padding: var(--space); }\n@media (max-width: 600px) {\n  :root { --space: 12px; }\n}"),
];

const createJsLesson = (
    order: number,
    topic: string,
    title: string,
    focus: string
) => ({
    category: "javascript",
    topic,
    title,
    order,
    content: {
        english: `${title} focuses on ${focus}. Learn the syntax, common browser behavior, practical use cases, and mistakes to avoid. Practice with small examples before using it in a real project.`,
        hinglish: `${title} me ${focus} par focus hota hai. Syntax, browser behavior, practical use cases aur common mistakes samjhein. Real project me use karne se pehle small examples ke saath practice karein.`,
    },
    codeSample: {
        language: "javascript",
        filename: `${topic}.js`,
        code: `// ${title}\nconst topic = ${JSON.stringify(title)};\nconsole.log(topic);\n\n// Practice idea: create a small example for ${focus}.`,
    },
});

const JS_ADDITIONAL_TOPICS: [number, string, string, string][] = [
    [27, "js-where-to", "JavaScript Where To", "placing scripts inline, internal, external, defer, and async"],
    [28, "js-comments", "JavaScript Comments", "single-line and multi-line comments"],
    [29, "js-let", "JavaScript Let", "block-scoped variables that can be reassigned"],
    [30, "js-const", "JavaScript Const", "block-scoped constants and mutation rules"],
    [31, "js-arithmetic", "JavaScript Arithmetic", "math operators and calculation order"],
    [32, "js-assignment", "JavaScript Assignment", "assignment operators like +=, -=, *=, and /="],
    [33, "js-comparisons", "JavaScript Comparisons", "strict equality and relational operators"],
    [34, "js-conditional-operator", "JavaScript Conditional Operator", "ternary expressions for small decisions"],
    [35, "js-booleans", "JavaScript Booleans", "true, false, truthy, and falsy values"],
    [36, "js-logical", "JavaScript Logical Operators", "AND, OR, NOT, and short-circuiting"],
    [37, "js-switch", "JavaScript Switch", "multi-branch conditions"],
    [38, "js-loop-for", "JavaScript For Loop", "counted loops and array iteration"],
    [39, "js-loop-while", "JavaScript While Loop", "loops that run while a condition is true"],
    [40, "js-break-continue", "JavaScript Break and Continue", "stopping or skipping loop iterations"],
    [41, "js-control-flow", "JavaScript Control Flow", "how execution moves through conditions, loops, and returns"],
    [42, "js-string-templates", "JavaScript String Templates", "template literals and interpolation"],
    [43, "js-string-methods", "JavaScript String Methods", "trim, slice, replace, includes, and casing"],
    [44, "js-string-search", "JavaScript String Search", "indexOf, startsWith, endsWith, match, and search"],
    [45, "js-number-methods", "JavaScript Number Methods", "toFixed, toString, Number, parseInt, and parseFloat"],
    [46, "js-number-properties", "JavaScript Number Properties", "MAX_VALUE, MIN_VALUE, EPSILON, and safe integers"],
    [47, "js-bitwise", "JavaScript Bitwise", "bit-level operators"],
    [48, "js-bigint", "JavaScript BigInt", "integers larger than Number safe range"],
    [49, "js-function-invocation", "JavaScript Function Invocation", "calling functions and understanding this context"],
    [50, "js-function-parameters", "JavaScript Function Parameters", "default parameters and argument passing"],
    [51, "js-function-returns", "JavaScript Function Returns", "return values and early returns"],
    [52, "js-function-arguments", "JavaScript Function Arguments", "rest parameters and the old arguments object"],
    [53, "js-function-expressions", "JavaScript Function Expressions", "assigning functions to variables"],
    [54, "js-arrow-functions", "JavaScript Arrow Functions", "short function syntax and lexical this"],
    [55, "js-object-properties", "JavaScript Object Properties", "reading, writing, deleting, and checking properties"],
    [56, "js-object-methods", "JavaScript Object Methods", "functions stored inside objects"],
    [57, "js-object-this", "JavaScript Object this", "how this points to the calling object"],
    [58, "js-object-display", "JavaScript Object Display", "rendering objects as JSON or entries"],
    [59, "js-object-constructors", "JavaScript Object Constructors", "creating similar objects with constructor functions"],
    [60, "js-code-blocks", "JavaScript Code Blocks", "block scope with braces"],
    [61, "js-hoisting", "JavaScript Hoisting", "declaration behavior before execution"],
    [62, "js-strict-mode", "JavaScript Strict Mode", "safer JavaScript parsing and runtime rules"],
    [63, "js-dates", "JavaScript Dates", "creating and working with Date objects"],
    [64, "js-date-formats", "JavaScript Date Formats", "ISO, short, long, and timestamp dates"],
    [65, "js-date-get-set", "JavaScript Date Get and Set", "getting and updating date parts"],
    [66, "js-date-methods", "JavaScript Date Methods", "formatting and comparing dates"],
    [67, "js-temporal-intro", "JavaScript Temporal Intro", "modern date-time concepts"],
    [68, "js-temporal-duration", "JavaScript Temporal Duration", "representing time spans"],
    [69, "js-temporal-instant", "JavaScript Temporal Instant", "exact points in time"],
    [70, "js-temporal-plain-date-time", "JavaScript Temporal PlainDateTime", "date and time without timezone"],
    [71, "js-temporal-zoned-date-time", "JavaScript Temporal ZonedDateTime", "date-time with timezone"],
    [72, "js-temporal-migrate", "JavaScript Temporal Migration", "moving from Date to Temporal patterns"],
    [73, "js-array-methods", "JavaScript Array Methods", "push, pop, shift, unshift, slice, splice, map, filter, and reduce"],
    [74, "js-array-search", "JavaScript Array Search", "find, findIndex, includes, indexOf, and some"],
    [75, "js-array-sort", "JavaScript Array Sort", "sorting strings, numbers, and objects"],
    [76, "js-array-iterations", "JavaScript Array Iterations", "forEach, map, filter, reduce, every, and some"],
    [77, "js-array-const", "JavaScript Array Const", "const arrays and mutation"],
    [78, "js-sets", "JavaScript Sets", "unique collections"],
    [79, "js-set-methods", "JavaScript Set Methods", "add, delete, has, clear, and iteration"],
    [80, "js-set-logic", "JavaScript Set Logic", "union, intersection, and difference"],
    [81, "js-weakset", "JavaScript WeakSet", "weakly held object collections"],
    [82, "js-maps", "JavaScript Maps", "key-value collections with any key type"],
    [83, "js-map-methods", "JavaScript Map Methods", "set, get, has, delete, clear, keys, and values"],
    [84, "js-weakmap", "JavaScript WeakMap", "private metadata for objects"],
    [85, "js-iterables", "JavaScript Iterables", "objects that work with for...of"],
    [86, "js-iterators", "JavaScript Iterators", "manual next() iteration"],
    [87, "js-generators", "JavaScript Generators", "pausable functions using yield"],
    [88, "js-math", "JavaScript Math", "common Math methods and constants"],
    [89, "js-math-random", "JavaScript Math Random", "random numbers and ranges"],
    [90, "js-regexp", "JavaScript RegExp", "regular expressions for matching text"],
    [91, "js-regexp-flags", "JavaScript RegExp Flags", "i, g, m, s, u, and y flags"],
    [92, "js-regexp-classes", "JavaScript RegExp Classes", "digit, word, whitespace, and custom classes"],
    [93, "js-regexp-quantifiers", "JavaScript RegExp Quantifiers", "matching repeated patterns"],
    [94, "js-regexp-methods", "JavaScript RegExp Methods", "test, exec, match, replace, split, and search"],
    [95, "js-typeof", "JavaScript typeof", "checking primitive and object types"],
    [96, "js-type-conversion", "JavaScript Type Conversion", "explicit and implicit conversions"],
    [97, "js-destructuring", "JavaScript Destructuring", "unpacking arrays and objects"],
    [98, "js-error-statements", "JavaScript Error Statements", "try, catch, finally, and throw"],
    [99, "js-error-object", "JavaScript Error Object", "name, message, stack, and custom errors"],
    [100, "js-debugging-console", "JavaScript Debugging Console", "console methods and inspection"],
    [101, "js-debugging-breakpoints", "JavaScript Debugging Breakpoints", "pausing code in DevTools"],
    [102, "js-style-guide", "JavaScript Style Guide", "consistent names, formatting, and code organization"],
    [103, "js-common-mistakes", "JavaScript Common Mistakes", "bugs with equality, scope, mutation, and async code"],
    [104, "js-performance", "JavaScript Performance", "efficient DOM updates and avoiding heavy main-thread work"],
    [105, "js-counter-project", "JavaScript Counter Project", "building a small interactive counter"],
    [106, "js-event-listener-project", "JavaScript Event Listener Project", "using events for UI interactions"],
    [107, "js-todo-list-project", "JavaScript To-Do List Project", "adding, rendering, and removing items"],
    [108, "js-modal-popup-project", "JavaScript Modal Popup Project", "opening and closing dialogs"],
    [109, "js-form-validation-project", "JavaScript Form Validation Project", "validating forms before submit"],
    [110, "js-versions", "JavaScript Versions", "ES versions and feature evolution"],
    [111, "js-es5", "JavaScript ES5", "strict mode, JSON, array methods, and older browser-era JavaScript"],
    [112, "js-es2015", "JavaScript ES2015", "let, const, classes, modules, promises, and arrow functions"],
    [113, "js-modern-versions", "JavaScript Modern Versions", "optional chaining, nullish coalescing, flat, at, and newer additions"],
    [114, "js-html-dom", "JavaScript HTML DOM", "document object model basics"],
    [115, "js-dom-api", "JavaScript DOM API", "nodes, elements, attributes, and collections"],
    [116, "js-selecting-elements", "JavaScript Selecting Elements", "getElementById, querySelector, and querySelectorAll"],
    [117, "js-changing-html", "JavaScript Changing HTML", "textContent, innerHTML, and safe updates"],
    [118, "js-changing-css", "JavaScript Changing CSS", "style and classList updates"],
    [119, "js-dom-form-validation", "JavaScript DOM Form Validation", "checking fields and showing messages"],
    [120, "js-dom-animations", "JavaScript DOM Animations", "class-based and Web Animations API effects"],
    [121, "js-mouse-events", "JavaScript Mouse Events", "click, dblclick, mouseenter, mouseleave, and contextmenu"],
    [122, "js-keyboard-events", "JavaScript Keyboard Events", "keydown, keyup, and keyboard shortcuts"],
    [123, "js-load-events", "JavaScript Load Events", "DOMContentLoaded, load, and beforeunload"],
    [124, "js-timing-events", "JavaScript Timing Events", "setTimeout, setInterval, and clearing timers"],
    [125, "js-advanced-functions", "JavaScript Advanced Functions", "callbacks, closures, bind, call, apply, and IIFE"],
    [126, "js-callbacks", "JavaScript Callbacks", "passing functions into functions"],
    [127, "js-closures", "JavaScript Closures", "functions remembering outer variables"],
    [128, "js-call-apply-bind", "JavaScript Call Apply Bind", "controlling this explicitly"],
    [129, "js-prototypes", "JavaScript Prototypes", "prototype chain and shared methods"],
    [130, "js-object-get-set", "JavaScript Object Getters and Setters", "computed object accessors"],
    [131, "js-object-management", "JavaScript Object Management", "keys, values, entries, assign, freeze, and seal"],
    [132, "js-class-inheritance", "JavaScript Class Inheritance", "extends, super, and overriding methods"],
    [133, "js-class-static", "JavaScript Class Static", "methods called on the class itself"],
    [134, "js-async-timeouts", "JavaScript Async Timeouts", "asynchronous delays with setTimeout"],
    [135, "js-async-callbacks", "JavaScript Async Callbacks", "callback-based async code and callback nesting"],
    [136, "js-modules-export", "JavaScript Modules Export", "named and default exports"],
    [137, "js-modules-import", "JavaScript Modules Import", "named, default, namespace, and dynamic imports"],
    [138, "js-meta-proxy", "JavaScript Meta Programming and Proxy", "intercepting object operations"],
    [139, "js-typed-arrays", "JavaScript Typed Arrays", "binary data with ArrayBuffer and typed views"],
    [140, "js-web-apis-json-ajax", "JavaScript Web APIs, JSON, and AJAX", "browser APIs, JSON parsing, XMLHttpRequest, and fetch patterns"],
];

const JS_ADDITIONAL_LESSONS = JS_ADDITIONAL_TOPICS.map(([order, topic, title, focus]) =>
    createJsLesson(order, topic, title, focus)
);

type StackCategory = "react" | "nextjs" | "tailwind";

const createStackLesson = (
    category: StackCategory,
    order: number,
    topic: string,
    title: string,
    focus: string
) => ({
    category,
    topic,
    title,
    order,
    content: {
        english: `${title} focuses on ${focus}. Learn the core idea, common patterns, project usage, and mistakes to avoid. Build a small example, then connect it to a real app workflow.`,
        hinglish: `${title} me ${focus} par focus hota hai. Core idea, common patterns, project usage aur common mistakes samjhein. Pehle small example banayein, phir real app workflow me connect karein.`,
    },
    codeSample: {
        language: category === "tailwind" ? "html" : "javascript",
        filename: `${topic}.${category === "tailwind" ? "html" : "jsx"}`,
        code: category === "tailwind"
            ? `<div class="p-4 rounded-lg border">\n  <h2 class="text-lg font-bold">${title}</h2>\n  <p class="text-sm text-slate-600">${focus}</p>\n</div>`
            : `// ${title}\nexport default function Example() {\n  return <div>${title}</div>;\n}\n\n// Practice: ${focus}.`,
    },
});

const REACT_TOPICS: [number, string, string, string][] = [
    [1, "react-introduction", "React Introduction", "what React is and why component-based UI matters"],
    [2, "react-get-started", "React Get Started", "setting up React with modern tooling"],
    [3, "react-upgrade", "React Upgrade", "keeping React projects on current versions"],
    [4, "react-es6", "React ES6", "modern JavaScript features used in React"],
    [5, "react-render-html", "React Render HTML", "rendering React into a root element"],
    [6, "react-jsx", "React JSX", "writing HTML-like syntax in JavaScript"],
    [7, "react-components", "React Components", "building reusable UI pieces"],
    [8, "react-class-components", "React Class Components", "legacy class component structure"],
    [9, "react-props", "React Props", "passing data into components"],
    [10, "react-events", "React Events", "handling clicks, input, and UI actions"],
    [11, "react-conditionals", "React Conditionals", "rendering UI based on state or props"],
    [12, "react-lists", "React Lists", "rendering arrays with stable keys"],
    [13, "react-forms", "React Forms", "controlled and uncontrolled form patterns"],
    [14, "react-router", "React Router", "client-side routing concepts"],
    [15, "react-memo", "React Memo", "memoizing components to avoid extra renders"],
    [16, "react-css-styling", "React CSS Styling", "styling React components with CSS"],
    [17, "react-sass", "React Sass", "using Sass with React projects"],
    [18, "react-hooks", "React Hooks", "using state and lifecycle features in functions"],
    [19, "react-usestate", "React useState", "local component state"],
    [20, "react-useeffect", "React useEffect", "side effects and synchronization"],
    [21, "react-usecontext", "React useContext", "sharing data without prop drilling"],
    [22, "react-useref", "React useRef", "DOM refs and persistent mutable values"],
    [23, "react-usereducer", "React useReducer", "complex state updates"],
    [24, "react-usecallback", "React useCallback", "stable callback references"],
    [25, "react-usememo", "React useMemo", "memoizing expensive calculations"],
    [26, "react-custom-hooks", "React Custom Hooks", "extracting reusable stateful logic"],
    [27, "react-react-compiler", "React Compiler", "automatic optimization concepts"],
    [28, "react-activity", "React Activity", "preserving state while hiding UI"],
    [29, "react-useeffectevent", "React useEffectEvent", "reading latest values inside effects"],
    [30, "react-transitions", "React Transitions", "non-blocking UI updates"],
    [31, "react-suspense", "React Suspense", "loading boundaries for async UI"],
    [32, "react-lazy", "React Lazy Loading", "code-splitting components"],
    [33, "react-error-boundaries", "React Error Boundaries", "catching render errors"],
    [34, "react-fragments", "React Fragments", "grouping elements without extra DOM"],
    [35, "react-portals", "React Portals", "rendering outside parent DOM hierarchy"],
    [36, "react-context-patterns", "React Context Patterns", "provider design and performance"],
    [37, "react-state-lifting", "React State Lifting", "moving shared state upward"],
    [38, "react-composition", "React Composition", "children and component slots"],
    [39, "react-controlled-inputs", "React Controlled Inputs", "form state driven by React"],
    [40, "react-uncontrolled-inputs", "React Uncontrolled Inputs", "form refs and native inputs"],
    [41, "react-form-validation", "React Form Validation", "validating and displaying errors"],
    [42, "react-fetching-data", "React Fetching Data", "loading data from APIs"],
    [43, "react-optimistic-ui", "React Optimistic UI", "instant UI before server confirmation"],
    [44, "react-accessibility", "React Accessibility", "labels, keyboard flow, and ARIA"],
    [45, "react-performance", "React Performance", "avoiding unnecessary renders"],
    [46, "react-devtools", "React DevTools", "debugging components and state"],
    [47, "react-typescript", "React TypeScript", "typing props, state, and events"],
    [48, "react-testing", "React Testing", "testing components and user behavior"],
    [49, "react-project-structure", "React Project Structure", "organizing files and components"],
    [50, "react-best-practices", "React Best Practices", "clean component design"],
    [51, "react-todo-project", "React To-do Project", "building a CRUD UI"],
    [52, "react-weather-project", "React Weather Project", "fetching and rendering API data"],
    [53, "react-dashboard-project", "React Dashboard Project", "cards, charts, and filters"],
    [54, "react-auth-ui", "React Auth UI", "login and protected UI patterns"],
    [55, "react-state-management", "React State Management", "choosing local, context, or external state"],
    [56, "react-server-components", "React Server Components", "server-rendered component concepts"],
    [57, "react-streaming-ui", "React Streaming UI", "progressive rendering ideas"],
    [58, "react-routing-patterns", "React Routing Patterns", "nested routes and layouts"],
    [59, "react-deployment", "React Deployment", "building and shipping React apps"],
    [60, "react-interview-topics", "React Interview Topics", "core concepts for practical interviews"],
];

const NEXTJS_TOPICS: [number, string, string, string][] = [
    [1, "nextjs-introduction", "Next.js Introduction", "what Next.js adds on top of React"],
    [2, "nextjs-installation", "Next.js Installation", "creating and running a project"],
    [3, "nextjs-project-structure", "Next.js Project Structure", "app directory, public assets, and config files"],
    [4, "nextjs-layouts-pages", "Next.js Layouts and Pages", "route UI files and shared layouts"],
    [5, "nextjs-linking-navigation", "Next.js Linking and Navigation", "Link, navigation, and redirects"],
    [6, "nextjs-server-client-components", "Next.js Server and Client Components", "server-first component architecture"],
    [7, "nextjs-fetching-data", "Next.js Fetching Data", "server data fetching patterns"],
    [8, "nextjs-mutating-data", "Next.js Mutating Data", "server actions and route handlers"],
    [9, "nextjs-caching", "Next.js Caching", "cache behavior and cache directives"],
    [10, "nextjs-revalidating", "Next.js Revalidating", "refreshing cached data"],
    [11, "nextjs-error-handling", "Next.js Error Handling", "error files and graceful failures"],
    [12, "nextjs-css", "Next.js CSS", "global CSS, CSS modules, and styling"],
    [13, "nextjs-images", "Next.js Images", "optimized images with next/image"],
    [14, "nextjs-fonts", "Next.js Fonts", "loading optimized fonts"],
    [15, "nextjs-metadata-og", "Next.js Metadata and OG Images", "SEO metadata and social cards"],
    [16, "nextjs-route-handlers", "Next.js Route Handlers", "building API endpoints"],
    [17, "nextjs-proxy", "Next.js Proxy", "request interception in Next.js 16"],
    [18, "nextjs-deploying", "Next.js Deploying", "shipping Next.js apps"],
    [19, "nextjs-dynamic-routes", "Next.js Dynamic Routes", "segments like [id] and [...slug]"],
    [20, "nextjs-route-groups", "Next.js Route Groups", "organizing routes without changing URLs"],
    [21, "nextjs-loading-ui", "Next.js Loading UI", "loading.tsx and Suspense"],
    [22, "nextjs-not-found", "Next.js Not Found", "not-found.tsx and 404 flows"],
    [23, "nextjs-templates", "Next.js Templates", "template remount behavior"],
    [24, "nextjs-parallel-routes", "Next.js Parallel Routes", "rendering slots together"],
    [25, "nextjs-intercepting-routes", "Next.js Intercepting Routes", "modal and overlay routing"],
    [26, "nextjs-search-params", "Next.js Search Params", "reading query strings"],
    [27, "nextjs-params", "Next.js Params", "reading dynamic route params"],
    [28, "nextjs-cookies", "Next.js Cookies", "reading and setting cookies"],
    [29, "nextjs-headers", "Next.js Headers", "request header access"],
    [30, "nextjs-server-actions", "Next.js Server Actions", "form mutations on the server"],
    [31, "nextjs-forms", "Next.js Forms", "forms with actions and validation"],
    [32, "nextjs-auth-patterns", "Next.js Auth Patterns", "protecting routes and user sessions"],
    [33, "nextjs-database-patterns", "Next.js Database Patterns", "lazy clients and server data"],
    [34, "nextjs-streaming", "Next.js Streaming", "progressive UI with Suspense"],
    [35, "nextjs-static-rendering", "Next.js Static Rendering", "pre-rendering static routes"],
    [36, "nextjs-dynamic-rendering", "Next.js Dynamic Rendering", "request-time rendering"],
    [37, "nextjs-isr", "Next.js ISR", "incremental static regeneration ideas"],
    [38, "nextjs-cache-components", "Next.js Cache Components", "using cache directives"],
    [39, "nextjs-cache-tags", "Next.js Cache Tags", "tag-based invalidation"],
    [40, "nextjs-route-segment-config", "Next.js Route Segment Config", "route-level rendering options"],
    [41, "nextjs-environment-variables", "Next.js Environment Variables", "server and client env values"],
    [42, "nextjs-config", "Next.js Config", "next.config options"],
    [43, "nextjs-turbopack", "Next.js Turbopack", "development bundling"],
    [44, "nextjs-typescript", "Next.js TypeScript", "typing routes and components"],
    [45, "nextjs-eslint", "Next.js ESLint", "linting project code"],
    [46, "nextjs-api-security", "Next.js API Security", "validating and protecting route handlers"],
    [47, "nextjs-upload-files", "Next.js File Uploads", "handling files safely"],
    [48, "nextjs-middleware-migration", "Next.js Middleware to Proxy", "new proxy.ts behavior"],
    [49, "nextjs-image-remote", "Next.js Remote Images", "remotePatterns and external images"],
    [50, "nextjs-og-generation", "Next.js OG Generation", "dynamic Open Graph images"],
    [51, "nextjs-sitemap-robots", "Next.js Sitemap and Robots", "search crawler files"],
    [52, "nextjs-internationalization", "Next.js Internationalization", "locale routing patterns"],
    [53, "nextjs-analytics", "Next.js Analytics", "measuring page performance"],
    [54, "nextjs-performance", "Next.js Performance", "bundle and rendering optimization"],
    [55, "nextjs-accessibility", "Next.js Accessibility", "accessible routing and UI"],
    [56, "nextjs-testing", "Next.js Testing", "unit and integration testing"],
    [57, "nextjs-debugging", "Next.js Debugging", "DevTools, logs, and overlays"],
    [58, "nextjs-upgrading", "Next.js Upgrading", "version upgrades and migrations"],
    [59, "nextjs-react-19", "Next.js React 19", "React 19 features in App Router"],
    [60, "nextjs-security-cves", "Next.js Security", "patching and defense-in-depth"],
    [61, "nextjs-ecommerce-project", "Next.js E-commerce Project", "products, cart, and checkout UI"],
    [62, "nextjs-blog-project", "Next.js Blog Project", "content routes and metadata"],
    [63, "nextjs-dashboard-project", "Next.js Dashboard Project", "data tables and protected layouts"],
    [64, "nextjs-saas-project", "Next.js SaaS Project", "auth, billing, and settings patterns"],
    [65, "nextjs-crud-project", "Next.js CRUD Project", "route handlers and server actions"],
    [66, "nextjs-deployment-checklist", "Next.js Deployment Checklist", "production readiness"],
    [67, "nextjs-vercel", "Next.js on Vercel", "platform features and deploy flow"],
    [68, "nextjs-self-hosting", "Next.js Self Hosting", "Node runtime deployment basics"],
    [69, "nextjs-best-practices", "Next.js Best Practices", "App Router architecture choices"],
    [70, "nextjs-interview-topics", "Next.js Interview Topics", "practical framework knowledge"],
];

const TAILWIND_TOPICS: [number, string, string, string][] = [
    [1, "tailwind-introduction", "Tailwind CSS Introduction", "utility-first styling"],
    [2, "tailwind-installation", "Tailwind Installation", "setting up Tailwind in a project"],
    [3, "tailwind-editor-setup", "Tailwind Editor Setup", "IntelliSense and formatting"],
    [4, "tailwind-utility-first", "Tailwind Utility-first", "composing designs with utilities"],
    [5, "tailwind-responsive-design", "Tailwind Responsive Design", "mobile-first breakpoints"],
    [6, "tailwind-hover-focus", "Tailwind Hover and Focus", "state variants"],
    [7, "tailwind-dark-mode", "Tailwind Dark Mode", "dark variant patterns"],
    [8, "tailwind-theme", "Tailwind Theme", "design tokens and customization"],
    [9, "tailwind-colors", "Tailwind Colors", "text, background, and border color utilities"],
    [10, "tailwind-spacing", "Tailwind Spacing", "padding, margin, gap, and space utilities"],
    [11, "tailwind-sizing", "Tailwind Sizing", "width, height, min, and max sizes"],
    [12, "tailwind-typography", "Tailwind Typography", "font, text, leading, tracking utilities"],
    [13, "tailwind-fonts", "Tailwind Fonts", "font family, weight, and style"],
    [14, "tailwind-backgrounds", "Tailwind Backgrounds", "background color, image, size, and position"],
    [15, "tailwind-borders", "Tailwind Borders", "border width, color, style, and radius"],
    [16, "tailwind-effects", "Tailwind Effects", "shadow, opacity, mix blend, and filters"],
    [17, "tailwind-filters", "Tailwind Filters", "blur, brightness, contrast, and grayscale"],
    [18, "tailwind-tables", "Tailwind Tables", "styling tabular data"],
    [19, "tailwind-transitions", "Tailwind Transitions", "duration, easing, delay, and properties"],
    [20, "tailwind-transforms", "Tailwind Transforms", "scale, rotate, translate, and skew"],
    [21, "tailwind-animation", "Tailwind Animation", "built-in and custom animations"],
    [22, "tailwind-layout", "Tailwind Layout", "container, box sizing, display, and overflow"],
    [23, "tailwind-flexbox", "Tailwind Flexbox", "flex direction, wrap, grow, shrink, and basis"],
    [24, "tailwind-grid", "Tailwind Grid", "grid columns, rows, placement, and gap"],
    [25, "tailwind-position", "Tailwind Position", "static, relative, absolute, fixed, sticky"],
    [26, "tailwind-z-index", "Tailwind Z-index", "stacking utilities"],
    [27, "tailwind-floats-clear", "Tailwind Floats and Clear", "legacy float utilities"],
    [28, "tailwind-object-fit", "Tailwind Object Fit", "image and video fitting"],
    [29, "tailwind-overflow", "Tailwind Overflow", "scrolling and clipping"],
    [30, "tailwind-visibility", "Tailwind Visibility", "visible, invisible, collapse"],
    [31, "tailwind-display", "Tailwind Display", "block, inline, flex, grid, hidden"],
    [32, "tailwind-align-items", "Tailwind Align Items", "cross-axis alignment"],
    [33, "tailwind-justify-content", "Tailwind Justify Content", "main-axis alignment"],
    [34, "tailwind-place-items", "Tailwind Place Items", "combined grid alignment"],
    [35, "tailwind-space-between", "Tailwind Space Between", "sibling spacing utilities"],
    [36, "tailwind-divide", "Tailwind Divide", "borders between children"],
    [37, "tailwind-ring", "Tailwind Ring", "focus rings and outlines"],
    [38, "tailwind-outline", "Tailwind Outline", "outline utilities"],
    [39, "tailwind-interactivity", "Tailwind Interactivity", "cursor, pointer events, resize, and select"],
    [40, "tailwind-screens", "Tailwind Screens", "breakpoint strategy"],
    [41, "tailwind-container", "Tailwind Container", "responsive content width"],
    [42, "tailwind-arbitrary-values", "Tailwind Arbitrary Values", "one-off custom values"],
    [43, "tailwind-arbitrary-variants", "Tailwind Arbitrary Variants", "custom selectors as variants"],
    [44, "tailwind-custom-theme", "Tailwind Custom Theme", "project-specific design tokens"],
    [45, "tailwind-css-variables", "Tailwind CSS Variables", "using variables with utilities"],
    [46, "tailwind-layer-base", "Tailwind Layer Base", "base styles and resets"],
    [47, "tailwind-layer-components", "Tailwind Layer Components", "component classes"],
    [48, "tailwind-layer-utilities", "Tailwind Layer Utilities", "custom utilities"],
    [49, "tailwind-forms", "Tailwind Forms", "inputs, selects, checkboxes, and labels"],
    [50, "tailwind-buttons", "Tailwind Buttons", "button states and sizes"],
    [51, "tailwind-cards", "Tailwind Cards", "card layouts and content hierarchy"],
    [52, "tailwind-navbar", "Tailwind Navbar", "responsive navigation"],
    [53, "tailwind-sidebar", "Tailwind Sidebar", "dashboard side navigation"],
    [54, "tailwind-modal", "Tailwind Modal", "dialogs and overlays"],
    [55, "tailwind-dropdown", "Tailwind Dropdown", "menus and popovers"],
    [56, "tailwind-tabs", "Tailwind Tabs", "tabbed interfaces"],
    [57, "tailwind-badges", "Tailwind Badges", "labels and status chips"],
    [58, "tailwind-alerts", "Tailwind Alerts", "success, warning, and error messages"],
    [59, "tailwind-avatars", "Tailwind Avatars", "profile images and initials"],
    [60, "tailwind-breadcrumbs", "Tailwind Breadcrumbs", "navigation trails"],
    [61, "tailwind-pagination", "Tailwind Pagination", "page controls"],
    [62, "tailwind-timeline", "Tailwind Timeline", "vertical progress layouts"],
    [63, "tailwind-pricing", "Tailwind Pricing", "pricing cards and comparison UI"],
    [64, "tailwind-hero", "Tailwind Hero Section", "first-screen layouts"],
    [65, "tailwind-dashboard", "Tailwind Dashboard", "dense product UI"],
    [66, "tailwind-landing-page", "Tailwind Landing Page", "marketing layouts"],
    [67, "tailwind-accessibility", "Tailwind Accessibility", "focus states, contrast, and semantics"],
    [68, "tailwind-performance", "Tailwind Performance", "smaller CSS and content scanning"],
    [69, "tailwind-responsive-patterns", "Tailwind Responsive Patterns", "common mobile to desktop patterns"],
    [70, "tailwind-state-variants", "Tailwind State Variants", "hover, focus, active, disabled, checked"],
    [71, "tailwind-group-peer", "Tailwind Group and Peer", "parent and sibling state styling"],
    [72, "tailwind-has-support", "Tailwind Has Support", "styling based on descendants"],
    [73, "tailwind-data-attributes", "Tailwind Data Attributes", "state styling with data attributes"],
    [74, "tailwind-motion", "Tailwind Motion", "reduced motion and animation UX"],
    [75, "tailwind-gradients", "Tailwind Gradients", "linear gradients and color stops"],
    [76, "tailwind-aspect-ratio", "Tailwind Aspect Ratio", "stable media boxes"],
    [77, "tailwind-line-clamp", "Tailwind Line Clamp", "multi-line truncation"],
    [78, "tailwind-scroll-snap", "Tailwind Scroll Snap", "snap scrolling layouts"],
    [79, "tailwind-scrollbar", "Tailwind Scrollbar", "scrollbar styling approaches"],
    [80, "tailwind-print", "Tailwind Print Styles", "print media variants"],
    [81, "tailwind-rtl", "Tailwind RTL", "right-to-left layout support"],
    [82, "tailwind-plugin-system", "Tailwind Plugin System", "extending Tailwind"],
    [83, "tailwind-official-plugins", "Tailwind Official Plugins", "forms, typography, aspect ratio"],
    [84, "tailwind-with-react", "Tailwind with React", "class composition in components"],
    [85, "tailwind-with-nextjs", "Tailwind with Next.js", "App Router styling"],
    [86, "tailwind-class-merge", "Tailwind Class Merge", "resolving conflicting utilities"],
    [87, "tailwind-cva-patterns", "Tailwind CVA Patterns", "component variants"],
    [88, "tailwind-design-system", "Tailwind Design System", "tokens and reusable patterns"],
    [89, "tailwind-theming", "Tailwind Theming", "light, dark, and brand themes"],
    [90, "tailwind-migration", "Tailwind Migration", "upgrading and refactoring classes"],
    [91, "tailwind-debugging", "Tailwind Debugging", "finding missing or overridden classes"],
    [92, "tailwind-best-practices", "Tailwind Best Practices", "maintainable utility-first code"],
    [93, "tailwind-auth-page-project", "Tailwind Auth Page Project", "login and signup UI"],
    [94, "tailwind-blog-card-project", "Tailwind Blog Card Project", "content card composition"],
    [95, "tailwind-admin-table-project", "Tailwind Admin Table Project", "tables with filters and actions"],
    [96, "tailwind-kanban-project", "Tailwind Kanban Project", "board layout"],
    [97, "tailwind-chat-ui-project", "Tailwind Chat UI Project", "messages and composer UI"],
    [98, "tailwind-settings-page-project", "Tailwind Settings Page Project", "forms and sections"],
    [99, "tailwind-portfolio-project", "Tailwind Portfolio Project", "personal site layout"],
    [100, "tailwind-interview-topics", "Tailwind Interview Topics", "practical utility-first knowledge"],
];

const REACT_LESSONS = REACT_TOPICS.map(([order, topic, title, focus]) =>
    createStackLesson("react", order, topic, title, focus)
);

const NEXTJS_LESSONS = NEXTJS_TOPICS.map(([order, topic, title, focus]) =>
    createStackLesson("nextjs", order, topic, title, focus)
);

const TAILWIND_LESSONS = TAILWIND_TOPICS.map(([order, topic, title, focus]) =>
    createStackLesson("tailwind", order, topic, title, focus)
);

const SEED_DATA = [
    // ==================== HTML COMPLETE A-Z ====================
    // SECTION 1: HTML BASICS
    {
        category: "html",
        topic: "what-is-html",
        title: "What is HTML?",
        order: 1,
        content: {
            english: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using tags and attributes. HTML elements tell the browser how to display content. Key points: HTML is NOT a programming language, it uses markup tags, browsers read HTML and render web pages, and HTML works with CSS and JavaScript.",
            hinglish: "HTML (HyperText Markup Language) web pages banane ki standard markup language hai. Yeh tags aur attributes ka use karke web page ka structure describe karta hai. Important points: HTML programming language NAHI hai, HTML markup tags use karta hai, browsers HTML padhkar web pages render karte hain, aur HTML CSS aur JavaScript ke saath kaam karta hai."
        },
        codeSample: {
            language: "html",
            filename: "index.html",
            code: "<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Web Page</title>\n</head>\n<body>\n    <h1>Welcome to HTML</h1>\n    <p>This is my first web page!</p>\n</body>\n</html>"
        }
    },
    {
        category: "html",
        topic: "html-editors",
        title: "HTML Editors",
        order: 2,
        content: {
            english: "To write HTML code, you need a text editor. Popular options include: VS Code (most popular, free, extensions), Sublime Text (fast, lightweight), Notepad++ (Windows, simple). Online editors: CodePen.io, JSFiddle.net, Replit.com. Recommended: Install VS Code with extensions like Live Server, Prettier, and Auto Close Tag for the best experience.",
            hinglish: "HTML code likhne ke liye text editor chahiye. Popular options: VS Code (sabse popular, free, extensions available), Sublime Text (fast, lightweight), Notepad++ (Windows, simple). Online editors: CodePen.io, JSFiddle.net, Replit.com. Recommended: VS Code install karein with Live Server, Prettier, aur Auto Close Tag extensions."
        },
        codeSample: {
            language: "html",
            filename: "editor-setup.html",
            code: "<!-- VS Code mein HTML file banayein -->\n<!-- File > New File > Save as 'index.html' -->\n\n<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Hello from VS Code!</h1>\n</body>\n</html>"
        }
    },
    {
        category: "html",
        topic: "html-basic-structure",
        title: "HTML Basic Structure",
        order: 3,
        content: {
            english: "Every HTML page follows a basic structure: <!DOCTYPE html> declares HTML5 document. <html> is the root element with lang attribute. <head> contains metadata (title, meta tags, CSS links). <body> contains all visible content. Best practices: always use proper indentation, include lang attribute, set charset to UTF-8, and add viewport meta for mobile responsiveness.",
            hinglish: "Har HTML page ek basic structure follow karta hai: <!DOCTYPE html> HTML5 document declare karta hai. <html> root element hai with lang attribute. <head> mein metadata hota hai (title, meta tags, CSS links). <body> mein saara visible content hota hai. Best practices: proper indentation use karein, lang attribute include karein, charset UTF-8 set karein, aur mobile ke liye viewport meta add karein."
        },
        codeSample: {
            language: "html",
            filename: "basic-structure.html",
            code: "<!DOCTYPE html>\n<html lang='en'>\n<head>\n    <meta charset='UTF-8'>\n    <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n    <title>My Web Page</title>\n</head>\n<body>\n    <h1>Welcome!</h1>\n    <p>This is a basic HTML structure.</p>\n</body>\n</html>"
        }
    },
    {
        category: "html",
        topic: "html-elements",
        title: "HTML Elements",
        order: 4,
        content: {
            english: "HTML Elements are building blocks with opening tag, content, and closing tag. Example: <p>Text</p>. Container elements have both tags (div, p, h1). Empty elements are self-closing (br, hr, img, input). Elements can be nested inside each other. Tag vs Element: Tag is <p>, Element is complete <p>Text</p>."
        ,
            hinglish: "HTML Elements building blocks hote hain with opening tag, content, aur closing tag. Example: <p>Text</p>. Container elements mein dono tags hote hain (div, p, h1). Empty elements self-closing hote hain (br, hr, img, input). Elements ek dusre ke andar nested ho sakte hain. Tag vs Element: Tag hai <p>, Element hai complete <p>Text</p>."
        },
        codeSample: {
            language: "html",
            filename: "elements.html",
            code: "<!-- Container Element -->\n<p>This is a paragraph</p>\n\n<!-- Nested Elements -->\n<div>\n    <h2>Heading</h2>\n    <p>Paragraph inside div</p>\n</div>\n\n<!-- Empty Elements -->\n<br>\n<hr>\n<img src='photo.jpg' alt='Photo'>"
        }
    },
    {
        category: "html",
        topic: "html-attributes",
        title: "HTML Attributes",
        order: 5,
        content: {
            english: "Attributes provide additional information about elements. Syntax: attribute='value' in opening tag. Common attributes: id (unique identifier), class (group styling), style (inline CSS), title (tooltip). Global attributes work on all elements: id, class, style, title, hidden, tabindex, data-*. Values usually in quotes, some are boolean (disabled, required).",
            hinglish: "Attributes elements ke baare mein additional information dete hain. Syntax: attribute='value' opening tag mein. Common attributes: id (unique identifier), class (group styling), style (inline CSS), title (tooltip). Global attributes sab elements par kaam karte hain: id, class, style, title, hidden, tabindex, data-*. Values usually quotes mein, kuch boolean hote hain (disabled, required)."
        },
        codeSample: {
            language: "html",
            filename: "attributes.html",
            code: "<!-- ID Attribute -->\n<h1 id='main-title'>Welcome</h1>\n\n<!-- Class Attribute -->\n<p class='highlight important'>Text</p>\n\n<!-- Style Attribute -->\n<div style='background: blue; color: white'>\n\n<!-- Title Attribute -->\n<p title='This is helpful info'>Hover me</p>\n\n<!-- Multiple Attributes -->\n<a href='https://example.com' target='_blank' class='link'>Click</a>"
        }
    },
    {
        category: "html",
        topic: "html-headings",
        title: "HTML Headings (h1-h6)",
        order: 6,
        content: {
            english: "HTML provides six heading levels: h1 (most important) to h6 (least important). Best practices: use only ONE h1 per page, don't skip levels (h1→h2→h3), headings help with SEO, screen readers use headings for navigation. Default sizes vary by browser: h1=32px, h2=24px, h3=18.72px, h4=16px, h5=13.28px, h6=10.72px. Don't use headings just to make text big.",
            hinglish: "HTML mein six heading levels hote hain: h1 (sabse important) se h6 (least important). Best practices: ek page mein sirf EK h1 use karein, levels skip na karein (h1→h2→h3), headings SEO mein help karti hain, screen readers navigation ke liye headings use karte hain. Sirf text bada karne ke liye headings use na karein."
        },
        codeSample: {
            language: "html",
            filename: "headings.html",
            code: "<h1>Main Heading - Most Important</h1>\n<h2>Subheading</h2>\n<h3>Sub-subheading</h3>\n<h4>Fourth Level</h4>\n<h5>Fifth Level</h5>\n<h6>Sixth Level - Least Important</h6>\n\n<!-- Wrong: Skipped h2 -->\n<h1>Main</h1>\n<h3>Wrong!</h3>\n\n<!-- Right: Sequential -->\n<h1>Main</h1>\n<h2>Section</h2>\n<h3>Subsection</h3>"
        }
    },
    {
        category: "html",
        topic: "html-paragraphs",
        title: "HTML Paragraphs",
        order: 7,
        content: {
            english: "The <p> tag defines paragraphs. Browser automatically adds spacing, it's a block-level element taking full width. Important: browsers ignore extra spaces and blank lines, use CSS for custom spacing. Don't use multiple <br> tags or empty <p> for spacing. Paragraphs can contain inline elements (a, strong, em, span) but not block elements (div, h1).",
            hinglish: "<p> tag paragraphs define karta hai. Browser automatically spacing add karta hai, yeh block-level element hai. Important: browsers extra spaces aur blank lines ignore karte hain, custom spacing ke liye CSS use karein. Spacing ke liye multiple <br> ya empty <p> use na karein. Paragraphs mein inline elements (a, strong, em, span) ho sakte hain par block elements (div, h1) nahi."
        },
        codeSample: {
            language: "html",
            filename: "paragraphs.html",
            code: "<!-- Basic Paragraph -->\n<p>This is a paragraph.</p>\n<p>Another paragraph.</p>\n\n<!-- With inline elements -->\n<p>This is <strong>bold</strong> and <em>italic</em>.</p>\n<p>Visit <a href='#'>website</a> for info.</p>\n\n<!-- Browser ignores extra spaces -->\n<p>This     has     extra     spaces</p>\n<!-- Displays as: This has extra spaces -->"
        }
    },
    {
        category: "html",
        topic: "html-text-formatting",
        title: "HTML Text Formatting",
        order: 8,
        content: {
            english: "Semantic formatting (meaning + styling): strong (important/bold), em (emphasized/italic), mark (highlighted), del (deleted/strikethrough), ins (inserted/underline), sub (subscript H₂O), sup (superscript x²). Non-semantic (styling only): b (bold), i (italic), u (underline), small (smaller). Other: abbr (abbreviation), blockquote (quotation), code (code snippet), pre (preformatted), kbd (keyboard input).",
            hinglish: "Semantic formatting (meaning + styling): strong (important/bold), em (emphasized/italic), mark (highlighted), del (deleted/strikethrough), ins (inserted/underline), sub (subscript H₂O), sup (superscript x²). Non-semantic (sirf styling): b (bold), i (italic), u (underline), small (smaller). Other: abbr (abbreviation), blockquote (quotation), code (code snippet), pre (preformatted), kbd (keyboard input)."
        },
        codeSample: {
            language: "html",
            filename: "text-formatting.html",
            code: "<!-- Semantic -->\n<p><strong>Important!</strong></p>\n<p>This is <em>emphasized</em></p>\n<p><mark>Highlight</mark> this</p>\n<p>Price: <del>$100</del> <ins>$50</ins></p>\n<p>Water: H<sub>2</sub>O</p>\n<p>Area: x<sup>2</sup></p>\n\n<!-- Code -->\n<code>console.log('Hi')</code>\n<pre>\n  Multiple\n  Lines\n</pre>\n<kbd>Ctrl</kbd> + <kbd>C</kbd>"
        }
    },
    {
        category: "html",
        topic: "html-comments",
        title: "HTML Comments",
        order: 9,
        content: {
            english: "Comments explain code and are not displayed: <!-- Comment -->. Uses: explain complex code, temporarily disable code, add notes, document sections, TODO reminders. Rules: cannot be nested, visible in View Source but not on rendered page, can span multiple lines. Best practices: explain WHY not WHAT, keep updated, don't over-comment obvious code.",
            hinglish: "Comments code ko explain karte hain aur display nahi hote: <!-- Comment -->. Uses: complex code explain karna, code temporarily disable karna, notes add karna, sections document karna, TODO reminders. Rules: nested nahi ho sakte, View Source mein dikhte hain par rendered page par nahi, multiple lines tak ho sakte hain. Best practices: WHAT nahi WHY explain karein."
        },
        codeSample: {
            language: "html",
            filename: "comments.html",
            code: "<!-- Single line comment -->\n<p>This is visible</p>\n\n<!-- \n  Multi-line comment\n  Hidden from browser\n-->\n<p>Also visible</p>\n\n<!-- TODO: Add more content -->\n<!-- FIXME: Check responsive -->\n\n<!-- Comment out code -->\n<!-- <div class='old'>\n  <p>Deprecated</p>\n</div> -->"
        }
    },
    // ==================== HTML LINKS & MEDIA ====================
    {
        category: "html",
        topic: "html-links",
        title: "HTML Links",
        order: 10,
        content: {
            english: "The <a> tag creates hyperlinks. Required attribute: href (URL destination). Target values: _self (same tab), _blank (new tab). Types: absolute URL (https://example.com), relative URL (/about.html), same page (#section), email (mailto:), phone (tel:), download. Best practices: use descriptive text, open external links in new tab with rel='noopener', add title for accessibility.",
            hinglish: "<a> tag hyperlinks banata hai. Required attribute: href (URL). Target values: _self (same tab), _blank (new tab). Types: absolute URL (https://example.com), relative URL (/about.html), same page (#section), email (mailto:), phone (tel:), download. Best practices: descriptive text use karein, external links ko new tab mein open karein with rel='noopener', accessibility ke liye title add karein."
        },
        codeSample: {
            language: "html",
            filename: "links.html",
            code: "<!-- Basic Link -->\n<a href='https://google.com'>Visit Google</a>\n\n<!-- New Tab -->\n<a href='https://google.com' target='_blank' rel='noopener'>\n  Open in New Tab\n</a>\n\n<!-- Email & Phone -->\n<a href='mailto:test@email.com'>Email</a>\n<a href='tel:+911234567890'>Call</a>\n\n<!-- Download -->\n<a href='file.pdf' download>Download PDF</a>\n\n<!-- Same Page -->\n<a href='#section2'>Go to Section 2</a>"
        }
    },
    {
        category: "html",
        topic: "html-images",
        title: "HTML Images",
        order: 11,
        content: {
            english: "The <img> tag embeds images. Required: src (source), alt (description for accessibility). Optional: width, height, loading='lazy'. Formats: JPG (photos), PNG (logos/transparent), GIF (animations), SVG (vectors), WebP (modern/smaller). Best practices: always include alt text, optimize size, use correct format, lazy load below-fold images, specify dimensions.",
            hinglish: "<img> tag images embed karta hai. Required: src (source), alt (accessibility ke liye description). Optional: width, height, loading='lazy'. Formats: JPG (photos), PNG (logos/transparent), GIF (animations), SVG (vectors), WebP (modern/smaller). Best practices: hamesha alt text include karein, size optimize karein, correct format use karein, below-fold images ko lazy load karein."
        },
        codeSample: {
            language: "html",
            filename: "images.html",
            code: "<!-- Basic Image -->\n<img src='photo.jpg' alt='Beautiful landscape'>\n\n<!-- With Dimensions -->\n<img src='logo.png' alt='Logo' width='200' height='100'>\n\n<!-- Lazy Loading -->\n<img src='large.jpg' alt='Large' loading='lazy'>\n\n<!-- From URL -->\n<img src='https://example.com/img.jpg' alt='Online'>\n\n<!-- Image as Link -->\n<a href='page.html'>\n  <img src='button.jpg' alt='Click'>\n</a>"
        }
    },
    {
        category: "html",
        topic: "html-tables",
        title: "HTML Tables",
        order: 12,
        content: {
            english: "Tables display data in rows/columns. Elements: table (container), tr (table row), th (header cell, bold/centered), td (data cell), thead (header group), tbody (body), tfoot (footer), caption (title). Attributes: colspan (merge columns), rowspan (merge rows), border. Best practices: use for tabular data only, include thead/tbody, add captions for accessibility.",
            hinglish: "Tables data ko rows/columns mein display karte hain. Elements: table (container), tr (row), th (header cell, bold/centered), td (data cell), thead (header), tbody (body), tfoot (footer), caption (title). Attributes: colspan (columns merge), rowspan (rows merge), border. Best practices: sirf tabular data ke liye use karein, thead/tbody include karein, accessibility ke liye captions add karein."
        },
        codeSample: {
            language: "html",
            filename: "tables.html",
            code: "<table>\n  <caption>Student Records</caption>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Age</th>\n      <th>Grade</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>John</td>\n      <td>20</td>\n      <td>A</td>\n    </tr>\n    <tr>\n      <td>Jane</td>\n      <td>22</td>\n      <td>A+</td>\n    </tr>\n  </tbody>\n</table>\n\n<!-- Merged Cells -->\n<td colspan='2'>Spans 2 columns</td>\n<td rowspan='2'>Spans 2 rows</td>"
        }
    },
    {
        category: "html",
        topic: "html-lists",
        title: "HTML Lists",
        order: 13,
        content: {
            english: "Three types of lists: Unordered (ul) - bullet points, use list-style-type (disc, circle, square, none). Ordered (ol) - numbered, use type (1, A, a, I, i) and start attributes. Description (dl) - terms with definitions using dt (term) and dd (description). Lists can be nested. Use CSS for custom styling.",
            hinglish: "Teen types ke lists hote hain: Unordered (ul) - bullet points, list-style-type use karein (disc, circle, square, none). Ordered (ol) - numbered, type (1, A, a, I, i) aur start attributes use karein. Description (dl) - terms with definitions using dt (term) aur dd (description). Lists nested ho sakte hain. Custom styling ke liye CSS use karein."
        },
        codeSample: {
            language: "html",
            filename: "lists.html",
            code: "<!-- Unordered List -->\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>\n\n<!-- Ordered List -->\n<ol type='A' start='1'>\n  <li>First</li>\n  <li>Second</li>\n</ol>\n\n<!-- Description List -->\n<dl>\n  <dt>HTML</dt>\n  <dd>Markup language</dd>\n  <dt>CSS</dt>\n  <dd>Style language</dd>\n</dl>\n\n<!-- Nested List -->\n<ul>\n  <li>Fruits\n    <ul>\n      <li>Apple</li>\n      <li>Banana</li>\n    </ul>\n  </li>\n</ul>"
        }
    },
    // ==================== HTML FORMS ====================
    {
        category: "html",
        topic: "html-forms-basics",
        title: "HTML Forms Basics",
        order: 14,
        content: {
            english: "Forms collect user input. Form element attributes: action (URL to send data), method (GET or POST), enctype (encoding type). Input elements: text, password, email, number, submit, reset. Label element connects to input via for/id. Fieldset groups related inputs with legend title. Best practices: always use labels, add placeholders, validate input, use semantic types.",
            hinglish: "Forms user input collect karte hain. Form attributes: action (URL jahan data jayega), method (GET ya POST), enctype (encoding). Input elements: text, password, email, number, submit, reset. Label element for/id se input se connect hota hai. Fieldset related inputs ko group karta hai with legend. Best practices: hamesha labels use karein, placeholders add karein, input validate karein, semantic types use karein."
        },
        codeSample: {
            language: "html",
            filename: "forms-basics.html",
            code: "<form action='/submit' method='POST'>\n  <fieldset>\n    <legend>Personal Info</legend>\n    \n    <label for='name'>Name:</label>\n    <input type='text' id='name' name='name' required>\n    \n    <label for='email'>Email:</label>\n    <input type='email' id='email' name='email' placeholder='user@email.com'>\n    \n    <label for='pass'>Password:</label>\n    <input type='password' id='pass' name='password'>\n    \n    <button type='submit'>Submit</button>\n    <button type='reset'>Reset</button>\n  </fieldset>\n</form>"
        }
    },
    {
        category: "html",
        topic: "html-input-types",
        title: "HTML Input Types",
        order: 15,
        content: {
            english: "Modern input types: text, password, email (validates @), number (min/max/step), tel (phone), url (website), search, date (date picker), time, datetime-local, month, week, color (color picker), range (slider), file (upload), checkbox, radio, submit, reset, button. Attributes: placeholder, required, disabled, readonly, minlength, maxlength, pattern (regex), autocomplete.",
            hinglish: "Modern input types: text, password, email (@ validate karta hai), number (min/max/step), tel (phone), url (website), search, date (date picker), time, datetime-local, month, week, color (color picker), range (slider), file (upload), checkbox, radio, submit, reset, button. Attributes: placeholder, required, disabled, readonly, minlength, maxlength, pattern (regex), autocomplete."
        },
        codeSample: {
            language: "html",
            filename: "input-types.html",
            code: "<!-- Text Inputs -->\n<input type='text' placeholder='Name' required>\n<input type='email' placeholder='Email'>\n<input type='password' minlength='8'>\n\n<!-- Number -->\n<input type='number' min='0' max='100' step='5'>\n\n<!-- Date & Time -->\n<input type='date'>\n<input type='time'>\n<input type='datetime-local'>\n\n<!-- Special -->\n<input type='color'>\n<input type='range' min='0' max='100'>\n<input type='file' accept='image/*'>\n<input type='url' placeholder='https://'>\n<input type='search' placeholder='Search...'>\n\n<!-- Pattern Validation -->\n<input type='text' pattern='[A-Z]{3}-[0-9]{3}' placeholder='ABC-123'>"
        }
    },
    {
        category: "html",
        topic: "html-form-elements",
        title: "HTML Form Elements",
        order: 16,
        content: {
            english: "Additional form elements: textarea (multi-line text, rows/cols), select/option (dropdown), optgroup (group options), datalist (autocomplete suggestions), output (calculation result), progress (progress bar), meter (gauge). Select attributes: multiple, size. Option attributes: value, selected, disabled. Textarea: wrap, readonly.",
            hinglish: "Additional form elements: textarea (multi-line text, rows/cols), select/option (dropdown), optgroup (group options), datalist (autocomplete suggestions), output (calculation result), progress (progress bar), meter (gauge). Select attributes: multiple, size. Option attributes: value, selected, disabled."
        },
        codeSample: {
            language: "html",
            filename: "form-elements.html",
            code: "<!-- Textarea -->\n<textarea rows='4' cols='50' placeholder='Message...'></textarea>\n\n<!-- Select Dropdown -->\n<select name='country'>\n  <option value=''>Select</option>\n  <option value='in' selected>India</option>\n  <option value='us'>USA</option>\n</select>\n\n<!-- With Groups -->\n<select>\n  <optgroup label='Frontend'>\n    <option>HTML</option>\n    <option>CSS</option>\n  </optgroup>\n  <optgroup label='Backend'>\n    <option>Node.js</option>\n    <option>Python</option>\n  </optgroup>\n</select>\n\n<!-- Datalist -->\n<input list='browsers'>\n<datalist id='browsers'>\n  <option value='Chrome'>\n  <option value='Firefox'>\n</datalist>"
        }
    },
    // ==================== HTML SEMANTIC ====================
    {
        category: "html",
        topic: "html-semantic-elements",
        title: "HTML Semantic Elements",
        order: 17,
        content: {
            english: "Semantic elements clearly describe their meaning: header (intro content), nav (navigation links), main (main content, only one), article (self-contained content), section (thematic grouping), aside (sidebar/tangential), footer (footer content). Benefits: better SEO, accessibility, code readability. Non-semantic: div, span (no meaning). Always prefer semantic over div.",
            hinglish: "Semantic elements unka meaning clearly describe karte hain: header (intro), nav (navigation), main (main content, sirf ek), article (self-contained), section (thematic grouping), aside (sidebar), footer (footer). Benefits: better SEO, accessibility, code readability. Non-semantic: div, span (koi meaning nahi). Hamesha semantic prefer karein div se."
        },
        codeSample: {
            language: "html",
            filename: "semantic.html",
            code: "<header>\n  <h1>Website</h1>\n  <nav>\n    <a href='/'>Home</a>\n    <a href='/about'>About</a>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h2>Blog Post</h2>\n    <p>Content here...</p>\n  </article>\n  \n  <aside>\n    <h3>Related</h3>\n    <p>Sidebar content</p>\n  </aside>\n</main>\n\n<footer>\n  <p>&copy; 2024</p>\n</footer>"
        }
    },
    {
        category: "html",
        topic: "html-div-span",
        title: "HTML Div & Span",
        order: 18,
        content: {
            english: "Div is a block-level container (takes full width, starts new line). Span is inline container (only takes needed width, stays in line). Both have no semantic meaning, used for styling with CSS. Div groups block elements, span wraps inline text. Modern HTML prefers semantic elements (header, section, article) over div when possible.",
            hinglish: "Div block-level container hai (full width leta hai, new line par start). Span inline container hai (sirf needed width leta hai, line mein rehta). Dono ka koi semantic meaning nahi, CSS styling ke liye use hote hain. Div block elements ko group karta hai, span inline text ko wrap karta hai. Modern HTML semantic elements (header, section, article) prefer karta hai div se."
        },
        codeSample: {
            language: "html",
            filename: "div-span.html",
            code: "<!-- Div (Block-level) -->\n<div class='container'>\n  <h2>Section</h2>\n  <p>Content here</p>\n</div>\n\n<!-- Span (Inline) -->\n<p>This is <span class='highlight'>highlighted</span> text</p>\n\n<!-- Layout Example -->\n<div class='header'>Header</div>\n<div class='content'>\n  <p>Text with <span style='color:red'>red</span> word</p>\n</div>\n<div class='footer'>Footer</div>"
        }
    },
    // ==================== HTML MEDIA ====================
    {
        category: "html",
        topic: "html-video-audio",
        title: "HTML Video & Audio",
        order: 19,
        content: {
            english: "Video tag: src, controls, width, height, autoplay, muted, loop, poster (thumbnail). Source tag for multiple formats. Audio tag: same attributes except width/height/poster. Formats: Video (MP4, WebM, OGG), Audio (MP3, WAV, OGG). Best practices: always include controls, provide multiple sources, add fallback text, use poster for video.",
            hinglish: "Video tag: src, controls, width, height, autoplay, muted, loop, poster (thumbnail). Source tag multiple formats ke liye. Audio tag: same attributes except width/height/poster. Formats: Video (MP4, WebM, OGG), Audio (MP3, WAV, OGG). Best practices: hamesha controls include karein, multiple sources provide karein, fallback text add karein, video ke liye poster use karein."
        },
        codeSample: {
            language: "html",
            filename: "video-audio.html",
            code: "<!-- Video -->\n<video width='640' height='360' controls muted poster='thumb.jpg'>\n  <source src='video.mp4' type='video/mp4'>\n  <source src='video.webm' type='video/webm'>\n  Your browser doesn't support video.\n</video>\n\n<!-- Autoplay & Loop -->\n<video autoplay muted loop>\n  <source src='bg.mp4' type='video/mp4'>\n</video>\n\n<!-- Audio -->\n<audio controls>\n  <source src='song.mp3' type='audio/mpeg'>\n  <source src='song.ogg' type='audio/ogg'>\n  Browser doesn't support audio.\n</audio>"
        }
    },
    {
        category: "html",
        topic: "html-iframe",
        title: "HTML Iframe",
        order: 20,
        content: {
            english: "Iframe embeds another webpage. Attributes: src (URL), width, height, name (for target), allow (permissions), sandbox (security), loading='lazy'. Common uses: embed YouTube videos, Google Maps, external content. Security: sandbox restricts features, allow specifies permissions (autoplay, fullscreen). Best practices: set dimensions, use lazy loading, specify allow permissions.",
            hinglish: "Iframe dusra webpage embed karta hai. Attributes: src (URL), width, height, name (target ke liye), allow (permissions), sandbox (security), loading='lazy'. Common uses: YouTube videos embed, Google Maps, external content. Security: sandbox features restrict karta hai, allow permissions specify karta hai. Best practices: dimensions set karein, lazy loading use karein, allow permissions specify karein."
        },
        codeSample: {
            language: "html",
            filename: "iframe.html",
            code: "<!-- YouTube Embed -->\n<iframe \n  width='560' \n  height='315' \n  src='https://www.youtube.com/embed/VIDEO_ID' \n  allow='accelerometer; autoplay; clipboard-write' \n  allowfullscreen\n></iframe>\n\n<!-- Google Maps -->\n<iframe \n  src='https://maps.google.com/...' \n  width='600' \n  height='450'\n  loading='lazy'\n></iframe>\n\n<!-- With Sandbox -->\n<iframe src='page.html' sandbox='allow-scripts'></iframe>"
        }
    },
    // ==================== HTML METADATA ====================
    {
        category: "html",
        topic: "html-head-meta",
        title: "HTML Head & Meta Tags",
        order: 21,
        content: {
            english: "Head section contains metadata: title (browser tab), meta charset='UTF-8' (character encoding), meta viewport (mobile responsive), meta description (SEO), meta keywords, link rel='stylesheet' (CSS), link rel='icon' (favicon), script (JavaScript), style (CSS), base (base URL), noscript (no JS fallback). Important for SEO and social sharing with Open Graph tags.",
            hinglish: "Head section mein metadata hota hai: title (browser tab), meta charset='UTF-8' (encoding), meta viewport (mobile responsive), meta description (SEO), meta keywords, link rel='stylesheet' (CSS), link rel='icon' (favicon), script (JavaScript), style (CSS), base (base URL), noscript (no JS fallback). SEO aur social sharing ke liye important Open Graph tags ke saath."
        },
        codeSample: {
            language: "html",
            filename: "head-meta.html",
            code: "<head>\n  <meta charset='UTF-8'>\n  <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n  <meta name='description' content='Page description'>\n  <meta name='keywords' content='HTML, CSS, JS'>\n  \n  <title>Page Title</title>\n  \n  <link rel='stylesheet' href='style.css'>\n  <link rel='icon' href='favicon.ico'>\n  \n  <!-- Open Graph (Social) -->\n  <meta property='og:title' content='Title'>\n  <meta property='og:image' content='image.jpg'>\n  \n  <script src='app.js'></script>\n  <style>body { margin: 0; }</style>\n</head>"
        }
    },
    // ==================== HTML5 FEATURES ====================
    {
        category: "html",
        topic: "html5-new-features",
        title: "HTML5 New Features",
        order: 22,
        content: {
            english: "HTML5 features: semantic elements (header, nav, section, article, aside, footer), new form types (email, date, range, color), audio/video support, canvas (graphics), SVG, local storage, session storage, geolocation, drag & drop, web workers, server-sent events, application cache (deprecated), responsive images (srcset, sizes), details/summary, dialog, progress, meter elements.",
            hinglish: "HTML5 features: semantic elements (header, nav, section, article, aside, footer), new form types (email, date, range, color), audio/video support, canvas (graphics), SVG, local storage, session storage, geolocation, drag & drop, web workers, server-sent events, responsive images (srcset, sizes), details/summary, dialog, progress, meter elements."
        },
        codeSample: {
            language: "html",
            filename: "html5-features.html",
            code: "<!-- Semantic Elements -->\n<header><nav>...</nav></header>\n<main><article><section>...</section></article></main>\n\n<!-- New Inputs -->\n<input type='email' required>\n<input type='date'>\n<input type='color'>\n<input type='range'>\n\n<!-- Details/Summary -->\n<details>\n  <summary>Click to expand</summary>\n  <p>Hidden content here</p>\n</details>\n\n<!-- Progress & Meter -->\n<progress value='70' max='100'></progress>\n<meter value='0.6'></meter>"
        }
    },
    // ==================== HTML ATTRIBUTES REFERENCE ====================
    {
        category: "html",
        topic: "html-global-attributes",
        title: "HTML Global Attributes",
        order: 23,
        content: {
            english: "Global attributes work on ALL elements: id (unique identifier), class (CSS styling), style (inline CSS), title (tooltip), hidden (hide element), tabindex (tab order), accesskey (keyboard shortcut), contenteditable (make editable), draggable (drag & drop), spellcheck, translate, data-* (custom data attributes), lang, dir (text direction). Use data-* for storing custom data.",
            hinglish: "Global attributes SAB elements par kaam karte hain: id (unique identifier), class (CSS styling), style (inline CSS), title (tooltip), hidden (element chhupaye), tabindex (tab order), accesskey (keyboard shortcut), contenteditable (editable banaye), draggable (drag & drop), spellcheck, translate, data-* (custom data), lang, dir (text direction). Custom data store karne ke liye data-* use karein."
        },
        codeSample: {
            language: "html",
            filename: "global-attributes.html",
            code: "<!-- Common Global Attributes -->\n<div id='main' class='container' title='Tooltip'>\n  Content\n</div>\n\n<!-- Hidden -->\n<p hidden>This is invisible</p>\n\n<!-- Content Editable -->\n<div contenteditable='true'>\n  Edit this text!\n</div>\n\n<!-- Custom Data -->\n<div data-user-id='123' data-role='admin'>\n  User Info\n</div>\n\n<!-- Tab Index -->\n<input tabindex='1'>\n<button tabindex='2'>Click</button>\n\n<!-- Draggable -->\n<img draggable='true' src='photo.jpg'>"
        }
    },
    // ==================== HTML BEST PRACTICES ====================
    {
        category: "html",
        topic: "html-best-practices",
        title: "HTML Best Practices",
        order: 24,
        content: {
            english: "Best practices: use semantic elements, always include alt text, proper indentation, lowercase tags, close all elements, quote attributes, validate HTML (validator.w3.org), mobile-first with viewport meta, optimize images, use heading hierarchy (h1→h6), separate structure (HTML) from presentation (CSS), accessibility (ARIA labels, keyboard navigation), SEO meta tags, fast loading (minimize HTTP requests).",
            hinglish: "Best practices: semantic elements use karein, hamesha alt text include karein, proper indentation, lowercase tags, sab elements close karein, quote attributes, HTML validate karein, mobile-first with viewport meta, images optimize karein, heading hierarchy use karein (h1→h6), structure (HTML) aur presentation (CSS) separate rakhein, accessibility (ARIA labels), SEO meta tags, fast loading."
        },
        codeSample: {
            language: "html",
            filename: "best-practices.html",
            code: "<!-- Good Practices -->\n<!DOCTYPE html>\n<html lang='en'>\n<head>\n  <meta charset='UTF-8'>\n  <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n  <title>Good Example</title>\n</head>\n<body>\n  <header>\n    <nav>\n      <a href='/'>Home</a>\n    </nav>\n  </header>\n  \n  <main>\n    <article>\n      <h1>Main Title</h1>\n      <img src='photo.jpg' alt='Description'>\n      <p>Content here...</p>\n    </article>\n  </main>\n  \n  <footer>\n    <p>&copy; 2024</p>\n  </footer>\n</body>\n</html>"
        }
    },
    ...HTML_ADDITIONAL_LESSONS,
    // ==================== CSS COMPLETE A-Z ====================
    {
        category: "css",
        topic: "what-is-css",
        title: "What is CSS?",
        order: 1,
        content: {
            english: "CSS (Cascading Style Sheets) is used to style and layout web pages. CSS controls colors, fonts, spacing, positioning, and responsive design. Three types: Inline (style attribute), Internal (style tag), External (separate .css file). CSS works with HTML to make beautiful websites. Benefits: separates content from design, saves time, easier maintenance, better control.",
            hinglish: "CSS (Cascading Style Sheets) web pages ko style aur layout karne ke liye use hoti hai. CSS colors, fonts, spacing, positioning, aur responsive design control karti hai. Teen types: Inline (style attribute), Internal (style tag), External (separate .css file). CSS HTML ke saath milkar beautiful websites banati hai."
        },
        codeSample: {
            language: "css",
            filename: "styles.css",
            code: "/* External CSS */\nbody {\n    background-color: #f0f0f0;\n    font-family: Arial, sans-serif;\n}\n\nh1 {\n    color: navy;\n    text-align: center;\n    font-size: 32px;\n}\n\np {\n    color: #333;\n    line-height: 1.6;\n}"
        }
    },
    {
        category: "css",
        topic: "css-syntax",
        title: "CSS Syntax",
        order: 2,
        content: {
            english: "CSS Rule = Selector + Declaration Block. Selector targets HTML element. Declaration block contains property: value pairs. Example: h1 { color: blue; font-size: 24px; }. Properties: color, background, font, margin, padding, border, etc. Values depend on property. Multiple declarations separated by semicolons. Comments use /* */.",
            hinglish: "CSS Rule = Selector + Declaration Block. Selector HTML element ko target karta hai. Declaration block mein property: value pairs hote hain. Example: h1 { color: blue; font-size: 24px; }. Properties: color, background, font, margin, padding, border, etc. Multiple declarations semicolons se separate hote hain. Comments /* */ mein hote hain."
        },
        codeSample: {
            language: "css",
            filename: "syntax.css",
            code: "/* CSS Syntax Example */\nselector {\n    property: value;\n    property2: value2;\n}\n\n/* Real Example */\nh1 {\n    color: blue;\n    font-size: 32px;\n    text-align: center;\n}\n\n/* Multiple Selectors */\nh1, h2, h3 {\n    font-family: Arial;\n    color: #333;\n}\n\n/* Comment */\n/* This styles paragraphs */\np {\n    line-height: 1.6;\n}"
        }
    },
    {
        category: "css",
        topic: "css-selectors",
        title: "CSS Selectors",
        order: 3,
        content: {
            english: "Selectors target HTML elements: Element (p, h1), Class (.classname - reusable), ID (#idname - unique), Universal (*), Group (h1, p), Descendant (div p), Child (div > p), Adjacent (h1 + p), Attribute ([type='text']). Pseudo-classes (:hover, :focus, :first-child). Pseudo-elements (::before, ::after, ::first-line). Specificity: Inline > ID > Class > Element.",
            hinglish: "Selectors HTML elements ko target karte hain: Element (p, h1), Class (.classname - reusable), ID (#idname - unique), Universal (*), Group (h1, p), Descendant (div p), Child (div > p), Adjacent (h1 + p), Attribute ([type='text']). Pseudo-classes (:hover, :focus). Specificity: Inline > ID > Class > Element."
        },
        codeSample: {
            language: "css",
            filename: "selectors.css",
            code: "/* Element Selector */\np { color: blue; }\n\n/* Class Selector */\n.highlight { background: yellow; }\n\n/* ID Selector */\n#header { font-size: 24px; }\n\n/* Descendant */\ndiv p { margin: 10px; }\n\n/* Child Selector */\nul > li { list-style: none; }\n\n/* Pseudo-class */\na:hover { color: red; }\ninput:focus { border: 2px solid blue; }\n\n/* Attribute */\ninput[type='email'] { border: 1px solid gray; }\n\n/* Pseudo-element */\np::first-line { font-weight: bold; }"
        }
    },
    {
        category: "css",
        topic: "css-colors",
        title: "CSS Colors",
        order: 4,
        content: {
            english: "Color values: Named (red, blue, green), Hex (#RRGGBB or #RGB), RGB (rgb(255,0,0)), RGBA (rgba(255,0,0,0.5) with opacity), HSL (hsl(0,100%,50%)), HSLA (with opacity). Background-color sets element background. Color sets text color. Opacity (0-1) makes element transparent. Best: use RGBA/HSLA for transparency control.",
            hinglish: "Color values: Named (red, blue), Hex (#RRGGBB ya #RGB), RGB (rgb(255,0,0)), RGBA (rgba(255,0,0,0.5) with opacity), HSL (hsl(0,100%,50%)), HSLA (with opacity). Background-color element ka background set karta hai. Color text color set karta hai. Opacity (0-1) element ko transparent banati hai."
        },
        codeSample: {
            language: "css",
            filename: "colors.css",
            code: "/* Named Colors */\nh1 { color: navy; }\n\n/* Hex Colors */\np { color: #ff5733; }\n\n/* RGB */\ndiv { background-color: rgb(255, 0, 0); }\n\n/* RGBA (with transparency) */\n.overlay {\n    background: rgba(0, 0, 0, 0.5);\n}\n\n/* HSL */\nbutton {\n    background: hsl(120, 100%, 50%);\n}\n\n/* HSLA */\ncard {\n    border: 2px solid hsla(240, 100%, 50%, 0.3);\n}\n\n/* Opacity */\nimg { opacity: 0.7; }"
        }
    },
    {
        category: "css",
        topic: "css-backgrounds",
        title: "CSS Backgrounds",
        order: 5,
        content: {
            english: "Background properties: background-color (solid color), background-image (url), background-repeat (repeat, no-repeat, repeat-x, repeat-y), background-position (center, top, left, percentages), background-size (cover, contain, auto, pixels), background-attachment (scroll, fixed). Shorthand: background: color image repeat position/size. Multiple backgrounds supported.",
            hinglish: "Background properties: background-color (solid color), background-image (url), background-repeat (repeat, no-repeat), background-position (center, top, left), background-size (cover, contain, auto), background-attachment (scroll, fixed). Shorthand: background: color image repeat position/size. Multiple backgrounds supported hote hain."
        },
        codeSample: {
            language: "css",
            filename: "backgrounds.css",
            code: "/* Background Color */\ndiv { background-color: #f0f0f0; }\n\n/* Background Image */\n.hero {\n    background-image: url('bg.jpg');\n    background-repeat: no-repeat;\n    background-size: cover;\n    background-position: center;\n}\n\n/* Shorthand */\n.banner {\n    background: #333 url('pattern.png') repeat fixed center/cover;\n}\n\n/* Gradient Background */\n.gradient {\n    background: linear-gradient(135deg, #667eea, #764ba2);\n}\n\n/* Multiple Backgrounds */\n.multi {\n    background: url('overlay.png'), url('bg.jpg');\n}"
        }
    },
    {
        category: "css",
        topic: "css-borders",
        title: "CSS Borders",
        order: 6,
        content: {
            english: "Border properties: border-width (thin, medium, thick, px), border-style (solid, dashed, dotted, double, groove, ridge, none), border-color (any color value). Shorthand: border: width style color. Individual sides: border-top, border-right, border-bottom, border-left. Border-radius creates rounded corners (px or %). Box-shadow adds shadows.",
            hinglish: "Border properties: border-width (thin, medium, px), border-style (solid, dashed, dotted, double, none), border-color (any color). Shorthand: border: width style color. Individual sides: border-top, border-right, etc. Border-radius rounded corners banata hai. Box-shadow shadows add karta hai."
        },
        codeSample: {
            language: "css",
            filename: "borders.css",
            code: "/* Border Shorthand */\ndiv { border: 2px solid black; }\n\n/* Individual Properties */\n.box {\n    border-width: 3px;\n    border-style: dashed;\n    border-color: blue;\n}\n\n/* Rounded Corners */\n.circle {\n    border-radius: 50%;\n    border: 2px solid #333;\n}\n\n/* Different Sides */\n.card {\n    border-top: 3px solid red;\n    border-bottom: 1px solid gray;\n}\n\n/* Box Shadow */\n.shadow {\n    border: none;\n    box-shadow: 0 4px 8px rgba(0,0,0,0.2);\n}"
        }
    },
    {
        category: "css",
        topic: "css-margins-padding",
        title: "CSS Margins & Padding",
        order: 7,
        content: {
            english: "Margin: space OUTSIDE element (pushes other elements away). Padding: space INSIDE element (between content and border). Values: margin/padding: top right bottom left (clockwise). Shorthand: 1 value (all sides), 2 values (top-bottom, left-right), 3 values (top, left-right, bottom), 4 values (top, right, bottom, left). Auto centers horizontally.",
            hinglish: "Margin: element ke BAHAR space (dusre elements ko door push karta hai). Padding: element ke ANDAR space (content aur border ke beech). Values: margin/padding: top right bottom left (clockwise). Shorthand: 1 value (sab sides), 2 values (top-bottom, left-right), 4 values (top, right, bottom, left). Auto se horizontally center hota hai."
        },
        codeSample: {
            language: "css",
            filename: "spacing.css",
            code: "/* Margin - Outside Space */\ndiv {\n    margin: 20px; /* All sides */\n    margin: 10px 20px; /* top-bottom, left-right */\n    margin: 10px 20px 30px 40px; /* T R B L */\n    margin: 0 auto; /* Center horizontally */\n}\n\n/* Padding - Inside Space */\n.box {\n    padding: 20px;\n    padding: 10px 30px;\n    padding: 10px 20px 30px 40px;\n}\n\n/* Combined Example */\n.card {\n    margin: 20px auto;\n    padding: 30px;\n    max-width: 600px;\n}\n\n/* Individual Sides */\np {\n    margin-top: 10px;\n    padding-left: 20px;\n}"
        }
    },
    {
        category: "css",
        topic: "css-box-model",
        title: "CSS Box Model",
        order: 8,
        content: {
            english: "Every HTML element is a box: Content (text/images) → Padding (space inside) → Border → Margin (space outside). Width/Height only applies to content by default. box-sizing: content-box (default, width = content only), box-sizing: border-box (width = content + padding + border). ALWAYS use border-box for easier layout calculations.",
            hinglish: "Har HTML element ek box hai: Content (text/images) → Padding (andar ki space) → Border → Margin (bahar ki space). Width/Height sirf content par apply hota hai by default. box-sizing: content-box (default), box-sizing: border-box (width = content + padding + border). HAMESHA border-box use karein easier calculations ke liye."
        },
        codeSample: {
            language: "css",
            filename: "box-model.css",
            code: "/* Default Box Model */\n.default {\n    width: 300px;\n    padding: 20px;\n    border: 5px solid black;\n    /* Total width = 300 + 40 + 10 = 350px */\n}\n\n/* Better Box Model */\n* {\n    box-sizing: border-box;\n}\n\n.better {\n    width: 300px;\n    padding: 20px;\n    border: 5px solid black;\n    /* Total width = 300px (includes padding & border) */\n}\n\n/* Reset */\n* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}"
        }
    },
    {
        category: "css",
        topic: "css-display",
        title: "CSS Display Property",
        order: 9,
        content: {
            english: "Display controls layout behavior: block (full width, new line - div, p, h1), inline (only content width, no new line - span, a, strong), inline-block (inline + width/height), none (hides element), flex (flexbox layout), grid (grid layout), table, list-item. Visibility: hidden (hides but keeps space) vs display:none (removes from flow).",
            hinglish: "Display layout behavior control karta hai: block (full width, new line - div, p, h1), inline (sirf content width, no new line - span, a), inline-block (inline + width/height), none (element chhupaye), flex (flexbox layout), grid (grid layout). Visibility: hidden (space rakhta hai) vs display:none (flow se hata deta hai)."
        },
        codeSample: {
            language: "css",
            filename: "display.css",
            code: "/* Block Element */\ndiv {\n    display: block;\n    width: 200px;\n}\n\n/* Inline Element */\nspan {\n    display: inline;\n    /* width/height ignored */\n}\n\n/* Inline-Block */\n.box {\n    display: inline-block;\n    width: 100px;\n    height: 100px;\n}\n\n/* Hide Element */\n.hidden {\n    display: none; /* Completely removed */\n}\n.invisible {\n    visibility: hidden; /* Space kept */\n}\n\n/* Modern Layouts */\n.container { display: flex; }\n.grid { display: grid; }"
        }
    },
    {
        category: "css",
        topic: "css-positioning",
        title: "CSS Positioning",
        order: 10,
        content: {
            english: "Position controls element placement: static (default, normal flow), relative (offset from normal position, keeps space), absolute (removed from flow, positioned relative to parent), fixed (relative to viewport, stays on scroll), sticky (switches between relative and fixed). Use top, right, bottom, left with positioned elements. Z-index controls stacking order.",
            hinglish: "Position element placement control karta hai: static (default), relative (normal position se offset, space rakhta hai), absolute (flow se removed, parent ke relative), fixed (viewport ke relative, scroll par bhi same), sticky (relative aur fixed ke beech switch). Top, right, bottom, left use karein. Z-index stacking order control karta hai."
        },
        codeSample: {
            language: "css",
            filename: "position.css",
            code: "/* Relative */\n.box1 {\n    position: relative;\n    top: 20px;\n    left: 30px;\n}\n\n/* Absolute */\n.parent { position: relative; }\n.child {\n    position: absolute;\n    top: 0;\n    right: 0;\n}\n\n/* Fixed */\n.navbar {\n    position: fixed;\n    top: 0;\n    width: 100%;\n}\n\n/* Sticky */\n.header {\n    position: sticky;\n    top: 0;\n}\n\n/* Z-Index */\n.modal { z-index: 1000; }"
        }
    },
    {
        category: "css",
        topic: "css-flexbox",
        title: "CSS Flexbox",
        order: 11,
        content: {
            english: "Flexbox for 1D layouts (row OR column). Container: display:flex, flex-direction (row, column), justify-content (main axis alignment), align-items (cross axis), flex-wrap (wrap, nowrap), gap. Items: flex (shorthand for grow shrink basis), flex-grow (how much to grow), flex-shrink, flex-basis, align-self (override alignment). Perfect for navigation, cards, centering.",
            hinglish: "Flexbox 1D layouts ke liye (row YA column). Container: display:flex, flex-direction (row, column), justify-content (main axis), align-items (cross axis), flex-wrap, gap. Items: flex (grow shrink basis), flex-grow, flex-shrink, flex-basis, align-self. Navigation, cards, centering ke liye perfect."
        },
        codeSample: {
            language: "css",
            filename: "flexbox.css",
            code: "/* Flex Container */\n.container {\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n    gap: 20px;\n    flex-wrap: wrap;\n}\n\n/* Flex Items */\n.item {\n    flex: 1; /* grow shrink basis */\n    flex-grow: 1;\n    flex-shrink: 0;\n    flex-basis: 200px;\n}\n\n/* Center Everything */\n.center {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n}\n\n/* Navigation */\nnav {\n    display: flex;\n    justify-content: space-around;\n}"
        }
    },
    {
        category: "css",
        topic: "css-grid",
        title: "CSS Grid",
        order: 12,
        content: {
            english: "Grid for 2D layouts (rows AND columns). Container: display:grid, grid-template-columns (define columns), grid-template-rows, gap, grid-template-areas. Items: grid-column (start/end), grid-row, grid-area. Units: fr (fraction), repeat(), minmax(), auto-fit, auto-fill. Perfect for page layouts, galleries, complex grids.",
            hinglish: "Grid 2D layouts ke liye (rows AUR columns). Container: display:grid, grid-template-columns, grid-template-rows, gap, grid-template-areas. Items: grid-column, grid-row, grid-area. Units: fr (fraction), repeat(), minmax(), auto-fit. Page layouts, galleries, complex grids ke liye perfect."
        },
        codeSample: {
            language: "css",
            filename: "grid.css",
            code: "/* Grid Container */\n.grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    grid-template-rows: auto;\n    gap: 20px;\n}\n\n/* Responsive Grid */\n.responsive {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: 16px;\n}\n\n/* Grid Areas */\n.layout {\n    grid-template-areas:\n        'header header'\n        'sidebar main'\n        'footer footer';\n}\n\n/* Place Items */\n.item {\n    grid-column: 1 / 3;\n    grid-row: 2 / 4;\n}\n\n/* Center with Grid */\n.center {\n    display: grid;\n    place-items: center;\n}"
        }
    },
    {
        category: "css",
        topic: "css-typography",
        title: "CSS Typography",
        order: 13,
        content: {
            english: "Font properties: font-family (font stack with fallbacks), font-size (px, em, rem, %, vw), font-weight (100-900, normal, bold), font-style (normal, italic, oblique), line-height (spacing between lines), letter-spacing (space between characters), text-align (left, right, center, justify), text-decoration (underline, line-through, overline, none), text-transform (uppercase, lowercase, capitalize), text-shadow.",
            hinglish: "Font properties: font-family (font stack with fallbacks), font-size (px, em, rem, %), font-weight (100-900, normal, bold), font-style (normal, italic), line-height (lines ke beech spacing), letter-spacing (characters ke beech space), text-align (left, right, center), text-decoration (underline, none), text-transform (uppercase, lowercase)."
        },
        codeSample: {
            language: "css",
            filename: "typography.css",
            code: "/* Font Family */\nbody {\n    font-family: 'Arial', 'Helvetica', sans-serif;\n}\n\n/* Font Size */\nh1 { font-size: 2.5rem; }\np { font-size: 16px; }\n\n/* Font Weight & Style */\n.strong { font-weight: 700; }\n.emphasis { font-style: italic; }\n\n/* Line Height */\np {\n    line-height: 1.6;\n    letter-spacing: 0.5px;\n}\n\n/* Text Alignment */\n.center { text-align: center; }\n.justify { text-align: justify; }\n\n/* Text Transform */\n.uppercase { text-transform: uppercase; }\n.capitalize { text-transform: capitalize; }\n\n/* Text Shadow */\nh1 {\n    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}"
        }
    },
    {
        category: "css",
        topic: "css-transitions-animations",
        title: "CSS Transitions & Animations",
        order: 14,
        content: {
            english: "Transitions: smooth property changes. transition: property duration timing-function delay. Timing: ease, linear, ease-in, ease-out, ease-in-out. Animations: @keyframes define animation, animation: name duration timing-function delay iteration-count direction. Keyframes: from/to or 0%/100%. Transform: translate, rotate, scale, skew. Perfect for hover effects, loading spinners, smooth interactions.",
            hinglish: "Transitions: smooth property changes. transition: property duration timing-function delay. Timing: ease, linear, ease-in, ease-out. Animations: @keyframes define karte hain, animation: name duration timing iteration-count. Transform: translate, rotate, scale, skew. Hover effects, loading spinners, smooth interactions ke liye perfect."
        },
        codeSample: {
            language: "css",
            filename: "animations.css",
            code: "/* Transition */\nbutton {\n    background: blue;\n    transition: background 0.3s ease;\n}\nbutton:hover {\n    background: darkblue;\n}\n\n/* Multiple Transitions */\ncard {\n    transition: all 0.3s ease-in-out;\n}\n\n/* Keyframe Animation */\n@keyframes slideIn {\n    from { transform: translateX(-100%); }\n    to { transform: translateX(0); }\n}\n\n.animated {\n    animation: slideIn 0.5s ease;\n}\n\n/* Infinite Animation */\n@keyframes spin {\n    to { transform: rotate(360deg); }\n}\n.spinner {\n    animation: spin 1s linear infinite;\n}\n\n/* Transform */\n.hover:hover {\n    transform: scale(1.1) rotate(5deg);\n}"
        }
    },
    {
        category: "css",
        topic: "css-responsive-design",
        title: "CSS Responsive Design",
        order: 15,
        content: {
            english: "Make websites work on all devices: Media queries (@media), viewport meta tag, relative units (%, em, rem, vw, vh), flexible grids (flexbox/grid), responsive images (max-width: 100%), mobile-first approach. Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px). Use min-width for mobile-first, max-width for desktop-first.",
            hinglish: "Websites ko sab devices par chalayein: Media queries (@media), viewport meta tag, relative units (%, em, rem, vw, vh), flexible grids (flexbox/grid), responsive images. Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px). Mobile-first approach use karein (min-width)."
        },
        codeSample: {
            language: "css",
            filename: "responsive.css",
            code: "/* Mobile First */\n.container {\n    width: 100%;\n    padding: 16px;\n}\n\n/* Tablet */\n@media (min-width: 768px) {\n    .container {\n        max-width: 720px;\n        margin: 0 auto;\n    }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n    .container {\n        max-width: 960px;\n    }\n}\n\n/* Responsive Image */\nimg {\n    max-width: 100%;\n    height: auto;\n}\n\n/* Hide on Mobile */\n@media (max-width: 767px) {\n    .desktop-only { display: none; }\n}\n\n/* Responsive Grid */\n.grid {\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n}"
        }
    },
    ...CSS_ADDITIONAL_LESSONS,
    // ==================== JAVASCRIPT COMPLETE A-Z ====================
    // SECTION 1: JS BASICS
    {
        category: "javascript",
        topic: "what-is-javascript",
        title: "What is JavaScript?",
        order: 1,
        content: {
            english: "JavaScript is a high-level, interpreted programming language that makes web pages interactive. It runs in browsers and on servers (Node.js). JavaScript can: change HTML content, modify CSS styles, respond to user events, validate forms, create animations, communicate with servers (AJAX/fetch), build full applications. It's the ONLY programming language that runs natively in browsers.",
            hinglish: "JavaScript ek high-level, interpreted programming language hai jo web pages ko interactive banati hai. Yeh browsers aur servers (Node.js) dono par chalti hai. JavaScript kar sakti hai: HTML content change karna, CSS styles modify karna, user events pe respond karna, forms validate karna, animations banana, servers se communicate karna, full applications banana. Yeh AKELI programming language hai jo natively browsers mein chalti hai."
        },
        codeSample: {
            language: "javascript",
            filename: "intro.js",
            code: "// JavaScript can change HTML\ndocument.getElementById('demo').innerHTML = 'Hello JavaScript!';\n\n// JavaScript can change CSS\ndocument.getElementById('demo').style.color = 'blue';\n\n// JavaScript can respond to events\nbutton.addEventListener('click', function() {\n    alert('Button clicked!');\n});\n\n// Console output\nconsole.log('JavaScript is working!');"
        }
    },
    {
        category: "javascript",
        topic: "js-setup-editors",
        title: "JavaScript Setup & Editors",
        order: 2,
        content: {
            english: "To write JavaScript, you need: Text Editor (VS Code recommended with extensions like ESLint, Prettier, JavaScript ES6 snippets), Browser (Chrome/Firefox with Developer Tools - F12 to open), Node.js (for running JS outside browser). Three ways to add JS: Inline (onclick attribute), Internal (script tag in HTML), External (separate .js file - BEST PRACTICE). Always put script tag at end of body or use defer/async.",
            hinglish: "JavaScript likhne ke liye chahiye: Text Editor (VS Code recommended with ESLint, Prettier extensions), Browser (Chrome/Firefox with Developer Tools - F12 se open), Node.js (browser ke bahar JS chalane ke liye). Teen tareeke JS add karne ke: Inline (onclick attribute), Internal (script tag HTML mein), External (separate .js file - BEST PRACTICE). Script tag ko hamesha body ke end mein rakhein ya defer/async use karein."
        },
        codeSample: {
            language: "javascript",
            filename: "setup.js",
            code: "<!-- Inline (NOT Recommended) -->\n<button onclick=\"alert('Clicked')\">Click</button>\n\n<!-- Internal -->\n<script>\n    console.log('Internal JavaScript');\n</script>\n\n<!-- External (BEST) -->\n<script src='app.js'></script>\n\n<!-- With defer (loads after HTML) -->\n<script src='app.js' defer></script>\n\n<!-- With async (loads while parsing) -->\n<script src='app.js' async></script>"
        }
    },
    {
        category: "javascript",
        topic: "js-output-methods",
        title: "JavaScript Output Methods",
        order: 3,
        content: {
            english: "Four ways to display output: console.log() - for debugging (F12 > Console), document.write() - writes to HTML (overwrites entire page), innerHTML - changes HTML content of element, window.alert() - shows popup alert. Best practice: use console.log for debugging, innerHTML for updating content. Avoid document.write as it overwrites page.",
            hinglish: "Char tareeke output dikhane ke: console.log() - debugging ke liye (F12 > Console), document.write() - HTML mein likhta hai (pura page overwrite karta hai), innerHTML - element ka HTML content change karta hai, window.alert() - popup alert dikhata hai. Best practice: debugging ke liye console.log use karein, content update karne ke liye innerHTML. document.write avoid karein kyunki yeh page overwrite karta hai."
        },
        codeSample: {
            language: "javascript",
            filename: "output.js",
            code: "// Console (Debugging)\nconsole.log('Debug message');\nconsole.error('Error message');\nconsole.warn('Warning message');\n\n// Alert (Popup)\nwindow.alert('Hello User!');\nalert('Quick message');\n\n// innerHTML (Update HTML)\ndocument.getElementById('demo').innerHTML = 'New content';\n\n// document.write (NOT Recommended)\ndocument.write('This overwrites everything');\n\n// Multiple values\nconsole.log('Name:', 'John', 'Age:', 25);"
        }
    },
    {
        category: "javascript",
        topic: "js-statements-syntax",
        title: "JavaScript Statements & Syntax",
        order: 4,
        content: {
            english: "JavaScript syntax rules: statements end with semicolon ; (optional but recommended), code executes top to bottom, whitespace is ignored, JavaScript is case-sensitive (Name ≠ name), use camelCase for variables/functions, single or double quotes for strings, comments with // or /* */. Statements are instructions that tell browser what to do. Multiple statements can be on one line (separated by ;).",
            hinglish: "JavaScript syntax rules: statements semicolon ; pe end hote hain (optional but recommended), code top to bottom execute hota hai, whitespace ignore hoti hai, JavaScript case-sensitive hai (Name ≠ name), variables/functions ke liye camelCase use karein, strings ke liye single ya double quotes, comments // ya /* */ se. Statements browser ko batate hain kya karna hai."
        },
        codeSample: {
            language: "javascript",
            filename: "syntax.js",
            code: "// Statements\nlet name = 'John';\nlet age = 25;\n\n// Multiple on one line\nlet x = 10; let y = 20; let z = 30;\n\n// Case Sensitive\nlet Name = 'John';\nlet name = 'Jane'; // Different variable!\n\n// Comments\n// Single line comment\n\n/* \n   Multi-line comment\n   Explaining code below\n*/\n\n// CamelCase\nlet firstName = 'John';\nfunction calculateTotal() { }"
        }
    },
    {
        category: "javascript",
        topic: "js-variables",
        title: "JavaScript Variables",
        order: 5,
        content: {
            english: "Variables store data values. Three ways to declare: var (old, function-scoped, avoid), let (block-scoped, can reassign), const (block-scoped, cannot reassign). Rules: must start with letter, $, or _, case-sensitive, no reserved words (let, const, function), camelCase convention. Always prefer const, use let only when reassignment needed, avoid var.",
            hinglish: "Variables data values store karte hain. Teen tareeke declare karne ke: var (purana, function-scoped, avoid karein), let (block-scoped, reassign kar sakte hain), const (block-scoped, reassign nahi kar sakte). Rules: letter, $, ya _ se start hona chahiye, case-sensitive, reserved words nahi (let, const, function), camelCase convention. Hamesha const prefer karein, sirf let use karein jab reassignment chahiye ho, var avoid karein."
        },
        codeSample: {
            language: "javascript",
            filename: "variables.js",
            code: "// const (Cannot reassign - PREFERRED)\nconst PI = 3.14159;\nconst name = 'John';\n// PI = 3.14; // ERROR!\n\n// let (Can reassign)\nlet age = 25;\nage = 26; // OK\nlet score; // undefined\nscore = 100;\n\n// var (Old way - AVOID)\nvar oldWay = 'deprecated';\n\n// Naming Rules\nlet firstName = 'John';  // Valid\nlet _private = 'secret'; // Valid\nlet $price = 100;        // Valid\n// let 1stPlace = 'X';   // Invalid!\n\n// Constants for fixed values\nconst TAX_RATE = 0.18;\nconst MAX_USERS = 100;"
        }
    },
    {
        category: "javascript",
        topic: "js-data-types",
        title: "JavaScript Data Types",
        order: 6,
        content: {
            english: "JavaScript has 8 data types. Primitive (7): string (text), number (integers & decimals), boolean (true/false), undefined (declared but no value), null (intentional empty), bigint (large numbers), symbol (unique identifiers). Non-primitive (1): object (arrays, functions, dates). Use typeof to check type. JavaScript is dynamically typed (type can change).",
            hinglish: "JavaScript mein 8 data types hote hain. Primitive (7): string (text), number (integers & decimals), boolean (true/false), undefined (declared par no value), null (intentional empty), bigint (large numbers), symbol (unique identifiers). Non-primitive (1): object (arrays, functions, dates). typeof se type check karein. JavaScript dynamically typed hai (type change ho sakta hai)."
        },
        codeSample: {
            language: "javascript",
            filename: "datatypes.js",
            code: "// String\nlet name = 'John';\nlet greeting = \"Hello\";\n\n// Number\nlet age = 25;\nlet price = 99.99;\n\n// Boolean\nlet isActive = true;\nlet hasAccess = false;\n\n// Undefined & Null\nlet x;           // undefined\nlet y = null;    // null (intentional empty)\n\n// BigInt\nlet bigNum = 999999999999999999n;\n\n// Object\nlet person = { name: 'John', age: 25 };\nlet arr = [1, 2, 3];\n\n// Check type\ntypeof name;     // 'string'\ntypeof age;      // 'number'\ntypeof isActive; // 'boolean'\ntypeof x;        // 'undefined'\ntypeof person;   // 'object'"
        }
    },
    {
        category: "javascript",
        topic: "js-strings",
        title: "JavaScript Strings",
        order: 7,
        content: {
            english: "Strings store text data. Three ways to create: single quotes ('text'), double quotes (\"text\"), backticks (template literals `text ${var}`). String properties/methods: length (string length), toUpperCase(), toLowerCase(), trim() (remove spaces), concat() (join strings), slice(start, end), substring(start, end), replace(old, new), indexOf(char), includes(char). Template literals allow multi-line strings and variable interpolation.",
            hinglish: "Strings text data store karte hain. Teen tareeke banane ke: single quotes ('text'), double quotes (\"text\"), backticks (template literals `text ${var}`). String properties/methods: length, toUpperCase(), toLowerCase(), trim(), concat(), slice(), substring(), replace(), indexOf(), includes(). Template literals multi-line strings aur variable interpolation allow karte hain."
        },
        codeSample: {
            language: "javascript",
            filename: "strings.js",
            code: "// String Creation\nlet name = 'John';\nlet greeting = \"Hello\";\nlet message = `Hi ${name}!`; // Template literal\n\n// Multi-line\nlet bio = `Line 1\nLine 2\nLine 3`;\n\n// Properties & Methods\nlet text = 'Hello World';\ntext.length;           // 11\ntext.toUpperCase();    // 'HELLO WORLD'\ntext.toLowerCase();    // 'hello world'\ntext.slice(0, 5);      // 'Hello'\ntext.indexOf('W');     // 6\ntext.includes('World');// true\ntext.replace('World', 'JS'); // 'Hello JS'\n\n// Concatenation\nlet full = firstName + ' ' + lastName;\nlet full2 = `${firstName} ${lastName}`; // Better"
        }
    },
    {
        category: "javascript",
        topic: "js-numbers-operators",
        title: "JavaScript Numbers & Operators",
        order: 8,
        content: {
            english: "Numbers can be integers (25) or decimals (3.14). Special values: Infinity, -Infinity, NaN (Not a Number). Operators: Arithmetic (+, -, *, /, %, ** power, ++ increment, -- decrement), Assignment (=, +=, -=, *=, /=), Comparison (==, ===, !=, !==, >, <, >=, <=), Logical (&& AND, || OR, ! NOT). Use === (strict equality) instead of == (loose). parseInt() and parseFloat() convert strings to numbers.",
            hinglish: "Numbers integers (25) ya decimals (3.14) ho sakte hain. Special values: Infinity, -Infinity, NaN (Not a Number). Operators: Arithmetic (+, -, *, /, %, ** power), Assignment (=, +=, -=), Comparison (==, ===, !=, !==, >, <), Logical (&& AND, || OR, ! NOT). === (strict equality) use karein == (loose) ki jagah. parseInt() aur parseFloat() strings ko numbers mein convert karte hain."
        },
        codeSample: {
            language: "javascript",
            filename: "numbers.js",
            code: "// Arithmetic\nlet sum = 10 + 5;      // 15\nlet diff = 10 - 5;     // 5\nlet product = 10 * 5;  // 50\nlet quotient = 10 / 5; // 2\nlet remainder = 10 % 3;// 1\nlet power = 2 ** 3;    // 8\n\n// Increment/Decrement\nlet x = 5;\nx++;  // 6\nx--;  // 5\n\n// Comparison (Use ===)\n5 == '5';   // true (loose)\n5 === '5';  // false (strict)\n5 !== '5';  // true\n\n// Logical\ntrue && false;  // false (AND)\ntrue || false;  // true (OR)\n!true;          // false (NOT)\n\n// Type Conversion\nparseInt('42');      // 42\nparseFloat('3.14');  // 3.14\nNumber('100');       // 100"
        }
    },
    {
        category: "javascript",
        topic: "js-conditionals",
        title: "JavaScript Conditionals (if/else)",
        order: 9,
        content: {
            english: "Conditionals execute code based on conditions. if statement runs code if condition is true. else runs if condition is false. else if checks multiple conditions. Ternary operator (condition ? true : false) is shorthand. switch statement matches value against multiple cases. Falsy values: false, 0, '', null, undefined, NaN. Everything else is truthy.",
            hinglish: "Conditionals conditions ke basis par code execute karte hain. if statement tab chalta hai jab condition true ho. else tab chalta hai jab condition false ho. else if multiple conditions check karta hai. Ternary operator (condition ? true : false) shorthand hai. switch statement value ko multiple cases se match karta hai. Falsy values: false, 0, '', null, undefined, NaN. Baaki sab truthy hai."
        },
        codeSample: {
            language: "javascript",
            filename: "conditionals.js",
            code: "// if/else\nlet age = 18;\n\nif (age >= 18) {\n    console.log('Adult');\n} else {\n    console.log('Minor');\n}\n\n// else if\nlet score = 85;\nif (score >= 90) {\n    grade = 'A';\n} else if (score >= 80) {\n    grade = 'B';\n} else if (score >= 70) {\n    grade = 'C';\n} else {\n    grade = 'F';\n}\n\n// Ternary Operator\nlet status = age >= 18 ? 'Adult' : 'Minor';\n\n// Switch\nlet day = 'Monday';\nswitch(day) {\n    case 'Monday':\n        console.log('Start of week');\n        break;\n    case 'Friday':\n        console.log('Weekend soon');\n        break;\n    default:\n        console.log('Regular day');\n}"
        }
    },
    {
        category: "javascript",
        topic: "js-loops",
        title: "JavaScript Loops",
        order: 10,
        content: {
            english: "Loops execute code multiple times. for loop: for (initialization; condition; increment). while loop: runs while condition is true. do...while: runs at least once, then checks condition. for...of: iterate over arrays/strings. for...in: iterate over object properties. break exits loop, skip to next iteration with continue. Infinite loops crash programs - always ensure condition becomes false.",
            hinglish: "Loops code ko multiple times execute karte hain. for loop: for (initialization; condition; increment). while loop: jab tak condition true ho tab tak chalta hai. do...while: kam se kam ek baar chalta hai, phir condition check karta hai. for...of: arrays/strings par iterate karein. for...in: object properties par iterate karein. break loop se bahar nikalta hai, continue next iteration pe skip karta hai."
        },
        codeSample: {
            language: "javascript",
            filename: "loops.js",
            code: "// for Loop\nfor (let i = 0; i < 5; i++) {\n    console.log(i); // 0, 1, 2, 3, 4\n}\n\n// while Loop\nlet i = 0;\nwhile (i < 5) {\n    console.log(i);\n    i++;\n}\n\n// do...while\nlet j = 0;\ndo {\n    console.log(j);\n    j++;\n} while (j < 5);\n\n// for...of (Arrays)\nlet colors = ['red', 'green', 'blue'];\nfor (let color of colors) {\n    console.log(color);\n}\n\n// for...in (Objects)\nlet person = { name: 'John', age: 25 };\nfor (let key in person) {\n    console.log(key, person[key]);\n}\n\n// break & continue\nfor (let i = 0; i < 10; i++) {\n    if (i === 5) break;     // Exit loop\n    if (i === 3) continue;  // Skip iteration\n    console.log(i);\n}"
        }
    },
    {
        category: "javascript",
        topic: "js-functions",
        title: "JavaScript Functions",
        order: 11,
        content: {
            english: "Functions are reusable code blocks that perform tasks. Declaration: function name(parameters) { }. Call: name(arguments). Return statement sends value back. Parameters vs Arguments: parameters are in definition, arguments are actual values passed. Functions can be: named functions, anonymous functions, arrow functions (ES6). Functions are first-class citizens (can be assigned to variables, passed as arguments, returned from other functions).",
            hinglish: "Functions reusable code blocks hote hain jo tasks perform karte hain. Declaration: function name(parameters) { }. Call: name(arguments). Return statement value bhejta hai back. Parameters vs Arguments: parameters definition mein hote hain, arguments actual values hote hain. Functions teen type ke: named functions, anonymous functions, arrow functions (ES6). Functions first-class citizens hote hain (variables mein assign, arguments mein pass, doosre functions se return ho sakte hain)."
        },
        codeSample: {
            language: "javascript",
            filename: "functions.js",
            code: "// Function Declaration\nfunction greet(name) {\n    return `Hello ${name}!`;\n}\nconsole.log(greet('John'));\n\n// Function Expression\nconst add = function(a, b) {\n    return a + b;\n};\n\n// Arrow Function (ES6)\nconst multiply = (a, b) => a * b;\n\n// Default Parameters\nconst welcome = (name = 'Guest') => {\n    return `Welcome ${name}`;\n};\n\n// Multiple Returns\nconst getUser = () => {\n    return { name: 'John', age: 25 };\n};\n\n// Higher-Order Function\nconst operate = (a, b, operation) => {\n    return operation(a, b);\n};\noperate(5, 3, (x, y) => x + y); // 8"
        }
    },
    {
        category: "javascript",
        topic: "js-scope-closures",
        title: "JavaScript Scope & Closures",
        order: 12,
        content: {
            english: "Scope determines variable accessibility. Global scope: accessible everywhere. Function scope: accessible only inside function (var). Block scope: accessible only inside {} (let, const). Lexical scoping: inner functions have access to outer function's variables. Closure: function that remembers variables from its outer scope even after outer function has returned. Closures are used for data privacy, function factories, currying.",
            hinglish: "Scope variable accessibility determine karta hai. Global scope: sab jagah accessible. Function scope: sirf function ke andar accessible (var). Block scope: sirf {} ke andar accessible (let, const). Lexical scoping: inner functions ko outer function ke variables milte hain. Closure: function jo outer scope ke variables ko yaad rakhta hai even after outer function returns. Closures data privacy, function factories, currying ke liye use hote hain."
        },
        codeSample: {
            language: "javascript",
            filename: "scope.js",
            code: "// Global Scope\nlet globalVar = 'I am global';\n\nfunction myFunction() {\n    // Function Scope\n    let functionVar = 'I am local';\n    console.log(globalVar); // Accessible\n    \n    if (true) {\n        // Block Scope\n        let blockVar = 'I am block-scoped';\n        console.log(functionVar); // Accessible\n    }\n    // console.log(blockVar); // ERROR!\n}\n\n// Closure Example\nfunction outer() {\n    let count = 0;\n    return function() {\n        count++;\n        return count;\n    };\n}\nconst counter = outer();\ncounter(); // 1\ncounter(); // 2\ncounter(); // 3"
        }
    },
    {
        category: "javascript",
        topic: "js-arrays",
        title: "JavaScript Arrays",
        order: 13,
        content: {
            english: "Arrays store multiple values in single variable. Create: let arr = [1, 2, 3] or new Array(). Properties: length (number of elements). Access: arr[0] (zero-indexed). Methods (Mutating - change original): push(), pop(), shift(), unshift(), splice(), reverse(), sort(). Methods (Non-mutating - return new): concat(), slice(), map(), filter(), reduce(), find(), forEach(), includes(), indexOf(), join(). Arrays can hold any data type, even other arrays (nested).",
            hinglish: "Arrays single variable mein multiple values store karte hain. Create: let arr = [1, 2, 3] ya new Array(). Properties: length (elements ki count). Access: arr[0] (zero-indexed). Methods (Mutating - original change): push(), pop(), shift(), unshift(), splice(), reverse(), sort(). Methods (Non-mutating - naya return): concat(), slice(), map(), filter(), reduce(), find(), forEach(), includes(), indexOf(), join(). Arrays koi bhi data type hold kar sakte hain, even other arrays (nested)."
        },
        codeSample: {
            language: "javascript",
            filename: "arrays.js",
            code: "// Create Array\nlet fruits = ['Apple', 'Banana', 'Mango'];\nlet mixed = [1, 'two', true, null];\n\n// Access\nfruits[0];        // 'Apple'\nfruits.length;    // 3\nfruits[fruits.length - 1]; // 'Mango'\n\n// Mutating Methods\nfruits.push('Orange');      // Add end\nfruits.pop();               // Remove end\nfruits.unshift('Grape');    // Add start\nfruits.shift();             // Remove start\nfruits.splice(1, 1);        // Remove 1 at index 1\n\n// Non-Mutating Methods\nlet nums = [1, 2, 3, 4, 5];\nnums.slice(1, 3);           // [2, 3]\nnums.map(x => x * 2);       // [2, 4, 6, 8, 10]\nnums.filter(x => x > 2);    // [3, 4, 5]\nnums.reduce((sum, x) => sum + x, 0); // 15\nnums.find(x => x > 3);      // 4\nnums.includes(3);           // true\nnums.join(' - ');           // '1 - 2 - 3 - 4 - 5'\n\n// forEach\nfruits.forEach(fruit => console.log(fruit));"
        }
    },
    {
        category: "javascript",
        topic: "js-objects",
        title: "JavaScript Objects",
        order: 14,
        content: {
            english: "Objects store data as key-value pairs. Create: let obj = { key: value } or new Object(). Access properties: obj.key (dot notation) or obj['key'] (bracket notation). Methods: Object.keys(), Object.values(), Object.entries(), Object.assign() (merge), Object.freeze() (prevent changes). this keyword refers to current object. Objects can contain any data type including functions (methods) and other objects (nested).",
            hinglish: "Objects key-value pairs mein data store karte hain. Create: let obj = { key: value } ya new Object(). Access properties: obj.key (dot notation) ya obj['key'] (bracket notation). Methods: Object.keys(), Object.values(), Object.entries(), Object.assign() (merge), Object.freeze() (changes rokta hai). this keyword current object ko refer karta hai. Objects koi bhi data type contain kar sakte hain including functions (methods) aur other objects (nested)."
        },
        codeSample: {
            language: "javascript",
            filename: "objects.js",
            code: "// Create Object\nlet person = {\n    name: 'John',\n    age: 25,\n    city: 'Mumbai',\n    greet() {\n        return `Hi, I'm ${this.name}`;\n    }\n};\n\n// Access\nperson.name;           // 'John'\nperson['age'];         // 25\nperson.greet();        // 'Hi, I'm John'\n\n// Modify\nperson.age = 26;\nperson.email = 'john@email.com';\ndelete person.city;\n\n// Object Methods\nObject.keys(person);   // ['name', 'age', 'email']\nObject.values(person); // ['John', 26, 'john@email.com']\nObject.entries(person);// [['name','John'],['age',26]]\n\n// Merge Objects\nlet details = { phone: '1234567890' };\nlet full = Object.assign({}, person, details);\nlet full2 = { ...person, ...details }; // Spread\n\n// Freeze (Cannot modify)\nObject.freeze(person);\nperson.age = 30; // No effect"
        }
    },
    {
        category: "javascript",
        topic: "js-dom-intro",
        title: "JavaScript DOM Introduction",
        order: 15,
        content: {
            english: "DOM (Document Object Model) is a tree representation of HTML. JavaScript uses DOM to access and modify HTML/CSS. DOM tree: document (root) → html → head/body → elements. Document object is entry point. Everything in HTML is a node: element nodes, text nodes, attribute nodes, comment nodes. DOM allows: change content, modify styles, add/remove elements, respond to events, create animations.",
            hinglish: "DOM (Document Object Model) HTML ka tree representation hai. JavaScript DOM ka use karke HTML/CSS ko access aur modify karta hai. DOM tree: document (root) → html → head/body → elements. Document object entry point hai. HTML mein sab kuch node hai: element nodes, text nodes, attribute nodes, comment nodes. DOM allow karta hai: content change, styles modify, add/remove elements, events pe respond, animations banana."
        },
        codeSample: {
            language: "javascript",
            filename: "dom-intro.js",
            code: "// Select Elements\ndocument.getElementById('id');\ndocument.getElementsByClassName('class');\ndocument.getElementsByTagName('div');\ndocument.querySelector('.class');      // First match\ndocument.querySelectorAll('.class');   // All matches\n\n// Change Content\nelement.innerHTML = '<p>New HTML</p>';\nelement.textContent = 'Plain text';\n\n// Change Styles\nelement.style.color = 'blue';\nelement.style.backgroundColor = 'red';\n\n// Change Attributes\nelement.setAttribute('href', 'new-url');\nelement.getAttribute('href');\nelement.removeAttribute('disabled');\n\n// Add/Remove Classes\nelement.classList.add('active');\nelement.classList.remove('hidden');\nelement.classList.toggle('active');\nelement.classList.contains('active'); // true/false"
        }
    },
    {
        category: "javascript",
        topic: "js-dom-manipulation",
        title: "JavaScript DOM Manipulation",
        order: 16,
        content: {
            english: "DOM manipulation allows creating, modifying, and removing elements. Create: document.createElement('tag'). Add to DOM: parent.appendChild() or parent.insertBefore(). Remove: parent.removeChild() or element.remove(). Clone: element.cloneNode(true) for deep clone. Navigate DOM: parentElement, children, firstElementChild, lastElementChild, nextElementSibling, previousElementSibling. Best practice: batch DOM updates, use DocumentFragment for multiple elements.",
            hinglish: "DOM manipulation elements ko create, modify, aur remove karne deta hai. Create: document.createElement('tag'). DOM mein add: parent.appendChild() ya parent.insertBefore(). Remove: parent.removeChild() ya element.remove(). Clone: element.cloneNode(true) deep clone ke liye. DOM navigate: parentElement, children, firstElementChild, lastElementChild, nextElementSibling, previousElementSibling. Best practice: DOM updates batch karein, multiple elements ke liye DocumentFragment use karein."
        },
        codeSample: {
            language: "javascript",
            filename: "dom-manipulation.js",
            code: "// Create Element\nlet newDiv = document.createElement('div');\nnewDiv.textContent = 'New Div';\nnewDiv.className = 'box';\n\n// Add to DOM\ndocument.body.appendChild(newDiv);\n\nlet parent = document.getElementById('container');\nparent.insertBefore(newDiv, parent.firstChild);\n\n// Remove\nparent.removeChild(newDiv);\nnewDiv.remove(); // Modern way\n\n// Clone\nlet clone = newDiv.cloneNode(true); // Deep clone\n\n// Navigate DOM\nnewDiv.parentElement;\nnewDiv.children;\nnewDiv.firstElementChild;\nnewDiv.nextElementSibling;\nnewDiv.previousElementSibling;\n\n// DocumentFragment (Batch updates)\nlet fragment = document.createDocumentFragment();\nfor (let i = 0; i < 10; i++) {\n    let item = document.createElement('li');\n    item.textContent = `Item ${i}`;\n    fragment.appendChild(item);\n}\ndocument.getElementById('list').appendChild(fragment);"
        }
    },
    {
        category: "javascript",
        topic: "js-events",
        title: "JavaScript Events",
        order: 17,
        content: {
            english: "Events are actions that happen in browser: click, mouseover, keydown, submit, load, scroll, resize, focus, blur, change, input, dblclick, contextmenu. Add event listeners: element.addEventListener('event', function). Remove: element.removeEventListener('event', function). Event object contains details (target, type, key, coordinates). Event propagation: capturing (top to bottom), bubbling (bottom to top), e.stopPropagation() stops propagation, e.preventDefault() prevents default behavior.",
            hinglish: "Events browser mein hone wale actions hote hain: click, mouseover, keydown, submit, load, scroll. Event listeners add karein: element.addEventListener('event', function). Remove: element.removeEventListener(). Event object mein details hote hain (target, type, key, coordinates). Event propagation: capturing (top to bottom), bubbling (bottom to top), e.stopPropagation() propagation rokta hai, e.preventDefault() default behavior rokta hai."
        },
        codeSample: {
            language: "javascript",
            filename: "events.js",
            code: "// Add Event Listener\nbutton.addEventListener('click', function(e) {\n    console.log('Clicked!', e.target);\n});\n\n// Arrow Function\nbutton.addEventListener('click', (e) => {\n    console.log('Button clicked');\n});\n\n// Event Object\ninput.addEventListener('keydown', (e) => {\n    console.log(e.key);      // Key pressed\n    console.log(e.target);   // Element\n    if (e.key === 'Enter') {\n        console.log('Enter pressed');\n    }\n});\n\n// Prevent Default\nform.addEventListener('submit', (e) => {\n    e.preventDefault(); // Stop form submission\n    console.log('Form submitted');\n});\n\n// Stop Propagation\nchild.addEventListener('click', (e) => {\n    e.stopPropagation(); // Don't bubble up\n});\n\n// Remove Listener\nfunction handleClick() { }\nbutton.addEventListener('click', handleClick);\nbutton.removeEventListener('click', handleClick);"
        }
    },
    {
        category: "javascript",
        topic: "js-es6-features",
        title: "JavaScript ES6+ Features",
        order: 18,
        content: {
            english: "ES6 (2015) introduced major features: let/const (block scoping), arrow functions (=>), template literals (`text ${var}`), destructuring (extract values), spread/rest operator (...), default parameters, classes, modules (import/export), promises, Map/Set, symbols. ES7+: includes(), exponentiation (**). ES8+: async/await, Object.values/entries. ES9+: rest/spread for objects. ES10+: flat(), Object.fromEntries(). ES11+: optional chaining (?.), nullish coalescing (??).",
            hinglish: "ES6 (2015) ne major features introduce kiye: let/const (block scoping), arrow functions (=>), template literals, destructuring, spread/rest operator (...), default parameters, classes, modules (import/export), promises, Map/Set. ES7+: includes(), exponentiation (**). ES8+: async/await. ES11+: optional chaining (?.), nullish coalescing (??)."
        },
        codeSample: {
            language: "javascript",
            filename: "es6.js",
            code: "// Destructuring\nlet [a, b] = [1, 2];\nlet { name, age } = person;\n\n// Spread Operator\nlet arr2 = [...arr1, 4, 5];\nlet obj2 = { ...obj1, newKey: 'value' };\n\n// Rest Parameters\nfunction sum(...numbers) {\n    return numbers.reduce((total, n) => total + n, 0);\n}\nsum(1, 2, 3, 4); // 10\n\n// Optional Chaining\nlet street = user?.address?.street;\n\n// Nullish Coalescing\nlet name = userName ?? 'Guest';\n\n// Classes\nclass Animal {\n    constructor(name) {\n        this.name = name;\n    }\n    speak() {\n        console.log(`${this.name} makes sound`);\n    }\n}\n\n// Modules\nimport { func } from './module.js';\nexport const myFunc = () => { };"
        }
    },
    {
        category: "javascript",
        topic: "js-promises",
        title: "JavaScript Promises",
        order: 19,
        content: {
            english: "Promises handle asynchronous operations. Three states: pending (initial), fulfilled (resolved), rejected (failed). Create: new Promise((resolve, reject) => { }). Use .then() for success, .catch() for error, .finally() for cleanup. Promise.all() waits for all promises, Promise.race() waits for first. Promises solve callback hell. Async operations: API calls, file reading, timers, database queries. Always handle errors with .catch().",
            hinglish: "Promises asynchronous operations handle karte hain. Teen states: pending (initial), fulfilled (resolved), rejected (failed). Create: new Promise((resolve, reject) => { }). Use .then() success ke liye, .catch() error ke liye, .finally() cleanup ke liye. Promise.all() sab promises ka wait karta hai, Promise.race() first ka wait karta hai. Promises callback hell solve karte hain. Hamesha .catch() se errors handle karein."
        },
        codeSample: {
            language: "javascript",
            filename: "promises.js",
            code: "// Create Promise\nlet myPromise = new Promise((resolve, reject) => {\n    let success = true;\n    if (success) {\n        resolve('Operation successful!');\n    } else {\n        reject('Operation failed!');\n    }\n});\n\n// Use Promise\nmyPromise\n    .then(result => {\n        console.log(result);\n    })\n    .catch(error => {\n        console.error(error);\n    })\n    .finally(() => {\n        console.log('Done');\n    });\n\n// Multiple Promises\nPromise.all([promise1, promise2])\n    .then(results => console.log(results));\n\nPromise.race([promise1, promise2])\n    .then(first => console.log(first));"
        }
    },
    {
        category: "javascript",
        topic: "js-async-await",
        title: "JavaScript Async/Await",
        order: 20,
        content: {
            english: "Async/await is syntactic sugar over promises, makes async code look synchronous. async keyword before function makes it return promise. await pauses execution until promise resolves. Must use await inside async function. Error handling: try/catch blocks. Parallel execution: Promise.all() with await. Benefits: cleaner code, easier debugging, better error handling, no callback hell. Modern JavaScript prefers async/await over .then() chains.",
            hinglish: "Async/await promises ke upar syntactic sugar hai, async code ko synchronous jaisa dikhata hai. async keyword function ke before lagta hai, promise return karta hai. await execution ko pause karta hai jab tak promise resolve na ho. await ko async function ke andar use karna padta hai. Error handling: try/catch blocks. Parallel execution: Promise.all() with await. Benefits: cleaner code, easier debugging, better error handling."
        },
        codeSample: {
            language: "javascript",
            filename: "async-await.js",
            code: "// Async Function\nasync function fetchData() {\n    try {\n        let response = await fetch('https://api.example.com/data');\n        let data = await response.json();\n        console.log(data);\n    } catch (error) {\n        console.error('Error:', error);\n    }\n}\n\n// Parallel Execution\nasync function fetchAll() {\n    let [users, posts] = await Promise.all([\n        fetch('/api/users').then(r => r.json()),\n        fetch('/api/posts').then(r => r.json())\n    ]);\n    console.log(users, posts);\n}\n\n// With Error Handling\nasync function getUser(id) {\n    try {\n        const res = await fetch(`/api/users/${id}`);\n        if (!res.ok) throw new Error('Not found');\n        return await res.json();\n    } catch (err) {\n        console.error(err.message);\n    }\n}"
        }
    },
    {
        category: "javascript",
        topic: "js-fetch-api",
        title: "JavaScript Fetch API",
        order: 21,
        content: {
            english: "Fetch API makes HTTP requests. Syntax: fetch(url, options). Methods: GET (retrieve data), POST (send data), PUT (update), DELETE (remove), PATCH (partial update). Returns promise. Common options: method, headers, body (JSON.stringify for POST), mode, credentials. Handle response: response.json(), response.text(), response.ok (check status). Always handle errors. Modern alternative to XMLHttpRequest.",
            hinglish: "Fetch API HTTP requests banata hai. Syntax: fetch(url, options). Methods: GET (data retrieve), POST (data send), PUT (update), DELETE (remove). Promise return karta hai. Common options: method, headers, body (POST ke liye JSON.stringify). Response handle: response.json(), response.text(), response.ok (status check). Hamesha errors handle karein. XMLHttpRequest ka modern alternative."
        },
        codeSample: {
            language: "javascript",
            filename: "fetch.js",
            code: "// GET Request\nfetch('https://api.example.com/users')\n    .then(res => res.json())\n    .then(data => console.log(data))\n    .catch(err => console.error(err));\n\n// POST Request\nfetch('https://api.example.com/users', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ name: 'John', age: 25 })\n})\n    .then(res => res.json())\n    .then(data => console.log(data));\n\n// Async/Await\nasync function getUsers() {\n    try {\n        const res = await fetch('/api/users');\n        if (!res.ok) throw new Error('Failed');\n        const data = await res.json();\n        return data;\n    } catch (error) {\n        console.error(error);\n    }\n}\n\n// DELETE Request\nasync function deleteUser(id) {\n    await fetch(`/api/users/${id}`, {\n        method: 'DELETE'\n    });\n}"
        }
    },
    {
        category: "javascript",
        topic: "js-error-handling",
        title: "JavaScript Error Handling",
        order: 22,
        content: {
            english: "Error handling prevents crashes. try/catch/finally: try block contains risky code, catch handles errors, finally always executes. Throw: throw new Error('message'). Error types: SyntaxError (invalid code), TypeError (wrong type), ReferenceError (undefined variable), RangeError (out of range), URIError (invalid URI). Custom errors: class extends Error. Debugging: console methods, debugger statement, browser DevTools.",
            hinglish: "Error handling crashes se bachata hai. try/catch/finally: try block mein risky code, catch errors handle karta hai, finally hamesha execute hota hai. Throw: throw new Error('message'). Error types: SyntaxError, TypeError, ReferenceError, RangeError, URIError. Custom errors: class extends Error. Debugging: console methods, debugger statement, browser DevTools."
        },
        codeSample: {
            language: "javascript",
            filename: "errors.js",
            code: "// try/catch\ntry {\n    let result = riskyOperation();\n    console.log(result);\n} catch (error) {\n    console.error('Error:', error.message);\n} finally {\n    console.log('Always runs');\n}\n\n// Throw Error\nfunction divide(a, b) {\n    if (b === 0) {\n        throw new Error('Cannot divide by zero');\n    }\n    return a / b;\n}\n\n// Custom Error\nclass ValidationError extends Error {\n    constructor(message) {\n        super(message);\n        this.name = 'ValidationError';\n    }\n}\n\n// Multiple Catch\ntry {\n    // code\n} catch (e) {\n    if (e instanceof TypeError) {\n        console.log('Type error');\n    } else if (e instanceof RangeError) {\n        console.log('Range error');\n    } else {\n        throw e; // Re-throw\n    }\n}"
        }
    },
    {
        category: "javascript",
        topic: "js-local-storage",
        title: "JavaScript Local & Session Storage",
        order: 23,
        content: {
            english: "Web storage saves data in browser. localStorage: persists even after browser close, 5-10MB limit. sessionStorage: clears when tab closes, same size limit. Methods: setItem(key, value), getItem(key), removeItem(key), clear(). Values stored as strings - use JSON.stringify() to save objects, JSON.parse() to retrieve. Events: storage event fires when storage changes. Use for: user preferences, form data, shopping cart, auth tokens (not sensitive data).",
            hinglish: "Web storage browser mein data save karta hai. localStorage: browser close hone ke baad bhi rehta hai, 5-10MB limit. sessionStorage: tab close hone par clear ho jata hai. Methods: setItem(key, value), getItem(key), removeItem(key), clear(). Values strings mein store hote hain - objects save karne ke liye JSON.stringify(), retrieve karne ke liye JSON.parse() use karein. Use: user preferences, form data, shopping cart, auth tokens (sensitive data nahi)."
        },
        codeSample: {
            language: "javascript",
            filename: "storage.js",
            code: "// LocalStorage\nlocalStorage.setItem('name', 'John');\nlocalStorage.getItem('name');    // 'John'\nlocalStorage.removeItem('name');\nlocalStorage.clear();            // Clear all\n\n// Store Objects\nlet user = { name: 'John', age: 25 };\nlocalStorage.setItem('user', JSON.stringify(user));\n\nlet retrieved = JSON.parse(localStorage.getItem('user'));\nconsole.log(retrieved.name); // 'John'\n\n// SessionStorage (Same API)\nsessionStorage.setItem('temp', 'data');\nsessionStorage.getItem('temp');\nsessionStorage.removeItem('temp');\n\n// Check Support\nif (typeof(Storage) !== 'undefined') {\n    // Supported\n} else {\n    // Not supported\n}\n\n// Storage Event\nwindow.addEventListener('storage', (e) => {\n    console.log('Storage changed:', e.key);\n});"
        }
    },
    {
        category: "javascript",
        topic: "js-modules",
        title: "JavaScript Modules",
        order: 24,
        content: {
            english: "Modules split code into separate files. Export: export default (one per file), export named (multiple). Import: import default from './file', import { named } from './file', import * as alias from './file'. Benefits: code organization, reusability, namespace isolation, better maintenance. Use type='module' in script tag. Modern JavaScript uses ES6 modules. CommonJS (require/module.exports) used in Node.js.",
            hinglish: "Modules code ko separate files mein split karte hain. Export: export default (ek per file), export named (multiple). Import: import default from './file', import { named } from './file'. Benefits: code organization, reusability, namespace isolation, better maintenance. Script tag mein type='module' use karein. Modern JavaScript ES6 modules use karta hai. CommonJS (require/module.exports) Node.js mein use hota hai."
        },
        codeSample: {
            language: "javascript",
            filename: "modules.js",
            code: "// math.js - Named Exports\nexport const PI = 3.14159;\nexport function add(a, b) {\n    return a + b;\n}\nexport function subtract(a, b) {\n    return a - b;\n}\n\n// string.js - Default Export\nexport default function capitalize(str) {\n    return str.charAt(0).toUpperCase() + str.slice(1);\n}\n\n// main.js - Imports\nimport capitalize from './string.js';\nimport { add, subtract, PI } from './math.js';\nimport * as MathUtils from './math.js';\n\nconsole.log(add(5, 3));      // 8\nconsole.log(PI);             // 3.14159\nconsole.log(capitalize('hi')); // 'Hi'\nconsole.log(MathUtils.subtract(10, 4)); // 6\n\n<!-- HTML -->\n<script type='module' src='main.js'></script>"
        }
    },
    {
        category: "javascript",
        topic: "js-classes-oop",
        title: "JavaScript Classes & OOP",
        order: 25,
        content: {
            english: "Classes are blueprints for objects (ES6 syntax). OOP concepts: Encapsulation (data + methods together), Inheritance (child extends parent), Polymorphism (same method, different behavior), Abstraction (hide complexity). Class syntax: class Name { constructor(), methods }. Inheritance: class Child extends Parent, super() calls parent constructor. Access modifiers: #private (truly private), _convention (not enforced). Static methods belong to class not instances.",
            hinglish: "Classes objects ke liye blueprints hote hain (ES6 syntax). OOP concepts: Encapsulation (data + methods together), Inheritance (child extends parent), Polymorphism (same method, different behavior), Abstraction (complexity chhupaye). Class syntax: class Name { constructor(), methods }. Inheritance: class Child extends Parent, super() parent constructor ko call karta hai. #private (truly private), _convention (enforced nahi)."
        },
        codeSample: {
            language: "javascript",
            filename: "classes.js",
            code: "// Class Definition\nclass Animal {\n    constructor(name, sound) {\n        this.name = name;\n        this.#sound = sound; // Private\n    }\n    \n    #sound; // Private field\n    \n    speak() {\n        return `${this.name} says ${this.#sound}`;\n    }\n    \n    static info() {\n        return 'Animal class';\n    }\n}\n\n// Inheritance\nclass Dog extends Animal {\n    constructor(name) {\n        super(name, 'Woof');\n        this.breed = 'Labrador';\n    }\n    \n    fetch() {\n        return `${this.name} is fetching`;\n    }\n}\n\nlet dog = new Dog('Buddy');\ndog.speak();  // 'Buddy says Woof'\ndog.fetch();  // 'Buddy is fetching'\nAnimal.info(); // 'Animal class'"
        }
    },
    {
        category: "javascript",
        topic: "js-best-practices",
        title: "JavaScript Best Practices",
        order: 26,
        content: {
            english: "Best practices: use const by default, let when needed, never var. Always use === instead of ==. Use descriptive names (camelCase). Handle all errors with try/catch. Use template literals over concatenation. Prefer arrow functions for callbacks. Use modern methods (map, filter, reduce) over loops. Avoid global variables. Use modules for organization. Comment complex logic, not obvious code. Use linters (ESLint) and formatters (Prettier). Test your code. Keep functions small and focused.",
            hinglish: "Best practices: const default use karein, let jab zaroorat ho, var kabhi nahi. Hamesha === use karein == ki jagah. Descriptive names use karein (camelCase). Sab errors ko try/catch se handle karein. Template literals prefer karein concatenation se. Callbacks ke liye arrow functions use karein. Modern methods (map, filter, reduce) prefer karein loops se. Global variables avoid karein. Modules use karein organization ke liye. Complex logic ko comment karein, obvious code ko nahi."
        },
        codeSample: {
            language: "javascript",
            filename: "best-practices.js",
            code: "// ✅ Good Practices\nconst PI = 3.14159;\nlet count = 0;\n\nconst greet = (name) => `Hello ${name}`;\n\nconst numbers = [1, 2, 3];\nconst doubled = numbers.map(n => n * 2);\n\ntry {\n    const data = await fetch('/api/data');\n} catch (error) {\n    console.error('Failed:', error);\n}\n\n// ❌ Bad Practices\nvar x = 10;           // Use const/let\nif (x == '10') { }    // Use ===\nlet fullName = firstName + ' ' + lastName; // Use template\n\nfor (let i = 0; i < arr.length; i++) { } // Use forEach/map\n\nfunction doEverything() { } // Keep functions small\n\n// ✅ Module Structure\nexport const helper = () => { };\nimport { helper } from './utils.js';"
        }
    },
    ...JS_ADDITIONAL_LESSONS,
    ...REACT_LESSONS,
    ...NEXTJS_LESSONS,
    ...TAILWIND_LESSONS,
];

export async function seedLessons() {
    try {
        await connectDB();
        // Clear existing lessons to avoid duplicates during resync
        await Lesson.deleteMany({});
        
        const totalTopics = SEED_DATA.length;
        console.log(`📚 Seeding ${totalTopics} lessons across all categories...`);
        
        // Seed in batches to avoid memory issues
        const BATCH_SIZE = 100;
        for (let i = 0; i < SEED_DATA.length; i += BATCH_SIZE) {
            const batch = SEED_DATA.slice(i, i + BATCH_SIZE);
            await Lesson.insertMany(batch);
            console.log(`  ✅ Inserted batch ${Math.floor(i/BATCH_SIZE) + 1}: ${i + 1} - ${Math.min(i + BATCH_SIZE, totalTopics)}`);
        }
        
        // Count per category for verification
        const cats = SEED_DATA.reduce((acc, l) => {
            acc[l.category] = (acc[l.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        console.log("\n📊 Seeded topics per category:");
        Object.entries(cats).forEach(([cat, count]) => {
            console.log(`  • ${cat}: ${count} topics`);
        });
        
        console.log(`\n✅ Successfully seeded ${totalTopics} lessons!`);
        return { success: true, count: totalTopics };
    } catch (error) {
        console.error("Seeding Error:", error);
        return { success: false, error: error };
    }
}

// Direct invocation: npx tsx scripts/seed-lessons.ts
seedLessons()
    .then((result) => {
        if (result.success) {
            console.log(`\n🎉 Done! ${result.count} lessons are now in the database.`);
        } else {
            console.error("❌ Seeding failed.");
        }
        process.exit(result.success ? 0 : 1);
    })
    .catch((err) => {
        console.error("Fatal error:", err);
        process.exit(1);
    });

