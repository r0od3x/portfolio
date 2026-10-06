// All site copy lives here. Facts come from the CV and github.com/r0od3x.

export const profile = {
  name: "Mohamed Reda Ghalbi",
  firstName: "Reda",
  lastName: "Ghalbi",
  role: "AI & Data Science Engineering Student",
  location: "Casablanca, Morocco",
  timeZone: "Africa/Casablanca",
  school: "EMSI Casablanca",
  email: "ghalbimohamedreda@gmail.com",
  availability: "Open to a PFE or internship, 2026–27",
  socials: {
    github: "https://github.com/r0od3x",
    linkedin: "https://www.linkedin.com/in/mohamed-reda-ghalbi-941b1126b/",
    resume: "/resume.pdf",
  },
};

export const about = {
  // Rendered with a scroll-driven reading effect; *asterisks* mark serif accents.
  statement:
    "Most of what I build starts in a notebook and ends somewhere less *glamorous*: an API, a mobile app, a pipeline that runs every night. I've done that for FedEx, for a paper & cardboard manufacturer, and this summer for a *bank*. Off the keyboard I'm on a judo mat. I took silver at the national Coupe du Trône in 2024, and I referee now too.",
  facts: [
    { label: "Based in", value: "Casablanca, Morocco", note: "GMT+1" },
    { label: "Studying", value: "AI & Data Science engineering, EMSI", note: "2022 → 2027" },
    { label: "Speaks", value: "Arabic, French, English", note: "+ a little German" },
    { label: "Off-screen", value: "Judoka & referee", note: "Silver, Coupe du Trône '24" },
  ],
};

export const marqueeWords = [
  "Computer vision",
  "LLM agents",
  "Forecasting",
  "Data pipelines",
  "Full-stack",
  "Deep learning",
];

export type SkillGroup = { id: string; title: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  { id: "dl", title: "Deep learning", skills: ["PyTorch", "EfficientNet", "ResNet", "Multi-task regression", "Deep Q-Learning", "OpenCV"] },
  { id: "ai", title: "LLMs & agents", skills: ["LangGraph", "LangChain", "RAG", "ChromaDB", "OpenAI & Claude APIs", "MCP"] },
  { id: "ml", title: "ML & data", skills: ["Scikit-learn", "Pandas", "NumPy", "Time-series forecasting", "Matplotlib", "Seaborn"] },
  { id: "data", title: "Data engineering", skills: ["SQL", "PostgreSQL", "MongoDB", "ETL pipelines", "Tesseract OCR"] },
  { id: "backend", title: "Backend", skills: ["Python", "FastAPI", "Flask", "Node / Express", "ASP.NET Core", "Laravel"] },
  { id: "frontend", title: "Interfaces", skills: ["React", "Flutter", "React Native", "Streamlit", "HTML / CSS"] },
  { id: "tools", title: "Daily tools", skills: ["Git", "Linux", "Jupyter", "Google Colab", "Kaggle"] },
];

export type Figure = "nutrivision" | "medai" | "customs" | "sugarsight";

