import { useState, useEffect } from 'react';
import AppCard from './ui/AppCard';
import { mainApi } from '@/utils/Api';
import { useAuthStore } from '@/utils/ZuStand';

export function UserApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    useEffect(()=>{
      const fetchUserContent = async () =>{
        try{
            setIsLoading(true);
            const res = await mainApi.get(`${env_main_api}/users/${user?.id}/applications`);

            const data = res.data;
            if (data.data){
              setApplications(data.data.applications || []);
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
                {applications?.map((app) => (
                    <div className='flex flex-wrap gap-4'>
                        <AppCard app={app}/>
                    </div>
                ))}
                </>
            )}
            
        </div>
    );
}