import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification"

const Signup = () => {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors }
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });

    const GoogleSubmit = async () => {
        window.location.href = 'http://localhost:3000/api/auth/google';
        Notification("succes login to Google", "success");
    }

    const SignUpSubmit = async (data: any) => {
        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            Notification("succes Sign Up", "success");
            window.location.href = '/'
        } catch (error) {
            console.error("Submission failed:", error);
            Notification("error Sign Up", "error");
        }
        reset();
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-auto no-scrollbar">
            <div className='border rounded-xl px-5 border-gray-800 bg-[#121b31]
                    whitespace-nowrap overflow-hidden mb-6'>
                <h1 className='text-white whitespace-nowrap overflow-hidden'>Sign Up</h1>
            </div>

            <div className='h-auto w-full max-w-[350px] flex flex-col gap-4 overflow-hidden my-auto'>
                <div className="w-full h-auto">
                    <h2 className="text-[#00adef] font-electrolize text-sm whitespace-nowrap overflow-hidden">
                        Welcome!
                    </h2>
                    <h1 className="text-md font-electrolize text-white whitespace-nowrap overflow-hidden">
                        We are happy to have you. 
                    </h1>
                </div>

                <div className="flex flex-col h-full w-[90%] items-center gap-2 place-content-center">
                    <form onSubmit={handleSubmit(SignUpSubmit)}
                        className='flex flex-col gap-3 w-full h-auto'>

                        <div className="flex flex-col gap-1">
                            <input
                                {...register("firstName", { required: true })}
                                placeholder="First Name"
                                className="h-[45px] w-full text-sm text-white outline-none px-3 border border-gray-800 rounded-md bg-transparent focus:border-[#00adef] transition-colors placeholder:text-gray-500"
                            />
                            {errors.firstName && <p className="pl-2 text-red-500 text-[10px] italic">{errors.firstName.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <input
                                {...register("lastName", { required: true })}
                                placeholder="Last Name"
                                className="h-[45px] w-full text-sm text-white outline-none px-3 border border-gray-800 rounded-md bg-transparent focus:border-[#00adef] transition-colors placeholder:text-gray-500"
                            />
                            {errors.lastName && <p className="pl-2 text-red-500 text-[10px] italic">{errors.lastName.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <input
                                {...register("email", { required: true })}
                                placeholder="Enter Your Email"
                                className="h-[45px] w-full text-sm text-white outline-none px-3 border border-gray-800 rounded-md bg-transparent focus:border-[#00adef] transition-colors placeholder:text-gray-500"
                            />
                            {errors.email && <p className="pl-2 text-red-500 text-[10px] italic">{errors.email.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <input
                                {...register("password", { required: true })}
                                placeholder="Enter Your Password"
                                type='password'
                                className="h-[45px] w-full text-sm text-white outline-none px-3 border border-gray-800 rounded-md bg-transparent focus:border-[#00adef] transition-colors placeholder:text-gray-500"
                            />
                            {errors.password && <p className="pl-2 text-red-500 text-[10px] italic">{errors.password.message}</p>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <input
                                {...register("confirmPassword", { required: true })}
                                placeholder="Confirm Password"
                                type='password'
                                className="h-[45px] w-full text-sm text-white outline-none px-3 border border-gray-800 rounded-md bg-transparent focus:border-[#00adef] transition-colors placeholder:text-gray-500"
                            />
                            {errors.confirmPassword && <p className="pl-2 text-red-500 text-[10px] italic">{errors.confirmPassword.message}</p>}
                        </div>

                        <button type="submit"
                                className="h-[45px] w-full mt-2 text-white font-bold rounded-lg bg-[#00adef] hover:bg-[#0086b8] transition-all transform active:scale-95">
                            Register
                        </button>
                    </form>

                    <button onClick={GoogleSubmit}
                            className="h-[45px] w-full flex gap-5 rounded-lg border overflow-hidden
                             border-gray-800 justify-center bg-transparent text-white 
                            hover:bg-white hover:text-black transition-all items-center mt-2">
                        <img className="h-6 w-6" 
                             src="/public/icons/google1.png"
                             alt="Google icon"/>
                        <span className='text-xs lg:text-sm font-semibold whitespace-nowrap'>Log in with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;