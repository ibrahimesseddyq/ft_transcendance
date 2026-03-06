import { useState } from 'react';
import TestTakingArea from '@/components/ui/TestTakingArea';

const MOCK_TESTS = [
    { id: 1, title: "React Fundamentals", status: "current", points: 10 },
    { id: 2, title: "Tailwind CSS Styling", status: "locked", points: 5 },
    { id: 3, title: "Next.js App Router", status: "locked", points: 15 },
];

export function CandidateQuizPage() {
    const [activeTestIndex, setActiveTestIndex] = useState(0);

    return (
        <div className="overflow-y-auto no-scrollbar w-full h-screen bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
            <div className='grid grid-cols-4 h-full w-full lg:divide-x-2 divide-gray-200 dark:divide-slate-800'>
                
                {/* Sidebar */}
                <div className="col-span-4 lg:col-span-1 bg-[#e9e9e9] dark:bg-slate-900 h-full p-6 transition-colors duration-300">
                    <div className="mb-8">
                        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Job Phase</h2>
                        <h1 className="text-xl font-bold text-black dark:text-white">Technical Assessment</h1>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        {MOCK_TESTS.map((test, index) => (
                            <QuizSidebarItem 
                                key={test.id} 
                                test={test} 
                                isSelected={index === activeTestIndex} 
                                number={index + 1}
                            />
                        ))}
                    </div>
                </div>
                
                {/* Main Area */}
                <div className="col-span-4 lg:col-span-3 h-full p-4 lg:p-10 flex flex-col items-center bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-300">
                    <div className='max-w-4xl w-full'>
                        <TestTakingArea testData={MOCK_TESTS[activeTestIndex]} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const QuizSidebarItem = ({ test, isSelected, number }: any) => (
    <div className={`p-4 rounded-xl border-2 transition-all flex items-center gap-4 
        ${isSelected 
            ? 'bg-white dark:bg-slate-800 border-[#00adef] shadow-sm' 
            : 'bg-transparent border-transparent opacity-60 hover:opacity-80'}`}>
        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold
            ${isSelected 
                ? 'bg-[#00adef] text-white' 
                : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {number}
        </div>
        <div>
            <h3 className="font-semibold text-sm text-black dark:text-white">{test.title}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{test.points} Total Points</p>
        </div>
    </div>
);