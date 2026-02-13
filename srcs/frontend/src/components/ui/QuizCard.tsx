

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
        <div className="flex flex-col gap-4 justify-between min-h-20 min-w-20 rounded-lg">
            <h1>{Type}</h1>
            <p> <Description Type={Type} /></p>
            <button className="p-1 px-2 rounded-xl bg-[#00adef] text-white">Create Quiz</button>
        </div>
    );
}
export default QuizCard;