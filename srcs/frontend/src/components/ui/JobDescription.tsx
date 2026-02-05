import { CloudUpload, LucideIcon  } from 'lucide-react';
import Notification from "@/utils/TostifyNotification"

interface props{
  jobItem?: any; 
  setJobDescp: (open: boolean) => void ;
}

const JobDescription = ({ jobItem, setJobDescp }: props) => {
  const SKILLS = jobItem.skills?.split(',');
  const ApplySubmit = async (data: any) => {
    console.log("********hii iam here in job desc*********", data);
    setJobDescp(false);
    Notification("You Applyed succesfuly", "success");
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
      <div className="flex p-2 border border-gray-300/10 
        hover:border-green-600 rounded-3xl items-center gap-2">
        <Icon className="w-5 h-5 text-white" /> 
        <p className="font-light text-white">{title}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full flex flex-col items-center">
      <div className='border rounded-xl px-5 py-2 border-[#1e2e52] bg-[#121b31] mb-6'>
        <h1 className='text-white text-lg font-bold'>Job Description</h1>
      </div>
      <button
        onClick={() => setJobDescp(false)}
        className="absolute top-6 right-6 text-red-600 cursor-pointer">
        ✕
      </button>

      <div className='flex flex-col gap-6 h-full w-full bg-[#121b31]/70 p-8 rounded-2xl 
        border border-[#1e2e52] overflow-y-auto overflow-x-hidden custom-scrollbar shadow-2xl'>

        {/* Title */}
        <h1 className="text-white font-bold text-4xl">{jobItem.title}</h1>

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
          <h2 className="text-xl font-semibold mb-2 text-[#10B77F]">Salary</h2>
          <p className="text-gray-300">
            {jobItem.salaryMin} - {jobItem.salaryMax} {jobItem.salaryCurrency}
          </p>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[#10B77F]">Description</h2>
          <p className="text-gray-300 text-md font-light break-words">
            {jobItem.description}
          </p>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-[#10B77F]">Requirements</h2>
          <p className="text-gray-300 text-md font-light break-words">
            {jobItem.requirements}
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
      <button 
          type='button'
          onClick={() => ApplySubmit(jobItem)}
          className=" absolute bottom-5 right-5 z-50 h-11 flex-1 text-black font-bold rounded-lg 
            bg-[#10B77F] hover:bg-[#0d9668] transition-colors p-2">
        Easy Apply
      </button>
    </div>
  );
}

export default JobDescription;