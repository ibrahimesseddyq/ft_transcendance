import { Info, Briefcase, Search, Users, User } from 'lucide-react';

interface InfoContent {
    title: string,
    titlecolor: string,
    description: string,
    icon?: any,
}

const Info1 = ({ title, titlecolor, description, icon }: InfoContent) => {
    return (
        <div className="h-auto w-full lg:h-[250px] lg:w-[600px] flex flex-col lg:flex-row justify-between rounded-md 
            border border-[#1E2E52] bg-[#131D34] items-center transition-all p-5 place-content-center"
        >
            {icon && (
                <div className="
                    flex justify-start lg:justify-end items-center">
                  <img 
                    src={icon}
                  />
                </div>
            )}

            <div className="">
                <h1 className="text-lg font-semibold text-center text-white hover:pramary-text">
                    {title}
                </h1>
                <p className="text-sm text-[#94A3B8] font-medium text-center leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

export const LoginInformations = () => {
    return (
        <div className="w-full h-full flex flex-col gap-4 justify-between items-center overflow-auto no-scrollbar p-5">
            <div className='h-auto w-full lg:h-[250px] lg:w-[600px] items-center place-content-center'>
                <h1 className="text-lg font-semibold text-white">
                    Everything you need to <span className='font-bold text-[#10B77F]'>succeed</span>
                </h1>
                <p className="text-sm text-[#94A3B8] font-medium leading-relaxed">
                    Powerful tools designed to accelerate your career growth.
                </p>
            </div>
            <Info1
                title="Let the right people know you're open to work"
                titlecolor="#F54300"
                description="With the Open To Work feature, you can privately tell recruiters or publicly share with the community that you are looking for new job opportunities."
                icon={Info}
            />

            <Info1
                title="Build a profile that stands out"
                titlecolor="#000000"
                description="Your profile is your digital business card. Showcase your skills, experience, and education to catch the eye of top employers."
                icon={Briefcase}
            />

            <Info1
                title="Connect with your professional community"
                titlecolor="#F54300"
                description="Expand your horizons by following industry leaders and connecting with peers who share your professional interests."
                icon={Search}
            />

            <Info1
                title="Stay updated on the latest industry news"
                titlecolor="#000000"
                description="Access personalized news feeds and join conversations that matter to your career growth and industry knowledge."
                icon={Users} 
            />

            <Info1
                title="Never miss a new opportunity"
                titlecolor="#F54300"
                description="Set up custom job alerts and be the first to apply when a position that matches your criteria becomes available."
                icon={User} 
            />
        </div>
    );
}