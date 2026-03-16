import { ClipboardList, CalendarDays, MapPin, MapPinned, File, Send, type LucideIcon } from 'lucide-react';
import Notification from "@/utils/TostifyNotification"
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/utils/ZuStand';
import { ToastContainer } from "react-toastify";
import { mainApi } from '@/utils/Api';
import { useState, useEffect } from 'react';

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
      const response = await mainApi.get(`${env_main_api}/jobs/${jobId}`);
      const result = response.data;
      
      if (result && result.data) {
        setJobItem(result.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Notification("Error loading job details", "error");
    }
  };

  useEffect(() => {
    if (jobId) FetchJob();
  }, [jobId]);

  const ApplySubmit = async (item: any) => {
    try {
      await mainApi.post(`${env_main_api}/applications`, item);
      Notification("Job Applied successfully!", "success");
      setTimeout(() => { navigate('/Jobs'); }, 1500)
    } catch (error) {
      console.log("Apply failed:", error);
      Notification("Cannot apply to this job", "error");
    }
  };

  if (!jobItem) return <div className="p-20 text-center">Loading Job Details...</div>;

  interface props {
    Icon: LucideIcon;
    title: string;
  }
  
  const MiniBox = ({ Icon, title }: props) => (
    <div className="flex items-center gap-1.5 transition-colors">
      <Icon className="w-4 h-4 text-[#737373] dark:text-gray-400" />
      <p className="font-light text-sm text-[#737373] dark:text-gray-400 truncate">{title || 'N/A'}</p>
    </div>
  );

  const Buttons = () => {
    const btnStyle = "flex-1 rounded-xl text-surface-main text-lg max-w-fit h-12 \
      bg-gradient-to-r from-primary to-slate-700 dark:to-slate-800 \
      px-6 hover:scale-105 transition-all shadow-lg shadow-primary/20";

    return (
      <div className='flex-1 justify-end flex flex-wrap gap-2 items-center'>
        {isAdminOrRecruiter ? (
          <Link to={`/Application/${jobItem?.id}`} className={btnStyle}>
            <div className="flex items-center gap-3 h-full">
              <ClipboardList className="w-5 h-5 text-surface-main" />
              <p className="font-bold text-base">See Applications</p>
            </div>
          </Link>
        ) : (
          <button onClick={() => ApplySubmit(submitData)} type='button' className={btnStyle}>
            <div className="flex items-center gap-3 h-full">
              <Send className="w-5 h-5 text-surface-main" />
              <p className="font-bold text-base text-surface-main">Apply Now</p>
            </div>
          </button>
        )}
      </div>
    );
  }

  const cardStyle = "col-span-1 bg-surface-main dark:bg-secondary-darkbg border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden p-6 transition-all";

  return (
    <div className="h-full w-full items-center transition-colors duration-300">
      <ToastContainer />
      <div className='grid grid-cols-1 gap-6 h-full w-full p-4 md:px-40 pb-10'>
        <div className={`${cardStyle} flex flex-col md:flex-row gap-6 items-center md:items-start`}>
          <img
            src={'/icons/jobCover.jpg'}
            className='h-24 w-24 rounded-2xl object-cover border-2 border-gray-100 dark:border-gray-800 hover:scale-110 transition-transform shadow-md'
            alt="Job Cover"
          />
          <div className='flex flex-col gap-1 justify-center flex-1'>
            <h1 className="text-[#0a0a0a] dark:text-surface-main text-2xl font-extrabold">{jobItem?.title}</h1>
            <h1 className="text-primary text-lg font-bold tracking-tight">RH-CONNECT</h1>
            <div className='flex flex-wrap gap-x-4 gap-y-2 mt-2'>
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
            <h2 className="text-lg font-bold text-black dark:text-surface-main mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Description
            </h2>
            <p className="text-[#737373] dark:text-gray-400 text-justify text-base leading-relaxed break-words">
              {jobItem?.description}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black dark:text-surface-main mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Requirements
            </h2>
            <p className="text-[#737373] dark:text-gray-400 text-justify text-base leading-relaxed break-words">
              {jobItem?.requirements}
            </p>
          </section>

          {jobItem?.skills && (
            <div className="flex flex-wrap gap-2">
              {jobItem.skills.split(',').map((item: string, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full border border-blue-100 dark:border-blue-800/50">
                  {item.trim()}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-6 border-t border-gray-100 dark:border-gray-800 gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold text-black dark:text-surface-main uppercase tracking-wider">Salary Range</h2>
              <p className="text-2xl font-black text-accent">
                {jobItem?.salaryMin} - {jobItem?.salaryMax} <span className="text-sm font-medium">{jobItem?.salaryCurrency}</span>
              </p>
            </div>

            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase flex flex-col gap-1 md:text-right">
              <span>Posted: {new Date(jobItem?.createdAt).toLocaleDateString()}</span>
              {jobItem?.closedAt && (
                <span className="text-red-500">Deadline: {new Date(jobItem?.closedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}