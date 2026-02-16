import { useState } from 'react'
import { CopyCheck, Ellipsis } from 'lucide-react';

interface TestProps{
    id: number;
    title: string;
    description:string;
}

const TestsList = () =>{
    const [tests, setTests] = useState([
        {id:1, title:"dhgdfhjgghftdfghhg", description:"dhgdfhjgghftdghhgdhgdfhjgghftdfghhfhjgghftdfghhg"},
        {id:2, title:"dhgdfhjgghftdfghhg", description:"dhgdfhjgghftdfghhgdhgdfhdfghhgdhgdfhjgghftdfghhg"},
        {id:3, title:"dhgdfhjgghftdfghhg", description:"dhgdfhjgggghftdfghhgdhftdfghhgdhgdfhjgghftdfghhg"}
    ]);
    const TestCard = (test:any)=>{
        console.log(test.title);
        return (
            <div className="bg-white/50 flex flex-col gap-2 min-h-20 border border-black px-4 py-2 rounded-lg mt-3 shadow sm">
                <div className='flex gap-2 '>
                    <div className='h-8 w-8 bg-gray-400 rounded-lg text-center text-lg text-white'>
                        1
                    </div>
                    <h1 className="text-black truncate">{test.title}Title</h1>
                </div>
                <div className='flex gap-2 justify-between'>
                    <div className='py-2 flex gap-2'>
                        <CopyCheck className='text-black'/>
                        <h1 className='text-sm font-semibold'>Mutiple choice</h1>
                    </div>
                    <Ellipsis className='w-4 h-4 my-auto'/>
                </div>
            </div>
        );
    }
    return (
        <div className='h-full w-full'>
            {tests.map((item:any)=>(
                <div key={item.id} className='w-full'>
                    <TestCard key={item.id} test={item}/>
                </div>
            ))}
        </div>
    );
}

export default TestsList;