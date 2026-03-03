import CreateTest from '@/components/ui/CreateTest'
import TestsList from '@/components/ui/TestsList'

export function QuizPage(){
    return (
        <div className="overflow-y-auto no-scrollbar items-center w-full h-screen 
            bg-white dark:bg-slate-950 rounded-xl transition-colors duration-300">
        
            <div className='grid grid-cols-4 h-full w-full lg:divide-x-2 divide-gray-200 dark:divide-gray-800 p-4 lg:p-0'>
                <div className="col-span-4 lg:col-span-1 gap-4 bg-transparent lg:bg-[#f3f4f6] dark:lg:bg-slate-900/50
                    h-full w-full order-last lg:order-first p-4 transition-colors">
                    <div className="mb-4 px-2">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent Tests</h3>
                    </div>
                    
                    <TestsList />
                </div>

                <div className="flex flex-wrap col-span-4 lg:col-span-3 h-full w-full
                    justify-center order-first lg:order-last bg-transparent">
                    <div className='items-stretch flex flex-col gap-4 h-full w-full p-4 lg:p-8 overflow-y-auto custom-scrollbar'>
                        
                        <div className="mb-2">
                            <h2 className="text-2xl font-bold text-black dark:text-white">Create New Assessment</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Configure your multiple-choice questions and difficulty settings.</p>
                        </div>
                        <CreateTest />
                    </div>
                </div>
            </div>
        </div>
    );
}