export type Project = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  context: string;
  year: string;
  figure: Figure;
  figureCaption: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "nutrivision-ai",
    index: "01",
    name: "NutriVision AI",
    tagline: "Calories and macros from one photo of a meal.",
    description:
      "A fine-tuned EfficientNet-B3 that looks at a dish and predicts calories, mass, protein, fat and carbs directly, with no food database lookup. FastAPI serves it; a Flutter app puts it in your hand.",
    highlights: [
      "Multi-task regression head on Nutrition5K (lab-measured cafeteria dishes)",
      "Huber loss, warm-up + cosine schedule, selective fine-tuning of the backbone",
      "LLM-written nutrition coaching on top of the predictions",
    ],
    stack: ["PyTorch", "EfficientNet-B3", "FastAPI", "Flutter"],
    metrics: [
      { label: "Calorie MAE, Nutrition5K", value: "36.4 kcal" },
      { label: "vs. Google Research baseline", value: "−17.3%" },
    ],
    context: "Academic · team of 2",
    year: "2026",
    figure: "nutrivision",
    figureCaption: "Photo in, five numbers out",
    repo: "https://github.com/r0od3x/NutriVision-AI",
  },
  {
    slug: "medai",
    index: "02",
    name: "MedAI",
    tagline: "Medical pre-consultation, run by a team of agents.",
    description:
      "A LangGraph pipeline where a triage agent interviews the patient, a doctor validates and prescribes, and a synthesis agent writes the report. The doctor stays in the loop for every decision.",
    highlights: [
      "Orchestrator → triage → doctor validation → synthesis, with shared state",
      "Adaptive questionnaire; LLM flags symptoms, hypotheses and red flags",
      "FastAPI backend, Streamlit UI, resumable consultation history",
    ],
    stack: ["LangGraph", "LangChain", "OpenAI", "FastAPI", "Streamlit"],
    metrics: [
      { label: "Agents in the graph", value: "4" },
      { label: "Human in the loop", value: "Always" },
    ],
    context: "Academic",
    year: "2026",
    figure: "medai",
    figureCaption: "One consultation, four hand-offs",
    repo: "https://github.com/r0od3x/projet_agentic_med_ai",
  },
  {
    slug: "customs",
    index: "03",
    name: "Customs certificates",
    tagline: "A folder of PDFs becomes a finished certificate.",
    description:
      "Built during my internship at GPC, a paper & cardboard manufacturer. It reads product sheets and invoices, computes paper weights, allocates them against customs declarations and fills in the paperwork.",
    highlights: [
      "pdfminer for native text, Tesseract OCR fallback for scans",
      "FIFO allocation against the declarations ledger in PostgreSQL",
      "Certificates generated from Excel templates, exported to XLSX + PDF",
    ],
    stack: ["Python", "Tesseract", "PostgreSQL", "CustomTkinter", "xlwings"],
    metrics: [
      { label: "Input", value: "PDF folder" },
      { label: "Output", value: "XLSX + PDF" },
    ],
    context: "Internship · GPC",
    year: "2025",
    figure: "customs",
    figureCaption: "Scan, extract, allocate, print",
    repo: "https://github.com/r0od3x/gestionfacture",
  },
  {
    slug: "sugarsight",
    index: "04",
    name: "SugarSight",
    tagline: "Diabetes risk from eight numbers.",
    description:
      "A Random Forest trained on the Pima Indians dataset, served through FastAPI as a web form and a REST endpoint, with LLM-written replies to user feedback.",
    highlights: [
      "Engineered features from Glucose × BMI ratios",
      "Documented POST /predict endpoint for other apps",
      "Environment-based config, no secrets in code",
    ],
    stack: ["Scikit-learn", "FastAPI", "OpenAI API", "GSAP"],
    metrics: [
      { label: "Test accuracy", value: "~81%" },
      { label: "Input features", value: "8" },
    ],
    context: "Academic",
    year: "2025",
    figure: "sugarsight",
    figureCaption: "Eight indicators, one forest, one answer",
    repo: "https://github.com/r0od3x/SugarSight",
  },
];

export type MiniProject = {
  name: string;
  description: string;
  stack: string;
  year: string;
  repo: string;
};

export const archive: MiniProject[] = [
  {
    name: "Snake, Deep Q-Learning",
    description: "An agent that teaches itself Snake. Averages ~30 points a game.",
    stack: "PyTorch · Pygame",
    year: "2026",
    repo: "https://github.com/r0od3x/snake-ai-dqn",
  },
  {
    name: "Agentic RAG labs",
    description: "Prompting → RAG over PDFs → tool-calling agents.",
    stack: "LangGraph · ChromaDB",
    year: "2026",
    repo: "https://github.com/r0od3x/TP_multiai",
  },
  {
    name: "Renting",
    description: "Airbnb-style platform: renters, sellers, admins, JWT roles.",
    stack: "ASP.NET Core · MongoDB · React",
    year: "2025",
    repo: "https://github.com/r0od3x/rentingsite",
  },
  {
    name: "Casa Dojo",
    description: "Roster, belts and payments for a real judo club.",
    stack: "React · Express",
    year: "2025",
    repo: "https://github.com/r0od3x/casadojo",
  },
  {
    name: "Iaido scoreboard",
    description: "Keyboard-driven tournament scoreboard, solo and team.",
    stack: "Python · Tkinter",
    year: "2025",
    repo: "https://github.com/r0od3x/iaido-scoreboard",
  },
  {
    name: "HM-Helper API",
    description: "Laravel mock of remote brand servers, with tests.",
    stack: "Laravel · PHPUnit",
    year: "2025",
    repo: "https://github.com/r0od3x/php-api",
  },
];

