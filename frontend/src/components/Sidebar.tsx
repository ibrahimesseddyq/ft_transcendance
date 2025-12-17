import {Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, MessageCircleMore ,Settings, LogOut, Trophy} from "lucide-react";
import { cn } from "@/lib/utils";


 export const navigation = [
  { name: "Home", path: "/homepage", icon: Home }, 
  { name: "Games", path: "/games", icon: Gamepad2}, 
  { name: "Chat", path: "/chat", icon: MessageCircleMore }, 
  { name: "Tournaments", path: "/tournaments", icon: Trophy}, 
  { name: "Settings", path: "/settting", icon: Settings},
  { name: "LogOut", path: "/logout", icon: LogOut},
];
export function Sidebar() {
    const location = useLocation(); 
    const currentPath = location.pathname;

    return (
        <div
            className="
                fixed bottom-0 left-0 w-full h-20
                flex items-center justify-center gap-5
                bg-transparent z-20 
                lg:relative lg:h-full lg:flex-col lg:z-0 lg:w-[10%] lg:max-w-64"
        >
            {/* Navigation */}
            <nav className="bg-[#1E212A] lg:h-[700px] lg:w-[55%] lg:max-w-28 h-full w-full
                items-center flex flex-row lg:flex-col mx-auto lg:py-8 lg:my-8
                 lg:rounded-full shadow-[0px_0px_12px_0px_#d6d6d6]">
                
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = currentPath === item.path; 

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={cn(
                                isCurrent
                                    ? "text-white" 
                                    : "text-[#666875] hover:text-yellow-400", 
                                "group flex h-[50%] w-[50%] items-center justify-center rounded-lg transition-all duration-200"
                            )}
                        >
                            <Icon className="h-[90%] w-[90%]" />
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}