import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification"
import { mainService } from '@/utils/Api';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;
    const BACKEND_URL = import.meta.env.VITE_SERVICE_URL;
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
    });

    const GoogleSubmit = async () => {
        window.location.href = `${BACKEND_URL}${env_main_api}/auth/google`;
    }

    const SignUpSubmit = async (data: any) => {
        try {
            await mainService.post(`${env_main_api}/auth/register`, data);
            Notification("succes Sign Up", "success");
            navigate('/', { replace: true });
        } catch (error) {
            Notification("error Sign Up", "error");
        }
        reset();
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-auto no-scrollbar">
            {/* Header Badge */}
            <div className='border rounded-xl px-5 border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-[#121b31]
                    whitespace-nowrap overflow-hidden mb-6 transition-colors'>
                <h1 className='text-black dark:text-surface-main whitespace-nowrap overflow-hidden'>Sign Up</h1>
            </div>

            <div className='h-auto w-full max-w-[350px] flex flex-col gap-4 overflow-y-auto custom-scrollbar my-auto'>
                <div className="w-full h-auto">
                    <h2 className="text-primary font-electrolize text-sm whitespace-nowrap overflow-hidden">
                        Welcome!
                    </h2>
                    <h1 className="text-md font-electrolize text-black dark:text-surface-main whitespace-nowrap overflow-hidden transition-colors">
                        We are happy to have you. 
                    </h1>
                </div>

                <div className="flex flex-col h-full w-[90%] items-center gap-2 place-content-center">
                    <form onSubmit={handleSubmit(SignUpSubmit)}
                        className='flex flex-col gap-3 w-full h-auto'>
                        {[
                            { name: "firstName", placeholder: "First Name", type: "text" },
                            { name: "lastName", placeholder: "Last Name", type: "text" },
                            { name: "email", placeholder: "Enter Your Email", type: "email" },
                            { name: "password", placeholder: "Enter Your Password", type: "password" },
                            { name: "confirmPassword", placeholder: "Confirm Password", type: "password" }
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col gap-1">
                                <input
                                    {...register(field.name as any, { required: true })}
                                    placeholder={field.placeholder}
                                    type={field.type}
                                    className="h-[45px] w-full text-sm text-black dark:text-surface-main 
                                        outline-none px-3 border border-gray-300 dark:border-gray-800 rounded-md bg-transparent 
                                        focus:border-primary transition-colors placeholder:text-gray-500"
                                />
                                {errors[field.name as keyof typeof errors] && (
                                    <p className="pl-2 text-red-500 text-[10px] italic">
                                        {errors[field.name as keyof typeof errors]?.message as string}
                                    </p>
                                )}
                            </div>
                        ))}

                        <button type="submit"
                                className="h-[45px] w-full text-surface-main font-bold whitespace-nowrap
                                    mx-auto rounded-lg bg-primary hover:bg-[#0086b8] transition-colors overflow-hidden">
                            Register
                        </button>
                    </form>

                    <button onClick={GoogleSubmit}
                            className="h-[45px] w-full flex gap-5 rounded-lg border overflow-hidden
                             border-gray-300 dark:border-gray-800 justify-center bg-transparent text-black dark:text-surface-main
                            hover:bg-black hover:text-surface-main dark:hover:bg-surface-main dark:hover:text-black transition-all items-center mt-2">
                        <img className="h-6 w-6" 
                             src="/icons/google.png"
                             alt="Google icon"/>
                        <span className='text-xs lg:text-sm font-semibold whitespace-nowrap'>Sign up with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;