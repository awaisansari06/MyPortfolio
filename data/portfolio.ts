export interface ProjectCaseStudy {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: string;
  shortDescription?: string;
  description: string;
  liveUrl: string;
  githubUrl?: string;
  compactTechnologies?: string[];
  technologies: string[];
  conciseFeatures?: string[];
  features: string[];
  problem: string;
  approach: string;
  implementation: string[];
  metrics?: { label: string; value: string }[];
  flowSteps: string[];
}

export interface EducationItem {
  year: string;
  degree: string;
  institution: string;
  details: string;
  score?: string;
}

export interface CertificationItem {
  year: string;
  title: string;
  issuer: string;
  credentialId?: string;
}

export interface TechCategory {
  title: string;
  skills: string[];
}

export interface PortfolioData {
  name: string;
  role: string;
  subRole: string;
  statement: string;
  metadata: string[];
  bio: string;
  location: string;
  email: string;
  socials: {
    github: string;
    linkedin: string;
  };
  whatIBuild: {
    number: string;
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
  }[];
  projects: ProjectCaseStudy[];
  techCategories: TechCategory[];
  engineeringFoundations: {
    name: string;
    description: string;
    tool?: string;
  }[];
  education: EducationItem[];
  certifications: CertificationItem[];
  experiments: {
    id: string;
    title: string;
    tag: string;
    description: string;
    tech: string;
  }[];
}

