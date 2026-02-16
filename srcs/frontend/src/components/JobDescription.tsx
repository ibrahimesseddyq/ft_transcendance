import { ClipboardList, CloudUpload, LucideIcon, CalendarDays ,MapPin ,MapPinned, File, Send } from 'lucide-react';
import Notification from "@/utils/TostifyNotification"
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/utils/ZuStand';
import {ToastContainer} from "react-toastify";

export function JobDescription(){
  const location = useLocation();
  const navigate = useNavigate();
  const jobItem = location.state?.job || [];
  const SKILLS = jobItem.skills?.split(',');
  const user = useAuthStore((state) => state.user);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role);

  const submitData = {
    jobId: jobItem.id,
    candidateId: user?.id,
    currentPhaseId: null,
  }

  const ApplySubmit = async (item: any) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok)
        throw new Error(`Server error: ${response.status}`);
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
  const MiniBox = ({Icon , title}: props) => {
    return (
      <div className="flex items-center">
        <Icon className="w-5 h-5 text-[#737373]" /> 
        <p className="font-light text-[#737373]">{title}</p>
      </div>
    );
  }
  const Buttons = () =>{
    return (
      <div className='flex-1 justify-end min-h-12 flex flex-wrap gap-2 items-center'>
        {isAdminOrRecruiter
          ?
            <Link to={`/Application/${jobItem.id}`}
              className={`flex-1 rounded-md text-white text-lg max-w-fit h-12
              bg-gradient-to-r  from-[#00adef] to-slate-700 px-5`}>
                <div className="flex items-center gap-4 h-full">
                  <ClipboardList className="w-5 h-5 text-white" /> 
                  <p className="font-medium text-base text-white">See Applications</p>
                </div>
            </Link>
          :
            <button onClick={() => ApplySubmit(submitData)}
              type='button'
              className={`flex-1 rounded-md text-white text-lg max-w-fit h-12
                bg-gradient-to-r  from-[#00adef] to-slate-700 px-5`}>
              <div className="flex items-center gap-4">
                <Send className="w-5 h-5 text-white" /> 
                <p className="font-medium text-base text-white">pustules now</p>
              </div>
            </button>
        }
        
      </div>
    );
  }
  const DesCover = () =>{
    return (
      <div className={`${cardStyle} flex flex-col md:flex-row gap-4 `}>
        <img src={'/icons/jobCover.jpg'} className='h-24 w-24 rounded-md  bg-cover bg-center hover:scale-110 duration-500'/>
        <div className='flex flex-col gap-2 justify-between'>
          <h1 className="text-[#0a0a0a] text-2xl font-bold">{jobItem.title}</h1>
          <h1 className="text-[#737373] text-lg font-medium">RH-CONNECT</h1>
          <div className='flex flex-wrap gap-3'>
            <MiniBox 
              Icon={CalendarDays} 
              title={new Date(jobItem.createdAt).toLocaleDateString()}
            />
            <MiniBox 
              Icon={MapPin} 
              title={jobItem.location} 
            />
            <MiniBox 
              Icon={File} 
              title={jobItem.employmentType} 
            />
            <MiniBox 
              Icon={MapPinned} 
              title={jobItem.isRemote ? 'Remote' : 'Onsite'} 
            />
          </div>
        </div>
        <Buttons />
      </div>
    );
  }

  const cardStyle = "col-span-1 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden p-4 sm:p-6"; 
  return (
    <div className="h-full w-full items-center ">
      <ToastContainer/>
      <div className='grid grid-cols-1 gap-6 h-full w-full p-4 md:px-40'>
        <DesCover />

        <div className={`${cardStyle} relative flex flex-col gap-4`}>

          {/* Description */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2">Description</h2>
            <p className="text-[#737373] text-justify text-base">
              {jobItem.description}
            </p>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-2">Requirements</h2>
            <p className="text-[#737373] text-justify text-base">
              {jobItem.requirements}
            </p>
          </div>

          {/* jobItem Info Badges */}
          <div className="flex flex-wrap gap-3">
            {SKILLS && SKILLS.length > 0 ? (
              SKILLS.map((item: string, index: number) => (
                <MiniBox 
                key={index} 
                Icon={CloudUpload} 
                title={item.trim()} 
                />
              ))
            ) : null}
          </div>

          {/* Salary */}
          <div className="mt-2">
            <h2 className="text-base sm:text-lg font-semibold mb-2">Salary</h2>
            <p className="text-[#737373] text-justify text-base">
              {jobItem.salaryMin} - {jobItem.salaryMax} {jobItem.salaryCurrency}
            </p>
          </div>

          {/* Dates */}
          <div className="mt-4 text-sm text-gray-500 flex flex-col gap-1">
            <span>Created: {new Date(jobItem.createdAt).toLocaleDateString()}</span>
            <span>Last Updated: {new Date(jobItem.updatedAt).toLocaleDateString()}</span>
            {jobItem.closedAt && (
              <span>Closed: {new Date(jobItem.closedAt).toLocaleDateString()}</span>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
