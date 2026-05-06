import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainService } from '@/utils/Api'
import { useAuthStore } from '@/utils/ZuStand';
import Notification from '@/utils/TostifyNotification';

interface props{
  candidateId: string,
  applicationId: string,
  application?: {
    status?: string;
    contractEndDate?: string | null;
    jobId?: string;
    [key: string]: any;
  };
}

function getContractCountdown(contractEndDate: string | null | undefined) {
  if (!contractEndDate) return null;
  const end = new Date(contractEndDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return { days: Math.abs(diffDays), expired: diffDays < 0 };
}

const UserCard = ({ candidateId, applicationId, application }: props) => {
    const BACKEND_URL = import.meta.env.VITE_SERVICE_URL;
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const isRecruiter = user?.role === 'recruiter' || user?.role === 'admin';
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [contractEndDate, setContractEndDate] = useState<string>(
      application?.contractEndDate ? new Date(application.contractEndDate).toISOString().split('T')[0] : ''
    );
    const [isSavingDate, setIsSavingDate] = useState(false);
    const [isRenewing, setIsRenewing] = useState(false);
    const avatarUrl = `${BACKEND_URL}${(userData as any)?.avatarUrl}`;
    const candidateInitials = `${(userData as any)?.firstName?.[0] || ''}${(userData as any)?.lastName?.[0] || ''}`.toUpperCase();
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;
    const isAccepted = application?.status === 'accepted';
    const countdown = getContractCountdown(contractEndDate || application?.contractEndDate);

    useEffect(()=>{
      const fetchUserContent = async () =>{
        try{
          setIsLoading(true);
          const res = await mainService.get(`${env_main_api}/users/${candidateId}`);
          const data = res.data;
          if (data.data){
            setUserData(data.data);
          }
        }catch(err){
          setUserData(null);
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

  const handleSaveContractEndDate = async () => {
    if (!contractEndDate) return;
    try {
      setIsSavingDate(true);
      await mainService.patch(`${env_main_api}/applications/${applicationId}/contract-end`, { contractEndDate });
      Notification('Contract end date saved', 'success');
    } catch {
      Notification('Failed to save contract end date', 'error');
    } finally {
      setIsSavingDate(false);
    }
  };

  const handleRenew = async () => {
    if (!window.confirm('Start a new contract for this employee?')) return;
    try {
      setIsRenewing(true);
      await mainService.post(`${env_main_api}/applications/${applicationId}/renew`);
      Notification('New contract started successfully', 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to renew contract';
      Notification(msg, 'error');
    } finally {
      setIsRenewing(false);
    }
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
        ) : (userData as any)?.avatarUrl ? (
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
              {isLoading ? 'Loading...' : `${(userData as any)?.firstName || ''} ${(userData as any)?.lastName || ''}`.trim() || 'Unknown Candidate'}
            </h1>
            <h1 className='truncate text-xs font-normal text-slate-500 dark:text-slate-400'>
              {isLoading ? 'Fetching profile...' : (userData as any)?.email || 'No email provided'}
            </h1>
          </div>
        </div>

        {/* Contract section — only for accepted applications */}
        {isAccepted && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/50 flex flex-col gap-2">
            {/* Countdown badge */}
            {countdown ? (
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                countdown.expired ? 'text-rose-600 dark:text-rose-400' : countdown.days <= 30 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                <span className={`h-2 w-2 rounded-full ${countdown.expired ? 'bg-rose-500' : countdown.days <= 30 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {countdown.expired
                  ? `Contract expired ${countdown.days} day${countdown.days !== 1 ? 's' : ''} ago`
                  : `${countdown.days} day${countdown.days !== 1 ? 's' : ''} left on contract`}
              </div>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400">No contract end date set</span>
            )}

            {/* Date setter — recruiter only */}
            {isRecruiter && (
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={contractEndDate}
                  onChange={(e) => setContractEndDate(e.target.value)}
                  className="flex-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-sky-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300"
                />
                <button
                  onClick={handleSaveContractEndDate}
                  disabled={isSavingDate || !contractEndDate}
                  className="rounded bg-sky-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
                >
                  {isSavingDate ? '…' : 'Set'}
                </button>
              </div>
            )}
          </div>
        )}

          <div className="flex w-full items-center gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
            <button onClick={handleSeeDetails}
              className='h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'>
              Details
            </button>
            
            <button onClick={handleSeeProfile}
              className='h-9 w-full rounded-md bg-slate-800 px-2 text-center text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white'>
              Profile
            </button>

            {/* Renew button — recruiter only, accepted applications */}
            {isAccepted && isRecruiter && (
              <button
                onClick={handleRenew}
                disabled={isRenewing}
                className='h-9 w-full rounded-md border border-emerald-500 bg-emerald-50 px-2 text-center text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500 hover:text-white disabled:opacity-50 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-700 dark:hover:text-white'
              >
                {isRenewing ? '…' : 'Renew'}
              </button>
            )}
          </div>
          
      </div>
    </article>
  );
};

export default UserCard;