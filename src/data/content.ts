export const profile = {
  name: "Mohamed Reda Ghalbi",
  firstName: "Reda",
  role: "AI & Data Science Engineering Student",
  location: "Casablanca, Morocco",
  education: "Engineering degree in Computer Science, AI & Data Science track",
  school: "EMSI Casablanca",
  email: "ghalbimohamedreda@gmail.com",
  socials: {
    github: "https://github.com/r0od3x",
    linkedin: "https://www.linkedin.com/in/mohamed-reda-ghalbi-941b1126b/",
    resume: "/resume.pdf",
  },
  languages: [
    { name: "Arabic", level: "Native" },
    { name: "French", level: "Fluent" },
    { name: "English", level: "Fluent" },
    { name: "German", level: "Beginner" },
  ],
};

// Same lines as the typing banner on github.com/r0od3x.
export const terminalLines = [
  "building ML models, LLM agents & apps",
  "training neural networks that see food",
  "orchestrating LLM agents with LangGraph",
  "shipping full-stack web & mobile apps",
  "teaching a snake to play itself",
];

export const heroMetrics = [
  {
    value: 36.4,
    suffix: " kcal",
    label: "Calorie MAE on Nutrition5K, 17.3% below Google Research's baseline",
  },
  { value: 3, suffix: "", label: "Industry internships: banking, manufacturing, logistics" },
  { value: 5, suffix: "", label: "DeepLearning.AI deep learning courses completed" },
];

export type SkillGroup = {
  id: string;
  title: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend & Mobile",
    skills: ["React", "JavaScript", "HTML / CSS", "Flutter", "React Native", "Streamlit"],
  },
  {
    id: "ai",
    title: "LLMs & Agents",
    skills: ["LangGraph", "LangChain", "RAG", "ChromaDB", "OpenAI API", "Claude API", "Prompt Engineering"],
  },
  {
    id: "dl",
    title: "Deep Learning",
    skills: ["PyTorch", "EfficientNet", "ResNet", "Multi-task Regression", "Deep Q-Learning", "OpenCV"],
  },
  {
    id: "ml",
    title: "Machine Learning & Data",
    skills: ["Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Time-series Forecasting"],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    skills: ["Python", "FastAPI", "Flask", "Node.js / Express", "ASP.NET Core", "Laravel", "REST APIs"],
  },
  {
    id: "databases",
    title: "Data Engineering",
    skills: ["SQL", "PostgreSQL", "MongoDB", "ETL Pipelines", "OCR (Tesseract)", "XML"],
  },
  {
    id: "tools",
    title: "Tools",
    skills: ["Git", "Linux", "Google Colab", "Kaggle", "Jupyter"],
  },
];

