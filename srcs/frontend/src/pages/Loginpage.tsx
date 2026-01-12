
import { useState, useEffect } from 'react';
import {LoginInformations} from "@/components/LoginInformations"
import Signin from "@/components/SignIn"
import Signup from "@/components/SignUp"

export function LoginPage() {
  const [activeCard, setActiveCard] = useState<string>('signin');
    
  const getTabClasses = (tabName: string) => {
    const baseClasses = "absolute transition-all duration-500 ease-out cursor-pointer " +
                        "border border-transparent hover:border-[#14cdb4] " +
                        "rounded-3xl bg-[#131D34] flex flex-col items-center shadow-2xl overflow-hidden " +
                        "top-1/2 -translate-y-1/2 h-full";

    const isActive = activeCard === tabName;
    const isLeftBox = tabName === 'signin';

    if (isLeftBox) {
      if (isActive) {
        return `${baseClasses} lg:left-0 z-30 opacity-100 w-[70%]`;
      } else {
        return `${baseClasses} lg:left-0 z-10 opacity-60 w-[85px]`;
      }
    } else {
      if (isActive) {
        return `${baseClasses} lg:right-[50px] z-30 opacity-100 w-[70%]`; 
      } else {
        return `${baseClasses} lg:right-[50px] z-10 opacity-60 w-[85px]`;
      }
    }
  };

  return (
    <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-1 items-center ">
      <div className="grid-cols-1 lg:col-span-2 lg:row-span-1 lg:justify-end p-5 mx-auto h-full w-full items-center">
        <div className="relative w-full h-[600px] lg:h-full flex flex-col gap-2 lg:flex-row justify-center items-center">
          <div 
            onClick={() => setActiveCard('signin')} 
            className={getTabClasses('signin')}
          >
            {activeCard === 'signin' ? (
              <Signin />
            ) : (
              <h1 className="my-auto lg:mt-10 h-4 w-10 text-white tex-sm font-bold text-center ">
                SignIn
              </h1>
            )}
          </div>

          <div 
            onClick={() => setActiveCard('signup')} 
            className={getTabClasses('signup')}
          >
            {activeCard === 'signup' ? (
              <Signup />
            ) : (
              <h1 className="my-auto lg:mt-10 h-4 w-10 text-white text-sm font-bold text-center">
                SignUp
              </h1>
            )}
          </div>
        </div>
      </div>
      <div className="grid-cols-1 lg:col-span-4 lg:row-span-1 lg:justify-start h-full w-full">
        <LoginInformations />
      </div>
    </div>
  );
}