document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // GSAP Entry
  gsap.utils.toArray(".gsap-reveal").forEach((elem) => {
    gsap.from(elem, {
      scrollTrigger: {
        trigger: elem,
        start: "top 85%",
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    });
  });

  setupMobileMenu();
  setupTheme();
});

// Mobile Menu Logic
function setupMobileMenu() {
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("open");
      btn.classList.toggle("active");
    });
  }
}

// Theme Logic
function setupTheme() {
  const toggleTheme = (btn) => {
    // Dangling Animation
    if (btn && btn.classList.contains("icon-btn")) {
      btn.classList.remove("dangle-anim");
      void btn.offsetWidth; // trigger reflow
      btn.classList.add("dangle-anim");
    }
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    localStorage.setItem("fnt-theme", isDark ? "dark" : "light");
    const mobileBtn = document.getElementById("themeToggleMobile");
    if (mobileBtn)
      mobileBtn.innerHTML = isDark
        ? "<span>Switch to Light</span> ☀️"
        : "<span>Switch to Dark</span> 🌓";
  };
  const btnDesktop = document.getElementById("themeToggle");
  const btnMobile = document.getElementById("themeToggleMobile");
  if (btnDesktop)
    btnDesktop.addEventListener("click", () => toggleTheme(btnDesktop));
  if (btnMobile)
    btnMobile.addEventListener("click", () => toggleTheme(btnMobile));
  if (localStorage.getItem("fnt-theme") === "dark") {
    document.body.classList.add("dark-theme");
    if (btnMobile) btnMobile.innerHTML = "<span>Switch to Light</span> ☀️";
  }
}