export type Project = {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  approach: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  context: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "nutrivision-ai",
    index: "01",
    name: "NutriVision AI",
    tagline: "Calories and macros from a single food photo",
    description:
      "A deep learning system that looks at a photo of a meal and directly predicts its calories, mass, protein, fat and carbohydrates, with no food-database lookup. Served by a FastAPI backend and used from a Flutter mobile app.",
    problem:
      "Food logging is tedious enough that most people give up within weeks. Most of that friction comes from manual entry, so the goal was to get a nutrition estimate from one photo.",
    approach: [
      "Fine-tuned an ImageNet-pretrained EfficientNet-B3 with a multi-task regression head on Nutrition5K (lab-measured cafeteria dishes)",
      "Huber loss on z-score-normalised targets, AdamW, warm-up + cosine schedule, then selective fine-tuning of the last 100 backbone layers",
      "Served the model behind a FastAPI /predict endpoint consumed by a Flutter camera/gallery app",
      "Added LLM-generated nutrition coaching (Claude / GPT-4) on top of the predictions",
    ],
    stack: ["PyTorch", "EfficientNet-B3", "FastAPI", "Flutter", "LLM APIs"],
    metrics: [
      { label: "Calorie MAE on Nutrition5K", value: "36.4 kcal" },
      { label: "vs. Google Research baseline (44.0)", value: "−17.3%" },
    ],
    context: "Academic project · Team of 2 · 2026",
    repo: "https://github.com/r0od3x/NutriVision-AI",
  },
  {
    slug: "medai",
    index: "02",
    name: "MedAI: Multi-Agent Pre-Consultation",
    tagline: "LangGraph agents for triage, validation and reporting",
    description:
      "An AI-assisted medical pre-consultation platform built as a multi-agent LangGraph pipeline: a triage agent interviews the patient, a doctor validates and prescribes, and a synthesis agent writes the final report.",
    problem:
      "Consultations lose time on intake: collecting symptoms and writing up notes. The aim was to automate that part while keeping a doctor in the loop for every decision.",
    approach: [
      "Orchestrator → triage → doctor-validation → synthesis graph with shared consultation state in LangGraph",
      "Adaptive questionnaire and LLM clinical analysis: key symptoms, hypotheses, red flags, initial care",
      "FastAPI backend with Swagger docs and a Streamlit interface, plus resumable consultation history",
      "Medical resource hub exposed through an MCP module",
    ],
    stack: ["LangGraph", "LangChain", "OpenAI", "FastAPI", "Streamlit", "MCP"],
    metrics: [
      { label: "Agents in the pipeline", value: "4" },
      { label: "Human-in-the-loop", value: "Doctor validation" },
    ],
    context: "Academic project · 2026",
    repo: "https://github.com/r0od3x/projet_agentic_med_ai",
  },
  {
    slug: "gestion-facture",
    index: "03",
    name: "Customs Certificate Automation",
    tagline: "OCR + PostgreSQL desktop app for a paper & cardboard manufacturer",
    description:
      "A Windows desktop application built during my internship at GPC that turns a folder of product sheets and invoices (PDF) into finished customs certificates, replacing a manual, spreadsheet-driven process.",
    problem:
      "Preparing temporary-admission customs certificates meant reading PDFs by hand, computing paper composition and weights, and allocating quantities against customs declarations. It was slow and easy to get wrong.",
    approach: [
      "Extraction pipeline: native PDF text via pdfminer, Tesseract OCR fallback for scanned documents",
      "Computed paper composition and gross / net / declarable weights per product",
      "FIFO allocation against the customs-declaration ledger in PostgreSQL, updating remaining balances",
      "Generated certificates and calculation sheets from Excel templates, exported to XLSX and PDF",
    ],
    stack: ["Python", "Tesseract OCR", "PostgreSQL", "CustomTkinter", "xlwings"],
    metrics: [
      { label: "Input", value: "PDF folder" },
      { label: "Output", value: "XLSX + PDF certificates" },
    ],
    context: "Internship · GPC · 2025",
    repo: "https://github.com/r0od3x/gestionfacture",
  },
  {
    slug: "sugarsight",
    index: "04",
    name: "SugarSight",
    tagline: "Diabetes risk prediction web app",
    description:
      "A web application that estimates a patient's diabetes risk from eight medical indicators, with a REST API for integration and LLM-written replies to user feedback.",
    problem:
      "A risk model is only useful if people can reach it, so the model needed a usable interface and an API, not just a notebook.",
    approach: [
      "Trained a Random Forest on the Pima Indians Diabetes dataset with engineered features (Glucose × BMI ratios)",
      "Served predictions through FastAPI: web form plus a documented POST /predict endpoint",
      "Feedback form whose replies are generated by the OpenAI API and sent by email",
      "Environment-based configuration with no secrets in code",
    ],
    stack: ["Scikit-learn", "FastAPI", "OpenAI API", "Bootstrap", "GSAP"],
    metrics: [
      { label: "Test accuracy", value: "~81%" },
      { label: "Model", value: "Random Forest" },
    ],
    context: "Academic project · 2025",
    repo: "https://github.com/r0od3x/SugarSight",
  },
];

export type MiniProject = {
  name: string;
  description: string;
  stack: string[];
  repo: string;
};

export const moreProjects: MiniProject[] = [
  {
    name: "Snake AI: Deep Q-Learning",
    description:
      "An agent that teaches itself Snake from scratch using experience replay and ε-greedy exploration. The shipped model averages ~30 points per game.",
    stack: ["PyTorch", "Pygame", "Reinforcement Learning"],
    repo: "https://github.com/r0od3x/snake-ai-dqn",
  },
  {
    name: "Agentic RAG Labs",
    description:
      "From prompt engineering to RAG over PDFs (ChromaDB, LLM-judged groundedness) to tool-calling agentic RAG with LangGraph.",
    stack: ["LangChain", "LangGraph", "ChromaDB", "Streamlit"],
    repo: "https://github.com/r0od3x/TP_multiai",
  },
  {
    name: "Renting: Rental Platform",
    description:
      "Airbnb-style full-stack platform with renter, seller and admin roles, JWT auth with role claims, BCrypt hashing and review gating.",
    stack: ["ASP.NET Core 8", "MongoDB", "React"],
    repo: "https://github.com/r0od3x/rentingsite",
  },
  {
    name: "Casa Dojo: Judo Club Manager",
    description:
      "Roster, belt progression, monthly payments and one-click WhatsApp reminders for a real judo dojo, built on file-system storage.",
    stack: ["React", "Vite", "Node.js", "Express"],
    repo: "https://github.com/r0od3x/casadojo",
  },
  {
    name: "Iaido Scoreboard",
    description:
      "Keyboard-driven full-screen scoreboard for iaido tournaments: solo and team matches, per-side timers, animated results, undo.",
    stack: ["Python", "Tkinter", "PyInstaller"],
    repo: "https://github.com/r0od3x/iaido-scoreboard",
  },
  {
    name: "HM-Helper API",
    description:
      "Laravel 12 REST API simulating remote brand servers, with token auth, per-site mock data and PHPUnit feature tests.",
    stack: ["PHP", "Laravel 12", "PHPUnit"],
    repo: "https://github.com/r0od3x/php-api",
  },
];

