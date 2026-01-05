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
        <div
            className="
                flex flex-col mt-28
                bg-transparent relative h-full w-auto md:w-[250px]"
        >
            {/* Navigation */}
            <nav className=" 
                 flex flex-col gap-5  ">
                
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = currentPath === item.path; 

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                isCurrent
                                    ? "text-green-600" 
                                    : "text-[#666875]", 
                                "group flex h-full w-full md:pl-14 rounded-lg transition-all duration-200"
                            )}
                        >
                            <div className='flex gap-2 hover:text-green-600'>
                                <Icon 
                                    className={cn(
                                        "h-[30px] w-[30px] fill-[#666875]  transition-all duration-200"
                                )}
                                />
                                <p className='hidden md:flex text-[20px] font-bold'>{item.name}</p> 
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}