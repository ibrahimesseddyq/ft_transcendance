
import { useState, useEffect } from 'react';
import {LoginInformations} from "@/components/LoginInformations"
import Signin from "@/components/SignIn"
import Signup from "@/components/SignUp"

export function LoginPage(){
    const [activeAuth, setActiveAuth] = useState('signin');
    

    const getTabClasses = (tabName: String) => {
        const baseClasses = "h-[90%] w-[50%] rounded-full flex items-center justify-center transition-colors duration-300";
        return activeAuth === tabName 
            ? `${baseClasses} bg-[#44BC19] m-1` 
            : `${baseClasses} bg-transparent m-1`; 
    };
    
    const getTextColor = (tabName: String) => {
        const baseClasses = "`text-sm font-bold"
        return activeAuth === tabName
            ? `${baseClasses} text-white` 
            : `${baseClasses} text-[#A8A2A2]`; 
    };


    return(
        <div className={`h-full w-full grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-1 items-center`}>
            <div className="grid-cols-1  lg:col-span-2 lg:row-span-1 lg:justify-end h-full w-full bg-zinc-200 items-center place-content-center">
                <div className='h-[80%] w-[80%] mx-auto shadow-[0px_0px_25px_-1px_#000000]'>
                    {activeAuth === 'signin' ?
                        <Signin 
                            getTabClasses={getTabClasses} 
                            getTextColor={getTextColor} 
                            setActiveAuth={setActiveAuth} 
                        /> : 
                        <Signup 
                            getTabClasses={getTabClasses} 
                            getTextColor={getTextColor} 
                            setActiveAuth={setActiveAuth} 
                        />
                    }
                </div>
            </div>
            <div className='grid-cols-1  lg:col-span-4 lg:row-span-1 lg:justify-start h-full w-full'>
                <LoginInformations/>
            </div>
        </div>
    );
}