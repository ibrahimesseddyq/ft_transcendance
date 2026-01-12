
import { useState, useEffect } from 'react';
import {LoginInformations} from "@/components/LoginInformations"
import Signin from "@/components/SignIn"
import Signup from "@/components/SignUp"

export function LoginPage(){
    const [activeCard, setActiveCard] = useState<String>('signin');
    

    const getTabClasses = (tabName: String) => {
        const baseClasses = " relative lg:absolute h-[550px] w-full max-w-[470px] lg:max-w-[370px] lg:h-full  \
                border border-transparent hover:border-[#14cdb4]\
                rounded-3xl bg-[#0e1732]\
                place-content-center place-items-center  inset-0 duration-700 ease-in-out";
        if (activeCard === tabName)
            console.log("z-index of " + tabName + " 20");
        else
            console.log("z-index of " + tabName + " 10");
        return activeCard !== tabName 
            ? `${baseClasses} z-20 translate-x-5  scale-100 opacity-100` 
            : `${baseClasses} z-10 -translate-x-5  scale-90 opacity-90 grayscale-[20%]`; 
    };

    return(
        <div className={`h-full w-full grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-1 items-center`}>
            <div className="grid-cols-1  lg:col-span-2 lg:row-span-1 lg:justify-end p-5 mx-auto
                h-full w-full items-center">
                <div className='relative h-full w-full mx-auto 
                     items-center '>
                    <div onClick={() => {setActiveCard('signup'); }}
                        className={getTabClasses('signin')}>
                        <Signup/>
                    </div>
                    <div onClick={() => {setActiveCard('signin'); }}
                        className={getTabClasses('signup')}>
                        <Signin/>
                    </div>
                </div>
            </div>
            <div className='grid-cols-1  lg:col-span-4 lg:row-span-1 lg:justify-start h-full w-full'>
                <LoginInformations/>
            </div>
        </div>
    );
}