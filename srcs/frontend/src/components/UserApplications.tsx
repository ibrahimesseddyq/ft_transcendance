import { useState, useEffect } from 'react';
import AppCard from '@/components/ui/AppCard';
import { mainApi } from '@/utils/Api';
import { useAuthStore } from '@/utils/ZuStand';
import { ToastContainer } from "react-toastify";
import Icon  from '@/components/ui/Icon'
import { Link } from 'react-router-dom';
import { AiChatButton } from '@/components/ui/AiChatButton'

export function UserApplications() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = useAuthStore((state) => state.user);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;
    const isAdminOrRecruiter = ["admin", "recruiter"].includes((user as any)?.role ?? "");

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
                {applications?.map((app: any, id:number) => (
                    <div className='flex gap-4 w-full max-w-[800px]' >
                        <AppCard key={id} app={app}/>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Icon name='Briefcase' className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-surface-main">No applications yet</h3>
                <p className="text-slate-500 dark:text-gray-400 max-w-xs mt-2">
                    You haven't applied to any positions. Check out our open roles and start your journey!
                </p>
                <Link 
                    to="/Jobs" 
                    className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
                >
                    Browse Jobs
                </Link>
            </div>
        )}
        {!isAdminOrRecruiter && (
            <AiChatButton />
        )}
        </div>
    );
}