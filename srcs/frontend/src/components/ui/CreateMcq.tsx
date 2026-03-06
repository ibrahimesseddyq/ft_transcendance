import { McqSchema } from '@/utils/ZodSchema';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyCheck, Check, Plus, Trash2, Sparkle, DiamondPlus } from 'lucide-react';
import { useState } from 'react';
import Notification from "@/utils/TostifyNotification";
import { quizApi } from '@/utils/Api';

type MCQFormValues = z.infer<typeof McqSchema>;

interface TestProps {
    id: string;
    text: string;
    isCorrect: boolean;
}
interface CreateMcqProps {
    onSuccess?: () => void;
}

const CreateMcq = ({ onSuccess }: CreateMcqProps) => {
    const CHOICE_IDS = ["A", "B", "C", "D"];
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
        console.log("IAm here");
        if (choices.length !== 4) {
            Notification("Please add exactly 4 choices", "error");
            return;
        }

        if (!choices.find(c => c.isCorrect)) {
            Notification("Please mark one choice as the correct answer", "error");
            return;
        }

        try {
            await quizApi.post(`/api/mcqs`, { ...data, choices, tags });
            Notification("Mcq created successfully!", "success");

            reset();
            setTags([]);
            setChoices([]);
            onSuccess?.();
        } catch (err: any) {
            Notification(err.response?.data?.message || "Error saving Mcq", "error");
        }
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

        const newChoices = [...choices, { id: CHOICE_IDS[choices.length], text, isCorrect }];
        setChoices(newChoices);
        setValue("choices", newChoices);
        setInputError("");

    };

    const DeleteTest = (testId: string) => {
        const updatedChoices = choices
            .filter((t) => t.id !== testId)
            .map((choice, index) => ({ ...choice, id: CHOICE_IDS[index] }));
        setChoices(updatedChoices);
        setValue("choices", updatedChoices);
    };

    return (
        <form 
            onSubmit={handleSubmit(TestSubmit)}
            className='flex flex-col gap-4 divide-y-2 divide-gray-200 dark:divide-gray-800 p-5 border border-gray-300 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300'
        >
            <div className='flex justify-between'>
                <div className='py-2 px-2 lg:px-4 flex gap-2 bg-slate-300/20 dark:bg-slate-700/30 w-fit rounded-lg'>
                    <CopyCheck className='text-black dark:text-white' />
                    <h1 className='text-sm lg:text-lg font-semibold text-black dark:text-white'>Multiple Choice</h1>
                </div>
                
                <select {...register("difficulty")} className="py-2 px-2 lg:px-4 flex gap-2 bg-slate-300/20 
                    dark:bg-slate-700/30 text-black dark:text-white w-fit rounded-lg outline-none border-none">
                    <option value="EASY" className="dark:bg-slate-800">EASY</option>
                    <option value="MEDIUM" className="dark:bg-slate-800">MEDIUM</option>
                    <option value="HARD" className="dark:bg-slate-800">HARD</option>
                </select>
            </div>

            {/* Category / Explanation / Question */}
            {[
                { label: "Category", name: "category", type: "text" },
                { label: "explanation", name: "explanation", type: "textarea" },
                { label: "Question", name: "question", type: "textarea" }
            ].map((field) => (
                <div key={field.name} className='flex flex-col gap-2 pt-5'>
                    <label className='flex gap-1 items-center'>
                        <div className='h-6 w-6 bg-black dark:bg-[#00adef] text-center text-white 
                            rounded-md flex items-center justify-center text-xs'>?</div>
                        <h1 className='text-black dark:text-white font-medium capitalize'>
                            {field.label} 
                            <span className='text-red-500'>*</span>
                        </h1>
                    </label>
                    {field.type === "textarea" ? (
                        <textarea
                            {...register(field.name as any)}
                            placeholder={`Enter ${field.label}`}
                            className="w-full bg-slate-100/50 dark:bg-slate-800/50 text-black dark:text-white 
                                border border-gray-200 dark:border-gray-700 rounded-lg p-4 outline-none min-h-[100px] focus:border-[#00adef]"
                        />
                    ) : (
                        <input 
                            type='text'
                            {...register(field.name as any)}
                            placeholder={`Enter ${field.label}`}
                            className="w-full bg-slate-100/50 dark:bg-slate-800/50 text-black dark:text-white 
                                border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:border-[#00adef]"
                        />
                    )}
                    {errors[field.name as keyof typeof errors] && <p className="text-red-400 text-[10px] italic">{(errors[field.name as keyof typeof errors] as any).message}</p>}
                </div>
            ))}

            {/* Choices */}
            <div className='flex flex-col gap-2 pt-5'>
                <h1 className='text-black dark:text-white font-medium'>Choices <span className='text-red-500'>* (Need 4)</span></h1>
                <div className='flex flex-col gap-4 items-center w-full'>
                    <AddChoice onAdd={handleAddTest} setInputError={setInputError} />
                    {inputError && <p className='text-red-500 text-sm w-full'>{inputError}</p>}
                    <div className='w-full flex flex-col gap-2'>
                        {choices.map((item) => (
                            <DisplayChoice key={item.id} Item={item} onDelete={DeleteTest} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className='flex flex-col gap-2 pt-5'>
                <h1 className='text-black dark:text-white font-semibold'>Tags</h1>
                <SingleTagInput tags={tags} onAddTag={handleAddTag} />
                <div className='flex flex-wrap gap-2 mt-3'>
                    {tags.map((tag, index) => (
                        <div key={index} className='flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 
                            rounded-md border border-slate-200 dark:border-slate-700'>
                            <span className='text-sm font-medium text-black dark:text-gray-300'>#{tag}</span>
                            <button type="button" onClick={() => removeTag(tag)} className='text-slate-500 hover:text-red-500 transition-colors'>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Points & Save */}
            <div className='flex flex-wrap gap-4 pt-5 items-end justify-between'>
                <CardField 
                    title="Mark as point" 
                    tag="Points" 
                    name="points" 
                    register={register} 
                    error={errors.points?.message} 
                    placeholder="50" 
                    type="number"
                />
                
                <button
                    type='submit'
                    className="group flex rounded-xl text-white text-lg h-12 items-center bg-[#00adef] 
                        hover:bg-[#008dbf] px-8 py-2 shadow-lg shadow-[#00adef]/20 transition-all active:scale-95"
                >
                    <div className="flex items-center gap-3">
                        <DiamondPlus className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" /> 
                        <p className="font-bold text-base">Save Test</p>
                    </div>
                </button>
            </div>
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
                className="h-5 w-5 accent-[#00adef]"
            />
            <input 
                type='text' 
                value={text} 
                onChange={(e) => { setText(e.target.value); setInputError(""); }} 
                placeholder='Add choice here...'
                className='flex-1 h-12 bg-slate-100/50 dark:bg-slate-800/50 text-black dark:text-white p-3 
                    border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#00adef]'
            />
            <button 
                type='button' 
                onClick={() => { if(text){ onAdd(text, checkBox); setText(""); setCheckBox(false); }}} 
                className='h-12 px-4 flex gap-2 items-center bg-white dark:bg-slate-900 border-2 border-dashed 
                    border-gray-300 dark:border-gray-700 rounded-lg text-black dark:text-white 
                    hover:border-[#00adef] dark:hover:border-[#00adef] transition-colors'
            >
                <Plus size={18} className="text-[#00adef]"/>
                <span className="font-bold text-sm">ADD</span>
            </button>
        </div>
    );
}

const DisplayChoice = ({ Item, onDelete }: any) => (
    <div className='flex gap-2 items-center w-full animate-in slide-in-from-left-2 duration-300'>
        <div className={`h-6 w-6 flex items-center justify-center rounded-md border 
            ${Item.isCorrect ? 
            'bg-[#00adef] border-[#00adef]' : 
            'bg-white dark:bg-slate-800 border-gray-300 dark:border-gray-600'}`}>
            {Item.isCorrect && <Check className='text-white w-4 h-4' />}
        </div>
        <div className='min-h-11 flex-1 bg-slate-50 dark:bg-slate-800/30 text-black dark:text-gray-200 
            p-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center text-sm'>
            {Item.text}
        </div>
        <button type="button" onClick={() => onDelete(Item.id)} 
            className='p-2.5 text-gray-400 hover:text-red-500 bg-slate-100 
                dark:bg-slate-800 rounded-lg transition-colors'>
            <Trash2 size={18} />
        </button>
    </div>
);

const CardField = ({ title, tag, name, register, error, placeholder, type }: any) => (
    <div className='flex flex-col gap-2'>
        <h1 className="font-semibold text-black dark:text-white">{title}</h1>
        <div className='flex items-center gap-2 py-2 px-4 rounded-lg bg-slate-100/50 
            dark:bg-slate-800/50 border border-gray-200 dark:border-gray-700'>
            <input
                type={type} 
                {...register(name, { valueAsNumber: type === "number" })} 
                placeholder={placeholder}
                className='bg-transparent outline-none w-16 text-black dark:text-white font-bold'
            />
            <div className='flex gap-2 border-l border-gray-300 dark:border-gray-600 pl-2 items-center'>
                <p className="text-sm text-gray-500 dark:text-gray-400">{tag}</p>
                <Sparkle size={16} className="text-yellow-500"/>
            </div>
        </div>
        {error && <p className="text-red-400 text-[10px] italic">{error}</p>}
    </div>
);

const SingleTagInput = ({ onAddTag }: any) => {
    const [currentTag, setCurrentTag] = useState("");
    return (
        <div className='flex gap-2'>
            <input 
                type='text' 
                value={currentTag} 
                onChange={(e) => setCurrentTag(e.target.value)} 
                onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); onAddTag(currentTag); setCurrentTag(""); }}}
                placeholder='Type tag and press enter...'
                className='h-12 flex-1 bg-slate-100/50 dark:bg-slate-800/50 text-black dark:text-white p-3 border 
                    border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-[#00adef]'
            />
            <button type='button' onClick={() => { onAddTag(currentTag); setCurrentTag(""); }} 
                className='group h-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 
                    rounded-lg text-gray-500 hover:border-[#00adef] dark:hover:border-[#00adef] transition-colors'>
                <Plus size={18} className='group-hover:text-[#00adef]'/>
            </button>
        </div>
    );
};

export default CreateMcq;