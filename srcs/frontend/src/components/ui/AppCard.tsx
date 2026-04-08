import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainService } from '@/utils/Api'
import Icon  from '@/components/ui/Icon'
import Notification from "@/utils/TostifyNotification"

interface props{
    app: any,
}
const AppCard = ({app}:props) => {
    const navigate = useNavigate();
    const [job, setJob] = useState([]);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    const status = app?.status || 'pending';
    const normalizedStatus = String(status)
      .replace('inProgress', 'In Progress')
      .replace(/^./, (c: string) => c.toUpperCase());
    const statusClass =
      status === 'accepted'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800'
        : status === 'rejected'
        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800'
        : status === 'withdrawn'
        ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800';

    const fetchJob = async () =>{
      try{
        const res = await mainService.get(`${env_main_api}/jobs/${app?.jobId}`)
        setJob(res.data.data);
      } catch (err){

      }
    }

    useEffect(()=>{
      fetchJob();
    }, [])

    const handleSeePhases = () => {
      if (app.status === 'rejected')
        Notification("You are rejected from this job", "error")
      else if (app.status === 'accepted')
        Notification("You already accepted", "success")
      else
        navigate(`/UserPhase/${app.id}`);
    };
    const handleSeeDetails = () => {
      navigate(`/ApplicationDetails/${app.id}`);
    };

    return (
      <article className="w-full rounded-xl border border-slate-200 bg-white p-4 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                {(job as any)?.title || 'Role'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {(job as any)?.department || 'Department not set'}
              </p>
            </div>
            <span className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
              {normalizedStatus}
            </span>
          </header>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
              {(job as any)?.employmentType || 'Type N/A'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
              <Icon name="MapPinHouse" className="h-3.5 w-3.5 text-slate-400" />
              {(job as any)?.location || 'Location N/A'}
            </span>
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 dark:border-slate-700 dark:bg-slate-800">
              ${(job as any)?.salaryMin ?? 0} - ${(job as any)?.salaryMax ?? 0}
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {(job as any)?.description || 'No description provided.'}
          </p>

          <div className="flex w-full items-center gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
            <button
              onClick={handleSeeDetails}
              className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Details
            </button>

            <button
              onClick={handleSeePhases}
              className="h-9 w-full rounded-md bg-slate-800 px-2 text-center text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Phases
            </button>
          </div>
        </div>
      </article>
    );
};

export default AppCard;