import QuizCard from '@/components/ui/QuizCard'
import CreateTest from '@/components/ui/CreateTest'
import TestsList from '@/components/ui/TestsList'


export function QuizPage(){
    return (
        <div className="grid grid-cols-3 gap-4 overflow-y-auto no-scrollbar items-center w-full  p-2 lg:p-0 ">
            <div className="col-span-3 lg:col-span-1 bg-white rounded-xl h-full w-full order-last lg:order-first">
                {/* <TestsList /> */}
            </div>
            <div className="flex flex-wrap col-span-3 bg-white rounded-xl lg:col-span-2  h-full w-full justify-center order-first lg:order-last">

                <div className='items-stretch flex flex-col gap-4 h-full w-full py-2 px-6'>
                    <CreateTest />
                </div>

            </div>
        </div>
    );
}