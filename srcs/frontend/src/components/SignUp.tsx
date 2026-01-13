import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/utils/ZodSchema";


const Signup = () => {
        const {
          register,
          handleSubmit,
          reset,
          formState: { errors }
        } = useForm<z.infer<typeof RegisterSchema>>({
          resolver: zodResolver(RegisterSchema),
        });

        const SignUpSubmit = async (data: any) => {
            try {
                const response = await fetch("http://localhost:3000/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
            
                if (response.ok) {
                    const result = await response.json();
                    console.log("Success:", result);
                    alert("Form submitted successfully!");
                }else{
                    throw new Error(`Server responded with status: ${response.status}`);
                }
            

            } catch (error) {
                console.error("Submission failed:", error);
                alert("Something went wrong. Please try again.");
            }
            reset();
        };
        interface InputFieldProps {
          name: string;
          placeholder: string;
          type?: string;
          register: any;
          error?: string;
        }
        const InputField = ({name, placeholder, type, register, error}: InputFieldProps) =>{
            return (
                <div className='flex flex-col'>
                    <input
                        {...register(name, { required: true })}
                        type={type}
                        placeholder={placeholder}
                        className="h-[45px] w-full text-sm text-white outline-none
                            placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"
                    />
                    {error && <p className="pl-5 text-red-500 text-xs">{error}</p>}
                </div>
            );
        }

        return(
            <div className="w-full h-full flex flex-col  items-center p-4 overflow-hidden">
                <div className='my-auto h-[500px] w-full max-w-[350px] overflow-hidden'>
                    <div className="w-full ml-4 overflow-hidden">
                        <h2 className="text-[#10B77F] font-electrolize text-sm ">Welcome!</h2>
                        <h1 className="text-md font-electrolize text-white">
                            We are happy to have you. 
                        </h1>
                    </div>
                    <div className="flex flex-col ml-4 h-full w-[90%] 
                        items-center gap-2 place-content-center overflow-hidden">
                        <form onSubmit={handleSubmit(SignUpSubmit)}
                            className='flex flex-col gap-2 w-full'>
                            <InputField 
                                name="firstName" 
                                placeholder="First Name"
                                register={register}
                                error={errors.firstName?.message}
                            />
                            <InputField 
                                name="lastName" 
                                placeholder="Last Name"
                                register={register}
                                error={errors.lastName?.message}
                                />
                            <InputField 
                                name="email" 
                                placeholder="Enter Your Email"
                                register={register}
                                error={errors.email?.message}
                                />
                            <InputField 
                                name="password" 
                                placeholder="Enter Your Password"
                                register={register}
                                error={errors.password?.message}
                                />
                            <button  type="submit"
                                    className="h-[45px] w-[90%] text-black font-bold mx-auto  rounded-lg bg-[#10B77F]">
                                register
                            </button>
                        </form>
                        <a href='http://localhost:3000/api/auth/google'
                                className="h-[45px] w-[90%] flex gap-5 rounded-lg
                                border border-[#405673] justify-center
                                bg-transparent text-white hover:text-black hover:bg-white items-center">
                            <img    className="h-8 w-8" 
                                    src="src/assets/icons/google1.png"
                                    alt="Google icon"/>
                            <h1 className='text-xs lg:text-sm xl:text-md'>Log in with Google </h1>
                        </a>
                    </div>
                </div>
            </div>
        );
        
    }

    export default Signup;