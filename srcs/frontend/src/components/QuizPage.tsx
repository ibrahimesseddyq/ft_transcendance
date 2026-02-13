import QuizCard from '@/components/ui/QuizCard'


export function QuizPage(){
    return (
        <div className="grid grid-cols-3 gap-4 overflow-y-auto no-scrollbar items-center h-screen w-full p-2 md:p-0">
            <div className="col-span-3 md:col-span-1 bg-gray-500 rounded-xl h-full w-full"></div>
            <div className="col-span-3 md:col-span-2 bg-gray-500 rounded-xl p-4 h-full w-full">
                <QuizCard Type="MultipleResponse"/>
                <QuizCard Type="MultipleChoice"/>
                <QuizCard Type="TrueOrFalse"/>
            </div>
        </div>
    );
}