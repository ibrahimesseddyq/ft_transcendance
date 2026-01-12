import { Info, Briefcase, Search, Users, User } from 'lucide-react';

interface InfoContent {
    title: string,
    titlecolor: string,
    description: string,
    descolor: string,
    icon?: React.ReactNode,
    background?: string,
}

const InfoExample = ({ title, titlecolor, description, descolor, icon, background }: InfoContent) => {
    return (
        <div 
            style={{ backgroundColor: background || '#f1f5f9' }}
            className="w-full flex items-center gap-6 py-12 px-6 md:px-20 lg:px-32 transition-all"
        >
            {icon && (
                <div className="p-4 bg-orange-100 rounded-full text-[#b24020]">
                    {icon}
                </div>
            )}

            <div className="space-y-3">
                <h1 style={{ color: titlecolor || '#000000' }} 
                    className="text-2xl md:text-3xl font-bold text-center">
                    {title}
                </h1>
                <p style={{ color: descolor || '#334155' }}
                    className="text-base md:text-lg font-medium text-center leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

export const LoginInformations = () => {
    return (
        <div className="w-full h-full flex flex-col items-center overflow-auto no-scrollbar">
            <InfoExample
                title="Let the right people know you're open to work"
                titlecolor="text-[#b24020]"
                description="With the Open To Work feature, you can privately tell recruiters or publicly share with the community that you are looking for new job opportunities."
                descolor="text-orange-900/80"
                icon={<Briefcase size={100} strokeWidth={1.5}/>}
                background="#e4e4e7" 
            />

            <InfoExample
                title="Build a profile that stands out"
                titlecolor="text-white"
                description="Your profile is your digital business card. Showcase your skills, experience, and education to catch the eye of top employers."
                descolor="text-slate-300"
                icon={<User size={100} strokeWidth={1.5} className="text-blue-400" />}
                background="#ffffff" 
            />

            <InfoExample
                title="Connect with your professional community"
                titlecolor="text-blue-700"
                description="Expand your horizons by following industry leaders and connecting with peers who share your professional interests."
                descolor="text-blue-900/70"
                icon={<Users size={100} strokeWidth={1.5} className="text-blue-600" />}
                background="#e4e4e7" 
            />

            <InfoExample
                title="Stay updated on the latest industry news"
                titlecolor="text-slate-900"
                description="Access personalized news feeds and join conversations that matter to your career growth and industry knowledge."
                descolor="text-slate-600"
                icon={<Info size={100} strokeWidth={1.5} className="text-slate-700" />}
                background="#ffffff" 
            />

            <InfoExample
                title="Never miss a new opportunity"
                titlecolor="text-purple-700"
                description="Set up custom job alerts and be the first to apply when a position that matches your criteria becomes available."
                descolor="text-purple-900/70"
                icon={<Search size={100} strokeWidth={1.5} className="text-purple-600" />}
                background="#e4e4e7" 
            />
        </div>
    );
}