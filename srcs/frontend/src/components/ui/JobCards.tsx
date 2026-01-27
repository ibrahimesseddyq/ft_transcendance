import Notification from "@/utils/TostifyNotification";
import JobDescription from "@/components/ui/JobDescription"
import { Trash, SquarePen, Eye } from 'lucide-react';
import { boolean } from "zod";

interface props{
  jobsArray:any;
  jobItem:any;
  jobDescp:boolean;
  setJobItem: (open: any) => void;
  setJobDescp: (open: boolean) => void ;
  setIsFormOpen: (open: boolean) => void ;
}
const JobCards = ({jobsArray, jobItem, jobDescp, setJobItem, setJobDescp, setIsFormOpen}: props) => {
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
    <div className="flex flex-col gap-5 w-full h-full">
      {jobDescp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md p-4">
          <div
            className="relative bg-gray-900 border border-gray-700 p-6 rounded-xl 
              w-full max-w-7xl h-full max-h-[1000px] shadow-2xl">
            <JobDescription jobItem={jobItem} setJobDescp={setJobDescp} />
          </div>
        </div>
      )}

      {jobsArray.length > 0 ? (
        jobsArray.map((item: any) => (
          <div
            key={item.id}
            className="h-full w-full flex flex-col items-center gap-5 px-4">
            <div
              className="flex flex-col w-full max-w-[600px] border border-gray-800 
                bg-gray-900/50 p-6 gap-3 rounded-lg hover:border-gray-600 transition-all cursor-pointer">
              <div className="flex justify-between">
                <p className="text-white text-center font-medium bg-[#44BC19] w-20 px-2 rounded-sm text-xs truncate">
                  {item.department}
                </p>

                <div className="flex gap-4">
                  <Eye onClick={() => {setJobItem(item);setJobDescp(true);}}
                    className="h-5 w-5 text-white hover:text-green-600"/>
                  <SquarePen onClick={() => {setJobItem(item); setIsFormOpen(true);}}
                    className="h-5 w-5 text-white hover:text-green-600"/>
                  <Trash onClick={() => {DeleteJob(item.id);}}
                    className="h-5 w-5 text-white hover:text-red-600"/>
                </div>
              </div>

              <p className="text-white font-bold text-xl truncate">{item.title}</p>
              <p className="text-gray-400 text-sm truncate">{item.description}</p>

              <div className="flex justify-between text-[#6E6E6E] text-xs sm:text-sm mt-2 font-medium">
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                <span>{item.location}</span>
                <span className="text-green-500">${item.salaryMin}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500 italic text-center">No jobs posted yet.</div>
      )}
    </div>
  );
}

export default JobCards;