
import { useState, useEffect } from 'react';
import {LoginInformations} from "@/components/LoginInformations"
import Signin from "@/components/SignIn"
import Signup from "@/components/SignUp"

export function LoginPage() {
  const [activeCard, setActiveCard] = useState<string>('signin');
    
  const getTabClasses = (tabName: string) => {
    const baseClasses = "h-full w-full flex lg:flex-row flex-col gap-2 \
                        border border-transparent hover:border-[#14cdb4] rounded-xl bg-[#131D34] shadow-2xl \
                        transition-all duration-500 ease-out cursor-pointer overflow-hidden";

    if (tabName === "signin" && activeCard !== "signin"){
      return `${baseClasses} top-0 lg:left-0 z-30 scale-100 h-[90%] w-[100%] lg:h-[100%] lg:w-[80%]`;
    }
    else if (tabName === "signin" && activeCard === "signin"){
      return `${baseClasses} top-0 lg:left-0 z-10 scale-60 h-[10%] w-[100%] lg:h-[100%] lg:w-[20%] lg:max-w-[85px]`;
    } 
    else if (tabName === "signup" && activeCard !== "signup"){
      return `${baseClasses} button-0 lg:right-0 z-30 scale-100 h-[90%] w-[100%] lg:h-[100%] lg:w-[80%]`;
    }
    else {
      return `${baseClasses} button-0 lg:right-0 z-10 scale-60 h-[10%] w-[100%] lg:h-[100%] lg:w-[20%] lg:max-w-[85px]`;
    }
  };

  return (
    <div className="h-full w-full lg:max-w-[1500px] lg:max-h-[1000px] flex flex-col lg:flex-row gap-5 p-2">
      <div className="overfolw-auto custom-scrollbar">
        <LoginInformations />
      </div>
      <div className=" p-5 w-full h-full flex flex-col gap-5 items-center">
        <div className='w-fit h-fit'>
          <h1 className=' text-center text-white text-xl font-medium'>Welcome to 
            <span className='font-bold text-xl pramary-text'> Hire Me</span> website,<br/>
            let build Your career.
          </h1>
        </div>
        <div className="w-full max-w-[400px] h-[550px] my-auto
            lg:w-full lg:max-w-[550px] lg:h-full lg:max-h-[700px]
            flex flex-col gap-2 lg:flex-row">
          <div 
            onClick={() => setActiveCard('signin')} 
            className={getTabClasses('signup')}
          >
            {activeCard === 'signin' ? (
              <Signin />
            ) : (
              <h1 className="mt-4 mx-auto lg:mt-10 h-4 w-10 text-white tex-sm font-bold items-center">
                SignIn
              </h1>
            )}
          </div>

          <div 
            onClick={() => setActiveCard('signup')} 
            className={getTabClasses('signin')}
          >
            {activeCard === 'signup' ? (
              <Signup />
            ) : (
              <h1 className="mt-4 mx-auto lg:mt-10 h-4 w-10 text-white text-sm font-bold items-center">
                SignUp
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}