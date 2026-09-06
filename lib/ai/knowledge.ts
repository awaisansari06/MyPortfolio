import { portfolioData } from '@/data/portfolio';

/**
 * Verified knowledge base for "ASK AWAIS AI" portfolio assistant.
 * All information is strictly curated from verified portfolio records.
 */
export const VERIFIED_PORTFOLIO_KNOWLEDGE = {
  profile: {
    fullName: portfolioData.name, // Mohammad Awais Ansari
    commonName: 'Awais',
    role: portfolioData.role, // Full-Stack Developer
    subRole: portfolioData.subRole,
    location: portfolioData.location, // Virar, Maharashtra, India
    email: portfolioData.email, // muhammadavais14@gmail.com
    statement: portfolioData.statement,
    bio: portfolioData.bio,
    spokenLanguages: ['English', 'Hindi', 'Marathi'],
    interests: ['AI Engineering', 'Full-Stack Development', 'Open Source'],
    status: 'Open to opportunities (Full-Time, Contract, Engineering Collaborations)',
    resumeUrl: '/AwaisCV.pdf',
    socials: {
      github: portfolioData.socials.github,
      linkedin: portfolioData.socials.linkedin,
    },
  },

  skills: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'C++', 'Java'],
    frontend: [
      'React.js',
      'Next.js (App Router)',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'shadcn/ui',
      'Framer Motion',
    ],
    backendAndApis: [
      'Node.js',
      'REST APIs',
      'tRPC',
      'Prisma ORM',
      'Zod',
      'React Hook Form',
    ],
    databases: ['PostgreSQL', 'Prisma', 'Convex'],
    aiTechnologies: [
      'Google Gemini',
      'OpenRouter',
      'Vercel AI SDK',
      'AI Agents / Multi-agent workflows',
    ],
    cloudAndTools: [
      'Git',
      'GitHub',
      'Vercel',
      'Clerk',
      'Inngest',
      'E2B (Cloud Micro-VM Sandboxes)',
      'Mapbox',
      'Google Places API',
      'Arcjet',
    ],
    computerScienceFoundations: [
      'Data Structures & Algorithms (C++)',
      'Object-Oriented Programming (Java)',
      'Database Management Systems (SQL)',
      'Operating Systems',
      'Software Engineering & Architecture',
    ],
  },

  projects: [
    {
      id: 'careerwise',
      name: 'CareerWise',
      tagline: 'AI-Powered Career Intelligence Platform',
      category: 'Full-Stack AI Application',
      liveUrl: 'https://careerwise-v1.vercel.app/',
      githubUrl: 'https://github.com/awaisansari06/CareerWise',
      technologies: [
        'Next.js 15.5',
        'React 19',
        'TypeScript',
        'Tailwind CSS',
        'PostgreSQL',
        'Prisma',
        'Google Gemini',
        'Clerk',
        'Inngest',
      ],
      description:
        'An end-to-end career intelligence system engineered to bridge the gap between job seekers and competitive technical hiring bars. Unites resume review, interview prep, and career planning into a cohesive data-driven pipeline.',
      keyFeatures: [
        'Resume & ATS analysis with actionable optimization scoring',
        'Mock interview preparation with AI conversational feedback',
        'Interactive career roadmaps tailored to target engineering roles',
        'AI-driven cover letter generation customized to job descriptions',
        'Industry salary intelligence and market compensation data',
      ],
      architecture:
        'Built with Next.js 15.5 App Router and React 19, powered by Google Gemini generative models with serverless background queue processing via Inngest and relational persistence via PostgreSQL & Prisma.',
    },
    {
      id: 'devflow',
      name: 'DevFlow',
      tagline: 'Intelligent AI-Powered Web Development Platform',
      category: 'Agentic Development Platform',
      liveUrl: 'https://devflow-project.vercel.app/',
      githubUrl: 'https://github.com/awaisansari06/devflow',
      technologies: [
        'Next.js 15',
        'React 19',
        'TypeScript',
        'Tailwind CSS',
        'tRPC',
        'E2B Cloud Sandboxes',
        'PostgreSQL',
        'Prisma',
        'Clerk',
        'Inngest',
        'Vercel AI SDK',
      ],
      description:
        'An agentic development environment that transforms conversational software specifications into fully running, multi-file full-stack web applications inside isolated cloud micro-VM sandboxes.',
      keyFeatures: [
        'Natural-language prompt to running full-stack application synthesis',
        'E2B cloud micro-VM sandbox execution',
        'Live browser previews rendered in real time',
        'Live terminal output, build logs, and runtime inspection',
        'Interactive file explorer and multi-file code editor',
        'Project versioning, checkpoints, and execution history',
      ],
      architecture:
        'Pairs autonomous multi-step LLM loops via Vercel AI SDK with dedicated E2B secure Linux micro-VMs, orchestrated with type-safe tRPC client-server protocols and Inngest queues.',
    },
    {
      id: 'smart-journey',
      name: 'SmartJourney',
      tagline: 'AI-Driven Personalized Travel Assistant',
      category: 'Geospatial Travel Exploration Platform',
      liveUrl: 'https://smartjourney-v2.vercel.app/',
      githubUrl: 'https://github.com/awaisansari06/smart-journey',
      technologies: [
        'Next.js',
        'React',
        'Tailwind CSS',
        'shadcn/ui',
        'Convex Database',
        'OpenRouter',
        'Google Places API',
        'Mapbox',
        'Clerk',
        'Arcjet',
      ],
      description:
        'An intelligent itinerary and geospatial exploration platform designed to synthesize optimized multi-day travel schedules tailored to personal budgets, pacing, and logistics.',
      keyFeatures: [
        'Personalized day-by-day travel itineraries customized by budget, duration, group size, and pacing',
        'Real-time destination discovery and place scoring with Google Places API',
        'Interactive geospatial routing, waypoint visualization, and 3D maps using Mapbox',
        'Hotel discovery with proximity and budget matching',
        'Reactive real-time cloud data synchronization powered by Convex',
        'Granular security, bot shielding, and rate limiting using Arcjet',
        'Trip history management with customizable sharing',
      ],
      architecture:
        'Combines OpenRouter multi-model LLM generation with live Google Places API data, Mapbox interactive geospatial map layers, Convex real-time document store, and Arcjet security layers.',
    },
  ],

  education: [
    {
      degree: 'M.Sc. Computer Science',
      institution: 'University of Mumbai',
      duration: 'Expected 2028',
      details:
        'Advanced graduate studies concentrating on artificial intelligence systems, advanced algorithms, and software architecture.',
    },
    {
      degree: 'B.Sc. Computer Science',
      institution: 'University of Mumbai',
      duration: '2023 – 2026',
      score: 'CGPA: 8.56 / 10',
      details:
        'Rigorous undergraduate training across core computer science: data structures, object-oriented design, databases, operating systems, and web development.',
    },
    {
      degree: 'HSC — Science',
      institution: 'Maharashtra State Board',
      duration: '2023',
      score: '71.33%',
      details: 'Physics, Chemistry, and Mathematics focus.',
    },
  ],

  certifications: [
    {
      year: '2026',
      title: 'Oracle Agentic AI Foundations Associate',
      issuer: 'Oracle',
    },
    {
      year: '2026',
      title: 'JavaScript / Front-End Certification',
      issuer: 'freeCodeCamp',
    },
    {
      year: '2026',
      title: 'Front-End Software Engineering Job Simulation',
      issuer: 'Skyscanner / Forage',
    },
    {
      year: '2026',
      title: 'Introduction to Generative AI and Agents',
      issuer: 'Microsoft Learn',
    },
    {
      year: '2026',
      title: 'Software Engineering Job Simulation',
      issuer: 'Skyscanner / Forage',
    },
  ],
};
