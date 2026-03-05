import { useState, useEffect } from 'react'
import api from '@/utils/Api';
import { CopyCheck, Ellipsis } from 'lucide-react';

const TestsList = () =>{

    const [tests, setTests] = useState([]);
    useEffect(()=>{
      const fetchUserContent = async () =>{
        try{
          const res = await api.get(`/api/tests`);
          const data = res.data;
          if (data.data){
            setTests(data.data);
          }
        }catch(err){
          console.log(err);
        }
      }
      fetchUserContent();
    }, [tests]);

    const TestCard = ({test}: any)=>{
        return (
            <div className="bg-white/50 dark:bg-slate-900/50 flex flex-col gap-2 min-h-20 border border-gray-200 dark:border-gray-800 px-4 py-3 rounded-lg mt-3 shadow-sm hover:shadow-md transition-all duration-300">
                <div className='flex gap-3 items-center'>
                    {/* Index Badge */}
                    <div className='h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-200'>
                        {test.id}
                    </div>
                    {/* Title */}
                    <h1 className="text-black dark:text-white font-medium truncate flex-1">
                        {test.title}
                    </h1>
                </div>

                <div className='flex gap-2 justify-between items-center mt-1'>
                    <div className='flex gap-2 items-center'>
                        <CopyCheck className='text-[#00adef] w-5 h-5'/>
                        <h1 className='text-sm font-semibold text-gray-600 dark:text-gray-400'>
                            Multiple choice
                        </h1>
                    </div>
                    <button className='p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors'>
                        <Ellipsis className='w-5 h-5 text-gray-400 dark:text-gray-500'/>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='h-full w-full items-center'>
            {tests 
                ?
                <div>
                    {tests.map((item:any)=>(
                        <div key={item.id} className='w-full'>
                            <TestCard test={item}/>
                        </div>
                    ))}
                </div>
                :
                <h1 className='text-black dark:text-white'>No Test Provided</h1>
            }
            
        </div>
    );
}

export default TestsList;