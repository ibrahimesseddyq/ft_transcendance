import { useState, useEffect } from 'react';
import { Mail, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/utils/ZodSchema";
import { ToastContainer } from "react-toastify";
import { useSearchParams, useNavigate } from 'react-router-dom';
import Notification from "@/utils/TostifyNotification"

const Signin = () => {
    const [passtype, setPasstype] = useState('password');
    const [Icon, setIcon] = useState<any>(Eye);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
    });

    const handleToggle = () => {
        if (passtype === 'password') {
            setPasstype('text');
            setIcon(Eye);
        }
        else {
            setPasstype('password');
            setIcon(EyeOff);
        }
    }

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        console.log("My google token is, ", tokenFromUrl);
        if (tokenFromUrl) {
            localStorage.setItem("token", tokenFromUrl);
            Notification("Google Login Successful", "success");
            navigate('/Dashboard', { replace: true });
        }
    }, [searchParams, navigate]);
    
    const GoogleSubmit = () => {
        window.location.href = 'http://localhost:3000/api/auth/google';
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

            const result = await response.json();
            console.log("user Data: ", result.data.user);

            if (!response.ok) {
                throw new Error(result.message || `Status: ${response.status}`);
            }
            const token = result.data?.accessToken;
            
            if (token) {
                console.log("backend accessToken = ",  token);
                localStorage.setItem("token", token);
                Notification("Success Login", "success");
                // window.location.href = '/Dashboard';
            } else {
                throw new Error("Token not found in response");
            }
        } catch (error: any) {
            console.error("Submission failed:", error);
            Notification(error.message || "Error Login", "error");
        }
        reset();
    };

    return (
        <div className="w-full h-full flex flex-col items-center gap-4 p-4 overflow-auto no-scrollbar">
            <div className='border rounded-xl px-5 border-gray-800 bg-[#121b31]
                    whitespace-nowrap overflow-hidden mb-6'>
                <h1 className='text-white whitespace-nowrap overflow-hidden'>Sign In</h1>
            </div>
            
            <div className='h-auto w-full max-w-[350px] flex flex-col gap-4 overflow-hidden my-auto'>
                <div className="w-full h-auto">
                    <h2 className="text-[#00adef] font-electrolize text-sm whitespace-nowrap overflow-hidden">
                        Welcome Back!
                    </h2>
                    <h1 className="text-md font-electrolize text-white whitespace-nowrap overflow-hidden">
                        We are happy to see you again.
                    </h1>
                </div>

                <div className="flex flex-col h-full w-[90%] items-center gap-2 place-content-center overflow-hidden">
                    <form onSubmit={handleSubmit(LoginSubmit, (errors) => console.log("Validation Errors:", errors))}
                        className='flex flex-col gap-2 w-full'>
                        
                        <div className="flex justify-between items-center h-[50px] px-5
                                w-full border border-gray-800 rounded-md focus-within:border-[#00adef] transition-colors">
                            <input
                                {...register("email", { required: true })}
                                placeholder="Enter your Email"
                                className="w-full h-full text-white whitespace-nowrap 
                                    outline-none placeholder-gray-500 bg-transparent overflow-hidden"
                            />
                            <Mail className="h-5 w-5 text-gray-500 whitespace-nowrap overflow-hidden" />
                        </div>
                        {errors.email && <p className="pl-5 text-red-500 text-xs italic">{errors.email.message}</p>}

                        <div className="flex justify-between items-center h-[50px] 
                                w-full border border-gray-800 rounded-md px-5 focus-within:border-[#00adef] transition-colors">
                            <input
                                {...register("password", { required: true })}
                                placeholder="Enter your Password"
                                type={passtype}
                                className="w-full h-full text-white whitespace-nowrap
                                    outline-none placeholder-gray-500 bg-transparent overflow-hidden"
                            />
                            <Icon onClick={handleToggle}
                                className='cursor-pointer h-5 w-5 text-gray-500 hover:text-[#00adef] transition-colors whitespace-nowrap overflow-hidden' />
                        </div>
                        {errors.password && <p className="pl-5 text-red-500 text-xs italic">{errors.password.message}</p>}

                        <button
                            type="button"
                            className="w-full text-right text-[#00adef] whitespace-nowrap
                            text-xs font-semibold hover:underline hover:cursor-pointer">
                            Forgot Password?
                        </button>

                        <button type="submit"
                            className="h-[45px] w-full text-white font-bold whitespace-nowrap
                                    mx-auto rounded-lg bg-[#00adef] hover:bg-[#0086b8] transition-colors overflow-hidden">
                            Log in
                        </button>
                    </form>

                    <button onClick={GoogleSubmit}
                            className="h-[45px] w-full flex gap-5 rounded-lg border overflow-hidden
                             border-gray-800 justify-center bg-transparent text-white 
                            hover:bg-white hover:text-black transition-all items-center mt-2">
                        <img className="h-6 w-6" 
                             src="/icons/google1.png"
                             alt="Google icon"/>
                        <span className='text-xs lg:text-sm font-semibold whitespace-nowrap'>Log in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signin;