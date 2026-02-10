import { CloudUpload, LucideIcon, CalendarDays ,MapPin ,MapPinned, File, Send } from 'lucide-react';
import Notification from "@/utils/TostifyNotification"
import { useLocation, useNavigate } from 'react-router-dom'

export function JobDescription(){
  const location = useLocation();
  const navigate = useNavigate();
  const jobItem = location.state?.job || [];
  const SKILLS = jobItem.skills?.split(',');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const ApplySubmit = async (data: any) => {
    Notification("You Applyed succesfuly", "success");
    navigate("/Jobs");
    // try {
    //   const response = await fetch("http://localhost:3000/api/jobs", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(data),
    //   });
      
    //   if (!response.ok)
    //     throw new Error(`Server error: ${response.status}`);
      
    //   Notification("Job added successfully!", "success");
    //   setIsFormOpen(false);
    // } catch (error) {
    //   console.error("Submission failed:", error);
    //   Notification("Error creating job", "error");
    // }
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
  const ApplyButton = () =>{
    return (
      <button onClick={() => ApplySubmit(jobItem)}
        type='button'
        className='md:absolute md:bottom-4 md:right-4 h-10 max-w-64 rounded-md text-white text-lg shadow-xl
        bg-gradient-to-r  from-[#00adef] to-slate-700 px-10 hover:scale-110 duration-500'>
        <div className="flex items-center gap-4">
          <Send className="w-5 h-5 text-white" /> 
          <p className="font-medium text-white">pustules now</p>
        </div>
      </button>
    );
  }
  const DesCover = () =>{
    return (
      <div className={`${cardStyle} md:relative flex flex-col md:flex-row gap-4`}>
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
        <ApplyButton />
      </div>
    );
  }

  const cardStyle = "col-span-1 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden p-4 sm:p-6"; 
  return (
    <div className="h-full w-full items-center">
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
          
          <ApplyButton />
        </div>
      </div>
    </div>
  );
}
