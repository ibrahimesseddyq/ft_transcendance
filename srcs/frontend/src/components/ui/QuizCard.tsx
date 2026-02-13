

const QuizCard = ({Type}:any) =>{

    interface prop{
        Type:string;
    }
    const Description = ({Type}:prop)=>{
        const MultipleResponse = "hello this is Multiple Response";
        const MultipleChoice = "hello this is Multiple Choice";
        const TrueOrFalse = "hello this is True Or False";
        if (Type === "MultipleResponse")
            return (MultipleResponse);
        else if (Type === "MultipleChoice")
            return (MultipleChoice);
        return (TrueOrFalse);
    }
    return (
        <div className={`group flex flex-col gap-4 justify-between min-h-40 min-w-60 
            rounded-lg hover:duration-500 shadow-md transition duration-300 ease-out
            bg-slate-200/80 hover:bg-blue-700 p-2 bg-cover bg-center items-center
            ${Type === "MultipleResponse" ? 'hover:bg-[url(/MultipleResponse.jpg)]':
                Type === "MultipleChoice" ? 'hover:bg-[url(/MultipleChoice.jpg)]': 
                'hover:bg-[url(/TrueOrFalse.jpeg)]'}`}>
            <h1 className="text-xl font-semibold visible group-hover:invisible">{Type}</h1>
            <p className="text-sm visible group-hover:invisible"> <Description Type={Type} /></p>
            <button className="p-1 px-2 rounded-xl bg-[#00adef] text-white">Create Quiz</button>
        </div>
    );
}
export default QuizCard;