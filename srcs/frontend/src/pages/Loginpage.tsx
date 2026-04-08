import { useState } from 'react';
import { FeaturesSection } from "@/components/FeaturesSection";
import Signin from "@/components/SignIn";
import Signup from "@/components/SignUp";
import { ToastContainer } from "react-toastify";
import { Lock, UserPlus } from 'lucide-react';

export function LoginPage() {
  const [activeCard, setActiveCard] = useState<string>('signin');

  const getTabClasses = (tabName: string) => {
    let baseClasses = "relative maincard auth-card-transition cursor-pointer overflow-hidden rounded-2xl shadow-xl shadow-primary/20 border dark:border-gray-800 ";
    
    const isActive = activeCard === tabName;

    if (isActive) {
      baseClasses += 'bg-surface-main dark:bg-black/30 z-20 scale-100 min-h-[500px] h-auto w-full md:h-full md:w-[85%] shadow-2xl shadow-primary/30';
    } else {
      baseClasses += 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 z-10 scale-90 h-[100px] w-full md:h-full md:w-[15%] hover:scale-95 hover:shadow-lg dark:hover:shadow-primary/10 hover:border-primary/30 dark:hover:border-primary/20 group';
    }
    
    return baseClasses;
  };

  return (
    <div className="w-full  md:max-w-[1500px] mx-auto my-auto flex flex-col 
      md:flex-row gap-8 p-4 overflow-y-auto custom-scrollbar items-center justify-center">

      <ToastContainer />
      <div className="order-first md:order-last w-full max-w-[450px] md:w-[450px] h-full mx-auto">
        <div className="w-full h-full max-h-[1200px] flex flex-col md:flex-row gap-6 items-center justify-center">
          
          {/* Sign In Card */}
          <button
            onClick={() => setActiveCard('signin')}
            role="tab"
            aria-selected={activeCard === 'signin'}
            aria-controls="signin-panel"
            className={getTabClasses('signin') + ' md:will-change-auto'}
          >
            {activeCard === 'signin' ? (
              <div className="w-full h-full auth-content-enter">
                <Signin />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full gap-3 group-hover:gap-4 transition-all">
                <Lock className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary/70 group-hover:scale-110 transition-all" />
                <span className="text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wide group-hover:text-primary/80 transition-colors">
                  Sign In
                </span>
              </div>
            )}
          </button>

          {/* Sign Up Card */}
          <button
            onClick={() => setActiveCard('signup')}
            role="tab"
            aria-selected={activeCard === 'signup'}
            aria-controls="signup-panel"
            className={getTabClasses('signup') + ' md:will-change-auto'}
          >
            {activeCard === 'signup' ? (
              <div className="w-full h-full auth-content-enter">
                <Signup />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full w-full gap-3 group-hover:gap-4 transition-all">
                <UserPlus className="w-6 h-6 text-gray-500 dark:text-gray-400 group-hover:text-primary/70 group-hover:scale-110 transition-all" />
                <span className="text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wide group-hover:text-primary/80 transition-colors">
                  Sign Up
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="order-last md:order-first flex-1 h-auto md:h-full overflow-y-auto no-scrollbar pb-10 md:pb-0">
          <FeaturesSection />
      </div>

    </div>
  );
}