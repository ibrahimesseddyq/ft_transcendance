import {Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Dashboard from '../assets/icons/Dashboard.svg?react';
import Messages from '../assets/icons/Messages.svg?react';
import Settings from '../assets/icons/Settings.svg?react';
import Logout from '../assets/icons/Logout.svg?react';
import Jobs from '../assets/icons/Jobs.svg?react';
import Candidates from '../assets/icons/Candidates.svg?react';


 export const navigation = [
  { name: "Dashboard", path: "/Dashboard", icon: Dashboard }, 
  { name: "Jobs", path: "/Jobs", icon: Jobs}, 
  { name: "Messages", path: "/Messages", icon: Messages }, 
  { name: "Condidates", path: "/Condidates", icon: Candidates}, 
  { name: "Settings", path: "/settting", icon: Settings},
  { name: "LogOut", path: "/logout", icon: Logout},
];
export function Sidebar() {
    const location = useLocation(); 
    const currentPath = location.pathname;

    return (
        <div className="flex flex-col h-full w-full">
            {/* Navigation */}
            <nav className="flex flex-col gap-2 px-3 w-full">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = currentPath === item.path; 

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                "group flex items-center h-12 w-full px-4 rounded-xl transition-all duration-200",
                                isCurrent
                                    ? " text-[#10B77F]" 
                                    : "text-[#666875] hover:text-white"
                            )}
                        >
                            <div className='flex items-center gap-4'>
                                <Icon 
                                    className={cn(
                                        "h-5 w-5 transition-colors",
                                        isCurrent ? "fill-[#10B77F]" : "fill-[#666875] group-hover:fill-white"
                                    )}
                                />
                                <p className='text-[15px] font-semibold tracking-wide'>{item.name}</p> 
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}