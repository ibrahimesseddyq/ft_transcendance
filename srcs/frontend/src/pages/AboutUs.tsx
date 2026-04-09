
import { AiChatButton } from '@/components/ui/AiChatButton'
import { useAuthStore } from '@/utils/ZuStand';
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
    className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 ${className}`}
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
  <div className="mb-4 flex items-center gap-2">
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
      <Icon size={18} />
    </div>
    <h2 className="text-base font-semibold tracking-wide text-slate-900 dark:text-slate-100">{label}</h2>
  </div>
);

export function AboutUs() {
  const stackCategories = Object.entries(aboutUs.techStack) as [keyof TechStack, string[]][];
  const user = useAuthStore((state) => state.user);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes((user as any)?.role ?? "");

  return (
    <div className="h-full w-full overflow-y-auto p-4 transition-colors duration-300 custom-scrollbar md:p-6">

      {/* Hero banner */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500 opacity-90" />
        <div className="flex flex-col gap-3 max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Version {aboutUs.version}</span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">{aboutUs.name}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">{aboutUs.tagline}</p>
          <a
            href={aboutUs.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 self-start rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {aboutUs.description}
            </p>
          </SectionCard>

          {/* Mission */}
          <SectionCard>
            <SectionTitle icon={Target} label="Our Mission" />
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
              {aboutUs.mission}
            </p>
          </SectionCard>

          {/* Features */}
          <SectionCard>
            <SectionTitle icon={Zap} label="Key Features" />
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {aboutUs.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">{feature}</span>
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
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {member.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
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
                      <CategoryIcon size={14} className="text-slate-500 dark:text-slate-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {category}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
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

      {!isAdminOrRecruiter && (
        <AiChatButton />
      )}
    </div>
  );
}

