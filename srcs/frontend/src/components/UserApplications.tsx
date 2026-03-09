import { useState, useEffect } from 'react';
import AppCard from './ui/AppCard';
import { mainApi } from '@/utils/Api';
import { useAuthStore } from '@/utils/ZuStand';

export function UserApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useAuthStore((state) => state.user);

    useEffect(()=>{
      const fetchUserContent = async () =>{
        try{
            setIsLoading(true);
            const res = await mainApi.get(`/api/users/${user?.id}/applications`);

            const data = res.data;
            if (data.data){
              setApplications(data.data);
            }
        } catch(err){
            console.log(err);
        } finally{
            setIsLoading(false);
        }
      }
      fetchUserContent();
    }, [user?.id]);

    console.log(applications);

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4 items-center transition-all overflow-y-auto custom-scrollbar">
            
            {isLoading ? (
                <p className="text-slate-500 mt-10">Loading applications...</p>
            ) : (
                <>
                    {applications.map((item:any)=>{
                        <div className='flex flex-wrap gap-4'>
                            <AppCard app={item}/>
                        </div>
                    })}
                </>
            )}
            
        </div>
    );
}