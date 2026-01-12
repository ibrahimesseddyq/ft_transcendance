import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {LoginSchema } from "@/utils/ZodSchema";

interface SigninProps {
  getTabClasses: (tab: string) => string;
  getTextColor: (tab: string) => string;
  setActiveAuth: (tab: 'signin' | 'signup') => void;
}

const Signin = ({getTabClasses, getTextColor, setActiveAuth}:SigninProps) => {
        const [passtype, setPasstype] = useState('password');
        const [Icon, setIcon] = useState<any>(Eye);

        const {
            register,
            handleSubmit,
            reset,
            formState: { errors }
            } = useForm<z.infer<typeof LoginSchema>>({
            resolver: zodResolver(LoginSchema),
        });

        const handleToggle = ()=>{
            if (passtype === 'password'){
                setPasstype('text');
                setIcon(Eye);
            }
            else{
                setPasstype('password');
                setIcon(EyeOff);
            }
        }
        const LoginSubmit = async (data: any) => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
            
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }
            
                const result = await response.json();
                console.log("Success:", result);
                alert("Form submitted successfully!"); 
            } catch (error) {
                console.error("Submission failed:", error);
                alert("Something went wrong. Please try again.");
            }
            reset();
        };

        return(

            <div className="flex flex-col w-full h-full items-center p-2 border rounded-md bg-[#0e1732]">
                <div className="w-full ml-4">
                    <h2 className="text-[#FFCE22] font-electrolize text-sm ">Welcome Back!</h2>
                    <h1 className="text-md font-electrolize text-white">
                        We are happy to see you again. 
                    </h1>
                </div>
                <div className='flex mt-3 h-[60px] w-[90%] border border-[#405673] rounded-full bg-transparent items-center justify-between'>
                        <button 
                            onClick={() => {setActiveAuth('signin'); }}
                            className={getTabClasses('signin')}
                            >
                            <h1 className={getTextColor('signin')}>Sign In</h1>
                        </button>
                        <button 
                            onClick={() => {setActiveAuth('signup'); }}
                            className={getTabClasses('signup')}
                        >
                            <h1 className={getTextColor('signup')}>Sign Up</h1>
                        </button>
                </div>
                <div className="flex flex-col gap-2 h-full w-[90%] place-content-center">
                    <form  onSubmit={handleSubmit(LoginSubmit, (errors) => console.log("Validation Errors:", errors))}
                        className='flex flex-col w-full'>
                        <div className="flex justify-between items-center h-[50px] w-full mt-5 border border-[#405673]  rounded-md">
                            <input
                                {...register("email", { required: true })}
                                placeholder="Enter your Email"
                                className="w-full h-full text-white outline-none placeholder-white pl-5 bg-transparent"
                            />
                            <Mail className="h-10 w-14 text-white px-3" />
                        </div>
                        {errors.email && <p className="pl-5 text-red-500">{errors.email.message}</p>}
                        <div className="flex justify-between items-center h-[50px] w-full mt-3  border border-[#405673]  rounded-md">
                            <input
                                {...register("password", { required: true })}
                                placeholder="Enter your Password"
                                type={passtype}
                                className="w-full h-full text-white outline-none placeholder-white pl-5 bg-transparent"
                            />
                            <Icon onClick={handleToggle} className='cursor-pointer h-10 w-14 px-3 text-white'/>
                        </div>
                        {errors.password && <p className="pl-5 text-red-500">{errors.password.message}</p>}
                        <a href='#' className='pl-[70%] text-[#44BC19] text-xs font-semibold hover:underline hover:cursor-pointer w-full '>Forgot Password?</a>
                        <button type="submit"
                            className="text-white font-bold w-full mx-auto h-[50px] mt-5  rounded-full bg-[#44BC19] hover:bg-[#67ce42]">
                            Log in
                        </button>
                    </form>
                    <a  href="http://localhost:3000/api/auth/google" 
                            className="h-[50px]  flex gap-5  rounded-full w-full mt-5 mx-auto border border-[#405673] bg-transparent text-white hover:text-black hover:bg-white items-center">
                        <img    className="h-8 w-8 ml-10" 
                                src="src/assets/icons/google1.png"
                                alt="Google icon"/>
                        <h1>Log in with Google </h1>
                    </a>
                </div>
            </div>
        );
    }

    export default Signin;