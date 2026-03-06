import CreateMcq from '@/components/ui/CreateMcq'
import CreateTest from '@/components/ui/CreateTest'
import McqsList from '@/components/ui/McqsList'
import { useState } from 'react'
import { ToastContainer } from "react-toastify";

export function QuizPage() {
    const [activeTab, setActiveTab] = useState<'mcq' | 'test'>('mcq');
    const [refreshKey, setRefreshKey] = useState(0);
    const triggerRefresh = () => setRefreshKey(k => k + 1);

    return (
        <div className="overflow-y-auto no-scrollbar items-center w-full h-screen 
            bg-white dark:bg-slate-950 rounded-xl transition-colors duration-300">
            <ToastContainer />
            <div className='grid grid-cols-4 h-full w-full lg:divide-x-2 divide-gray-200 dark:divide-gray-800 p-4 lg:p-0'>
                
                {/* Sidebar */}
                <div className="col-span-4 lg:col-span-1 gap-4 bg-transparent lg:bg-[#f3f4f6] dark:lg:bg-slate-900/50
                    h-full w-full order-last lg:order-first p-4 transition-colors">
                    <div className="mb-4 px-2">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent MCQs</h3>
                    </div>
                    <McqsList refreshKey={refreshKey} />
                </div>

                {/* Main Panel */}
                <div className="flex flex-wrap col-span-4 lg:col-span-3 h-full w-full
                    justify-center order-first lg:order-last bg-transparent">
                    <div className='items-stretch flex flex-col gap-4 h-full w-full p-4 lg:p-8 overflow-y-auto custom-scrollbar'>
                        
                        {/* Tab Switcher */}
                        <div className='flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit'>
                            <button onClick={() => setActiveTab('mcq')}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all
                                    ${activeTab === 'mcq'
                                        ? 'bg-white dark:bg-slate-900 text-[#00adef] shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                                Create MCQ
                            </button>
                            <button onClick={() => setActiveTab('test')}
                                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all
                                    ${activeTab === 'test'
                                        ? 'bg-white dark:bg-slate-900 text-[#00adef] shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                                Create Test
                            </button>
                        </div>

                        {activeTab === 'mcq' ? (
                            <>
                                <div className="mb-2">
                                    <h2 className="text-2xl font-bold text-black dark:text-white">Create New MCQ</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Add a question to your MCQ library.</p>
                                </div>
                                <CreateMcq onSuccess={triggerRefresh} />
                            </>
                        ) : (
                            <>
                                <div className="mb-2">
                                    <h2 className="text-2xl font-bold text-black dark:text-white">Bundle MCQs into a Test</h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Select MCQs from your library and create a test to assign to jobs.</p>
                                </div>
                                <CreateTest onSuccess={triggerRefresh} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}