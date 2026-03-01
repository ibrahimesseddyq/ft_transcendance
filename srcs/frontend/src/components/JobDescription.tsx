import { ClipboardList, CloudUpload, LucideIcon, CalendarDays ,MapPin ,MapPinned, File, Send } from 'lucide-react';
import Notification from "@/utils/TostifyNotification"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/utils/ZuStand';
import {ToastContainer} from "react-toastify";
import api from '@/utils/Api';

export function JobDescription(){
  const location = useLocation();
  const navigate = useNavigate();
  const jobItem = location.state?.job || [];
  const SKILLS = jobItem.skills?.split(',');
  const user = useAuthStore((state) => state.user);
  
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");

  const submitData = {
    jobId: jobItem.id,
    candidateId: user?.id,
    currentPhaseId: null,
  }

  const ApplySubmit = async (item: any) => {
    try {
      await api.post(`/api/applications`, item);
      Notification("Job Applyed successfully!", "success");
      setTimeout(()=>{navigate('/Jobs');}, 1500)
    } catch (error) {
      console.log("Apply failed:", error);
      Notification("You alreay applyed", "Failed");
    }
  };

  interface props{
    Icon : LucideIcon;
    title : string;
  }
  const MiniBox = ({ Icon, title }: props) => {
    return (
      <div className="flex items-center gap-1.5 transition-colors">
        <Icon className="w-4 h-4 text-[#737373] dark:text-gray-400" /> 
        <p className="font-light text-sm text-[#737373] dark:text-gray-400 truncate">{title}</p>
      </div>
    );
  }

  const Buttons = () => {
    const btnStyle = "flex-1 rounded-xl text-white text-lg max-w-fit h-12 \
      bg-gradient-to-r from-[#00adef] to-slate-700 dark:to-slate-800 \
      px-6 hover:scale-105 transition-all shadow-lg shadow-[#00adef]/20";

    return (
      <div className='flex-1 justify-end flex flex-wrap gap-2 items-center'>
        {isAdminOrRecruiter ? (
          <Link to={`/Application/${jobItem.id}`} className={btnStyle}>
            <div className="flex items-center gap-3 h-full">
              <ClipboardList className="w-5 h-5 text-white" /> 
              <p className="font-bold text-base">See Applications</p>
            </div>
          </Link>
        ) : (
          <button onClick={() => ApplySubmit(submitData)} type='button' className={btnStyle}>
            <div className="flex items-center gap-3">
              <Send className="w-5 h-5 text-white" /> 
              <p className="font-bold text-base text-white">Apply Now</p>
            </div>
          </button>
        )}
      </div>
    );
  }

  const cardStyle = "col-span-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 \
    shadow-sm rounded-2xl overflow-hidden p-6 transition-all";

  const DesCover = () => {
    return (
      <div className={`${cardStyle} flex flex-col md:flex-row gap-6 items-center md:items-start`}>
        <img 
          src={'/icons/jobCover.jpg'} 
          className='h-24 w-24 rounded-2xl object-cover border-2 border-gray-100 
            dark:border-gray-800 hover:scale-110 transition-transform duration-500 shadow-md'
        />
        <div className='flex flex-col gap-1 justify-center flex-1'>
          <h1 className="text-[#0a0a0a] dark:text-white text-2xl font-extrabold">{jobItem.title}</h1>
          <h1 className="text-[#00adef] text-lg font-bold tracking-tight">RH-CONNECT</h1>
          <div className='flex flex-wrap gap-x-4 gap-y-2 mt-2'>
            <MiniBox Icon={CalendarDays} title={new Date(jobItem.createdAt).toLocaleDateString()} />
            <MiniBox Icon={MapPin} title={jobItem.location} />
            <MiniBox Icon={File} title={jobItem.employmentType} />
            <MiniBox Icon={MapPinned} title={jobItem.isRemote ? 'Remote' : 'Onsite'} />
          </div>
        </div>
        <Buttons />
      </div>
    );
  }

  return (
    <div className="h-full w-full items-center transition-colors duration-300">
      <ToastContainer />
      <div className='grid grid-cols-1 gap-6 h-full w-full p-4 md:px-40 pb-10'>
        <DesCover />

        <div className={`${cardStyle} flex flex-col gap-8`}>
          {/* Description */}
          <section>
            <h2 className="text-lg font-bold text-black dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#00adef] rounded-full" />
              Description
            </h2>
            <p className="text-[#737373] dark:text-gray-400 text-justify text-base leading-relaxed">
              {jobItem.description}
            </p>
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-lg font-bold text-black dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#00adef] rounded-full" />
              Requirements
            </h2>
            <p className="text-[#737373] dark:text-gray-400 text-justify text-base leading-relaxed">
              {jobItem.requirements}
            </p>
          </section>

          {/* Skills Badges */}
          <div className="flex flex-wrap gap-2">
            {SKILLS?.map((item: string, index: number) => (
              <span key={index} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700">
                {item.trim()}
              </span>
            ))}
          </div>

          {/* Footer Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-6 
            border-t border-gray-100 dark:border-gray-800 gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold text-black dark:text-white uppercase tracking-wider">Salary Range</h2>
              <p className="text-2xl font-black text-[#10B77F]">
                {jobItem.salaryMin} - {jobItem.salaryMax} <span className="text-sm font-medium">{jobItem.salaryCurrency}</span>
              </p>
            </div>
            
            <div className="text-[11px] font-bold text-gray-400 dark:text-gray-500 
              uppercase flex flex-col gap-1 md:text-right">
              <span>Posted: {new Date(jobItem.createdAt).toLocaleDateString()}</span>
              {jobItem.closedAt && (
                <span className="text-red-400">Deadline: {new Date(jobItem.closedAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
