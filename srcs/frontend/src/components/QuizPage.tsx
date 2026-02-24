import CreateTest from '@/components/ui/CreateTest'
import TestsList from '@/components/ui/TestsList'


export function QuizPage(){
    return (
        <div className="overflow-y-auto no-scrollbar items-center w-full h-screen bg-white rounded-xl">
            <div className='grid grid-cols-4 h-full w-full lg:divide-x-2 p-4 lg:p-0'>
                <div className="col-span-4 lg:col-span-1 gap-4 bg-transparent lg:bg-[#e9e9e9]
                    h-full w-full order-last lg:order-first p-4">
                    <TestsList />
                </div>
                <div className="flex flex-wrap col-span-4 lg:col-span-3 h-full w-full
                    justify-center order-first lg:order-last">
                    <div className='items-stretch flex flex-col gap-4 h-full w-full p-4 '>
                        <CreateTest />
                    </div>
                </div>
            </div>
        </div>
    );
}