import  { QuizSchema } from '@/utils/ZodSchema';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheck, Check, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CreateTest = () =>{
    const [checkBox, steCheckBox] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<z.infer<typeof QuizSchema>>({
        resolver: zodResolver(QuizSchema),
    });

    const SingleChoise = () =>{
        return (
            <div className='flex gap-2 items-center w-full'>
                {/* Check box */}
                <div onClick={()=> {steCheckBox(!checkBox)}} className='h-5 w-5 rounded-full border 
                    border-slate-300 text-center cursor-pointer'>
                    {checkBox ? <Check className='h-full w-full text-black bg-[#00adef] border rounded-full'/>: null}
                </div>
                {/* Choice */}
                <input {...register("description", { required: true })}
                    className='h-10  bg-slate-300/20 p-2
                    border outline-neutral-300 rounded-lg'
                />
                <div className='group h-10 p-2 bg-slate-300/20 rounded-lg'>
                    <Trash2 className='group-hover:text-red-600'/>
                </div>
                

            </div>
        );
    }

    return (
        <form className='flex flex-col gap-4 divide-y-2 py-4'>
            <div className='flex justify-between'>
                <div className='py-2 px-4 flex gap-2 bg-slate-300/20 w-fit rounded-lg'>
                    <CopyCheck className='text-black'/>
                    <h1 className='text-lg font-semibold'>Mutiple choice</h1>
                </div>
                <select {...register("difficulty")} className="py-2 px-4 flex gap-2 bg-slate-300/20 w-fit rounded-lg">
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
            </div>
            <div className='flex flex-col gap-2 pt-5'>
                <div className='flex gap-1'>
                    <div className='h-6 w-6 bg-black text-center text-white rounded-md'>
                        ?
                    </div>
                    <h1 className='text-black '>Question <span className='text-red-500'>*</span></h1>
                </div>
                <textarea
                    {...register("description", { required: true })}
                    placeholder="Question"
                    className="w-full h-full bg-slate-300/20 text-black whitespace-nowrap border rounded-lg p-4
                    outline-none placeholder-gray-500  overflow-hidden"
                    />
            </div>
            <button className='flex flex-col gap-2 pt-5'>
                <div className='flex gap-1'>
                    <h1 className='text-black '>Choices <span className='text-red-500'>*</span></h1>
                </div>
                <div className='flex flex-col gap-4 items-center w-full'>
                    <SingleChoise/>
                    <div className='py-2 px-4 flex gap-2 bg-slate-300/20 hover:border-[#00adef] w-fit border-2 border-dashed rounded-lg'>
                        <Plus />
                        <h1>ADD Choice</h1>
                    </div>
                </div>
            </button>
        </form>
    );
}
export default CreateTest;