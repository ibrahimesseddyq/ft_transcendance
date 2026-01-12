import { Info, Briefcase, Search, Users, User } from 'lucide-react';

interface InfoContent {
    title: string,
    titlecolor: string,
    description: string,
    descolor: string,
    icon?: any,
    background?: string,
}

const Info1 = ({ title, titlecolor, description, descolor, icon, background }: InfoContent) => {
    return (
        <div 
            style={{ backgroundColor: background || '#f1f5f9' }}
            className="w-full h-full flex flex-col lg:flex-row lg:justify-between items-center transition-all"
        >
            {icon && (
                <div className="lg:h-full h-[300px] w-[300px] 
                    flex justify-start lg:justify-end items-center">
                  <img 
                    src={icon}
                    alt="student logo" 
                    className="h-full w-full rounded-r-full object-cover" 
                  />
                </div>
            )}

            <div className="py-12 px-5  lg:px-10 xl:px-20 2xl:px-32">
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
        <div className="w-full h-full flex flex-col justify-between items-center overflow-auto no-scrollbar">
            <Info1
                title="Let the right people know you're open to work"
                titlecolor="#F54300"
                description="With the Open To Work feature, you can privately tell recruiters or publicly share with the community that you are looking for new job opportunities."
                descolor="#000000"
                icon="../src/assets/icons/hireback.jpg"
                background="#f1ece5" 
            />

            <Info1
                title="Build a profile that stands out"
                titlecolor="#000000"
                description="Your profile is your digital business card. Showcase your skills, experience, and education to catch the eye of top employers."
                descolor="#334155"
                icon="../src/assets/icons/deal.jpg"
                background="#ffffff" 
            />

            <Info1
                title="Connect with your professional community"
                titlecolor="#F54300"
                description="Expand your horizons by following industry leaders and connecting with peers who share your professional interests."
                descolor="#334155"
                icon="../src/assets/icons/community.jpg"
                background="#f1ece5" 
            />

            <Info1
                title="Stay updated on the latest industry news"
                titlecolor="#000000"
                description="Access personalized news feeds and join conversations that matter to your career growth and industry knowledge."
                descolor="#334155"
                icon="../src/assets/icons/industry.jpg"
                background="#ffffff" 
            />

            <Info1
                title="Never miss a new opportunity"
                titlecolor="#F54300"
                description="Set up custom job alerts and be the first to apply when a position that matches your criteria becomes available."
                descolor="#334155"
                icon="../src/assets/icons/opportunity.jpg"
                background="#f1ece5" 
            />
        </div>
    );
}