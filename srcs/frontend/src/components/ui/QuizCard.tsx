

const QuizCard = ({Type}:any) =>{

    interface prop{
        Type:string;
    }
    const Description = ({Type}:prop)=>{
        const MultipleResponse = "hello this is Multiple Response";
        const MultipleChoice = "hello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello thishello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Chhello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choicehello this is Multiple Choiceoice is Multiple Choice";
        const TrueOrFalse = "hello this is True Or False";
        if (Type === "MultipleResponse")
            return (MultipleResponse);
        else if (Type === "MultipleChoice")
            return (MultipleChoice);
        return (TrueOrFalse);
    }
    return (
        <div className={`flex-1 group relative gap-4 min-h-40 min-w-72 overflow-hidden bg-surface-main rounded-xl
            shadow-md p-4 flex items-center justify-center bg-cover bg-center transition-all duration-300
            ${Type === "MultipleResponse" ? 'bg-[url(/MultipleResponse.jpg)]' :
              Type === "MultipleChoice" ? 'bg-[url(/MultipleChoice.jpg)]' : 
              'bg-[url(/TrueOrFalse.jpeg)]'}`}>
            
            <div className="absolute inset-0 bg-secondary-darkbg/60 backdrop-blur-sm transition-opacity duration-500 ease-out group-hover:opacity-0 group-hover:backdrop-blur-none" />

            <div className="relative h-full w-full flex flex-col justify-between items-center
                transition-transform duration-500 ease-out group-hover:scale-90">
                <h1 className="text-xl font-semibold text-surface-main opacity-100 group-hover:opacity-0">
                    {Type}
                </h1>

                <div className="text-sm text-blue-100 opacity-100 group-hover:opacity-0 transition-opacity">
                    <Description Type={Type} />
                </div>

                <button className="mt-4 py-3 rounded-xl w-full
                    bg-primary text-surface-main hover:bg-blue-400 transition-colors">
                    Create Quiz
                </button>
            </div>
        </div>
    );
}
export default QuizCard;
