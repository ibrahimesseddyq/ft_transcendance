import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateJobSchema } from "@/utils/ZodSchema";
import Notification from "@/utils/TostifyNotification"

const JobForm = () => {
        const {
            register,
            handleSubmit,
            reset,
            formState: { errors }
            } = useForm<z.infer<typeof CreateJobSchema>>({
            resolver: zodResolver(CreateJobSchema),
        });
        interface Job {
            id: number;
            category: string;
            title: string;
            description: string;
            type: string;
            location: string;
            salary: string;
          }
          
          const Job = {
            category: "Enginering",
            title: "Front-End",
            description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
            type: "Full-time",
            location: "Remote",
            salary: "10 000-15 000"
          };
        const [jobsArray, setJobsArray] = useState<Job[]>(
            Array.from({ length: 1 }, (_, i) => ({
              id: i + 1,
              ...Job
            }))
            );
            const handleAddJob = () => {
              const newjobsArray = prompt("Enter new jobsArray:");
              if (newjobsArray && newjobsArray.trim()) {
                const category = prompt("Enter category (e.g., webDev, CS):");
                if (!category || !category.trim()) return;
          
                const title = prompt("Enter title (e.g., webDev, CS):");
                if (!title || !title.trim()) return;
          
                const description = prompt("Enter description :");
                if (!description || !description.trim()) return;
          
                const type = prompt("Enter type (e.g., Full-time):");
                if (!type || !type.trim()) return;
                
                const location = prompt("Enter location :");
                if (!location || !location.trim()) return;
                
                const salary = prompt("Enter salary in dolar (e.g., 10 000):");
                if (!salary || !salary.trim()) return;
          
                setJobsArray([...jobsArray, {
                  id: Date.now(),
                  category: category.trim(),
                  title: title.trim(),
                  description: description.trim(),
                  type: type.trim(),
                  location: location.trim(),
                  salary: salary.trim()
                }]);
              }
            };
          
            const handleDeleteJob = (id:Number) => {
              setJobsArray(jobsArray.filter(jobsArray => jobsArray.id !== id));
            };
        const JobSubmit = async (data: any) => {
            // try {
            //     const response = await fetch("http://localhost:3000/api/auth/login", {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //         },
            //         body: JSON.stringify(data),
            //     });
            
            //     if (!response.ok) {
            //         throw new Error(`Server responded with status: ${response.status}`);
            //     }
            //     Notification("succes Login", "success");
            //     window.location.href = '/dashboard'
            // } catch (error) {
            //     console.error("Submission failed:", error);
            //     Notification("error Login", "error");
            // } finally{

            // }
            reset();
        };
        return(
            <div className="h-full w-full flex flex-col  items-center">
                <div className='border rounded-xl px-5 border-[#1e2e52] bg-[#121b31]
                    whitespace-nowrap overflow-hidden'>
                    <h1 className='text-white whitespace-nowrap overflow-hidden'>Job From</h1>
                </div>
                <div className='h-auto w-full max-w-[350px] my-auto'>
                    <div className="w-64 h-12 overflow-hidden ">
                        <h2 className="text-[#10B77F] font-electrolize text-sm ">Welcome !</h2>
                        <h1 className="text-md font-electrolize text-white">
                            Pleas fill the job information. 
                        </h1>
                    </div>
                    <div className="flex flex-col h-full w-[90%] items-center gap-2 place-content-center overflow-hidden ">
                        <form  onSubmit={handleSubmit(JobSubmit, (errors) => console.log("Validation Errors:", errors))}
                            className='flex flex-col gap-2 w-full'>
                            <div className='flex gap-2 justify-between h-[45px] w-full'>
                                <div className=''>
                                    <input
                                        {...register("title", { required: true })}
                                        placeholder="First Name"
                                        className="h-full w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                        placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                                    {errors.title && <p className="pl-5 text-red-500 text-xs">{errors.title.message}</p>}
                                </div>
                                <div className=''>
                                    <input
                                        {...register("department", { required: true })}
                                        placeholder="First Name"
                                        className="h-full w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                        placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                                    {errors.department && <p className="pl-5 text-red-500 text-xs">{errors.department.message}</p>}
                                </div>
                            </div>
                            <div className='flex gap-2 justify-between h-[45px] w-full'>
                                <input
                                    {...register("requirements", { required: true })}
                                    placeholder="First Name"
                                    className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                    placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                                {errors.requirements && <p className="pl-5 text-red-500 text-xs">{errors.requirements.message}</p>}
                                <input
                                    {...register("location", { required: true })}
                                    placeholder="First Name"
                                    className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                    placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                                {errors.location && <p className="pl-5 text-red-500 text-xs">{errors.location.message}</p>}
                            </div>
                            <div className='flex gap-2 justify-between h-[45px] w-full'>
                                <input
                                    {...register("employmentType", { required: true })}
                                    placeholder="First Name"
                                    className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                    placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                                {errors.employmentType && <p className="pl-5 text-red-500 text-xs">{errors.employmentType.message}</p>}
                                <input
                                    {...register("createdBy", { required: true })}
                                    placeholder="First Name"
                                    className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                    placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                                {errors.createdBy && <p className="pl-5 text-red-500 text-xs">{errors.createdBy.message}</p>}
                            </div>
                            <input
                                {...register("description", { required: true })}
                                placeholder="First Name"
                                className="h-[45px] w-full text-sm text-white outline-none whitespace-nowrap overflow-hidden
                                placeholder-white mx-auto px-3 border border-[#405673] rounded-md bg-transparent"/>
                            {errors.description && <p className="pl-5 text-red-500 text-xs">{errors.description.message}</p>}
                            <button  type="submit"
                                className="h-[45px] w-[90%] text-black font-bold whitespace-nowrap
                                    mx-auto  rounded-lg bg-[#10B77F] overflow-hidden">
                                Post Job
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

export default JobForm;