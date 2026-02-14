import  { QuizSchema } from '@/utils/ZodSchema';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheck, Check, Plus, Trash2, Timer, DiamondPlus } from 'lucide-react';
import { useState } from 'react';

interface cardField{
    title: string;
    tag: string;
    name: string;
    register: any;
    error: any;
    placeholder: string;
    type: string;
    icon?: any;
}

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
                <div onClick={()=> {steCheckBox(!checkBox)}} className='h-5 w-5 rounded-sm border 
                    border-slate-300 text-center cursor-pointer'>
                    {checkBox ? <Check className='h-full w-full text-black bg-[#00adef] border'/>: null}
                </div>
                {/* Choice */}
                <textarea {...register("description", { required: true })}
                    className='h-12 w-full bg-slate-300/20 p-2
                    border outline-neutral-300 rounded-lg'
                />
                <div className='group h-12 w-12 p-2 bg-slate-300/20 rounded-lg'>
                    <Trash2 className='group-hover:text-red-600 h-full w-full'/>
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
            <div className='flex flex-col gap-2 pt-5'>
                <div className='flex gap-1'>
                    <h1 className='text-black '>Choices <span className='text-red-500'>*</span></h1>
                </div>
                <div className='flex flex-col gap-4 items-center w-full'>
                    <SingleChoise/>
                    <SingleChoise/>
                    <SingleChoise/>
                    <SingleChoise/>
                    <SingleChoise/>
                    <SingleChoise/>
                    <SingleChoise/>
                    <SingleChoise/>
                    <button className='py-2 px-4 flex gap-2 bg-slate-300/20 hover:border-[#00adef] w-fit border-2 border-dashed rounded-lg'>
                        <Plus />
                        <h1>ADD Choice</h1>
                    </button>
                </div>
            </div>
            <div className='flex flex-wrap gap-4 pt-5'>
                <CardField title="Estimation time" tag="Mins" name="durationMinutes" register={register} 
                    error={errors.durationMinutes?.message} placeholder="Job Title" type="number"/>
                <CardField title="Estimation time" tag="Mins" name="durationMinutes" register={register} 
                    error={errors.durationMinutes?.message} placeholder="Job Title" type="number"/>
                <CardField title="Mark as point" tag="Points" name="durationMinutes" register={register} 
                    error={errors.durationMinutes?.message} placeholder="Job Title" type="number"/>
            </div>
            <button
              type='submit'
              className={`group flex-1 rounded-md text-white text-lg max-w-fit h-12 items-center mx-auto
                bg-gradient-to-r  from-[#00adef] to-slate-700 px-7 py-2`}>
              <div className="flex items-center gap-4">
                <DiamondPlus className="w-5 h-5 text-white group-hover:text-green-400" /> 
                <p className="font-medium text-base text-white">ADD Test</p>
              </div>
            </button>
        </form>
    );
}
const CardField = ({title , tag,  name, register, error, placeholder, type }: cardField) => {
    return (
        <div className='flex-col gap-2'>
            {/* Title */}
            <h1>{title}</h1>
            {/* Box */}
            <div className='flex-1'>
                <div className='flex justify-between divide-x-2 py-2 px-4 w-fit rounded-lg bg-slate-300/20'>
                    <input type={type} {...register(name, { required: true })} placeholder={placeholder}
                        className='bg-transparent text-black mr-2 outline-none max-w-20'
                        />
                    <div className='flex gap-2 pl-2'>
                        <p>{tag}</p>
                        <Timer/>
                    </div>
                </div>
                {error && <p className="mt-1 text-red-400 text-[10px] italic">{error}</p>}
            </div>
        </div>
  );}
export default CreateTest;