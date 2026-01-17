
import { useState, useEffect } from 'react';
import {LoginInformations} from "@/components/LoginInformations"
import Signin from "@/components/SignIn"
import Signup from "@/components/SignUp"

export function LoginPage() {
  const [activeCard, setActiveCard] = useState<string>('signin');
    
  const getTabClasses = (tabName: string) => {
    let baseClasses = "flex lg:flex-row flex-col gap-2 border maincard shadow-3xl \
                         duration-1000 cursor-pointer ";
    let childClass;
    if (tabName === "signin" && activeCard !== "signin"){
      childClass =  'top-0 lg:left-0 z-30 scale-100 h-auto min-h-[600px]  w-[100%] lg:h-[100%] lg:w-[85%]';
    }
    else if (tabName === "signin" && activeCard === "signin"){
      childClass = 'top-0 lg:left-0 z-10 scale-90 h-14 w-[100%] lg:h-[100%] lg:w-[15%] lg:max-w-[85px]';
    } 
    else if (tabName === "signup" && activeCard !== "signup"){
      childClass = 'button-0 lg:right-0 z-30 scale-100 h-auto min-h-[600px]  w-[100%] lg:h-[100%] lg:w-[85%]';
    }
    else {
      childClass = 'button-0 lg:right-0 z-10 scale-90 h-14 w-[100%] lg:h-[100%] lg:w-[15%] lg:max-w-[85px]';
    }
    return (baseClasses + childClass);
  };

  return (
    <div className="h-full w-full lg:max-w-[1500px] overfolw-auto custom-scrollbar duration-300
      grid grid-cols-1 lg:grid-cols-2 gap-5 p-2 items-center">
      <div className="h-auto lg:h-full lg:w-full order-last lg:order-first overfolw-auto custom-scrollbar">
        <LoginInformations />
      </div>
      <div className="order-first lg:order-last p-5 h-full w-full
        flex flex-col gap-5 items-center overfolw-auto custom-scrollbar">
        <div className='w-fit h-fit'>
          <h1 className=' text-center text-white text-xl font-medium'>Welcome to 
            <span className='text-xl pramary-text'> Hire Me</span> website,<br/>
            let build Your career.
          </h1>
        </div>
        <div className=" w-full max-w-[400px] h-full 
            lg:w-full lg:max-w-[550px] lg:h-full items-center 
            flex flex-col gap-2 lg:flex-row duration-1000 ">
          <div 
            onClick={() => setActiveCard('signin')} 
            className={getTabClasses('signup')}
          >
            {activeCard === 'signin' ? (
              <Signin />
            ) : (
              <h1 className="mt-4 mx-auto lg:mt-10 h-14 w-10 text-white tex-sm font-bold items-center">
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