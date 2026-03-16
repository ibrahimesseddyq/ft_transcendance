import {
  Info,
  Target,
  Zap,
  Users,
  Layers,
  Github,
  CheckCircle2,
  Monitor,
  Server,
  Box,
  Radio,
} from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  github: string;
}

interface TechStack {
  frontend: string[];
  backend: string[];
  infrastructure: string[];
  realtime: string[];
}

interface AboutData {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  features: string[];
  team: TeamMember[];
  techStack: TechStack;
  contact: { github: string };
  version: string;
}

const stackCategoryIcons: Record<keyof TechStack, React.ElementType> = {
  frontend: Monitor,
  backend: Server,
  infrastructure: Box,
  realtime: Radio,
};

const aboutUs: AboutData = {
  name: "Hirefy",
  tagline: "A full-stack recruitment platform built as part of the 42 curriculum.",
  description:
    "Hirefy is a modern, full-stack web application designed to streamline the recruitment process. " +
    "It connects candidates and recruiters through a seamless interface, offering job listings, application tracking, " +
    "live chat, real-time notifications, quiz-based skill assessments, and a rich dashboard for recruiters. " +
    "Built with a microservices architecture, the platform consists of a main service handling users, jobs, " +
    "applications, conversations and profiles, and a dedicated quiz service for technical assessments. " +
    "The frontend is a single-page application powered by React and Vite.",
  mission:
    "Our mission is to make hiring transparent, fair, and efficient — giving every candidate the tools " +
    "to showcase their skills and every recruiter the insights needed to find the right talent.",
  features: [
    "User registration and authentication with JWT and two-factor authentication (2FA)",
    "Job posting and management for recruiters",
    "Application lifecycle tracking (submit, advance, reject, withdraw)",
    "Real-time chat between candidates and recruiters via Socket.IO",
    "Real-time notifications",
    "Quiz and MCQ-based technical assessments",
    "Recruiter dashboard with analytics",
    "Avatar / profile management",
    "Role-based access control (candidate, recruiter, admin)",
  ],
  team: [
    {
      name: "SOUFIANE ESSARHIR",
      role: "Project Manager",
      github: "https://github.com/soufianeessarhir"
    },
    {
      name: "ABDELLATIF EL FAGROUCH",
      role: "Product Owner",
      github: "https://github.com/Chidori42"
    },
    {
      name: "EL HOUSSAINE ABOUDI",
      role: "Developer",
      github: "https://github.com/eaboudi",
    },
    {
      name: "IBRAHIM ESSEDDYQ",
      role: "Architect",
      github: "https://github.com/ibrahimesseddyq",
    },
    {
      name: "ABDELMAJID ACHALLAH",
      role: "Devloper",
      github: "https://github.com/AM9-push"
    },
  ],
  techStack: {
    frontend: ["React", "Vite", "TypeScript", "Tailwind"],
    backend: ["Node.js", "Express", "Prisma", "MariaDb"],
    infrastructure: ["Docker", "Kubernetes", "Nginx"],
    realtime: ["Socket.IO"],
  },
  contact: {
    github: "https://github.com/ibrahimesseddyq/ft_transcendance",
  },
  version: "1.0.0",
};

const SectionCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-surface-main dark:bg-secondary-darkbg border border-gray-200 dark:border-slate-800
      rounded-2xl p-6 transition-colors duration-300 ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <div className="flex items-center gap-2 mb-5">
    <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
      <Icon size={18} />
    </div>
    <h2 className="text-lg font-bold text-black dark:text-surface-main tracking-wide">{label}</h2>
  </div>
);

export function AboutUs() {
  const stackCategories = Object.entries(aboutUs.techStack) as [keyof TechStack, string[]][];

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-6">

      {/* Hero banner */}
      <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-[#0086b8] p-8 md:p-12 text-white shadow-lg">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 flex flex-col gap-3 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">v{aboutUs.version}</span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{aboutUs.name}</h1>
          <p className="text-base md:text-lg opacity-90 font-medium">{aboutUs.tagline}</p>
          <a
            href={aboutUs.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 self-start text-sm font-semibold
              bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl"
          >
            <Github size={16} />
            View on GitHub
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column — spans 2 cols on lg */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Description */}
          <SectionCard>
            <SectionTitle icon={Info} label="About" />
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {aboutUs.description}
            </p>
          </SectionCard>

          {/* Mission */}
          <SectionCard>
            <SectionTitle icon={Target} label="Our Mission" />
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {aboutUs.mission}
            </p>
          </SectionCard>

          {/* Features */}
          <SectionCard>
            <SectionTitle icon={Zap} label="Key Features" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aboutUs.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Team */}
          <SectionCard>
            <SectionTitle icon={Users} label="Team" />
            <div className="flex flex-col gap-4">
              {aboutUs.team.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-sm">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-black dark:text-surface-main truncate">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                    >
                      <Github size={12} />
                      GitHub
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Tech Stack */}
          <SectionCard>
            <SectionTitle icon={Layers} label="Tech Stack" />
            <div className="flex flex-col gap-4">
              {stackCategories.map(([category, items]) => {
                const CategoryIcon = stackCategoryIcons[category];
                return (
                  <div key={category}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <CategoryIcon size={14} className="text-primary" />
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

