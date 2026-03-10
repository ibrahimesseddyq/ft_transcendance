import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, Menu, BriefcaseBusiness, Bookmark, BotMessageSquare, MessageCircleMore, X, GitPullRequestCreateArrow  } from 'lucide-react';
import { useAuthStore } from '@/utils/ZuStand';

export const navigation = [
    { name: "Dashboard", path: "/Dashboard", icon: House },
    { name: "Jobs", path: "/Jobs", icon: BriefcaseBusiness },
    { name: "Saved", path: "/Savedjobs", icon: Bookmark },
    { name: "AI chat", path: "/AIchat", icon: BotMessageSquare },
    { name: "Contact", path: "/chat", icon: MessageCircleMore },
    { name: "Quiz", path: "/QuizPage", icon: GitPullRequestCreateArrow },
    { name: "Applications", path: "/Applications", icon: GitPullRequestCreateArrow },
];

export function Navbar() {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex h-16 items-center justify-between w-full sm:w-fit px-4 relative">
            {/* Mobile Menu */}
            <button 
                onClick={() => setIsOpen(true)}
                className='flex md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors'
            >
                <Menu className='h-6 w-6 text-black dark:text-white' />
            </button>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] md:hidden flex backdrop-blur-md">
                    <div onClick={() => setIsOpen(false)} 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"  />
                    <nav className="fixed top-0 left-0 bottom-0 w-64 h-screen 
                        bg-white dark:bg-[#09122C] p-6 flex flex-col gap-4 shadow-xl transition-colors duration-300">
                        
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-black dark:text-white font-bold text-xl">Menu</h2>
                            <button onClick={() => setIsOpen(false)}>
                                <X className="text-black dark:text-white" />
                            </button>
                        </div>

                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 p-3 rounded-xl font-bold transition-all
                                    ${!isAdminOrRecruiter && item.name === 'Dashboard' || item.name === 'Quiz' ? 'hidden' : ''}
                                    ${isAdminOrRecruiter && item.name === 'Applications' ? 'hidden' : ''}
                                    ${location.pathname.startsWith(item.path) 
                                        ? 'bg-[#00adef] text-white' 
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex justify-center items-center gap-1">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`group flex items-center transition-all duration-200
                                ${!isAdminOrRecruiter && (item.name === 'Dashboard' || item.name === 'Quiz') ? 'hidden' : ''}
                                ${isAdminOrRecruiter && item.name === 'Applications' ? 'hidden' : ''}`}
                        >
                            <div className={`
                                flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
                                text-black dark:text-white 
                                ${isCurrent 
                                    ? 'bg-[#45a8c9] text-white shadow-sm' 
                                    : 'hover:bg-[#45a8c9]/10 dark:hover:bg-[#45a8c9]/20'
                                }
                            `}>
                                <Icon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                                <span className='hidden xl:block text-xs font-bold tracking-wide uppercase'>
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