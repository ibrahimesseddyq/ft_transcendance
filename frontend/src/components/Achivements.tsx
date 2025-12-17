import { cn } from "@/lib/utils";
import {AllUsers} from "@/lib/data";

export function Achivements(){
    return (    
        <div className="flex flex-col items-center justify-center relative border w-full h-24 lg:h-full
        border-yellow-500 rounded-lg  bg-[#1E212A] hover:shadow-[0_0_15px_0px_rgba(252,_211,_77,_0.3)] overflow-auto ">
              <header className="top-0 sticky">
                <h5 className="text-center items-center font-electrolize text-xl 2lg:text-2xl w-fit mx-auto
                  text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-[#E2D800]">
                    Achivements
                </h5>
              </header>
                {/* achivements */}
                <nav className="flex space-x-4 mx-auto my-auto place-items-center place-content-center">
                        {AllUsers[0].Achiv.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.name}
                              href="#"
                              className={cn(
                                item.current
                                  ? "text-yellow-300"
                                  : "text-yellow-800 hover:text-yellow-400",
                                "group flex w-6 h-6 lg:w-8 lg:h-8 items-center justify-center rounded-lg transition-all duration-200"
                              )}
                            >
                              <Icon className="h-6 w-6 lg:w-[100%] lg:h-[100%]" />
                            </a>
                          );
                        })}
                </nav>
          
        </div>
    );
}