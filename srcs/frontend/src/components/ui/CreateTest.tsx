import { McqSchema } from '@/utils/ZodSchema';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheck, Check, Plus, Trash2, Sparkle, DiamondPlus } from 'lucide-react';
import { useState } from 'react';

type MCQFormValues = z.infer<typeof McqSchema>;

interface TestProps {
    id: number;
    text: string;
    isCorrect: boolean;
}

const CreateTest = () => {
    const [nextId, setNextId] = useState(1);
    const [inputError, setInputError] = useState("");
    const [choices, setChoices] = useState<TestProps[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const { 
        register, 
        handleSubmit, 
        setValue,
        reset,
        formState: { errors } 
    } = useForm<MCQFormValues>({
        resolver: zodResolver(McqSchema) as any,
    });

   
    const TestSubmit = async (data: MCQFormValues) => {
        console.log("Final Form Data:", data);
        reset();
    };

    const handleAddTag = (newTag: string) => {
        const trimmedTag = newTag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            const newTags = [...tags, trimmedTag];
            setTags(newTags);
            setValue("tags", newTags);
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter(t => t !== tagToRemove);
        setTags(updatedTags);
        setValue("tags", updatedTags);
    };

    const handleAddTest = (text: string, isCorrect: boolean) => {
        if (!text.trim()) {
            setInputError("The Field Shouldn't be empty");
            return;
        }
        if (choices.length >= 4) {
            setInputError("The Test has maximum choices");
            return;
        }

        const newChoices = [...choices, { id: nextId, text, isCorrect }];
        setChoices(newChoices);
        setNextId(nextId + 1);
        setValue("choices", newChoices);
        setInputError("");
    };

    const DeleteTest = (testId: number) => {
        const updatedChoices = choices.filter((t) => t.id !== testId);
        setChoices(updatedChoices);
        setValue("choices", updatedChoices);
    };

    return (
        <form 
            onSubmit={handleSubmit(()=>TestSubmit)}
            className='flex flex-col gap-4 divide-y-2 p-5 border border-black rounded-lg overflow-hidden'
        >
            <div className='flex justify-between'>
                <div className='py-2 px-2 lg:px-4 flex gap-2 bg-slate-300/20 w-fit rounded-lg'>
                    <CopyCheck className='text-black' />
                    <h1 className='text-sm lg:text-lg font-semibold'>Multiple Choice</h1>
                </div>
                
                <select {...register("difficulty")} className="py-2 px-2 lg:px-4 flex gap-2 bg-slate-300/20 w-fit rounded-lg outline-none">
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                </select>
            </div>

            {/* Category */}
            <div className='flex flex-col gap-2 pt-5'>
                <label className='flex gap-1'>
                    <div className='h-6 w-6 bg-black text-center text-white rounded-md'>?</div>
                    <h1 className='text-black'>Category <span className='text-red-500'>*</span></h1>
                </label>
                <input 
                    type='text'
                    {...register("category")}
                    placeholder="Enter category"
                    className="w-full bg-slate-300/20 text-black border rounded-lg p-2 outline-none"
                />
                {errors.category && <p className="text-red-400 text-[10px] italic">{errors.category.message}</p>}
            </div>

            {/* explanation */}
            <div className='flex flex-col gap-2 pt-5'>
                <label className='flex gap-1'>
                    <div className='h-6 w-6 bg-black text-center text-white rounded-md'>?</div>
                    <h1 className='text-black'>explanation <span className='text-red-500'>*</span></h1>
                </label>
                <textarea
                    {...register("explanation")}
                    placeholder="Enter your explanation"
                    className="w-full bg-slate-300/20 text-black border rounded-lg p-4 outline-none min-h-[100px]"
                />
                {errors.explanation && <p className="text-red-400 text-[10px] italic">{errors.explanation.message}</p>}
            </div>

            {/* Question */}
            <div className='flex flex-col gap-2 pt-5'>
                <label className='flex gap-1'>
                    <div className='h-6 w-6 bg-black text-center text-white rounded-md'>?</div>
                    <h1 className='text-black'>Question <span className='text-red-500'>*</span></h1>
                </label>
                <textarea
                    {...register("question")}
                    placeholder="Enter your question"
                    className="w-full bg-slate-300/20 text-black border rounded-lg p-4 outline-none min-h-[100px]"
                />
                {errors.question && <p className="text-red-400 text-[10px] italic">{errors.question.message}</p>}
            </div>

            {/* Choices */}
            <div className='flex flex-col gap-2 pt-5'>
                <h1 className='text-black'>Choices <span className='text-red-500'>* (Need 4)</span></h1>
                <div className='flex flex-col gap-4 items-center w-full'>
                    <AddChoice onAdd={handleAddTest} setInputError={setInputError} />
                    {inputError && <p className='text-red-500 text-sm w-full'>{inputError}</p>}
                    {errors.choices && <p className="text-red-400 text-sm w-full italic">{errors.choices.message}</p>}
                    
                    <div className='w-full flex flex-col gap-2'>
                        {choices.map((item) => (
                            <DisplayChoice key={item.id} Item={item} onDelete={DeleteTest} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className='flex flex-col gap-2 pt-5'>
                <h1 className='text-black font-semibold'>Tags</h1>
                <SingleTagInput tags={tags} onAddTag={handleAddTag} />
                <div className='flex flex-wrap gap-2 mt-3'>
                    {tags.map((tag, index) => (
                        <div key={index} className='flex items-center gap-2 bg-slate-200 px-3 py-1.5 rounded-md border border-slate-300'>
                            <span className='text-sm font-medium'>#{tag}</span>
                            <button type="button" onClick={() => removeTag(tag)} className='text-slate-500 hover:text-red-500'>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Points */}
            <div className='flex flex-wrap gap-4 pt-5'>
                <CardField 
                    title="Mark as point" 
                    tag="Points" 
                    name="points" 
                    register={register} 
                    error={errors.points?.message} 
                    placeholder="1" 
                    type="number"
                />
            </div>

            <button
                type='submit'
                className="group flex rounded-md text-white text-lg max-w-fit h-12 items-center mx-auto bg-gradient-to-r from-[#00adef] to-slate-700 px-7 py-2 shadow-md mt-6"
            >
                <div className="flex items-center gap-4">
                    <DiamondPlus className="w-5 h-5 text-white group-hover:text-green-400" /> 
                    <p className="font-medium text-base text-white">Save Test</p>
                </div>
            </button>
        </form>
    );
}

const AddChoice = ({ onAdd, setInputError }: any) => {
    const [checkBox, setCheckBox] = useState(false);
    const [text, setText] = useState("");

    return (
        <div className='flex gap-2 items-center w-full'>
            <input 
                type='checkbox'
                checked={checkBox}
                onChange={() => setCheckBox(!checkBox)} 
                className="h-6 w-6"
            />
            <input 
                type='text' 
                value={text} 
                onChange={(e) => { setText(e.target.value); setInputError(""); }} 
                placeholder='Add choice here...'
                className='flex-1 h-12 bg-slate-300/20 p-2 border rounded-lg outline-none'
            />
            <button 
                type='button' 
                onClick={() => { if(text){ onAdd(text, checkBox); setText(""); setCheckBox(false); }}} 
                className='h-12 px-4 flex gap-2 items-center bg-slate-300/20 border-2 border-dashed rounded-lg'
            >
                <Plus size={18}/>
                <span className="font-semibold">ADD</span>
            </button>
        </div>
    );
}

const DisplayChoice = ({ Item, onDelete }: any) => (
    <div className='flex gap-2 items-center w-full'>
        <div className={`h-6 w-6 flex items-center justify-center rounded-sm border ${Item.isCorrect ? 'bg-[#00adef]' : 'bg-white'}`}>
            {Item.isCorrect && <Check className='text-white w-4 h-4' />}
        </div>
        <div className='min-h-10 flex-1 bg-slate-300/20 p-2 border rounded-lg flex items-center'>
            {Item.text}
        </div>
        <button type="button" onClick={() => onDelete(Item.id)} className='p-2 bg-slate-300/20 rounded-lg hover:text-red-600'>
            <Trash2 size={20} />
        </button>
    </div>
);

const CardField = ({ title, tag, name, register, error, placeholder, type }: any) => (
    <div className='flex flex-col gap-2'>
        <h1 className="font-semibold">{title}</h1>
        <div className='flex items-center gap-2 py-2 px-4 rounded-lg bg-slate-300/20 border'>
            <input
                min={1}
                max={5}
                type={type} 
                {...register(name, { valueAsNumber: type === "number" })} 
                placeholder={placeholder}
                className='bg-transparent outline-none w-16'
            />
            <div className='flex gap-2 border-l pl-2 items-center'>
                <p className="text-sm">{tag}</p>
                <Sparkle size={16}/>
            </div>
        </div>
        {error && <p className="text-red-400 text-[10px] italic">{error}</p>}
    </div>
);

const SingleTagInput = ({ tags, onAddTag }: any) => {
    const [currentTag, setCurrentTag] = useState("");
    console.log("tags:", tags);
    return (
        <div className='flex gap-2'>
            <input 
                type='text' 
                value={currentTag} 
                onChange={(e) => setCurrentTag(e.target.value)} 
                onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); onAddTag(currentTag); setCurrentTag(""); }}}
                placeholder='Type tag...'
                className='h-12 flex-1 bg-slate-300/20 p-2 border rounded-lg outline-none'
            />
            <button type='button' onClick={() => { onAddTag(currentTag); setCurrentTag(""); }} className='h-12 px-4 border-2 border-dashed rounded-lg'>
                <Plus size={18} />
            </button>
        </div>
    );
};

export default CreateTest;