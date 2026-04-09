import { ClipboardList, CalendarDays, MapPin, MapPinned, File, Send, type LucideIcon } from 'lucide-react';
import Notification from "@/utils/TostifyNotification"
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/utils/ZuStand';
import { ToastContainer } from "react-toastify";
import { mainService } from '@/utils/Api';
import { useState, useEffect } from 'react';
import { Loading } from '@/components/Loading';

export function JobDescription() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobItem, setJobItem] = useState<any>(null); 
  const user = useAuthStore((state) => state.user);
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;

  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");

  const submitData = {
    jobId: jobId,
    candidateId: user?.id, 
    currentPhaseId: null,
  }

  const FetchJob = async () => {
    try {
      const response = await mainService.get(`${env_main_api}/jobs/${jobId}`);
      const result = response.data;
      
      if (result && result.data) {
        setJobItem(result.data);
      }
    } catch (error) {
      Notification("Error loading job details", "error");
    }
  };

  useEffect(() => {
    if (jobId) FetchJob();
  }, [jobId]);

  const ApplySubmit = async (item: any) => {
    try {
      await mainService.post(`${env_main_api}/applications`, item);
      Notification("Job Applied successfully!", "success");
      setTimeout(() => { navigate('/Jobs'); }, 1500)
    } catch (error) {
      Notification("Cannot apply to this job", "error");
    }
  };

  if (!jobItem) return <Loading label="Loading job details..." />;

  interface props {
    Icon: LucideIcon;
    title: string;
  }
  
  const MiniBox = ({ Icon, title }: props) => (
    <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 transition-colors dark:border-slate-700 dark:bg-slate-800/80">
      <Icon className="h-4 w-4 text-slate-500 dark:text-slate-300" />
      <p className="truncate text-xs font-medium text-slate-600 dark:text-slate-300">{title || 'N/A'}</p>
    </div>
  );

  const Buttons = () => {
    const btnStyle = "inline-flex h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800";

    return (
      <div className='flex shrink-0 flex-wrap items-center justify-start gap-2 md:ml-auto md:justify-end'>
        {isAdminOrRecruiter ? (
          <Link to={`/Application/${jobItem?.id}`} className={btnStyle}>
            <ClipboardList className="h-4 w-4" />
            <p>See Applications</p>
          </Link>
        ) : (
          <button onClick={() => ApplySubmit(submitData)} type='button' className={`${btnStyle} border-slate-700 bg-slate-800 text-black  hover:text-white hover:bg-slate-700 dark:border-slate-600 dark:bg-slate-100 dark:text-white dark:hover:text-slate-900 dark:hover:bg-white`}>
            <Send className="h-4 w-4" />
            <p>Apply Now</p>
          </button>
        )}
      </div>
    );
  }

  const cardStyle = "col-span-1 overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900";
  const sectionTitleStyle = "mb-3 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100";

  return (
    <div className="h-full w-full items-cente transition-colors duration-300">
      <ToastContainer />
      <div className='mx-auto grid h-full w-full max-w-6xl grid-cols-1 gap-6 p-4 pb-10 md:p-8'>
        <div className={`${cardStyle} relative flex flex-col gap-5 md:flex-row md:items-start`}>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-500 opacity-90" />
          <img
            src={'/icons/jobCover.jpg'}
            className='h-20 w-20 rounded-lg border border-slate-200 object-cover shadow-sm transition-transform dark:border-slate-700 md:h-24 md:w-24'
            alt="Job Cover"
          />
          <div className='min-w-0 flex flex-1 flex-col justify-center gap-1.5'>
            <h1 className="truncate text-2xl font-semibold text-slate-900 dark:text-slate-100">{jobItem?.title}</h1>
            <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">RH-CONNECT</h2>
            <div className='mt-2 flex flex-wrap gap-2'>
              <MiniBox Icon={CalendarDays} title={new Date(jobItem?.createdAt).toLocaleDateString()} />
              <MiniBox Icon={MapPin} title={jobItem?.location} />
              <MiniBox Icon={File} title={jobItem?.employmentType} />
              <MiniBox Icon={MapPinned} title={jobItem?.isRemote ? 'Remote' : 'Onsite'} />
            </div>
          </div>
          <Buttons />
        </div>

        <div className={`${cardStyle} flex flex-col gap-8`}>
          <section>
            <h2 className={sectionTitleStyle}>
              <span className="h-5 w-1 rounded-full bg-slate-400 dark:bg-slate-600" />
              Description
            </h2>
            <p className="break-words text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {jobItem?.description || 'No description provided.'}
            </p>
          </section>

          <section>
            <h2 className={sectionTitleStyle}>
              <span className="h-5 w-1 rounded-full bg-slate-400 dark:bg-slate-600" />
              Requirements
            </h2>
            <p className="break-words text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {jobItem?.requirements || 'No requirements specified.'}
            </p>
          </section>

          {jobItem?.skills && (
            <div className="flex flex-wrap gap-2">
              {jobItem.skills.split(',').map((item: string, index: number) => (
                <span key={index} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 md:flex-row md:items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">Salary Range</h2>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {jobItem?.salaryMin} - {jobItem?.salaryMax} <span className="text-sm font-medium">{jobItem?.salaryCurrency}</span>
              </p>
            </div>

            <div className="flex flex-col gap-1 text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 md:text-right">
              <span>Posted: {new Date(jobItem?.createdAt).toLocaleDateString()}</span>
              {jobItem?.closedAt && (
                <span className="text-rose-600 dark:text-rose-400">Deadline: {new Date(jobItem?.closedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}