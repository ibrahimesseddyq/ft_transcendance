import Notification from "@/utils/TostifyNotification";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/utils/ZuStand';
import { mainApi } from '@/utils/Api';
import { JobPhaseManager } from "./JobPhaseManager";
import { Trash, SquarePen, Briefcase, MapPin, BarChart3, Bookmark, ScreenShare } from 'lucide-react';

interface props {
  jobsArray: any[];
  setJobsArray: (item: any) => void;
  setJobItem: (item: any) => void;
  setIsFormOpen: (open: boolean) => void;
}

const JobCards = ({ jobsArray, setJobsArray, setJobItem, setIsFormOpen }: props) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");
  const DeleteJob = async (jobId: string | number) => {
    if (!confirm("Are you sure you want to delete this job?")) 
      return;
    try {
      await mainApi.delete(`/api/jobs/${jobId}`);
      setJobsArray(jobsArray.filter(job => job.id !== jobId));
      Notification("Job Deleted", "success");
    } catch (error) {
      Notification("Error Deleting job", "error");
    }
  };

  const handleDetails = (job:any) => {
    navigate('/Jobdescription', { 
      state: {
        job: job,
      } 
    });
  };
  
  return (
    <div className="flex-1 h-full w-full overflow-auto no-scrollbar p-6 transition-colors duration-300">
      <div className="flex flex-wrap gap-6 justify-center">
        {jobsArray.length > 0 ? (
          jobsArray.map((item: any) => (
            <div
              key={item.id}
              className="relative flex flex-col w-full md:w-[350px] 
                bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >

              {/* Status Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {item.status === "closed" ? (
                  <span className="rounded-full border border-red-500/50 bg-red-500/10 text-red-500 
                      text-[10px] font-bold backdrop-blur-sm px-2 py-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    CLOSED
                  </span>
                ) : item.status === "archived" ? (
                  <span className="rounded-full border border-gray-500/50 bg-gray-500/10 text-gray-500 
                      text-[10px] font-bold backdrop-blur-sm px-2 py-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
                    ARCHIVED
                  </span>
                ) : (
                  <span className="rounded-full border border-[#00adef]/50 bg-[#00adef]/10 text-[#00adef] 
                    text-[10px] font-bold backdrop-blur-sm px-2 py-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00adef] animate-pulse" />
                    OPEN
                  </span>
                )}
              </div>

              {/* Icon & Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center text-[#00adef]">
                   <ScreenShare className="w-10 h-10"/>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{item.title}</h2>
              </div>


              {/* Meta Info Slots */}
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-xs font-medium mb-4">
                <div className="flex items-center gap-1">
                  <Briefcase size={14} />
                  <span className="truncate">{item.employmentType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span className="truncate">{item.isRemote ? "Remote" : "On site"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 size={14} />
                  <span className="truncate">{item.department}</span>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-slate-800 mb-4" />

              {/* Description */}
              <div className="relative max-h-24 overflow-hidden text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <p>{item.description}</p>
                <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
              </div>

              {/* Skills Tags */}
              {item.skills.length
                ? <div className="flex flex-wrap gap-2 mb-6">
                    {item.skills?.split(',').slice(0, 4).map((tag: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 
                        text-[10px] font-bold rounded-full max-w-[80px] truncate border border-blue-100 dark:border-blue-800/50">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                : null
               }

              <hr className="border-gray-100 dark:border-slate-800 mb-6" />

              {/* Footer Actions */}
              <div className="flex items-center justify-between mt-auto gap-2">
                <button 
                  onClick={() => handleDetails(item)}
                  className="px-4 py-2 border-2 border-[#3B5998] dark:border-blue-500 text-[#3B5998] dark:text-blue-400 text-xs font-bold rounded-xl hover:bg-[#3B5998] hover:text-white transition-all active:scale-95 whitespace-nowrap"
                >
                  Details
                </button>

                {isAdminOrRecruiter && (
                  <>
                    <div className="flex-1">
                       <JobPhaseManager jobId={item.id} />
                    </div>
                  </>
                )}

                <div className="flex items-center gap-2 text-gray-500">
                  {isAdminOrRecruiter && (
                    <>
                      <button onClick={() => { setJobItem(item); setIsFormOpen(true); }} className="hover:text-[#00adef]">
                        <SquarePen size={16} />
                      </button>
                      <button onClick={() => DeleteJob(item.id)} className="hover:text-red-500">
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                  <button className="hover:text-yellow-500 transition-colors">
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-full py-10 text-gray-400">No jobs found.</div>
        )}
      </div>
    </div>
  );
};

export default JobCards;
      
