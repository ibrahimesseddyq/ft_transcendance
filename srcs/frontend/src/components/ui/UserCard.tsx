import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainService } from '@/utils/Api'

interface props{
  candidateId: string,
  applicationId: string,
}
const UserCard = ({ candidateId, applicationId }: props) => {
    const BACKEND_URL = import.meta.env.VITE_SERVICE_URL;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
    const avatarUrl = `${BACKEND_URL}${(user as any)?.avatarUrl}`;
  const candidateInitials = `${(user as any)?.firstName?.[0] || ''}${(user as any)?.lastName?.[0] || ''}`.toUpperCase();
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    useEffect(()=>{
      const fetchUserContent = async () =>{
        try{
          setIsLoading(true);
          const res = await mainService.get(`${env_main_api}/users/${candidateId}`);
          
          const data = res.data;
          if (data.data){
            setUser(data.data);
          }
        }catch(err){
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
      fetchUserContent();
    }, [candidateId]);


  const handleSeeProfile = () => {
      navigate(`/Profile/${candidateId}`, { 
        state: {
          postId: candidateId,
      } 
    });
  };
  const handleSeeDetails = () => {
    navigate(`/ApplicationDetails/${applicationId}`);
  };
  
  return (
    <article className="group w-full min-h-20 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex items-start gap-3">
        {isLoading ? (
          <>
            <div className="h-14 w-14 animate-pulse rounded-full border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700" />
            <div className="mt-1 w-full space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </>
        ) : (user as any)?.avatarUrl ? (
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-300 bg-cover bg-center bg-no-repeat dark:border-slate-500"
            style={{ backgroundImage: `url("${avatarUrl}")` }}
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-sm font-bold text-slate-700 dark:border-slate-500 dark:bg-slate-700 dark:text-slate-100">
            {candidateInitials || 'NA'}
          </div>
        )}
          
          <div className='flex w-full min-w-0 flex-col gap-0.5'>
            <h1 className='truncate text-sm font-semibold text-slate-800 dark:text-slate-100'>
              {isLoading ? 'Loading...' : `${(user as any)?.firstName || ''} ${(user as any)?.lastName || ''}`.trim() || 'Unknown Candidate'}
            </h1>
            <h1 className='truncate text-xs font-normal text-slate-500 dark:text-slate-400'>
              {isLoading ? 'Fetching profile...' : (user as any)?.email || 'No email provided'}
            </h1>
          </div>
        </div>

          <div className="flex w-full items-center gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
            <button onClick={handleSeeDetails}
              className='h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'>
              Details
            </button>
            
            <button onClick={handleSeeProfile}
              className='h-9 w-full rounded-md bg-slate-800 px-2 text-center text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'>
              Profile
            </button>
          </div>
          
      </div>
    </article>
  );
};

export default UserCard;