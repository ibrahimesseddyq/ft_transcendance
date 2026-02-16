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

interface TestProps{
    id: number;
    text: string;
    check: boolean;
}

const CreateTest = () =>{
    
    const [nextId, setNextId] = useState(1);
    const [inputError, setInputError] = useState("");

    const [tests, setTests] = useState<TestProps[]>([]);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<z.infer<typeof QuizSchema>>({
        resolver: zodResolver(QuizSchema),
        defaultValues:{
            type:"QUIZ",
            category: "",
        }
    });
    const TestSubmit = async (data: TestProps) => {
        console.log("data is = ", data)
    }

    const handleAddTest = (text:string, check:boolean)=>{
        if (!text.trim()){
            setInputError("The Field Shouldn't be empty");
            return ;
        }
        if (tests.length >= 4){
            setInputError("The Test have maximum choices");
            return ;
        }
        setTests([...tests,{id: nextId, text, check}]);
            setNextId(nextId + 1);
    }
    const DeleteTest = (testId:number) =>{
        setTests(tests.filter((t) => t.id !== testId));
    }
   
    const TestInput = ({onAdd, setInputError} : any) => {
        const [checkBox, setCheckBox] = useState(false);
        const [text, setText] = useState("");
    
        return (
            <div className='flex gap-2 items-center w-full'>
                {/* Checkbox */}
                <input 
                    type='checkbox'
                    onClick={() => setCheckBox(!checkBox)} 
                    className={`h-6 w-6 rounded-sm border border-slate-300 cursor-pointer flex items-center justify-center ${checkBox ? 'bg-[#00adef]' : 'bg-white'}`}
                />
    
                {/* Input */}
                <input 
                    type='text' 
                    value={text} 
                    onChange={(e) => {setText(e.target.value); setInputError("");}} 
                    placeholder='Add choice here...'
                    className='h-12 w-full bg-slate-300/20 p-2 border outline-neutral-300 rounded-lg'
                />
    
                <button type='button' 
                        onClick={()=>{onAdd(text, checkBox); setText(""); setCheckBox(false)}} 
                        className='h-12 px-4 flex gap-2 items-center bg-slate-300/20
                            hover:border-[#00adef] border-2 border-dashed rounded-lg'>
                    <Plus />
                    <span className="font-semibold">ADD Choice</span>
                </button>
            </div>
        );
    }
    const DesplayChoise = ({Item, onDelete}: any) =>{
        const item = Item;
        return (
            <div className='flex gap-2 items-center w-full'>
                {/* Check box */}
                <div className='h-5 w-5 rounded-sm border 
                    border-slate-300 text-center'>
                    {item.check ? <Check className='h-full w-full text-black bg-[#00adef] border'/>: null}
                </div>
                {/* Choice */}
                <div className='min-h-10 w-full text-black bg-slate-300/20 p-2 overflow-auto
                    border outline-neutral-300 rounded-lg'>
                    {item.text}
                </div>
                <div onClick={()=>{onDelete(item.id)}} 
                    className='group h-12 w-12 p-2 bg-slate-300/20 rounded-lg'>
                    <Trash2 className='group-hover:text-red-600 h-full w-full'/>
                </div>
            </div>
        );
    }

    return (
        <form className='flex flex-col gap-4 divide-y-2 p-5 border border-black rounded-lg'>
            <div className='flex justify-between'>
                <div className='py-2 px-2 lg:px-4 flex gap-2 bg-slate-300/20 w-fit rounded-lg'>
                    <CopyCheck className='text-black'/>
                    <h1 className='text-sm lg:text-lg font-semibold'>Mutiple choice</h1>
                </div>
                <div className="py-2 px-2 lg:px-4 flex gap-2 bg-slate-300/20 w-fit rounded-lg">
                  <h1 className='font-semibold text-green-600'>QUIZ</h1>
                </div>
                <select {...register("difficulty")} className="py-2 px-2 lg:px-4 flex gap-2 bg-slate-300/20 w-fit rounded-lg">
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
                    <h1 className='text-black '>Title <span className='text-red-500'>*</span></h1>
                </div>
                <input type='text'
                    {...register("title", { required: true })}
                    placeholder="Enter Title"
                    className="w-full h-full bg-slate-300/20 text-black whitespace-nowrap border rounded-lg p-2
                    outline-none placeholder-gray-500  overflow-hidden"
                />
                {errors.title && <p className="mt-1 text-red-400 text-[10px] italic">{errors.title.message}</p>}
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
                {errors.description && <p className="mt-1 text-red-400 text-[10px] italic">{errors.description.message}</p>}
            </div>
            <div className='flex flex-col gap-2 pt-5'>
                <div className='flex gap-1'>
                    <h1 className='text-black '>Choices <span className='text-red-500'>*</span></h1>
                </div>
                <div className='flex flex-col gap-4 items-center w-full'>
                    <div className='flex-1 w-full'>
                        <TestInput onAdd={handleAddTest} setInputError={setInputError}/>
                        {inputError && <p className='text-red-500 text-base'>{inputError}</p>}
                    </div>
                    {tests.map((item:any)=>(
                        <div key={item.id} className='flex flex-col gap-2 w-full'>
                            <DesplayChoise Item={item} onDelete={DeleteTest}/>
                        </div>
                    ))}
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
              type='submit' onSubmit={()=>{TestSubmit}}
              className={`group flex-1 rounded-md text-white text-lg max-w-fit h-12 items-center mx-auto
                bg-gradient-to-r  from-[#00adef] to-slate-700 px-7 py-2 shadow-md`}>
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