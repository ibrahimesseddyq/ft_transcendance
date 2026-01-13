import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {LoginSchema } from "@/utils/ZodSchema";

const Signin = () => {
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
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                }
                console.log("Success:", result);
                alert("Form submitted successfully!"); 
            } catch (error) {
                console.error("Submission failed:", error);
                alert("Something went wrong. Please try again.");
            }
            reset();
        };

        return(

            <div className="w-full h-full flex flex-col  items-center p-4 overflow-hidden">
                <div className='my-auto h-[370px] w-full max-w-[350px]'>
                    <div className="w-64 h-12 ml-4 overflow-hidden ">
                        <h2 className="text-[#10B77F] font-electrolize text-sm ">Welcome Back!</h2>
                        <h1 className="text-md font-electrolize text-white">
                            We are happy to see you again. 
                        </h1>
                    </div>
                    <div className="flex flex-col h-full w-[90%] items-center gap-2 place-content-center overflow-hidden ">
                        <form  onSubmit={handleSubmit(LoginSubmit, (errors) => console.log("Validation Errors:", errors))}
                            className='flex flex-col gap-2 w-full'>
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
                            <button 
                              type="button"
                              className="w-full text-right text-[#10B77F] text-xs font-semibold hover:underline hover:cursor-pointer"
                            >
                              Forgot Password?
                            </button>
                            <button  type="submit"
                                    className="h-[45px] w-[90%] text-black font-bold mx-auto  rounded-lg bg-[#10B77F]">
                                Log in
                            </button>
                        </form>
                        <a href='http://localhost:3000/api/auth/google'
                                className="h-[45px] w-[90%] flex gap-5 rounded-lg
                                border border-[#405673] justify-center
                                bg-transparent text-white hover:text-black hover:bg-white items-center">
                            <img    className="h-8 w-8 " 
                                    src="src/assets/icons/google1.png"
                                    alt="Google icon"/>
                            <h1 className='text-xs lg:text-sm xl:text-md'>Log in with Google </h1>
                        </a>
                    </div>
                </div>

            </div>
        );
    }

    export default Signin;