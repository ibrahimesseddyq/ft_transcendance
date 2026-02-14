import QuizCard from '@/components/ui/QuizCard'
import CreateTest from '@/components/ui/CreateTest'


export function QuizPage(){
    return (
        <div className="grid grid-cols-3 gap-4 overflow-y-auto no-scrollbar items-center h-screen w-full p-2 md:p-0">
            <div className="col-span-3 md:col-span-1 bg-white rounded-xl h-full w-full order-last md:order-first"></div>
            <div className="flex flex-wrap col-span-3 bg-white rounded-xl md:col-span-2  h-full w-full justify-center order-first md:order-last">

                <div className='items-stretch flex flex-col gap-4 h-full w-full py-2 px-6'>
                    <CreateTest />
                    {/* <QuizCard Type="MultipleResponse"/>
                    <QuizCard Type="MultipleChoice"/>
                    <QuizCard Type="TrueOrFalse"/> */}
                </div>

            </div>
        </div>
    );
}