export type Certification = {
  name: string;
  issuer: string;
  year: string;
  detail?: string;
};

export const certifications: Certification[] = [
  {
    name: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    year: "2026",
    detail:
      "5 courses: Neural Networks & Deep Learning · Improving Deep Neural Networks · Structuring ML Projects · CNNs · Sequence Models",
  },
  { name: "CS50x: Introduction to Computer Science", issuer: "HarvardX", year: "2024" },
  { name: "Agile Project Management", issuer: "Google", year: "2024" },
];

export type TimelineItem = {
  date: string;
  title: string;
  org: string;
  description: string;
  points?: string[];
  stack?: string[];
  kind: "work" | "education" | "milestone" | "project";
};

// Chronological: from the start of the degree to the latest internship.
export const timeline: TimelineItem[] = [
  {
    date: "2022",
    title: "Started the engineering program",
    org: "EMSI Casablanca",
    kind: "education",
    description:
      "Computer Science engineering degree, specializing in AI & Data Science. Class delegate.",
  },
  {
    date: "2024",
    title: "2nd place, Coupe du Trône",
    org: "National judo competition",
    kind: "milestone",
    description:
      "Silver at the national level. I'm also a certified judo referee.",
  },
  {
    date: "Jul – Aug 2024",
    title: "Data & Analytics Intern",
    org: "FedEx",
    kind: "work",
    description:
      "Built an HR attendance analytics system and automated KPI reporting.",
    points: [
      "Attendance analytics application with Flask and PostgreSQL",
      "Automated HR KPI reporting through a REST API",
    ],
    stack: ["Flask", "PostgreSQL", "REST APIs"],
  },
  {
    date: "2025",
    title: "Organizer, 11th EMSI Careers Forum",
    org: "EMSI Casablanca",
    kind: "milestone",
    description:
      "Helped run the school's flagship careers event: logistics, partners and student outreach.",
  },
  {
    date: "Jul – Aug 2025",
    title: "Data & AI Automation Intern",
    org: "GPC (Gharb Papier et Carton)",
    kind: "work",
    description:
      "Automated data flows for a paper and cardboard manufacturer.",
    points: [
      "Automated ETL pipelines: PDF, Excel, XML and REST APIs into PostgreSQL",
      "OCR pipeline (Tesseract) to extract production data from scanned documents",
      "Real-time analytics dashboards on top of the consolidated data",
    ],
    stack: ["Python", "PostgreSQL", "Tesseract", "ETL"],
  },
  {
    date: "Jul – Aug 2026",
    title: "Data Science & AI Intern",
    org: "Crédit du Maroc",
    kind: "work",
    description:
      "Built forecasting for a bank's cash inflows and outflows to support budget monitoring.",
    points: [
      "Prepared, cleaned and transformed historical financial data for predictive modelling",
      "Built an ML pipeline forecasting cash inflows and outflows",
      "Engineered temporal lag features to improve forecast performance",
      "Contributed to the design of a decision-support system for budget tracking",
    ],
    stack: ["Python", "Pandas", "Scikit-learn"],
  },
  {
    date: "Now",
    title: "Final year, open to what's next",
    org: "2026 → 2027",
    kind: "milestone",
    description:
      "Looking for an end-of-studies project (PFE) or internship in AI / ML or data science.",
  },
];

export const educationEntries = [
  {
    title: "Engineering Degree: Computer Science, AI & Data Science",
    school: "EMSI Casablanca",
    period: "2022 – present",
    detail:
      "Machine learning, deep learning, big data processing and software engineering. Class delegate.",
  },
  {
    title: "Baccalaureate in Physical Sciences",
    school: "Morocco",
    period: "2022",
  },
];

export const educationFocus = [
  "Machine Learning & Deep Learning",
  "Multi-Agent Systems & Generative AI",
  "Big Data Processing & Data Engineering",
  "Software Engineering & Full-Stack Development",
];

export const contact = {
  eyebrow: "Get in touch",
  title: "Let's build something intelligent.",
  description:
    "Open to AI / ML and data science internships, end-of-studies projects (PFE) and collaborations. Based in Casablanca and comfortable working in Arabic, French and English.",
};
