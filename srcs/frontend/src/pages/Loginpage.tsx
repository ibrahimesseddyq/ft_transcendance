import { useState } from 'react';
import { FeaturesSection } from "@/components/FeaturesSection";
import Signin from "@/components/SignIn";
import Signup from "@/components/SignUp";

export function LoginPage() {
  const [activeCard, setActiveCard] = useState<string>('signin');

  const getTabClasses = (tabName: string) => {
    let baseClasses = "relative maincard duration-1000 transition-all cursor-pointer overflow-hidden rounded-2xl";
    
    const isActive = activeCard === tabName;

    if (isActive) {
    baseClasses += 'bg-black z-20 scale-100 min-h-[600px] h-auto w-full md:h-full md:w-[85%]';
  } else {
    baseClasses += 'bg-zinc-900 z-10 scale-95  h-[70px] w-full md:h-full md:w-[15%]';
  }
    
    return baseClasses;
  };

  return (
    <div className="w-full h-full md:max-w-[1500px] mx-auto flex flex-col 
      md:flex-row gap-8 p-4 overflow-y-auto custom-scrollbar">
    
      <div className="order-first md:order-last w-full max-w-[450px] md:w-[450px] h-full mx-auto">
        <div className="w-full h-full flex flex-col md:flex-row gap-2 items-center">
          
          {/* Sign In Card */}
          <div 
            onClick={() => setActiveCard('signin')} 
            className={getTabClasses('signin')}
          >
            {activeCard === 'signin' ? (
              <div className="w-full h-full animate-in fade-in duration-500">
                <Signin />
              </div>
            ) : (
              <h1 className="flex items-center justify-center h-full w-full 
                text-black text-sm font-bold uppercase">
                SignIn
              </h1>
            )}
          </div>

          {/* Sign Up Card */}
          <div 
            onClick={() => setActiveCard('signup')} 
            className={getTabClasses('signup')}
          >
            {activeCard === 'signup' ? (
              <div className="w-full h-full animate-in fade-in duration-500">
                <Signup />
              </div>
            ) : (
              <h1 className="flex items-center justify-center h-full w-full 
                text-black text-sm font-bold uppercase">
                SignUp
              </h1>
            )}
          </div>
        </div>
      </div>

      <div className="order-last md:order-first flex-1 h-auto md:h-full overflow-y-auto no-scrollbar pb-10 md:pb-0">
          <FeaturesSection />
      </div>

    </div>
  );
}