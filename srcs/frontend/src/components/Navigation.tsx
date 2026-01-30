import {Link, useLocation } from 'react-router-dom';
import { House, BriefcaseBusiness, Bookmark, BotMessageSquare, MessageCircleMore, BookOpenText } from 'lucide-react';


 export const navigation = [
    { name: "Jobs", path: "/Jobs", icon: BriefcaseBusiness}, 
    { name: "Saved jobs", path: "/Savedjobs", icon: Bookmark}, 
    { name: "AI chat", path: "/AIchat", icon: BotMessageSquare},
    { name: "Contact us", path: "/ContactUs", icon: MessageCircleMore }, 
    { name: "About us", path: "/settting", icon: BookOpenText},
];
export function Navbar() {
    const location = useLocation(); 
    const currentPath = location.pathname;

    return (
        <div className="flex h-full items-center">
            {/* Navigation */}

            <button className='hidden'>Nav</button>
            <nav className="flex gap-2 px-3">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = currentPath === item.path; 

                    return (
                        <Link
                            id='Nav'
                            key={item.name}
                            to={item.path}
                            className="flex items-center px-4 rounded-xl transition-all duration-200 cursor-pointer">
                            <div  className={`flex items-center gap-1 text-black duration-300 cursor-pointer
                                ${isCurrent ? 'bg-[#97CADB] p-2 rounded-2xl ' : 'fill-black'}`}>
                                <Icon 
                                    className="h-5 w-5"/>
                                <h1 className='hidden md:block text-xs font-semibold'>{item.name}</h1>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}