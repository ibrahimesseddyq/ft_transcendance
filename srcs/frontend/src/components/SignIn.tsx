import { useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
import Icon  from '@/components/ui/Icon'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/utils/ZodSchema";
import { useAuthStore } from '@/utils/ZuStand';
import { useNavigate } from 'react-router-dom';
import Notification from "@/utils/TostifyNotification"
import { mainService } from '@/utils/Api';

const Signin = () => {
    const [passtype, setPasstype] = useState('password');
    const [PassIcon, setPassIcon] = useState<any>(Eye);

    const navigate = useNavigate();
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const setFirstLogin = useAuthStore((state) => state.setFirstLogin);
    const setUserId = useAuthStore((state) => state.setUserId);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;
    const BACKEND_URL = import.meta.env.VITE_SERVICE_URL;

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
            setPassIcon(Eye);
        }
        else {
            setPasstype('password');
            setPassIcon(EyeOff);
        }
    }
    
    
    const GoogleSubmit = () => {
        window.location.href = `${BACKEND_URL}${env_main_api}/auth/google`;
    }


    const LoginSubmit = async (data: any) => {
        try {
            clearAuth();
            const response = await mainService.post(`${env_main_api}/auth/login`, data);
            const result = response.data?.data;
            const userId = result?.id;
         
            setFirstLogin(result?.firstLogin);

            if (userId) {
                setUserId(userId);
                reset();
                navigate("/Otp", { replace: true });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Login failed";
            Notification(errorMessage, "error");
        } 
    };

    return (
        <div className="w-full h-full flex flex-col items-center gap-4 p-4 overflow-auto no-scrollbar">
            {/* Sign In Header Badge */}
            <div className='border rounded-xl px-5 border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-[#121b31]
                    whitespace-nowrap overflow-hidden mb-6'>
                <h1 className='text-black dark:text-surface-main whitespace-nowrap overflow-hidden'>Sign In</h1>
            </div>
            
            <div className='h-auto w-full max-w-[350px] flex flex-col gap-4 overflow-hidden my-auto'>
                <div className="w-full h-auto">
                    <h2 className="text-primary font-electrolize text-sm whitespace-nowrap overflow-hidden">
                        Welcome Back!
                    </h2>
                    <h1 className="text-md font-electrolize text-black dark:text-surface-main whitespace-nowrap overflow-hidden transition-colors">
                        We are happy to see you again.
                    </h1>
                </div>

                <div className="flex flex-col h-full w-[90%] items-center gap-2 place-content-center overflow-hidden">
                    <form onSubmit={handleSubmit(LoginSubmit)} className='flex flex-col gap-2 w-full'>
                        
                        {/* Email Input Container */}
                        <div className="flex justify-between items-center h-[50px] px-5
                                w-full border border-gray-300 dark:border-gray-800 rounded-md focus-within:border-primary transition-colors">
                            <input
                                {...register("email", { required: true })}
                                placeholder="Enter your Email"
                                className="w-full h-full text-black dark:text-surface-main whitespace-nowrap
                                    outline-none placeholder-gray-500 bg-transparent overflow-hidden"
                            />
                            <Icon name='Mail' className="h-5 w-5 text-gray-500 whitespace-nowrap overflow-hidden" />
                        </div>
                        {errors.email && <p className="pl-5 text-red-500 text-xs italic">{errors.email.message}</p>}

                        {/* Password Input Container */}
                        <div className="flex justify-between items-center h-[50px] 
                                w-full border border-gray-300 dark:border-gray-800 rounded-md px-5 focus-within:border-primary transition-colors">
                            <input
                                {...register("password", { required: true })}
                                placeholder="Enter your Password"
                                type={passtype}
                                className="w-full h-full text-black dark:text-surface-main whitespace-nowrap
                                    outline-none placeholder-gray-500 bg-transparent overflow-hidden"
                            />
                            <PassIcon onClick={handleToggle}
                                className='cursor-pointer h-5 w-5 text-gray-500 hover:text-primary transition-colors whitespace-nowrap overflow-hidden' />
                        </div>
                        {errors.password && <p className="pl-5 text-red-500 text-xs italic">{errors.password.message}</p>}

                        <button type="submit"
                            className="h-[45px] w-full text-surface-main font-bold whitespace-nowrap
                                    mx-auto rounded-lg bg-primary hover:bg-[#0086b8] transition-colors overflow-hidden">
                            Log in
                        </button>
                    </form>

                    {/* Google Login Button */}
                    <button onClick={GoogleSubmit}
                            className="h-[45px] w-full flex gap-5 rounded-lg border overflow-hidden
                             border-gray-300 dark:border-gray-800 justify-center bg-transparent text-black dark:text-surface-main
                            hover:bg-black hover:text-surface-main dark:hover:bg-surface-main dark:hover:text-black transition-all items-center mt-2">
                        <img className="h-6 w-6" 
                             src="/icons/google.png"
                             alt="Google icon"/>
                        <span className='text-xs lg:text-sm font-semibold whitespace-nowrap'>Log in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signin;