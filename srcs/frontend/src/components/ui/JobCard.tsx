import Notification from "@/utils/TostifyNotification";
import { useAuthStore } from '@/utils/ZuStand';
import { mainService } from '@/utils/Api';
import { JobPhaseManager } from "./JobPhaseManager";
import Icon  from '@/components/ui/Icon'
import { Link } from 'react-router-dom';

interface props {
    job: any;
    setTotalPages: (TotalPages: number) => void;
    setJobItem: (item: any) => void;
    setIsFormOpen: (open: boolean) => void;
    setJobsArray: (open: any) => void;
}

const JobCard = ({job, setTotalPages, setJobItem, setJobsArray, setIsFormOpen}: props) =>{
    const user = useAuthStore((state) => state.user);
    const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    const DeleteJob = async (jobId: string | number) => {
        if (!confirm("Are you sure you want to delete this job?")) 
            return;
        try {
            await mainService.delete(`${env_main_api}/jobs/${jobId}`);
            const limit = 6;
            const params = new URLSearchParams();
            params.append("limit", String(limit));
            const url = `${env_main_api}/jobs?${params.toString()}`;
            const [filter_res] = await Promise.all([
              mainService.get(url),
              new Promise(resolve => setTimeout(resolve, 800))
            ]);
            const result = filter_res.data; 
            if (result) {
              setJobsArray(result.data || []);
              setTotalPages(result.meta?.totalPages || 1);
            }
              Notification("Job Deleted", "success");
        } catch (error) {
            Notification("Error Deleting job", "error");
        }
    };
    const statusTheme =
      job.status === "closed"
        ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
        : job.status === "archived"
          ? "border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300";

    return (
        <article
              className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >

              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500 opacity-90" />

              {/* Status Badge */}
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusTheme}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {job.status || "open"}
                </span>
              </div>

              {/* Icon & Title */}
              <div className="mb-4 mt-2 flex items-start gap-3 pr-24">
                <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                   <Icon name='ScreenShare' className="h-5 w-5"/>
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-slate-900 dark:text-slate-100">{job.title}</h2>
                  <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{job.department || "General Department"}</p>
                </div>
              </div>


              {/* Meta Info Slots */}
              <div className="mb-4 grid grid-cols-1 gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <div className="inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
                  <Icon name='Briefcase' size={14} />
                  <span className="truncate">{job.employmentType || "Not specified"}</span>
                </div>
                <div className="inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
                  <Icon name='MapPin' size={14} />
                  <span className="truncate">{job.isRemote ? "Remote" : "On site"}</span>
                </div>
                <div className="inline-flex w-fit items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
                  <Icon name='BarChart3' size={14} />
                  <span className="truncate">{job.department || "Department"}</span>
                </div>
              </div>

              <hr className="mb-4 border-slate-200 dark:border-slate-800" />

              {/* Description */}
              <div className="relative mb-4 min-h-[78px] max-h-24 overflow-hidden text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                <p>{job.description}</p>
                <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-white to-transparent dark:from-slate-900" />
              </div>

              {/* Skills Tags */}
              {job.skills?.length
                ? <div className="mb-6 flex flex-wrap gap-2">
                    {job.skills?.split(',').slice(0, 4).map((tag: string, i: number) => (
                      <span key={i} className="max-w-[110px] truncate rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                : null
               }

              <hr className="mb-5 border-slate-200 dark:border-slate-800" />

              {/* Footer Actions */}
              <div className="mt-auto flex items-center justify-between gap-2">
                <Link to={`/Jobdescription/${job?.id}`} 
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
                >
                  Details
                </Link>

                {isAdminOrRecruiter && (
                  <>
                    <div className="flex-1">
                       <JobPhaseManager jobId={job.id} />
                    </div>
                  </>
                )}

                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-300">
                  {isAdminOrRecruiter && (
                    <>
                      <button onClick={() => { setJobItem(job); setIsFormOpen(true); }} className="rounded-md p-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100">
                        <Icon name='SquarePen' size={16} />
                      </button>
                      <button onClick={() => DeleteJob(job.id)} className="rounded-md p-1.5 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-300">
                        <Icon name='Trash' size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
        </article>
    );
}

export default JobCard;