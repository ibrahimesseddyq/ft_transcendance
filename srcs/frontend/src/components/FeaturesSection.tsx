import { Info, Briefcase, Search, Bell, UserCheck, LucideIcon } from 'lucide-react';

interface FeatureItem {
  id: number;
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
  return (
    <div className="group p-6 bg-[#e1d8d8e0] border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export const FeaturesSection = () => {
  return (
    <section className="w-full h-full md:overflow-auto  no-scrollbar">
      {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Everything you need to <span className="text-blue-600">succeed</span>
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl">
            Powerful tools designed to accelerate your career growth and connect you with your next big move.
          </p>
        </div>

      {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Features.map((item) => (
                <div key={item.id} className='h-full w-full'>
                    <InfoCard
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                      />
                </div>
            ))}
        </div>
    </section>
  );
}