//firebase.js
// FIREBASE INIT
const firebaseConfig = {
  apiKey: "AIzaSyC6i5OswlTLw69VNR64b7fIOaiYQXX_bSA",
  authDomain: "fountains-ai-codelab.firebaseapp.com",
  projectId: "fountains-ai-codelab",
  storageBucket: "fountains-ai-codelab.firebasestorage.app",
  messagingSenderId: "447605557154",
  appId: "1:447605557154:web:4475a21963961b5e1514fb",
  measurementId: "G-WJ4JWB5GNB",
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged((user) => {
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .onSnapshot((doc) => {
        const data = doc.data() || {};
        const avatar =
          data.avatar ||
          user.photoURL ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`;
        const name = data.username || user.displayName || "Student";
        if (document.getElementById("nav-user-img"))
          document.getElementById("nav-user-img").src = avatar;
        if (document.getElementById("mobile-user-img"))
          document.getElementById("mobile-user-img").src = avatar;
        if (document.getElementById("mobile-user-name"))
          document.getElementById("mobile-user-name").innerText = name;
      });
  }
});

// DETAILED CONTENT DATABASE
const methodData = {
  1.1: {
    title: "The Architectural Blueprint (Think Before You Build)",
    content: `
            <p>Before opening any AI tool, you must be clear about what you want to build. AI works best when you give it direction. If your idea is vague, the result will also be vague. It is tempting to jump straight into coding, but this often leads to "spaghetti code" that is hard to fix later.</p>
            
            <h4>The Core Decisions</h4>
            <p>You should first decide on these four pillars:</p>
            <ul>
              <li><strong>The Goal:</strong> What is the website about? Who is it for?</li>
              <li><strong>The Structure:</strong> What pages will it have? (e.g., Home, About, Contact)</li>
              <li><strong>The Functionality:</strong> What can users do? (e.g., Fill a form, click a button, scroll a gallery)</li>
              <li><strong>The Aesthetics:</strong> How do you want it to look? (Modern, Dark Mode, Minimalist, Colorful)</li>
            </ul>
            <p>Think of this as drawing a plan before building a house. Without a plan, everything becomes confusing.</p>

            <h4>The "System Prompt" Strategy</h4>
            <p>Create a single document that describes your project in detail. Include your color palette (hex codes), font choices, and layout preferences. Feed this to the AI at the very start of your chat. This gives the AI "context memory" to keep your design consistent throughout the conversation.</p>

            <div class="modal-tip">
              <strong>Simple Tip</strong>
              Write your idea down as if you are explaining it to a junior developer or a friend. Explain the goal, main features, and style. You can paste this explanation into the AI later to help it understand your project clearly.
            </div>
          `,
  },
  1.2: {
    title: "Code Literacy & Command (Understand What You Are Using)",
    content: `
            <p>AI is powerful, but you must still understand basic coding. You cannot lead what you do not understand. If you rely 100% on AI without knowing the basics, you will be stuck the moment a bug appears.</p>
            
            <h4>The Three Pillars of Web Dev</h4>
            <ul>
              <li><strong>HTML (Structure):</strong> The skeleton of your site. You need to know tags like <code>&lt;div&gt;</code>, <code>&lt;section&gt;</code>, and <code>&lt;button&gt;</code>.</li>
              <li><strong>CSS (Design):</strong> The clothing. You need to understand Flexbox, Grid, and Padding to fix layout issues the AI might create.</li>
              <li><strong>JavaScript (Behavior):</strong> The brain. You need to know how functions and events work to make your site interactive.</li>
            </ul>
            <p>When you understand these basics, you can ask better questions, fix small issues yourself, and know when the AI makes a mistake. If you don’t understand the code, you cannot control it—and you cannot improve it.</p>

            <div class="modal-tip">
              <strong>Simple Tip</strong>
              When AI gives you code, read it line by line. If you see something confusing, ask the AI: “Explain this part in simple terms.” Never copy and paste blindly. Learning happens when you understand why the code works.
            </div>
          `,
  },
  1.3: {
    title: "The Multi-AI Approach (Use More Than One Helper)",
    content: `
            <p>No single AI tool is perfect at everything. Some are better at design, some at logic, some at research. Relying on just one is like trying to build a house with only a hammer.</p>
            
            <h4>Know Your Tools</h4>
            <ul>
              <li><strong>ChatGPT (GPT-4o):</strong> Excellent for logic, JavaScript functions, and explaining complex concepts.</li>
              <li><strong>Claude (Sonnet 3.5):</strong> Superior at writing clean, modern HTML/CSS and understanding visual layouts.</li>
              <li><strong>Perplexity / Bing:</strong> Best for finding up-to-date libraries, APIs, and documentation.</li>
            </ul>
            <p>If one AI is struggling or repeating the same mistake: Copy the code, take it to another AI, and ask for a fresh solution. This is similar to asking a second developer for help when you are stuck.</p>

            <div class="modal-tip">
              <strong>Simple Tip</strong>
              If an AI keeps giving wrong answers, don’t argue with it. Switch tools. A new AI often fixes the issue faster because it has a different "perspective."
            </div>
          `,
  },
  1.4: {
    title: "Iterative Resilience (Patience Is Part of the Skill)",
    content: `
            <p>AI-assisted development is not magic. Sometimes the code will break. Sometimes the AI will misunderstand you. This is normal. The key skill here is patience and correction.</p>
            <p>You improve results by giving feedback, adjusting your instructions, and trying again. Building with AI is a conversation, not a one-click action. Do not get frustrated if the first result isn't perfect.</p>
            
            <h4>The Feedback Loop</h4>
            <p>1. Generate Code -> 2. Test Code -> 3. Identify Error -> 4. Feed Error back to AI -> 5. Repeat.</p>

            <div class="modal-tip">
              <strong>Simple Tip</strong>
              When something doesn’t work, copy the error message from your browser console (F12), paste it into the AI, and ask: “Why is this happening and how do I fix it?”
            </div>
          `,
  },
  1.5: {
    title: "Clear Instructions Matter (Your Words Are Powerful)",
    content: `
            <p>AI responds directly to how you speak to it. Clear instructions produce better results. Vague requests lead to generic, boring code.</p>
            
            <h4>Be Specific</h4>
            <ul>
              <li><strong>Bad:</strong> "Make it better."</li>
              <li><strong>Good:</strong> "Make the layout cleaner, increase the padding to 20px, and use a sans-serif font for better readability on mobile."</li>
            </ul>
            <p>You can also tell the AI what <strong>not</strong> to do. This is called "Negative Prompting". For example: "Do not use external CSS libraries like Bootstrap, use custom CSS only."</p>

            <div class="modal-tip">
              <strong>Simple Tip</strong>
              Always be specific. You can say things like: “Keep the design simple”, “Use only basic HTML, CSS, and JavaScript”, or “Avoid complicated layouts”. This helps the AI stay focused and produce clean results.
            </div>
          `,
  },
  1.6: {
    title: "Build Small Pieces First (One Step at a Time)",
    content: `
            <p>Never ask an AI to build a full website at once. That usually leads to messy, broken code that cuts off halfway. Instead, use the "Component-Driven" approach.</p>
            
            <h4>The Assembly Line</h4>
            <p>Build small parts first, one section at a time, then combine everything together:</p>
            <ul>
              <li>Step 1: Build the Navigation Bar. Make sure it works.</li>
              <li>Step 2: Build the Hero Section (Header).</li>
              <li>Step 3: Build the Feature Cards.</li>
              <li>Step 4: Build the Footer.</li>
            </ul>
            <p>Once each part works well individually, you connect them to form the full website. This makes debugging much easier.</p>

            <div class="modal-tip">
              <strong>Simple Tip</strong>
              Treat your website like LEGO blocks: Build each block carefully, then assemble them. This approach gives cleaner and more reliable results.
            </div>
          `,
  },
  1.7: {
    title: "Human Verification (You Are Still the Boss)",
    content: `
            <p>AI can write code that looks correct but loads slowly, breaks on mobile, has security issues, or feels uncomfortable to use. That is why you must always test your work yourself.</p>
            
            <h4>The Quality Checklist</h4>
            <ul>
              <li><strong>Mobile View:</strong> Does it look good on a phone screen?</li>
              <li><strong>Browser Test:</strong> Does it work on Chrome, Edge, and Safari?</li>
              <li><strong>Interactivity:</strong> Do all buttons and forms actually work?</li>
              <li><strong>Speed:</strong> Does the site load instantly?</li>
            </ul>
            <p>AI helps you build faster, but you are responsible for quality. You are the Creative Director; the AI is just the intern.</p>

            <div class="modal-tip">
              <strong>Simple Tip</strong>
              Always test your website manually. If something feels wrong to you, it is wrong—even if the AI says it is correct. Trust your instincts.
            </div>
          `,
  },
  2.1: {
    title: "What Happens When You Open a Website?",
    content: `
        <p>When you type a website address into your browser and press Enter, several things happen very quickly:</p>
        <ul>
          <li>Your browser requests the website files from a server.</li>
          <li>The server sends back those files.</li>
          <li>Your browser reads the files and displays the website on your screen.</li>
        </ul>
        <p>A website is not magic. It is simply a collection of files working together.</p>
      `,
  },
  2.2: {
    title: "The Three Core Building Blocks of the Web",
    content: `
        <p>Every modern website is built using three main technologies. AI does not replace them—it helps you write them faster.</p>
        
        <h4>HTML — The Structure</h4>
        <p>HTML is the skeleton of the website. It decides headings, text, images, buttons, and forms. If a website were a house, HTML would be the walls and rooms.</p>
        
        <h4>CSS — The Design</h4>
        <p>CSS controls how the website looks. It handles colors, fonts, spacing, layout, and responsiveness (how it looks on phones). Without CSS, websites look plain and unfinished.</p>
        
        <h4>JavaScript — The Behavior</h4>
        <p>JavaScript makes websites interactive. It controls button clicks, form validation, animations, loading data, and user interaction. If HTML is the body and CSS is the clothing, JavaScript is the movement.</p>
      `,
  },
  2.3: {
    title: "How Browsers Read Your Website",
    content: `
        <p>Your browser reads files in this order:</p>
        <ol>
          <li>HTML first</li>
          <li>CSS next</li>
          <li>JavaScript last</li>
        </ol>
        <p>This is why:</p>
        <ul>
          <li>Broken HTML breaks the page</li>
          <li>Bad CSS affects design</li>
          <li>JavaScript errors affect behavior</li>
        </ul>
        <p>When AI gives you code, understanding this order helps you know where problems come from.</p>
      `,
  },
  2.4: {
    title: "Why Websites Have Multiple Files",
    content: `
        <p>You will often see files like <code>index.html</code>, <code>style.css</code>, and <code>script.js</code>.</p>
        <p>This separation:</p>
        <ul>
          <li>Keeps code clean</li>
          <li>Makes debugging easier</li>
          <li>Helps teams work together</li>
          <li>Helps AI generate better results</li>
        </ul>
        <p>AI works best when each file has one clear responsibility.</p>
      `,
  },
  2.5: {
    title: "Where AI Fits Into Web Development",
    content: `
        <p>AI does not “build websites alone.” Instead, it:</p>
        <ul>
          <li>Writes HTML faster</li>
          <li>Suggests design ideas</li>
          <li>Helps debug errors</li>
          <li>Explains confusing code</li>
          <li>Refactors messy code</li>
        </ul>
        <p>You are still the architect. AI is your assistant.</p>
      `,
  },
  2.6: {
    title: "Why Understanding This Matters When Using AI",
    content: `
        <p>If you understand what each file does, how browsers read code, and where errors come from, then you can:</p>
        <ul>
          <li>Correct AI mistakes</li>
          <li>Improve AI output</li>
          <li>Build more complex projects</li>
          <li>Avoid frustration</li>
        </ul>
        <p>Without this understanding, AI becomes confusing instead of helpful.</p>
      `,
  },
  2.7: {
    title: "Mini Task (Preparation for Lesson 3)",
    content: `
        <p>Before moving forward:</p>
        <ul>
          <li>Open any simple website project</li>
          <li>Identify the HTML file, the CSS file, and the JavaScript file</li>
          <li>Try to explain what each one does in your own words</li>
        </ul>
        <p>If you can do this, you are ready for the next lesson.</p>
      `,
  },
  3.1: {
    title: "Sign In and Gather Your Tools",
    content: `
        <p>Before writing a single line of code, make sure you have the right AI tools ready and signed in:</p>
        <ul>
          <li><strong>ChatGPT:</strong> Your AI brainstorming partner.</li>
          <li><strong>Gemini Code Assist (VS Code extension):</strong> Helps you debug and suggest improvements automatically.</li>
          <li><strong>Google AI Studio:</strong> Your hands-on coding environment for structured prompts and testing.</li>
        </ul>
        <p>Optional additions: Replit AI for testing small projects online, or Copilot for extra code suggestions.</p>
        <div class="modal-tip"><strong>Simple Tip</strong> Think of this step as sharpening your pencils before starting a drawing. If your tools are ready, you’ll work smoother and faster.</div>
      `,
  },
  3.2: {
    title: "Prepare Your Workspace",
    content: `
        <p>Having the right folder structure and file setup is critical. Organize your environment before asking AI to generate code.</p>
        <h4>Steps:</h4>
        <ol>
          <li>Create a main project folder for your website. Example: <code>MyWebsite</code></li>
          <li>Inside the folder, create your essential files: <code>index.html</code> (structure), <code>style.css</code> (design), <code>script.js</code> (functionality).</li>
          <li>Keep a separate folder for assets like images and icons.</li>
          <li>Name your files clearly so AI and you always know what goes where.</li>
        </ol>
        <div class="modal-tip"><strong>Pro Tip</strong> Treat your workspace like a clean desk. AI works better in an organized environment, and so do you.</div>
      `,
  },
  3.3: {
    title: "Discuss Your Plan With ChatGPT",
    content: `
        <p>Once your environment is ready, start your first conversation with ChatGPT.</p>
        <ul>
          <li>Describe your project goal clearly.</li>
          <li>Explain the features and structure you want.</li>
          <li>Ask for suggestions or improvements.</li>
        </ul>
        <p><strong>Example prompt:</strong> “I want to build a responsive portfolio website with HTML, CSS, and JavaScript. Can you suggest how to organize sections and components for a smooth workflow?”</p>
        <p>AI will expand your plan, suggest structure improvements, and point out potential challenges. This step ensures your project starts on solid ground.</p>
      `,
  },
  3.4: {
    title: "Move to Google AI Studio for Execution",
    content: `
        <p>After planning with ChatGPT, switch to Google AI Studio for hands-on coding.</p>
        <ul>
          <li>Paste your prompts.</li>
          <li>Ask the AI to write code for each component step by step.</li>
          <li>Check its suggestions carefully.</li>
          <li>Persist until the code matches your plan.</li>
        </ul>
        <div class="modal-tip"><strong>Pro Tip</strong> AI might not always get it right the first time—treat it as a partner, not a magician. The better you understand what you want, the better the AI output.</div>
      `,
  },
  3.5: {
    title: "Use Gemini Code Assist in VS Code for Debugging",
    content: `
        <p>While coding in VS Code:</p>
        <ul>
          <li>Gemini Code Assist can catch small mistakes automatically.</li>
          <li>It gives you suggestions for fixing errors.</li>
          <li>Use it to clean up AI-generated code quickly.</li>
        </ul>
        <div class="modal-tip"><strong>Simple Tip</strong> Think of Gemini as your extra set of eyes, so you don’t waste time hunting for tiny mistakes.</div>
      `,
  },
  3.6: {
    title: "The Rhythm of AI Workflow",
    content: `
        <p>Here’s how your workflow should feel, like a rhythm:</p>
        <ul>
          <li><strong>Plan</strong> → with ChatGPT, clarify your ideas.</li>
          <li><strong>Execute</strong> → in Google AI Studio, generate small pieces of code.</li>
          <li><strong>Check & Debug</strong> → with Gemini Code Assist in VS Code.</li>
          <li><strong>Assemble</strong> → bring all parts together in your organized folder.</li>
        </ul>
        <p>Do this one component at a time. Don’t rush. AI works best when your instructions are clear and focused.</p>
      `,
  },
  3.7: {
    title: "Why This Setup Works",
    content: `
        <ul>
          <li>You have clarity before writing code.</li>
          <li>You have support from multiple AI tools.</li>
          <li>You can test and debug easily.</li>
          <li>You stay in control of the website design.</li>
        </ul>
        <p>This is exactly how professionals build with AI—they orchestrate the tools, rather than letting the tools drive them.</p>
      `,
  },
  3.8: {
    title: "Mini Task",
    content: `
        <p>Set up a small demo project using this workflow:</p>
        <ol>
          <li>Create a folder with HTML, CSS, and JS.</li>
          <li>Ask ChatGPT to suggest a simple page layout.</li>
          <li>Generate the code for one section in Google AI Studio.</li>
          <li>Check and fix issues using Gemini Code Assist.</li>
          <li>Open your page in a browser and see it working.</li>
        </ol>
        <div class="modal-tip"><strong>Goal</strong> Understand the rhythm of planning → generating → debugging → assembling.</div>
      `,
  },
  4.1: {
    title: "Why Keywords Matter",
    content: `
        <p>AI doesn’t read your mind. It only knows what you tell it.</p>
        <p>Think of prompting AI like giving directions:</p>
        <ul>
          <li>“Go north” → clear</li>
          <li>“Go somewhere” → confusing</li>
        </ul>
        <p>If you want your website to be <strong>Mobile-friendly</strong>, <strong>Clean-looking</strong>, or <strong>Interactive</strong>, you need to say it. Those are your keywords.</p>
      `,
  },
  4.2: {
    title: "Must-Have Keywords for Web Projects",
    content: `
        <p>When prompting AI to generate website code, these words help the AI understand modern best practices:</p>
        <table class="modal-table">
          <thead>
            <tr><th>Keyword</th><th>What it Means</th><th>How to Use It in Prompts</th></tr>
          </thead>
          <tbody>
            <tr><td>Responsive</td><td>Works on phones, tablets, and desktops</td><td>“Make the layout responsive so it adjusts to different screen sizes”</td></tr>
            <tr><td>Clean / Minimal</td><td>Simple, readable design</td><td>“Use a clean layout with minimal distractions”</td></tr>
            <tr><td>User-Friendly</td><td>Easy for visitors to navigate</td><td>“Create a user-friendly menu that’s easy to click on mobile”</td></tr>
            <tr><td>Interactive</td><td>Buttons, hover effects, animations</td><td>“Add interactive buttons that change color when hovered”</td></tr>
            <tr><td>Accessible</td><td>Works for all users, including those with disabilities</td><td>“Use accessible HTML so screen readers can understand the content”</td></tr>
            <tr><td>Structured / Semantic HTML</td><td>Proper use of headings, sections, and tags</td><td>“Use semantic HTML with &lt;header&gt;, &lt;main&gt;, &lt;section&gt;”</td></tr>
            <tr><td>Organized CSS</td><td>Styles separated and reusable</td><td>“Write organized CSS with clear class names”</td></tr>
            <tr><td>Lightweight / Fast</td><td>Efficient code that loads quickly</td><td>“Ensure the page is lightweight and fast-loading”</td></tr>
            <tr><td>Modern Design</td><td>Contemporary look, not outdated</td><td>“Use modern design elements with readable fonts and spacing”</td></tr>
            <tr><td>Mobile-First</td><td>Design for mobile first, then scale</td><td>“Build a mobile-first layout that adapts to larger screens”</td></tr>
          </tbody>
        </table>
        <div class="modal-tip"><strong>Pro Tip</strong> Combine keywords naturally. Example: “Create a responsive, user-friendly, and clean landing page with interactive buttons.”</div>
      `,
  },
  4.3: {
    title: "Optional Keywords to Enhance Your Prompts",
    content: `
        <p>These are extras that can make your AI output even better:</p>
        <ul>
          <li><strong>Highlight / Emphasize</strong> → for important sections</li>
          <li><strong>Consistent Colors</strong> → to maintain branding</li>
          <li><strong>Animations / Smooth transitions</strong> → for hover effects</li>
          <li><strong>Grid / Flex Layout</strong> → control layout structure</li>
          <li><strong>Reusable Components</strong> → makes building bigger websites easier</li>
          <li><strong>Tested / Debugged</strong> → ensures functional code</li>
        </ul>
        <div class="modal-tip"><strong>Pro Tip</strong> Use 1–3 optional keywords per prompt. Too many may confuse the AI.</div>
      `,
  },
  4.4: {
    title: "How to Structure Your Prompt",
    content: `
        <p>Here’s a simple formula:</p>
        <ol>
          <li><strong>Goal / Component</strong> → “I want a navigation bar”</li>
          <li><strong>Style / Behavior</strong> → “that is responsive and clean”</li>
          <li><strong>Extras / Optional Keywords</strong> → “with hover animations and user-friendly links”</li>
          <li><strong>Constraints / Do Not Do</strong> → “Do not use heavy frameworks or unnecessary libraries”</li>
        </ol>
        <p><strong>Full Example Prompt:</strong><br>“I want a responsive, clean, and user-friendly navigation bar with interactive hover effects. Use semantic HTML, organized CSS, and lightweight code. Do not use Bootstrap or any heavy framework.”</p>
        <p>This gives AI everything it needs to write professional code.</p>
      `,
  },
  4.5: {
    title: "Human Touch — Why This Works",
    content: `
        <p>Even though AI is powerful:</p>
        <ul>
          <li>It only outputs what you describe</li>
          <li>Precise words = precise code</li>
          <li>Your understanding of the site improves as you refine prompts</li>
        </ul>
        <div class="modal-tip"><strong>Think of AI as a junior developer:</strong> it can code fast, but you must guide it carefully.</div>
      `,
  },
  4.6: {
    title: "Mini Task",
    content: `
        <p>Try it out:</p>
        <ol><li>Pick a small website component (like a button, card, or header)</li><li>Write a prompt including 3–5 keywords from the must-have list</li><li>Ask AI to generate the code</li><li>Review the code line by line</li><li>Modify your prompt if the output isn’t perfect</li></ol>
        <div class="modal-tip"><strong>Goal</strong> Learn the rhythm of giving clear instructions.</div>
      `,
  },
  5.1: {
    title: "Core Structural Sections",
    content: `
            <p>Every website—whether simple or complex—needs some core building blocks. AI cannot guess these automatically, so you must specify them in your prompts.</p>
            <h4>1. Navigation Bar (Navbar)</h4>
            <p><strong>Purpose:</strong> Helps users move around your site easily.<br><strong>Contents:</strong> Logo, menu items (Home, About, Contact), search bar.</p>
            <div class="modal-tip"><strong>Prompt Tip:</strong> “Create a responsive navigation bar with a logo on the left and menu items on the right. Keywords: hover effect, sticky navbar, mobile-friendly”</div>
            
            <h4>2. Hero Section / Banner</h4>
            <p><strong>Purpose:</strong> First thing users see; communicates your main message.<br><strong>Contents:</strong> Headline, subheadline, call-to-action button, background image.</p>
            <div class="modal-tip"><strong>Prompt Tip:</strong> “Design a hero section with a catchy headline, a centered button, and a smooth background image. Keywords: responsive, full-width, attention-grabbing”</div>

            <h4>3. Contact Section / Footer</h4>
            <p><strong>Purpose:</strong> Let users reach you and see your info.<br><strong>Contents:</strong> Email, phone, address, social links.</p>
            <div class="modal-tip"><strong>Prompt Tip:</strong> “Design a clean footer with contact info and social media icons. Keywords: sticky footer, responsive”</div>
          `,
  },
  5.2: {
    title: "Essential Content Sections",
    content: `
            <p>Once the structure is set, fill your site with these essential content sections:</p>
            
            <h4>1. About / Info Section</h4>
            <p><strong>Purpose:</strong> Explain what your website or project is about.<br><strong>Keywords:</strong> clean layout, user-friendly, readable text.</p>
            
            <h4>2. Services / Features Section</h4>
            <p><strong>Purpose:</strong> Highlight what you offer.<br><strong>Keywords:</strong> hover effect, interactive, responsive grid.</p>
            
            <h4>3. Projects / Portfolio Section</h4>
            <p><strong>Purpose:</strong> Showcase work or student projects.<br><strong>Keywords:</strong> carousel optional, grid layout, clickable cards.</p>
            
            <h4>4. Testimonials / Reviews Section</h4>
            <p><strong>Purpose:</strong> Build trust with quotes and profiles.<br><strong>Keywords:</strong> slider, smooth transition, shadow effect.</p>
            
            <div class="modal-tip"><strong>Pro Tip</strong> Don't just ask for "content". Ask for specific sections like "A 3-column features section with icon cards".</div>
          `,
  },
  5.3: {
    title: "Design Keywords to Guide AI",
    content: `
            <p>Once you know what sections are needed, guide AI with design keywords to improve visuals and interactivity.</p>
            <table class="modal-table">
              <thead>
                <tr><th>Keyword</th><th>Purpose / Effect</th><th>Example Use in Prompt</th></tr>
              </thead>
              <tbody>
                <tr><td>Carousel / Slider</td><td>Showcase multiple images in a moving frame</td><td>“Add a responsive carousel with 5 images in the hero section”</td></tr>
                <tr><td>Hover Effect</td><td>Change style when user hovers</td><td>“Add hover effect to buttons so they change color smoothly”</td></tr>
                <tr><td>Shadow / Drop Shadow</td><td>Gives depth to elements</td><td>“Add a soft shadow behind cards for depth”</td></tr>
                <tr><td>Gradient</td><td>Smooth color transitions</td><td>“Use a light blue gradient for the hero background”</td></tr>
                <tr><td>Rounded Corners</td><td>Softens edges</td><td>“Make all buttons with rounded corners for a modern look”</td></tr>
                <tr><td>Smooth Scroll</td><td>Animation when clicking links</td><td>“Implement smooth scroll from navbar to sections”</td></tr>
                <tr><td>Sticky / Fixed</td><td>Stays visible while scrolling</td><td>“Make the navbar sticky at the top”</td></tr>
                <tr><td>Responsive</td><td>Adjusts for mobile/desktop</td><td>“Ensure all sections are responsive”</td></tr>
                <tr><td>Grid / Flex Layout</td><td>Organize elements neatly</td><td>“Use a grid layout for the features section”</td></tr>
                <tr><td>Interactive Elements</td><td>Buttons, clickable images</td><td>“Make project cards interactive so they expand on hover”</td></tr>
              </tbody>
            </table>
            <div class="modal-tip"><strong>Pro Tip</strong> Combine section + keywords. Example: “Create a responsive 3-column features section with hover effect, soft shadows, and clean spacing between cards.”</div>
          `,
  },
  5.4: {
    title: "Why This Lesson Matters",
    content: `
            <p>Students often make this mistake: <em>“I want a beautiful website”</em>.</p>
            <p>AI needs more than that. By knowing:</p>
            <ul>
              <li>Which sections are essential</li>
              <li>Which design effects to use</li>
            </ul>
            <p>Students can write precise prompts, get better code, and avoid messy websites.</p>
            <div class="modal-tip"><strong>Remember</strong> AI is a tool. It builds what you describe, not what you imagine. Describe it well.</div>
          `,
  },
  5.5: {
    title: "Mini Task",
    content: `
            <p>Pick one section, like the features section.</p>
            <ol>
              <li>Write a prompt including: Section type (e.g., “features section”)</li>
              <li>Include 2–3 design keywords (e.g., hover effect, responsive, shadow)</li>
              <li>Ask your AI to generate the code</li>
              <li>Check it, tweak your prompt if needed</li>
            </ol>
            <div class="modal-tip"><strong>Goal</strong> Practice combining structure + keywords. This is the foundation of professional prompting.</div>
          `,
  },
  6.1: {
    title: "Understanding Design Prompting",
    content: `
            <p>When prompting AI for design, you are not just asking for “A website”. You are asking for: What section, How it should look, and How it should behave.</p>
            <h4>The Formula</h4>
            <p><strong>Section + Layout + Visual Effect + Interaction + Responsiveness</strong></p>
            <div class="modal-tip"><strong>Example Prompt:</strong> “Create a responsive hero section with a background image, smooth fade-in animation, and a call-to-action button with hover effect.”</div>
          `,
  },
  6.2: {
    title: "Carousel / Slider",
    content: `
            <p>A carousel is used to display multiple items in one space. Common types include Image Carousels (banners), Content Carousels (testimonials), and Card Carousels.</p>
            <h4>Useful Keywords</h4>
            <ul>
              <li>auto-play</li>
              <li>loop</li>
              <li>smooth transition</li>
              <li>navigation arrows</li>
              <li>pagination dots</li>
              <li>touch-friendly</li>
            </ul>
            <div class="modal-tip"><strong>Prompt Example:</strong> “Design a testimonial carousel with text cards, profile images, and auto-slide every 5 seconds.”</div>
          `,
  },
  6.3: {
    title: "Hover Effects",
    content: `
            <p>A hover effect happens when a user places the mouse on an element. It signals interactivity.</p>
            <h4>Common Types</h4>
            <ul>
              <li><strong>Color Change:</strong> Button or text changes color.</li>
              <li><strong>Scale Effect:</strong> Element slightly enlarges.</li>
              <li><strong>Shadow on Hover:</strong> Shadow appears or deepens.</li>
            </ul>
            <div class="modal-tip"><strong>Prompt Example:</strong> “Create interactive cards with hover effects including scale, shadow, and color transition.”</div>
          `,
  },
  6.4: {
    title: "Shadow Effects",
    content: `
            <p>Shadows make elements look real and clickable. They add depth to your modern design.</p>
            <h4>Types of Shadows</h4>
            <ul>
              <li><strong>Soft shadow:</strong> Clean and minimal.</li>
              <li><strong>Deep shadow:</strong> Bold, eye-catching.</li>
              <li><strong>Hover shadow:</strong> Appears only on interaction.</li>
            </ul>
            <div class="modal-tip"><strong>Keywords:</strong> box-shadow, soft shadow, elevated card, depth effect.</div>
          `,
  },
  6.5: {
    title: "Animations & Transitions",
    content: `
            <p>Animations make websites feel alive. They guide the user's eye and smooth out interactions.</p>
            <h4>Common Types</h4>
            <ul>
              <li><strong>Fade-In:</strong> Element appears gradually.</li>
              <li><strong>Slide-In:</strong> Element slides from left/right.</li>
              <li><strong>Smooth Transitions:</strong> Makes hover effects look clean.</li>
            </ul>
            <div class="modal-tip"><strong>Keywords:</strong> ease-in-out, smooth animation, on scroll animation, micro-interactions.</div>
          `,
  },
  6.6: {
    title: "Layout Keywords",
    content: `
            <p>These help AI structure content properly.</p>
            <table class="modal-table"><thead><tr><th>Keyword</th><th>Meaning</th></tr></thead><tbody><tr><td>Grid layout</td><td>Organizes items in rows and columns</td></tr><tr><td>Flexbox</td><td>Aligns items dynamically</td></tr><tr><td>Centered content</td><td>Aligns content to the middle</td></tr><tr><td>Full-width section</td><td>Spans entire screen</td></tr><tr><td>Spacing / Padding</td><td>Controls white space</td></tr></tbody></table>
            <div class="modal-tip"><strong>Prompt Example:</strong> “Use a grid layout with proper spacing and padding for the features section.”</div>
          `,
  },
  6.7: {
    title: "Responsive & Mobile Design",
    content: `
            <p>Never forget responsiveness. Ensure your site works on all devices.</p>
            <h4>Must-Use Keywords</h4>
            <ul><li>responsive design</li><li>mobile-first</li><li>tablet-friendly</li><li>adaptive layout</li><li>breakpoints</li></ul>
            <div class="modal-tip"><strong>Prompt Example:</strong> “Ensure the entire website is responsive and mobile-first with clean layout on all screen sizes.”</div>
          `,
  },
  6.8: {
    title: "Combining Everything",
    content: `
            <p>Here’s how a professional-level prompt looks:</p>
            <p><em>“Create a responsive landing page with a sticky navigation bar, a hero section containing a background image and call-to-action button, a features section using a grid layout with hover scale and shadow effects, a testimonial carousel with smooth transitions, and a clean footer. Use modern UI design, smooth animations, and mobile-first responsiveness.”</em></p>
            <div class="modal-tip">This is how real developers prompt AI.</div>
          `,
  },
  6.9: {
    title: "Connection to Teaching Style",
    content: `
            <p>This lesson fits perfectly with how you work:</p>
            <ol><li>You plan what to build</li><li>You understand the structure</li><li>You describe it clearly to ChatGPT</li><li>You refine it in Google AI Studio</li><li>Gemini Code Assist helps debug in VS Code</li></ol>
            <div class="modal-tip">Students are learning how to think, not just copy code.</div>
          `,
  },
  7.1: {
    title: "The Core Truth About Prompting",
    content: `
            <p>AI is not a mind reader. AI is a high-speed junior developer. If you are vague, it will guess. If you are clear, it will perform.</p>
            <ul>
              <li><strong>Bad prompt:</strong> “Build me a website.”</li>
              <li><strong>Good prompt:</strong> “Create a responsive landing page with a navigation bar, hero section, feature cards, and footer. Use clean design and modern layout.”</li>
            </ul>
            <div class="modal-tip">Prompting is project management, not magic.</div>
          `,
  },
  7.2: {
    title: "The Professional Prompting Framework",
    content: `
            <p>Every real-world prompt should follow this structure:</p>
            <ol>
              <li><strong>Context:</strong> Tell the AI what you are building and why.</li>
              <li><strong>Scope:</strong> Tell the AI what part to build now.</li>
              <li><strong>Structure:</strong> List the sections clearly.</li>
              <li><strong>Behavior:</strong> Explain how things should work or respond.</li>
              <li><strong>Responsiveness:</strong> Always include this.</li>
              <li><strong>Output Expectation:</strong> Tell the AI exactly what to return.</li>
            </ol>
            <div class="modal-tip">Never ask for the whole project at once.</div>
          `,
  },
  7.3: {
    title: "From Idea → Prompt (Real Example)",
    content: `
            <p><strong>Step 1: Idea in Your Head</strong><br>“I want a modern learning website.” (This is not a prompt.)</p>
            <p><strong>Step 2: Clarify the Idea</strong><br>Ask yourself: Who is it for? What is the main action? What sections are needed?</p>
            <p><strong>Step 3: Turn It Into a Real Prompt</strong><br>“I am building a student learning platform. Create a responsive homepage with a navigation bar, a hero section introducing the platform, a lessons section using cards, a project showcase section, and a footer. Use modern design, clean spacing, smooth hover effects, and mobile-first responsiveness. Return separate HTML, CSS, and JavaScript.”</p>
            <div class="modal-tip">This is professional-level prompting.</div>
          `,
  },
  7.4: {
    title: "Prompting in Small, Powerful Steps",
    content: `
            <p>Never say: “Build my entire website with login, dashboard, projects, admin panel, and database.”</p>
            <h4>Step-by-Step Prompting Flow</h4>
            <ul>
              <li><strong>Layout only:</strong> “Create the page layout without functionality.”</li>
              <li><strong>Styling:</strong> “Improve the UI with modern styling and spacing.”</li>
              <li><strong>Interaction:</strong> “Add hover effects and basic animations.”</li>
              <li><strong>Logic:</strong> “Add JavaScript to handle form submission.”</li>
              <li><strong>Refinement:</strong> “Optimize the code and remove unnecessary parts.”</li>
            </ul>
            <div class="modal-tip">This is how real products are built.</div>
          `,
  },
  7.5: {
    title: "Asking AI the Right Way",
    content: `
            <p>Do not say: “This code is bad.”</p>
            <p>Say: “The button does not respond when clicked. The console shows this error. Please fix it.”</p>
            <p>AI performs best when you provide feedback, provide errors, and provide expected behavior.</p>
            <div class="modal-tip">You are leading the AI.</div>
          `,
  },
  7.6: {
    title: "Iterating With AI",
    content: `
            <p>Prompting is a conversation. Example flow:</p>
            <ol>
              <li>“Build the navbar.”</li>
              <li>“Make it sticky.”</li>
              <li>“Improve spacing.”</li>
              <li>“Add hover animation.”</li>
              <li>“Optimize for mobile.”</li>
            </ol>
            <div class="modal-tip">Each prompt builds on the previous one. Never restart unless necessary.</div>
          `,
  },
  7.7: {
    title: "Using Multiple AI Tools Together",
    content: `
            <p>Professionals use systems, not single tools.</p>
            <ul>
              <li><strong>ChatGPT:</strong> Planning, Structuring, Explaining code.</li>
              <li><strong>Google AI Studio:</strong> Deep focus on logic, Careful prompt refinement.</li>
              <li><strong>Gemini Code Assist (VS Code):</strong> Error detection, Code suggestions, Inline fixes.</li>
            </ul>
            <div class="modal-tip">Each tool has a role.</div>
          `,
  },
  7.8: {
    title: "Common Prompting Mistakes",
    content: `
            <p>Avoid these mistakes:</p>
            <ul><li>Asking for too much at once</li><li>Not specifying responsiveness</li><li>Copy-pasting without understanding</li><li>Ignoring errors</li><li>Not reading generated code</li></ul>
            <div class="modal-tip">AI is powerful, but undisciplined use creates fragile code.</div>
          `,
  },
  7.9: {
    title: "Final Example: End-to-End Real Prompt",
    content: `
            <p>This is a complete, real-world prompt:</p>
            <p><em>“I am building a responsive learning platform for students. Create the homepage layout with a navigation bar containing a logo and menu links, a hero section with headline and call-to-action button, a lessons section using cards, a project showcase carousel, and a clean footer. Use modern UI design, smooth hover effects, proper spacing, and mobile-first responsiveness. Return clean HTML, CSS, and JavaScript separately. Do not include unnecessary libraries.”</em></p>
            <div class="modal-tip">This is how developers communicate with AI.</div>
          `,
  },
  7.1: {
    title: "The Core Truth About Prompting",
    content: `
            <p>AI is not a mind reader. AI is a high-speed junior developer. If you are vague, it will guess. If you are clear, it will perform.</p>
            <ul>
              <li><strong>Bad prompt:</strong> “Build me a website.”</li>
              <li><strong>Good prompt:</strong> “Create a responsive landing page with a navigation bar, hero section, feature cards, and footer. Use clean design and modern layout.”</li>
            </ul>
            <div class="modal-tip">Prompting is project management, not magic.</div>
          `,
  },
  7.2: {
    title: "The Professional Prompting Framework",
    content: `
            <p>Every real-world prompt should follow this structure:</p>
            <ol>
              <li><strong>Context:</strong> Tell the AI what you are building and why.</li>
              <li><strong>Scope:</strong> Tell the AI what part to build now.</li>
              <li><strong>Structure:</strong> List the sections clearly.</li>
              <li><strong>Behavior:</strong> Explain how things should work or respond.</li>
              <li><strong>Responsiveness:</strong> Always include this.</li>
              <li><strong>Output Expectation:</strong> Tell the AI exactly what to return.</li>
            </ol>
            <div class="modal-tip">Never ask for the whole project at once.</div>
          `,
  },
  7.3: {
    title: "From Idea → Prompt (Real Example)",
    content: `
            <p><strong>Step 1: Idea in Your Head</strong><br>“I want a modern learning website.” (This is not a prompt.)</p>
            <p><strong>Step 2: Clarify the Idea</strong><br>Ask yourself: Who is it for? What is the main action? What sections are needed?</p>
            <p><strong>Step 3: Turn It Into a Real Prompt</strong><br>“I am building a student learning platform. Create a responsive homepage with a navigation bar, a hero section introducing the platform, a lessons section using cards, a project showcase section, and a footer. Use modern design, clean spacing, smooth hover effects, and mobile-first responsiveness. Return separate HTML, CSS, and JavaScript.”</p>
            <div class="modal-tip">This is professional-level prompting.</div>
          `,
  },
  7.4: {
    title: "Prompting in Small, Powerful Steps",
    content: `
            <p>Never say: “Build my entire website with login, dashboard, projects, admin panel, and database.”</p>
            <h4>Step-by-Step Prompting Flow</h4>
            <ul>
              <li><strong>Layout only:</strong> “Create the page layout without functionality.”</li>
              <li><strong>Styling:</strong> “Improve the UI with modern styling and spacing.”</li>
              <li><strong>Interaction:</strong> “Add hover effects and basic animations.”</li>
              <li><strong>Logic:</strong> “Add JavaScript to handle form submission.”</li>
              <li><strong>Refinement:</strong> “Optimize the code and remove unnecessary parts.”</li>
            </ul>
            <div class="modal-tip">This is how real products are built.</div>
          `,
  },
  7.5: {
    title: "Asking AI the Right Way",
    content: `
            <p>Do not say: “This code is bad.”</p>
            <p>Say: “The button does not respond when clicked. The console shows this error. Please fix it.”</p>
            <p>AI performs best when you provide feedback, provide errors, and provide expected behavior.</p>
            <div class="modal-tip">You are leading the AI.</div>
          `,
  },
  7.6: {
    title: "Iterating With AI",
    content: `
            <p>Prompting is a conversation. Example flow:</p>
            <ol>
              <li>“Build the navbar.”</li>
              <li>“Make it sticky.”</li>
              <li>“Improve spacing.”</li>
              <li>“Add hover animation.”</li>
              <li>“Optimize for mobile.”</li>
            </ol>
            <div class="modal-tip">Each prompt builds on the previous one. Never restart unless necessary.</div>
          `,
  },
  7.7: {
    title: "Using Multiple AI Tools Together",
    content: `
            <p>Professionals use systems, not single tools.</p>
            <ul>
              <li><strong>ChatGPT:</strong> Planning, Structuring, Explaining code.</li>
              <li><strong>Google AI Studio:</strong> Deep focus on logic, Careful prompt refinement.</li>
              <li><strong>Gemini Code Assist (VS Code):</strong> Error detection, Code suggestions, Inline fixes.</li>
            </ul>
            <div class="modal-tip">Each tool has a role.</div>
          `,
  },
  7.8: {
    title: "Common Prompting Mistakes",
    content: `
            <p>Avoid these mistakes:</p>
            <ul><li>Asking for too much at once</li><li>Not specifying responsiveness</li><li>Copy-pasting without understanding</li><li>Ignoring errors</li><li>Not reading generated code</li></ul>
            <div class="modal-tip">AI is powerful, but undisciplined use creates fragile code.</div>
          `,
  },
  7.9: {
    title: "Final Example: End-to-End Real Prompt",
    content: `
            <p>This is a complete, real-world prompt:</p>
            <p><em>“I am building a responsive learning platform for students. Create the homepage layout with a navigation bar containing a logo and menu links, a hero section with headline and call-to-action button, a lessons section using cards, a project showcase carousel, and a clean footer. Use modern UI design, smooth hover effects, proper spacing, and mobile-first responsiveness. Return clean HTML, CSS, and JavaScript separately. Do not include unnecessary libraries.”</em></p>
            <div class="modal-tip">This is how developers communicate with AI.</div>
          `,
  },
  "7.10": {
    title: "Final Mindset Shift",
    content: `
            <p>AI does not build websites. You do.</p>
            <p>AI speeds you up, expands your thinking, and helps debug. But you decide structure, judge quality, and control direction.</p>
            <div class="modal-tip">If you can explain it clearly, you can build anything.</div>
          `,
  },
};

// MODAL LOGIC
function openMethod(btn) {
  const card = btn.parentElement;
  const num = card.querySelector(".method-num").innerText;
  const data = methodData[num];

  if (data) {
    const modalBody = document.getElementById("modal-body-content");
    modalBody.innerHTML = `
            <div style="margin-bottom:10px; font-size:4rem; font-weight:800; opacity:0.1; line-height:1;">${num}</div>
            <h3>${data.title}</h3>
            ${data.content}
          `;

    document.getElementById("methodModal").classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeMethod() {
  document.getElementById("methodModal").classList.remove("active");
  document.body.style.overflow = "auto";
}

// BACK TO TOP
const btn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) btn.classList.add("visible");
  else btn.classList.remove("visible");
});
btn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ROBOT ANIMATION
(function () {
  const robotScene = document.getElementById("robot-scene");
  const pupilL = document.getElementById("pupil-l");
  const pupilR = document.getElementById("pupil-r");
  if (!robotScene) return;
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let tilt = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("deviceorientation", (e) => {
    tilt.x = e.gamma || 0;
    tilt.y = e.beta || 0;
  });
  function animateRobot() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const targetX = (mouse.x - centerX) / centerX + tilt.x / 45;
    const targetY = (mouse.y - centerY) / centerY + (tilt.y / 45 - 1);
    current.x += (targetX - current.x) * 0.1;
    current.y += (targetY - current.y) * 0.1;
    const pX = current.x * 10;
    const pY = current.y * 8;
    if (pupilL) pupilL.setAttribute("transform", `translate(${pX}, ${pY})`);
    if (pupilR) pupilR.setAttribute("transform", `translate(${pX}, ${pY})`);
    if (robotScene)
      robotScene.style.transform = `rotateY(${current.x * 15}deg) rotateX(${
        -current.y * 15
      }deg)`;
    requestAnimationFrame(animateRobot);
  }
  animateRobot();
})();