export const portfolioData: PortfolioData = {
  name: "MOHAMMAD AWAIS ANSARI",
  role: "FULL-STACK DEVELOPER",
  subRole: "AI APPLICATION DEVELOPMENT & SOFTWARE ENGINEERING",
  statement: "Building AI-powered full-stack applications and intelligent digital products.",
  metadata: [
    "/ SOFTWARE ENGINEERING",
    "/ AI APPLICATIONS",
    "/ FULL-STACK DEVELOPMENT",
  ],
  bio: "Graduate student in Computer Science at the University of Mumbai, dedicated to engineering robust, production-oriented software with practical generative AI integrations.",
  location: "Virar, Maharashtra, India",
  email: "muhammadavais14@gmail.com",
  socials: {
    github: "https://github.com/awaisansari06",
    linkedin: "https://www.linkedin.com/in/mohammad-awais-ansari-0560bb428/",
  },
  whatIBuild: [
    {
      number: "01",
      title: "FULL-STACK",
      subtitle: "APPLICATIONS",
      description:
        "Building production-oriented web applications with modern frontend, backend, API and database technologies.",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "tRPC"],
    },
    {
      number: "02",
      title: "AI-POWERED",
      subtitle: "PRODUCTS",
      description:
        "Integrating generative AI and intelligent workflows into practical software products.",
      tags: ["Google Gemini", "Vercel AI SDK", "OpenRouter", "AI Agents"],
    },
    {
      number: "03",
      title: "MODERN",
      subtitle: "WEB EXPERIENCES",
      description:
        "Creating responsive interfaces with React, Next.js, Tailwind CSS and modern interaction patterns.",
      tags: ["Next.js", "React.js", "Tailwind CSS", "TypeScript"],
    },
    {
      number: "04",
      title: "INTERACTIVE",
      subtitle: "INTERFACES",
      description:
        "Exploring motion, interaction and creative frontend experiences.",
      tags: ["Three.js", "WebGL", "Framer Motion"],
    },
  ],
  projects: [
    {
      id: "careerwise",
      number: "01",
      title: "CAREERWISE",
      tagline: "AI-POWERED CAREER INTELLIGENCE PLATFORM",
      category: "FULL-STACK AI APPLICATION",
      shortDescription:
        "AI-powered career platform integrating resume/ATS analysis, mock interview preparation, interactive career roadmaps, AI-driven cover letter generation, and industry salary intelligence.",
      description:
        "CareerWise is an end-to-end career intelligence system engineered to bridge the gap between job seekers and competitive technical hiring bars. Rather than treating resume review, interview prep, and career planning as disparate tasks, CareerWise unites them into a cohesive data-driven pipeline powered by Google Gemini and serverless background execution.",
      liveUrl: "https://careerwise-v1.vercel.app/",
      githubUrl: "https://github.com/awaisansari06",
      compactTechnologies: [
        "Next.js 15.5",
        "React 19",
        "TypeScript",
        "PostgreSQL",
        "Prisma",
        "Google Gemini",
        "Clerk",
        "Inngest",
      ],
      technologies: [
        "Next.js 15.5",
        "React 19",
        "TypeScript",
        "Tailwind CSS",
        "PostgreSQL",
        "Prisma",
        "Google Gemini",
        "Clerk",
        "Inngest",
      ],
      conciseFeatures: [
        "Resume / ATS Analysis & Feedback",
        "Mock Interview Simulation",
        "Interactive Career Roadmaps",
        "Salary & Compensation Intelligence",
      ],
      features: [
        "AI-driven resume parsing with ATS scoring and structural critique",
        "Real-time mock interview simulation with contextual AI feedback",
        "Interactive career progression roadmaps customized to target roles",
        "Context-aware cover letter generation tailored to specific job listings",
        "Real-time industry salary intelligence and compensation benchmarks",
        "Resilient asynchronous background processing for heavy document parsing",
      ],
      problem:
        "Job seekers face fragmented tooling: disconnected resume checkers, generic interview advice, and opaque ATS filtering that fails to provide actionable, structured paths forward.",
      approach:
        "Constructed a unified career intelligence system powered by Google Gemini API and background job orchestration via Inngest, ensuring instant UI responses while deep document embeddings and analysis run asynchronously.",
      implementation: [
        "Engineered full-stack AI career platform with Next.js 15 App Router, React 19 Server Components, and Streaming SSR.",
        "Integrated Google Gemini API for deep structural resume inspection, personalized role guidance, and dynamic content generation.",
        "Built persistent database schemas using PostgreSQL and Prisma ORM with Clerk authentication and role-based access control.",
        "Orchestrated resilient background workflows using Inngest to decouple heavy AI inference from the main server response cycle.",
      ],
      metrics: [
        { label: "Core Model", value: "Gemini 3.8 Flash" },
        { label: "Architecture", value: "Next.js 15 App Router" },
        { label: "Database", value: "PostgreSQL + Prisma" },
        { label: "Workflows", value: "Inngest Serverless" },
      ],
      flowSteps: ["DOCUMENT", "ANALYSIS", "INTELLIGENCE", "CAREER PATH"],
    },
    {
      id: "devflow",
      number: "02",
      title: "DEVFLOW",
      tagline: "INTELLIGENT AI-POWERED WEB DEVELOPMENT PLATFORM",
      category: "AGENTIC AI & CLOUD SANDBOX",
      shortDescription:
        "Agentic AI development platform generating functional web applications from natural-language prompts using advanced AI agents, sandboxed execution, and live terminal streaming.",
      description:
        "DevFlow is an agentic development environment that transforms conversational software specifications into fully running, multi-file full-stack web applications. By pairing multi-step autonomous LLM agent loops with dedicated cloud micro-VM sandboxes, DevFlow compiles, installs packages, runs servers, and streams live application previews in real time.",
      liveUrl: "https://devflow-project.vercel.app/",
      githubUrl: "https://github.com/awaisansari06",
      compactTechnologies: [
        "Next.js 15",
        "React 19",
        "TypeScript",
        "E2B",
        "tRPC",
        "PostgreSQL",
        "Prisma",
        "Vercel AI SDK",
      ],
      technologies: [
        "Next.js 15",
        "React 19",
        "TypeScript",
        "Tailwind CSS",
        "tRPC",
        "E2B",
        "PostgreSQL",
        "Prisma",
        "Clerk",
        "Inngest",
        "Vercel AI SDK",
      ],
      conciseFeatures: [
        "Natural-Language App Synthesis",
        "E2B Cloud Micro-VM Sandboxes",
        "Real-Time Terminal Streaming",
        "Live Previews with Hot Reload",
      ],
      features: [
        "Natural-language to full-stack web application synthesis",
        "Isolated cloud sandbox execution using E2B infrastructure",
        "Live interactive application previews with hot reload inside sandboxes",
        "Real-time terminal execution logs and package installation feedback",
        "Interactive virtual file explorer and tree inspection",
        "Persistent project history, snapshots, and version management",
        "End-to-end typed API communication with tRPC",
      ],
      problem:
        "Building prototypes from prompts often produces non-executable code snippets trapped in chat windows, lacking isolated execution environments, file system trees, and live browser previews.",
      approach:
        "DevFlow pairs agentic tool-use loops (via Vercel AI SDK) with dedicated cloud micro-VM sandboxes (E2B). Agents write files, install dependencies, spin up servers, and expose a live secure iframe preview directly to the user.",
      implementation: [
        "Built agentic AI development platform generating functional web applications from natural-language prompts using advanced AI agents.",
        "Implemented secure E2B cloud sandbox execution with live application previews, terminal logs, file exploration, project history, and version control.",
        "Developed backend APIs and persistent project infrastructure using tRPC, PostgreSQL, Prisma, authentication, and AI model integrations.",
        "Streamed real-time stdout/stderr sandbox execution events directly to client terminal viewports.",
      ],
      metrics: [
        { label: "Sandbox Engine", value: "E2B Micro-VMs" },
        { label: "API Layer", value: "tRPC End-to-End" },
        { label: "Agentic Loop", value: "Vercel AI SDK" },
        { label: "State Store", value: "PostgreSQL / Prisma" },
      ],
      flowSteps: [
        "PROMPT",
        "AI AGENT",
        "SANDBOX BUILD",
        "LIVE PREVIEW",
      ],
    },
    {
      id: "smartjourney",
      number: "03",
      title: "SMARTJOURNEY",
      tagline: "AI-DRIVEN PERSONALIZED TRAVEL ASSISTANT",
      category: "GEOSPATIAL AI ASSISTANT",
      shortDescription:
        "AI travel assistant generating personalized day-by-day itineraries based on destination, budget, group size, duration, and user interests with interactive geospatial maps.",
      description:
        "SmartJourney is an intelligent itinerary and geospatial exploration platform designed to solve travel fragmentation. By combining large language model reasoning with live Google Places geospatial data and Mapbox interactive visual layers, SmartJourney synthesizes optimized multi-day travel schedules tailored to personal budgets, pacing, and logistics.",
      liveUrl: "https://smartjourney-v2.vercel.app/",
      githubUrl: "https://github.com/awaisansari06",
      compactTechnologies: [
        "Next.js",
        "React",
        "TypeScript",
        "Convex",
        "OpenRouter",
        "Google Places API",
        "Mapbox",
        "Arcjet",
      ],
      technologies: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "shadcn/ui",
        "Convex",
        "OpenRouter",
        "Google Places API",
        "Mapbox",
        "Clerk",
        "Arcjet",
      ],
      conciseFeatures: [
        "Personalized Day-by-Day Itineraries",
        "Google Places Discovery & Scoring",
        "Interactive Geospatial Routing",
        "Reactive Real-Time Persistence",
      ],
      features: [
        "Dynamic day-by-day itinerary generation with optimized travel pacing",
        "Real-time place discovery powered by Google Places API",
        "Interactive geospatial routing and waypoint visualization with Mapbox",
        "Hotel discovery with price tiers and location proximity scoring",
        "Real-time reactive cloud state with Convex database",
        "Granular rate limiting and bot protection using Arcjet security shield",
        "Trip history management and sharing with customizable privacy",
      ],
      problem:
        "Travel planning requires juggling dozens of browser tabs across review sites, maps, transit tables, and booking tools with zero cohesive day-by-day scheduling.",
      approach:
        "Harmonized OpenRouter generative reasoning with real-world spatial coordinates from Google Places and Mapbox SDK, creating dynamic itineraries mapped onto an interactive 3D geospatial canvas.",
      implementation: [
        "Built AI travel assistant generating personalized day-by-day itineraries based on destination, budget, group size, duration, and user interests.",
        "Integrated OpenRouter-based AI generation with Google Places API and Mapbox for activity recommendations, hotel discovery, location services, and interactive map experiences.",
        "Implemented user authentication, trip history management, subscription tiers, rate limiting, and security controls using Clerk and Arcjet.",
        "Leveraged Convex for reactive real-time document persistence and instant client-side state sync.",
      ],
      metrics: [
        { label: "AI Routing", value: "OpenRouter Multi-Model" },
        { label: "Maps & Geospatial", value: "Mapbox + Places API" },
        { label: "Reactive Store", value: "Convex Real-Time" },
        { label: "Security & Shield", value: "Arcjet Rate Limiting" },
      ],
      flowSteps: [
        "DESTINATION",
        "AI PLANNING",
        "PLACES & MAPS",
        "ITINERARY",
      ],
    },
  ],
  techCategories: [
    {
      title: "LANGUAGES",
      skills: ["JavaScript", "TypeScript", "Python", "SQL", "C++", "Java"],
    },
    {
      title: "FRONTEND",
      skills: [
        "React.js",
        "Next.js",
        "Tailwind CSS",
        "shadcn/ui",
        "Framer Motion",
      ],
    },
    {
      title: "BACKEND",
      skills: [
        "Node.js",
        "REST APIs",
        "tRPC",
        "Prisma",
        "Zod",
      ],
    },
    {
      title: "DATABASE",
      skills: ["PostgreSQL", "Convex"],
    },
    {
      title: "AI",
      skills: ["Google Gemini", "OpenRouter", "Vercel AI SDK", "AI Agents"],
    },
    {
      title: "INFRASTRUCTURE",
      skills: [
        "Git",
        "GitHub",
        "Vercel",
        "Clerk",
        "Inngest",
        "E2B",
      ],
    },
  ],
  engineeringFoundations: [
    {
      name: "Data Structures & Algorithms",
      description:
        "Algorithms, data structures and computational problem solving.",
      tool: "C++",
    },
    {
      name: "Object-Oriented Programming",
      description:
        "Object-oriented design and software organization.",
      tool: "Java",
    },
    {
      name: "Database Management",
      description:
        "Relational databases, data modeling and database systems.",
      tool: "SQL",
    },
    {
      name: "Operating Systems",
      description:
        "Core operating system concepts and system-level foundations.",
      tool: "PowerShell",
    },
    {
      name: "Software Engineering",
      description:
        "Software design, development practices and application architecture.",
      tool: "VS Code",
    },
  ],
  education: [
    {
      year: "Expected 2028",
      degree: "M.Sc. COMPUTER SCIENCE",
      institution: "University of Mumbai",
      details:
        "Advanced graduate studies focusing on artificial intelligence and modern software architecture.",
    },
    {
      year: "2023 – 2026",
      degree: "B.Sc. COMPUTER SCIENCE",
      institution: "University of Mumbai",
      details:
        "Rigorous foundation in computer science core principles, algorithms, operating systems, and full-stack software development.",
      score: "CGPA: 8.56 / 10",
    },
    {
      year: "2023",
      degree: "HSC — SCIENCE",
      institution: "Maharashtra State Board",
      details: "Higher secondary education in Physics, Chemistry, and Mathematics.",
      score: "71.33%",
    },
  ],
  certifications: [
    {
      year: "2026",
      title: "Oracle Agentic AI Foundations Associate",
      issuer: "Oracle",
    },
    {
      year: "2026",
      title: "JavaScript / Front-End Certification",
      issuer: "freeCodeCamp",
    },
    {
      year: "2026",
      title: "Front-End Software Engineering Job Simulation",
      issuer: "Skyscanner / Forage",
    },
    {
      year: "2026",
      title: "Introduction to Generative AI and Agents",
      issuer: "Microsoft Learn",
    },
    {
      year: "2026",
      title: "Software Engineering Job Simulation",
      issuer: "Skyscanner / Forage",
    },
  ],
  experiments: [
    {
      id: "procedural-mesh",
      title: "Architectural Topology",
      tag: "THREE.JS / PROCEDURAL",
      description:
        "Procedurally generated structural wireframe lattice with dynamic geometric deformation responding to pointer displacement.",
      tech: "Three.js BufferGeometry",
    },
    {
      id: "matrix-stream",
      title: "Token Stream Visualizer",
      tag: "AI STREAMING / CANVAS",
      description:
        "Real-time tokenized streaming inference buffer with simulated temperature sampling and latency histograms.",
      tech: "HTML5 2D Canvas Engine",
    },
    {
      id: "gravity-grid",
      title: "Physics Lattice",
      tag: "PARTICLES / VERLET",
      description:
        "Verlet integration particle matrix simulating tension, elasticity, and impulse damping under mouse interaction.",
      tech: "Verlet Mechanics / WebGL",
    },
  ],
};
