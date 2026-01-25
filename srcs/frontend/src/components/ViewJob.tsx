import Notification from "@/utils/TostifyNotification";
import { useState } from "react";

interface props{
  job:any;
  setIsFormOpen: (open: boolean) => void ;
}

export function ViewJob () {
    const ApplayJob = async (jobId:number)=>{
      try {
        const response = await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok)
          throw new Error(`Server error: ${response.status}`);

        Notification("Job Deleted successfully!", "success");
        // setIsFormOpen(false);
      } catch (error) {
        console.error("Deleting failed:", error);
        Notification("Error Deleting job", "error");
      }
    }
    return (
        <div className="h-full w-full flex flex-col items-center gap-5 p-4 bg-white">
            <div 
                className="flex flex-col w-full max-w-[600px] border border-gray-800
                bg-gray-900/50 p-6 gap-3 rounded-lg hover:border-gray-600 transition-all">
              <div className="flex justify-between">
                <p className="text-white text-center font-medium bg-[#44BC19] w-20 px-2 rounded-sm text-xs truncate">
                  {/* {job.department} */}
                </p>
              </div>
              <p className="text-white font-bold text-xl truncate">
                {/* {job.title} */}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed truncate">
                {/* {job.description} */}
              </p>
              <div className="flex justify-between text-[#6E6E6E] text-xs sm:text-sm mt-2 font-medium">
                  <span className="truncate">
                    {/* {job.createdAt} */}
                  </span>
                  <span className="truncate">
                    {/* {job.location} */}
                  </span>
                  <span className="text-green-500 truncate">
                    {/* {job.salaryMin} */}
                  </span>
              </div>
            </div>
              
        </div>
    );
}

export default ViewJob;