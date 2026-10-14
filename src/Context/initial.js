const day = 24 * 60 * 60 * 1000;
const ago = (d) => Date.now() - d * day;

export const addjobname = ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Graphic Designer", "Flutter Developer", "UI/UX Designer", "Motion Graphic Designer", "Social Media Specialist"];
export const cities = ["Damascus", "Aleppo", "Homs", "Hama", "Tartous", "Latakia"];
export const modes = ["Remote", "Onsite", "Hybrid"];
export const hours = ["Full time", "Part time"];
export const levels = ["Junior", "Mid-level", "Senior"];

export const addjobcity = cities.flatMap((c) => ["remote", "onsite"].map((m) => `${c},${m}`));

const common = {
  responsibilities: [
    "Build and maintain features used by thousands of people",
    "Work closely with product, design and QA in short iterations",
    "Write clean, tested and well-documented code",
    "Take part in code reviews and share knowledge with the team",
  ],
  requirements: [
    "At least two years of professional experience",
    "Strong communication and the ability to work as a team",
    "Comfortable with Git and modern development workflows",
  ],
};

export const jobs = [
  {
    id: "0", name: "Fullstack Developer", company: "Nimbus Labs", color: "#1f7a3a", city: "Aleppo", mode: "Onsite", hour: "Part time",
    level: "Mid-level", salary: [900, 1300], skills: ["React", "Node.js", "PostgreSQL"], postedAt: ago(1), ownerEmail: "company@forsa.dev",
    description: "We need a website developer with at least two years of experience and the ability to work as a team. You’ll own features end-to-end, from the database to the UI.",
    ...common,
  },
  {
    id: "1", name: "Frontend Developer", company: "Nimbus Labs", color: "#1f7a3a", city: "Homs", mode: "Remote", hour: "Part time",
    level: "Junior", salary: [600, 900], skills: ["React", "TypeScript", "CSS"], postedAt: ago(2), ownerEmail: "company@forsa.dev",
    description: "Join a small product studio crafting fast, accessible interfaces. Pixel-perfect eye and love for detail are a big plus.",
    ...common,
  },
  {
    id: "2", name: "Backend Developer", company: "Qasr Tech", color: "#d9480f", city: "Hama", mode: "Onsite", hour: "Full time",
    level: "Senior", salary: [1500, 2200], skills: ["Laravel", "MySQL", "Docker"], postedAt: ago(3), ownerEmail: "hr@qasr.tech",
    description: "Design and scale APIs that power our logistics platform. You’ll mentor two junior developers and shape our architecture.",
    ...common,
  },
  {
    id: "3", name: "Frontend Developer", company: "Cedar Apps", color: "#0c8599", city: "Aleppo", mode: "Hybrid", hour: "Full time",
    level: "Mid-level", salary: [1000, 1400], skills: ["Vue", "Tailwind", "Vite"], postedAt: ago(4), ownerEmail: "jobs@cedar.app",
    description: "Help us rebuild our customer dashboard with a modern stack. Two days in the office, the rest from wherever you like.",
    ...common,
  },
  {
    id: "4", name: "Backend Developer", company: "Levant Digital", color: "#7048e8", city: "Aleppo", mode: "Remote", hour: "Part time",
    level: "Mid-level", salary: [800, 1100], skills: ["Python", "Django", "Redis"], postedAt: ago(5), ownerEmail: "careers@levant.digital",
    description: "Work on data pipelines and integrations for e-commerce clients across the region, fully remote with flexible hours.",
    ...common,
  },
  {
    id: "5", name: "UI/UX Designer", company: "Yasmine Soft", color: "#c2255c", city: "Damascus", mode: "Onsite", hour: "Full time",
    level: "Mid-level", salary: [900, 1300], skills: ["Figma", "Design systems", "Prototyping"], postedAt: ago(6), ownerEmail: "hello@yasmine.soft",
    description: "Own the end-to-end design of our mobile banking app — research, flows, high-fidelity UI and a growing design system.",
    ...common,
  },
  {
    id: "6", name: "Flutter Developer", company: "Sham Systems", color: "#e67700", city: "Latakia", mode: "Remote", hour: "Full time",
    level: "Senior", salary: [1400, 1900], skills: ["Flutter", "Dart", "Firebase"], postedAt: ago(8), ownerEmail: "team@sham.systems",
    description: "Lead development of our cross-platform delivery app used daily by 40k customers. Ship weekly, measure everything.",
    ...common,
  },
  {
    id: "7", name: "Social Media Specialist", company: "Nimbus Labs", color: "#1f7a3a", city: "Tartous", mode: "Hybrid", hour: "Part time",
    level: "Junior", salary: [450, 700], skills: ["Content", "Analytics", "Canva"], postedAt: ago(10), ownerEmail: "company@forsa.dev",
    description: "Plan and publish content for our clients, report on growth and help shape campaigns with the creative team.",
    ...common,
  },
];

export const demoUsers = [
  { name: "Sara Haddad", email: "seeker@forsa.dev", password: "demo123", phone: "0991234567", loginby: "employee" },
  { name: "Nimbus Labs", email: "company@forsa.dev", password: "demo123", phone: "0211234567", loginby: "company" },
];

export const demoApplications = [
  { appId: "a1", id: "0", name: "Omar Khaled", email: "omar.k@mail.com", phone: "0933111222", file: "omar-khaled-cv.pdf", note: "Five years with React and Node — happy to start next month.", status: "new", at: ago(0.3) },
  { appId: "a2", id: "0", name: "Lina Saleh", email: "lina.saleh@mail.com", phone: "0944555666", file: "lina-saleh-resume.pdf", note: "", status: "shortlisted", at: ago(1.2) },
  { appId: "a3", id: "1", name: "Rami Youssef", email: "rami.y@mail.com", phone: "0955777888", file: "rami-cv.pdf", note: "Portfolio: rami.dev", status: "new", at: ago(2) },
];
