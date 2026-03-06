// src/components/ui/CreateTest.tsx
import { useState, useEffect } from 'react';
import { quizApi } from '@/utils/Api';
import Notification from '@/utils/TostifyNotification';
import { Plus, Trash2, FlaskConical, DiamondPlus } from 'lucide-react';

interface Mcq {
    id: string;
    question: string;
    difficulty: string;
    category: string;
}

interface CreateTestProps {
    onSuccess?: () => void;
}

const CreateTest = ({ onSuccess }: CreateTestProps) => {
    const [availableMcqs, setAvailableMcqs] = useState<Mcq[]>([]);
    const [selectedMcqIds, setSelectedMcqIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: '',
        description: '',
        durationMinutes: 30,
        passingScore: 70,
        category: '',
        difficulty: 'MEDIUM',
    });

    useEffect(() => {
        quizApi.get('/api/mcqs')
            .then(res => setAvailableMcqs(res.data?.data || []))
            .catch(() => Notification('Failed to load MCQs', 'error'))
            .finally(() => setLoading(false));
    }, []);

    const toggleMcq = (id: string) => {
        setSelectedMcqIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedMcqIds.length === 0) {
            Notification('Please select at least one MCQ', 'error');
            return;
        }
        try {
            await quizApi.post('/api/tests', {
                ...form,
                type: 'QUIZ',
                durationMinutes: Number(form.durationMinutes),
                passingScore: Number(form.passingScore),
                mcqs: selectedMcqIds,
            });
            Notification('Test created successfully!', 'success');
            setForm({ title: '', description: '', durationMinutes: 30, passingScore: 70, category: '', difficulty: 'MEDIUM' });
            setSelectedMcqIds([]);
            onSuccess?.();
        } catch (err: any) {
            Notification(err.response?.data?.message || 'Error creating test', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit}
            className='flex flex-col gap-4 divide-y-2 divide-gray-200 dark:divide-gray-800 p-5 
                border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-slate-900'>

            {/* Header */}
            <div className='flex justify-between items-center'>
                <div className='py-2 px-4 flex gap-2 bg-slate-300/20 dark:bg-slate-700/30 w-fit rounded-lg'>
                    <FlaskConical className='text-[#00adef]' />
                    <h1 className='text-lg font-semibold text-black dark:text-white'>Create Test</h1>
                </div>
                <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}
                    className="py-2 px-4 bg-slate-300/20 dark:bg-slate-700/30 text-black dark:text-white w-fit rounded-lg outline-none">
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                </select>
            </div>

            {/* Basic fields */}
            <div className='flex flex-col gap-4 pt-5'>
                {[
                    { label: 'Title', key: 'title', type: 'text', placeholder: 'e.g. JavaScript Fundamentals' },
                    { label: 'Category', key: 'category', type: 'text', placeholder: 'e.g. JavaScript' },
                    { label: 'Description', key: 'description', type: 'textarea', placeholder: 'Describe this test...' },
                ].map(field => (
                    <div key={field.key} className='flex flex-col gap-2'>
                        <label className='text-black dark:text-white font-medium capitalize'>{field.label}</label>
                        {field.type === 'textarea' ? (
                            <textarea value={(form as any)[field.key]}
                                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 text-black dark:text-white 
                                    border border-gray-200 dark:border-gray-700 rounded-lg p-3 outline-none min-h-[80px] focus:border-[#00adef]"
                            />
                        ) : (
                            <input type='text' value={(form as any)[field.key]}
                                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                placeholder={field.placeholder} required={field.key === 'title'}
                                className="w-full bg-slate-100/50 dark:bg-slate-800/50 text-black dark:text-white 
                                    border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:border-[#00adef]"
                            />
                        )}
                    </div>
                ))}

                <div className='flex gap-4'>
                    <div className='flex flex-col gap-2 flex-1'>
                        <label className='text-black dark:text-white font-medium'>Duration (minutes)</label>
                        <input type='number' value={form.durationMinutes}
                            onChange={e => setForm(f => ({ ...f, durationMinutes: Number(e.target.value) }))}
                            className="bg-slate-100/50 dark:bg-slate-800/50 text-black dark:text-white 
                                border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:border-[#00adef]"
                        />
                    </div>
                    <div className='flex flex-col gap-2 flex-1'>
                        <label className='text-black dark:text-white font-medium'>Passing Score (%)</label>
                        <input type='number' value={form.passingScore}
                            onChange={e => setForm(f => ({ ...f, passingScore: Number(e.target.value) }))}
                            className="bg-slate-100/50 dark:bg-slate-800/50 text-black dark:text-white 
                                border border-gray-200 dark:border-gray-700 rounded-lg p-2 outline-none focus:border-[#00adef]"
                        />
                    </div>
                </div>
            </div>

            {/* MCQ Picker */}
            <div className='flex flex-col gap-3 pt-5'>
                <h1 className='text-black dark:text-white font-medium'>
                    Select MCQs <span className='text-red-500'>*</span>
                    <span className='ml-2 text-sm text-gray-400'>({selectedMcqIds.length} selected)</span>
                </h1>

                {loading ? (
                    <p className='text-gray-400 text-sm animate-pulse'>Loading MCQs...</p>
                ) : availableMcqs.length === 0 ? (
                    <p className='text-gray-400 text-sm'>No MCQs available. Create some first.</p>
                ) : (
                    <div className='flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1'>
                        {availableMcqs.map(mcq => {
                            const isSelected = selectedMcqIds.includes(mcq.id);
                            return (
                                <div key={mcq.id} onClick={() => toggleMcq(mcq.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                                        ${isSelected
                                            ? 'border-[#00adef] bg-[#00adef]/5'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-[#00adef]/50'}`}>
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0
                                        ${isSelected ? 'bg-[#00adef] border-[#00adef]' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {isSelected && <span className='text-white text-xs font-bold'>✓</span>}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm text-black dark:text-white truncate'>{mcq.question}</p>
                                        <p className='text-[10px] text-gray-400'>{mcq.category} · {mcq.difficulty}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className='pt-5 flex justify-end'>
                <button type='submit'
                    className="group flex rounded-xl text-white text-lg h-12 items-center bg-[#00adef] 
                        hover:bg-[#008dbf] px-8 py-2 shadow-lg shadow-[#00adef]/20 transition-all active:scale-95">
                    <div className="flex items-center gap-3">
                        <DiamondPlus className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                        <p className="font-bold text-base">Create Test</p>
                    </div>
                </button>
            </div>
        </form>
    );
};

export default CreateTest;