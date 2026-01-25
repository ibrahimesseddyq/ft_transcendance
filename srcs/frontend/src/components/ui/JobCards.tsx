import Notification from "@/utils/TostifyNotification";
import { useState } from "react";

interface props{
  jobsArray:any;
  setJobItem:(open: any) => void;
  setIsFormOpen: (open: boolean) => void ;
}
const JobCards = ({jobsArray, setJobItem, setIsFormOpen}: props) => {
    const DeleteJob = async (jobId:number)=>{
      try {
        const response = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok)
          throw new Error(`Server error: ${response.status}`);

        Notification("Job Deleted successfully!", "success");
        setIsFormOpen(false);
      } catch (error) {
        console.error("Deleting failed:", error);
        Notification("Error Deleting job", "error");
      }
    }
    return (
        <div className="h-full w-full flex flex-col items-center gap-5 px-4 mb-24">
            {jobsArray.length > 0 ? (
              jobsArray.map((item:any) => (
                <div 
                key={item.id} 
                className="flex flex-col w-full max-w-[600px] border border-gray-800 bg-gray-900/50 p-6 gap-3 rounded-lg hover:border-gray-600 transition-all"
                >
                  <div className="flex justify-between">
                    <p className="text-white text-center font-medium bg-[#44BC19] w-20 px-2 rounded-sm text-xs truncate">
                      {item.department}
                    </p>

                    <div className="flex gap-4">
                      
                      <button onClick={()=>{setJobItem(item);
                        setIsFormOpen(true);
                      }}
                        className="text-white hover:text-green-600">
                        Edit
                      </button>
                      <button onClick={()=>{DeleteJob(item.id)}}
                        className="text-white hover:text-red-600">
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-white font-bold text-xl truncate">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed truncate">{item.description}</p>
                  <div className="flex justify-between text-[#6E6E6E] text-xs sm:text-sm mt-2 font-medium">
                      <span className="truncate">{item.createdAt}</span>
                      <span className="truncate">{item.location}</span>
                      <span className="text-green-500 truncate">${item.salaryMin}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 mt-10 italic">No jobs posted yet.</div>
            )}
        </div>
    );
}

export default JobCards;