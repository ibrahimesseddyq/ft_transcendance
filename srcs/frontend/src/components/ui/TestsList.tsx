
interface TestProps{
    id: number;
    title: string;
    description:string;
}

const TestsList = (Tests:TestProps[]) =>{
    const TestCard = (test:any)=>{
        return (
            <div className="flex flex-col gap-2 p-2 bg-slate-400">
                <h1 className="text-black">{test.title}</h1>
                <p className="text-black/20 text-base">{test.description}</p>
            </div>
        );
    }
    return (
        <div>
            {Tests.map((item:any)=>(
                <div key={item.id} className='flex flex-col gap-2 w-full'>
                    <TestCard key={item.id} test={item}/>
                </div>
            ))}
        </div>
    );
}

export default TestsList;