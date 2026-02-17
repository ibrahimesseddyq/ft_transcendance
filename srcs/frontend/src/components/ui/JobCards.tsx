import Notification from "@/utils/TostifyNotification";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/utils/ZuStand';
import {Eye, Trash, SquarePen, Briefcase, MapPin, BarChart3, Bookmark, ScreenShare } from 'lucide-react';

interface props {
  jobsArray: any[];
  setJobsArray: (item: any) => void;
  setJobItem: (item: any) => void;
  setJobDescp: (open: boolean) => void;
  setIsFormOpen: (open: boolean) => void;
}

const JobCards = ({ jobsArray, setJobsArray, setJobItem, setJobDescp, setIsFormOpen }: props) => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const user = useAuthStore((state) => state.user);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role);
  const DeleteJob = async (jobId: string | number) => {
    if (!confirm("Are you sure you want to delete this job?")) 
      return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (response.ok){
        setJobsArray(jobsArray.filter(job => job.id !== jobId));
        Notification("Job Deleted", "success");
      } 
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
    <div className="flex-1 h-full w-full overflow-auto no-scrollbar p-6">
      <div className="flex flex-wrap gap-6 justify-center ">
        {jobsArray.length > 0 ? (
          jobsArray.map((item: any) => (
            <div
              key={item.id}
              className="relative flex flex-col w-full md:w-[350px] 
                bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >

              <div className="absolute top-3 right-3 flex items-center gap-2">
                {/* closed or open or archived*/}
                {item.status === "closed" ? (
                  <span className="rounded-full border border-red-500/50 bg-red-500/10 text-red-500 
                      text-[10px] font-bold backdrop-blur-sm px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    CLOSED
                  </span>
                ) : item.status === "archived" ? (
                  <span className="rounded-full border border-gray-500/50 bg-gray-500/10 text-gray-500 
                      text-[10px] font-bold backdrop-blur-sm px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
                    ARCHIVED
                  </span>
                ) : (
                  <span className="rounded-full border border-[#00adef]/50 bg-[#00adef]/10 text-[#00adef] 
                    text-[10px] font-bold backdrop-blur-sm px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00adef] animate-pulse" />
                    OPEN
                  </span>
                )}
              </div>

              {/*Icon & Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                   <ScreenShare className="w-10 h-10"/>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 truncate">{item.title}</h2>
              </div>

              <div className="flex items-center justify-between text-gray-700 text-sm font-medium mb-4">
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  <span className="truncate">{item.employmentType}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span className="truncate">{item.isRemote ? "Remote" : "On site"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 size={16} />
                  <span className="truncate">{item.department}</span>
                </div>
              </div>

              <hr className="border-gray-100 mb-4" />

              {/* Description */}
              <div className="relative max-h-28 overflow-hidden text-[13px] text-gray-800">
                <p>{item.description}</p>
                <div className="absolute bottom-0 h-12 w-full bg-gradient-to-t from-white to-transparent"></div>
              </div>
              {/* Requirements/Tags Section */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.skills?.split(',').slice(0, 4).map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-[#D1E1FF] text-[#1E3A8A] 
                    text-xs font-semibold rounded-full max-w-[68px] truncate">
                    {tag.trim()}
                  </span>
                ))}
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* Footer Actions */}
              <div className="flex items-center justify-between mt-auto">
                <button 
                  onClick={()=>{handleDetails(item)}}
                  className="px-8 py-2.5 border-2 border-[#3B5998] text-[#3B5998] font-bold rounded-xl hover:bg-[#3B5998] hover:text-white transition-colors"
                >
                  Details
                </button>
                
                <div className="flex items-center gap-3">
                  {isAdminOrRecruiter
                    ?
                      <>
                        <button onClick={() => { setJobItem(item); setIsFormOpen(true); } } className="text-gray-900 hover:text-blue-500">
                          <SquarePen size={20} />
                        </button>
                        <button onClick={() => DeleteJob(item.id)} className="text-gray-900 hover:text-red-500">
                          <Trash size={20} />
                        </button>
                      </> 
                    : null}
              
                  <button className="text-gray-900 hover:text-green-500">
                    <Bookmark size={20} />
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