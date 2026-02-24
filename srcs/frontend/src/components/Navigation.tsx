import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Menu, BriefcaseBusiness, Bookmark, BotMessageSquare, MessageCircleMore, BookOpenText, X } from 'lucide-react';
import { useAuthStore } from '@/utils/ZuStand';

export const navigation = [
    { name: "Dashboard", path: "/Dashboard", icon: House },
    { name: "Jobs", path: "/Jobs", icon: BriefcaseBusiness },
    { name: "Saved", path: "/Savedjobs", icon: Bookmark },
    { name: "AI chat", path: "/AIchat", icon: BotMessageSquare },
    { name: "Contact", path: "/chat", icon: MessageCircleMore },
    { name: "About", path: "/About", icon: BookOpenText },
];

export function Navbar() {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-16 items-center justify-between w-full sm:w-fit px-4 relative ">
            <button 
                onClick={() => setIsOpen(true)}
                className='flex sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors '
            >
                <Menu className='h-6 w-6 text-black' />
            </button>
            {/* MObile Navigation */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] sm:hidden backdrop-blur-md">
                    <div onClick={() => setIsOpen(false)} 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"  />
                    <nav className="fixed top-0 left-0 bottom-0 w-64 
                        h-screen bg-[#09122C] p-6 flex flex-col gap-4 shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-white font-bold text-xl">Menu</h2>
                            <button onClick={() => setIsOpen(false)}><X className="text-white" /></button>
                        </div>

                        {navigation.map((item) => (
                            <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 p-3 rounded-xl font-bold 
                                ${user?.role === "candidate" && item.name === 'Dashboard' ? 'hidden' : ''}
                                ${location.pathname.startsWith(item.path) ? 'bg-[#00adef] text-white' : 'text-gray-400'}`}
                                >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex justify-center items-center gap-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            
                            className={`group flex items-center transition-all duration-200
                                ${user?.role === "candidate" && item.name === 'Dashboard' ? 'hidden' : ''}`}
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