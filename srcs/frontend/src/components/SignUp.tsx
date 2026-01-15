import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Path } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/utils/ZodSchema";


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
                const result = await response.json();
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                }
                console.log("Success:", result);
                alert("Form submitted successfully!");
            

            } catch (error) {
                console.error("Submission failed:", error);
                alert("Something went wrong. Please try again.");
            } finally{

            }
            reset();
        };

        return(
            <div className="w-full h-full flex flex-col  items-center 
                p-4 overflo overflow-auto scrollbar">
                <div className='border rounded-xl px-5 border-[#1e2e52] bg-[#121b31]
                    whitespace-nowrap overflow-hidden'>
                    <h1 className='text-white'>Sign Up</h1>
                </div>
                <div className='h-[500px] w-full max-w-[350px] flex flex-col  gap-4 
                    overflow-hidden my-auto'>
                    <div className="w-full overflow-hidden">
                        <h2 className="text-[#10B77F] font-electrolize text-sm
                            whitespace-nowrap overflow-hidden">
                            Welcome!
                        </h2>
                        <h1 className="text-md font-electrolize text-white
                            whitespace-nowrap overflow-hidden">
                            We are happy to have you. 
                        </h1>
                    </div>
                    <div className="flex flex-col h-full w-[90%] 
                        items-center gap-2 place-content-center overflow-hidden ">
                        <form onSubmit={handleSubmit(SignUpSubmit)}
                            className='flex flex-col gap-2 w-full'>

                            <input
                                {...register("firstName", { required: true })}
                                placeholder="First Name"
                                className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                            {errors.firstName && <p className="pl-5 text-red-500 text-xs">{errors.firstName.message}</p>}

                            <input
                                {...register("lastName", { required: true })}
                                placeholder="Last Name"
                                className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                            {errors.lastName && <p className="pl-5 text-red-500 text-xs">{errors.lastName.message}</p>}

                            <input
                                {...register("email", { required: true })}
                                placeholder="Enter Your Email"
                                className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                            {errors.email && <p className="pl-5 text-red-500 text-xs">{errors.email.message}</p>}

                            <input
                                {...register("password", { required: true })}
                                placeholder="Enter Your Password"
                                type='password'
                                className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                            {errors.password && <p className="pl-5 text-red-500 text-xs">{errors.password.message}</p>}

                            <button  type="submit"
                                    className="h-[45px] w-[90%] text-black font-bold mx-auto  rounded-lg bg-[#10B77F]">
                                register
                            </button>
                        </form>

                        <a href='http://localhost:3000/api/auth/google'
                                className="h-[45px] w-[90%] flex gap-5 rounded-lg
                                border border-[#405673] justify-center
                                bg-transparent text-white hover:text-black hover:bg-white items-center">
                            <img    className="h-8 w-8 " 
                                    src="src/assets/icons/google1.png"
                                    alt="Google icon"/>
                            <h1 className='text-xs lg:text-sm xl:text-md whitespace-nowrap overflow-hidden'>Log in with Google </h1>
                        </a>
                    </div>
                </div>
            </div>
        );
        
    }

    export default Signup;