import { useState, useEffect } from 'react';
import AppCard from '@/components/ui/AppCard';
import { mainApi } from '@/utils/Api';
import { useAuthStore } from '@/utils/ZuStand';
import { ToastContainer } from "react-toastify";

export function UserApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    useEffect(() => {
        const fetchUserContent = async () => {
            if (!user?.id) {
                setIsLoading(false);
                return; 
            }

            try {
                setIsLoading(true);
                const res = await mainApi.get(`${env_main_api}/users/${user.id}/applications`);
                
                if (res.data?.data) {
                    setApplications(res.data.data.applications || []);
                }
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserContent();
    }, [user?.id, env_main_api]);
            
    console.log('apps :', applications);

    return (
        <div className="w-full h-full p-4 flex flex-col gap-4 items-center transition-all overflow-y-auto custom-scrollbar">
            <ToastContainer />
            {isLoading ? (
                <p className="text-slate-500 mt-10">Loading applications...</p>
            ) : applications.length > 0 ? (
                <div className='flex flex-wrap gap-4 justify-center w-full'>
                    {applications.map((app) => (
        
                        <AppCard app={app} />
                    ))}
                </div>
            ) : (
                <>
                {applications?.map((app: any, id:number) => (
                    <div className='flex gap-4 w-full max-w-[800px]' >
                        <AppCard key={id} app={app}/>
                    </div>
                ))}
                </>
            )}
            
        </div>
    );
}