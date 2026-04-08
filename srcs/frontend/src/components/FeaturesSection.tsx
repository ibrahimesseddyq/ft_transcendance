import { Info, Briefcase, Search, Bell, UserCheck, LucideIcon } from 'lucide-react';

interface FeatureItem {
  id?: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

const Features = [
  {
    id: 1,
    title: "Open to Work",
    description: "Privately tell recruiters or publicly share with the community that you are looking for new job opportunities.",
    icon: Info
  },
  {
    id: 2,
    title: "Standout Profile",
    description: "Showcase your skills, experience, and education to catch the eye of top employers with a digital business card.",
    icon: Briefcase
  },
  {
    id: 3,
    title: "Professional Community",
    description: "Expand your horizons by following industry leaders and connecting with peers who share your interests.",
    icon: Search
  },
  {
    id: 4,
    title: "Industry Updates",
    description: "Set up custom job alerts and be the first to apply when a position matches your specific criteria.",
    icon: Bell
  },
  {
    id: 5,
    title: "Never Miss an Opportunity",
    description: "Keep your momentum going with real-time notifications and personalized career recommendations.",
    icon: UserCheck 
  }
];

const InfoCard = ({ id, title, description, icon: Icon }: FeatureItem) => {
  const delay = ((id ?? 1) - 1) * 120;

  return (
    <article
      className="feature-reveal group relative overflow-hidden p-6 md:p-7 bg-white/70 dark:bg-slate-900/55 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="feature-card-glow" />

      <div className="mb-5 flex items-center justify-between">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-50 dark:from-sky-900/40 dark:to-cyan-900/30 text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-700/70 group-hover:scale-110 transition-transform duration-500">
          <Icon size={22} />
        </div>
        <span className="feature-kicker-font text-[11px] font-bold tracking-[0.12em] text-slate-400 dark:text-slate-500">
          0{id}
        </span>
      </div>
      
      <h3 className="feature-heading-font text-lg font-bold text-secondary-darkbg dark:text-slate-100 mb-2 leading-tight">
        {title}
      </h3>
      <p className="feature-body-font text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>
    </article>
  );
}

export const FeaturesSection = () => {
  return (
    <section className="w-full h-full md:overflow-auto no-scrollbar">
      <div className="relative overflow-hidden p-6 md:p-10">

        <div className="feature-reveal mb-10 md:mb-12 relative z-10" style={{ animationDelay: '40ms' }}>
          <span className="feature-kicker-font inline-flex items-center px-3 py-1 rounded-full border border-sky-200 dark:border-sky-700 bg-white/80 dark:bg-sky-900/30 text-[11px] font-semibold tracking-wide text-sky-700 dark:text-sky-300">
            Career Acceleration Toolkit
          </span>
          <h2 className="feature-heading-font mt-4 text-3xl md:text-4xl font-bold text-secondary-darkbg dark:text-slate-100 transition-colors leading-tight">
            Everything you need to <span className="text-sky-600 dark:text-primary">stand out and get hired</span>
          </h2>
          <p className="feature-body-font mt-4 text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl transition-colors leading-relaxed">
          Powerful tools designed to accelerate your career growth and connect you with your next big move.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Features.map((item) => (
            <InfoCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}