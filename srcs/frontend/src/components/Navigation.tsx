import { Link, useLocation } from 'react-router-dom';
import { House, Menu, BriefcaseBusiness, Bookmark, BotMessageSquare, MessageCircleMore, BookOpenText } from 'lucide-react';

export const navigation = [
    { name: "Home", path: "/Home", icon: House },
    { name: "Jobs", path: "/Jobs", icon: BriefcaseBusiness },
    { name: "Saved jobs", path: "/Savedjobs", icon: Bookmark },
    { name: "AI chat", path: "/AIchat", icon: BotMessageSquare },
    { name: "Contact us", path: "/ContactUs", icon: MessageCircleMore },
    { name: "About us", path: "/About", icon: BookOpenText },
];

export function Navbar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="flex h-16 items-center justify-between px-4">
            {/* Mobile Menu Button */}
            <button className='flex sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <Menu className='h-6 w-6 text-black' />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex justify-center items-center gap-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = currentPath === item.path;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="group flex items-center transition-all duration-200"
                        >
                            <div className={`
                                flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-black
                                ${isCurrent 
                                    ? 'bg-[#45a8c9] shadow-sm' 
                                    : 'hover:bg-[#45a8c9]/10'
                                }
                            `}>
                                <Icon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                <span className='hidden lg:block text-xs font-bold tracking-wide uppercase'>
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}