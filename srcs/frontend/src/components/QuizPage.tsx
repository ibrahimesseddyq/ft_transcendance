import QuizCard from '@/components/ui/QuizCard'


export function QuizPage(){
    return (
        <div className="grid grid-cols-3 gap-4 overflow-y-auto no-scrollbar items-center h-screen w-full p-2 md:p-0">
            <div className="col-span-3 md:col-span-1 bg-white rounded-xl h-full w-full"></div>
            <div className="flex flex-wrap gcol-span-3 md:col-span-2 bg-white rounded-xl p-4 h-full w-full">
                <div className='flex flex-wrap gap-4 h-fit'>
                    <QuizCard Type="MultipleResponse"/>
                    <QuizCard Type="MultipleChoice"/>
                    <QuizCard Type="TrueOrFalse"/>
                </div>
                
            </div>
        </div>
    );
}