export type TimelineItem = {
  date: string;
  year: string;
  title: string;
  org: string;
  description: string;
  points?: string[];
  stack?: string[];
  kind: "work" | "education" | "milestone";
};

// Chronological: from the start of the degree to now.
export const timeline: TimelineItem[] = [
  {
    date: "Sep 2022",
    year: "2022",
    title: "Started engineering school",
    org: "EMSI Casablanca",
    kind: "education",
    description: "Computer Science engineering, later specialising in AI & Data Science. Elected class delegate.",
  },
  {
    date: "2024",
    year: "2024",
    title: "Silver, Coupe du Trône",
    org: "National judo championship",
    kind: "milestone",
    description: "Second place nationally. These days I also referee.",
  },
  {
    date: "Jul – Aug 2024",
    year: "2024",
    title: "Data & Analytics Intern",
    org: "FedEx",
    kind: "work",
    description: "HR attendance analytics and automated KPI reporting.",
    points: ["Attendance analytics app on Flask + PostgreSQL", "HR KPI reports generated through a REST API"],
    stack: ["Flask", "PostgreSQL", "REST"],
  },
  {
    date: "2025",
    year: "2025",
    title: "Organiser, 11th Careers Forum",
    org: "EMSI Casablanca",
    kind: "milestone",
    description: "Logistics, partners and student outreach for the school's biggest event.",
  },
  {
    date: "Jul – Aug 2025",
    year: "2025",
    title: "Data & AI Automation Intern",
    org: "GPC, Gharb Papier et Carton",
    kind: "work",
    description: "Automated the data flows of a paper & cardboard manufacturer.",
    points: [
      "ETL from PDF, Excel, XML and REST into PostgreSQL",
      "Tesseract OCR for scanned production documents",
      "Real-time dashboards on top of it all",
    ],
    stack: ["Python", "PostgreSQL", "Tesseract"],
  },
  {
    date: "Jul – Aug 2026",
    year: "2026",
    title: "Data Science & AI Intern",
    org: "Crédit du Maroc",
    kind: "work",
    description: "Forecasting a bank's cash inflows and outflows for budget monitoring.",
    points: [
      "Cleaned and shaped historical financial data",
      "ML pipeline forecasting inflows and outflows",
      "Lag features to sharpen the forecasts",
    ],
    stack: ["Python", "Pandas", "Scikit-learn"],
  },
  {
    date: "Now",
    year: "Now",
    title: "Final year",
    org: "2026 → 2027",
    kind: "milestone",
    description: "Looking for an end-of-studies project (PFE) or internship in ML, computer vision or data.",
  },
];

export const education = [
  { year: "2022 → 27", title: "Engineering degree, Computer Science (AI & Data Science)", place: "EMSI Casablanca" },
  { year: "2026", title: "Deep Learning Specialization, 5 courses", place: "DeepLearning.AI" },
  { year: "2024", title: "CS50x: Introduction to Computer Science", place: "HarvardX" },
  { year: "2024", title: "Agile Project Management", place: "Google" },
  { year: "2022", title: "Baccalaureate, Physical Sciences", place: "Morocco" },
];

export const contact = {
  title: "Let's talk.",
  description:
    "I'm looking for an end-of-studies project (PFE) or an internship in machine learning, computer vision or data, for 2026–27. Email is the fastest way to reach me.",
};
