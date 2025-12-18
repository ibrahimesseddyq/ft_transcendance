
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye } from "lucide-react";


export function LoginPage(){
    const [activeAuth, setActiveAuth] = useState('signin');
    const navigate = useNavigate();
    const [activeGender, setActiveGender] = useState('Male');

    const handlePlayClick = () => {
        navigate('/homepage'); 
    };

    const getTabClasses = (tabName: String) => {
        const baseClasses = "h-[90%] w-[50%] rounded-full flex items-center justify-center transition-colors duration-300";
        return activeAuth === tabName 
            ? `${baseClasses} bg-[#44BC19] m-1` 
            : `${baseClasses} bg-transparent m-1`; 
    };
    
    const getTextColor = (tabName: String) => {
        return activeGender === tabName ? 'text-white' : 'text-[#A8A2A2]';
    };
    const getGender = (tabName: String) => {
        const baseClasses = "h-[90%] w-[50%] rounded-full flex items-center justify-center transition-colors duration-300";
        return activeGender === tabName 
            ? `${baseClasses} bg-[#405673] m-1` 
            : `${baseClasses} bg-transparent m-1`; 
    };
    
    const getGenderTextColor = (tabName: String) => {
        return activeAuth === tabName ? 'text-white' : 'text-[#A8A2A2]';
    };

    const Signin = () => {
        return(

            <div className="p-1 flex flex-col w-full h-full gap-2 items-center my-4">
                <div className="w-full ml-4">
                    <h2 className="text-[#FFCE22] font-electrolize text-sm ">Welcome Back!</h2>
                    <h1 className="text-md font-electrolize text-white">
                        We are happy to see you again. 
                    </h1>
                </div>
                <div className='flex mt-3 h-[40px] w-[90%] border border-[#405673] rounded-full bg-transparent items-center justify-between'>
                        <button 
                            onClick={() => {setActiveAuth('signin'); setRetate(true);}}
                            className={getTabClasses('signin')}
                            >
                            <h1 className={`text-sm font-bold ${getTextColor('signin')}`}>Sign In</h1>
                        </button>
                        <button 
                            onClick={() => {setActiveAuth('signup'); setRetate(false);}}
                            className={getTabClasses('signup')}
                        >
                            <h1 className={`text-sm font-bold ${getTextColor('signup')}`}>Sign Up</h1>
                        </button>
                </div>
                <div className="flex flex-col w-[90%] ">
                    <div className="flex justify-between items-center h-[50px] w-full mt-5 border-transparent border border-[#afb8c4] rounded-full">
                        <input
                            placeholder="Enter your email"
                            type='email'
                            className="w-full h-full text-white outline-none placeholder-white pl-5 bg-transparent"
                        />
                        <Mail className="h-10 w-14 pr-5 text-white" />
                    </div>
                    <div className="flex justify-between items-center h-[50px] w-full mt-3 border-transparent border border-[#afb8c4]  rounded-full">
                        <input
                            placeholder="Enter your Password"
                            type='password'
                            className="w-full h-full text-white outline-none placeholder-white pl-5 bg-transparent"
                        />
                        <Eye className="h-10 w-14 pr-5 text-white" />
                    </div>
                    <a href='#' className='text-[#44BC19] text-sm font-semibold hover:underline hover:cursor-pointer w-28'>Forgot Password?</a>
                    <button onClick={handlePlayClick}
                            className="text-white font-bold w-full mx-auto h-[50px] mt-5 border rounded-full bg-[#44BC19]">
                        Log in
                    </button>
                    <button onClick={handlePlayClick}
                            className="h-[50px]  flex gap-5 rounded-full w-full mt-5 mx-auto border border-[#405673] bg-transparent text-white hover:text-black hover:bg-white items-center">
                        <img    className="h-8 w-8 ml-10" 
                                src="src/assets/icons/google1.png"
                                alt="Google icon"/>
                        <h1>Log in with Google </h1>
                    </button>
                </div>
            </div>
        );
    }
    const Signup = () => {
        return(
            <div className="p-1 flex flex-col w-full h-full gap-1 items-center my-4">
                <div className="w-full ml-4">
                    <h2 className="text-[#FFCE22] font-electrolize text-sm ">Welcome!</h2>
                    <h1 className="text-md font-electrolize text-white">
                        We are happy to have you. 
                    </h1>
                </div>
                <div className='flex mt-3 h-[40px] w-[90%] border border-[#405673] rounded-full bg-transparent items-center justify-between'>
                        <button 
                            onClick={() => {setActiveAuth('signin'); setRetate(true);}}
                            className={getTabClasses('signin')}
                            >
                            <h1 className={`text-sm font-bold ${getTextColor('signin')}`}>Sign In</h1>
                        </button>
                        <button 
                            onClick={() => {setActiveAuth('signup'); setRetate(false);}}
                            className={getTabClasses('signup')}
                        >
                            <h1 className={`text-sm font-bold ${getTextColor('signup')}`}>Sign Up</h1>
                        </button>
                </div>
                <div className="flex flex-col w-[90%] items-center gap-2">
                    <div className='flex gap-4 h-[40px] w-full '>
                        <input
                            placeholder="First Name"
                            type='text'
                            className=" w-full lg:w-[60%] text-sm text-white outline-none placeholder-white mx-auto pl-3 border  border-[#405673] rounded-full  bg-transparent"
                        />
                        <input
                            placeholder="Last Name"
                            type='text'
                            className=" w-full lg:w-[60%] text-sm text-white outline-none placeholder-white mx-auto pl-3 border border-[#405673] rounded-full  bg-transparent"
                        />
                    </div>
                    <div className='flex gap-4 h-[40px] w-full'>
                        <select name="User" id="User"
                            className=" w-full lg:w-[60%] text-sm text-white outline-none 
                            placeholder-white mx-auto pl-3 border  border-[#405673] rounded-full  bg-transparent">
                                <option value="organization" className='text-black'>organization</option>
                                <option value="Developer" className='text-black'>Developer</option>
                        </select>
                        <input
                            placeholder="Number"
                            className="w-full lg:w-[60%] text-sm text-white outline-none placeholder-white mx-auto pl-3 border border-[#405673] rounded-full  bg-transparent"
                        />
                    </div>
                    <div className='flex h-[40px] w-full border border-[#405673] rounded-full bg-transparent items-center justify-between'>
                        <button 
                            onClick={() => {setActiveGender('Male'); setRetate(true);}}
                            className={getGender('Male')}
                            >
                            <h1 className={`text-sm font-bold ${getGenderTextColor('Male')}`}>Male</h1>
                        </button>
                        <button 
                            onClick={() => {setActiveGender('Female'); setRetate(false);}}
                            className={getGender('Female')}
                        >
                            <h1 className={`text-sm font-bold ${getGenderTextColor('Female')}`}>Female</h1>
                        </button>
                    </div>
                    <input
                            placeholder="Enter Your Email"
                            className="h-[40px] w-full text-sm text-white outline-none placeholder-white mx-auto pl-3 border border-[#405673] rounded-full  bg-transparent"
                        />
                    <input
                            placeholder="Enter Your Password"
                            className="h-[40px] w-full text-sm text-white outline-none placeholder-white mx-auto pl-3 border  border-[#405673] rounded-full  bg-transparent"
                        />
                    <button onClick={handlePlayClick}
                            className="text-white font-bold w-full mx-auto h-[40px] border rounded-full bg-[#44BC19]">
                        Log in
                    </button>
                    <button onClick={handlePlayClick}
                            className="h-[40px] flex gap-5 rounded-full w-full mx-auto border border-[#405673] bg-transparent text-white hover:text-black hover:bg-white items-center">
                        <img    className="h-8 w-8 ml-10" 
                                src="src/assets/icons/google1.png"
                                alt="Google icon"/>
                        <h1>Log in with Google </h1>
                    </button>
                </div>
            </div>
        );
        
    }
    const [isRetate, setRetate] = useState(true);
    const retate = `${isRetate 
      ? ''
      : 'lg:col-start-2 ' 
    }`;
    
    return(
        <div className={`h-auto w-full sm:p-5 sm:w-[441px] p-0 border border-[#5F88B8] rounded-lg bg-[#09122C] mx-auto flex items-center justify-center overflow-hidden`}>
            <div className="flex-grow  h-full w-full">
                {activeAuth === 'signin' ? <Signin /> : <Signup />}
            </div>
        </div>
    );
}