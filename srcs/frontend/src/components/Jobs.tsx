import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Loading } from "@/components/Loading";
import JobForm from "@/components/ui/CreateOrEditJobForm";
import {ToastContainer} from "react-toastify";
import JobFilter from "@/components/ui/JobFilter"
import JobCards  from '@/components/ui/JobCards'
import { useAuthStore } from '@/utils/ZuStand';

interface Job {
  title : string;
  description: string;
  department : string;
  location : string;
  skills: string;
  requirements : string; 
  employmentType : string;
  status: string;
  isRemote: string;
  salaryCurrency : string;
  salaryMin : bigint;
  salaryMax : bigint;
  createdBy : string;
  createdAt : string;
  updatedAt : string;
  closedAt : string;
}

export function Jobs() {
  const [jobsArray, setJobsArray] = useState<Job[]>([]);
  const [jobItem, setJobItem] = useState<Job | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");

  return (
    <div className="flex flex-col md:flex-row w-full gap-5 overflow-hidden 
      p-4 md:p-0 transition-colors duration-300 ">
      <ToastContainer />

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/20 dark:bg-black/40 p-4">
          
          <div className="relative bg-white dark:bg-gray-900 border border-gray-200 
            dark:border-gray-800 p-6 rounded-xl w-full max-w-lg shadow-2xl transition-all">
            
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-gray-400 dark:text-gray-500 
                hover:text-gray-900 dark:hover:text-white transition-colors">
              ✕
            </button>

            <JobForm jobItem={jobItem} setIsFormOpen={setIsFormOpen} setJobsArray={setJobsArray}/>
          </div>
        </div>
      )}

      {/* Sidebar Filter Component */}
      <JobFilter
        totalJobs={jobsArray}
        setJobsArray={setJobsArray}
        setIsLoading={setIsLoading}
      />

      {/* Content Area */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <JobCards 
          jobsArray={jobsArray}
          setJobsArray={setJobsArray}
          setJobItem={setJobItem}
          setIsFormOpen={setIsFormOpen}
        />
      )}

      {isAdminOrRecruiter && (
        <button 
          onClick={() => {setJobItem(null); setIsFormOpen(true)}}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-[#10B77F] hover:bg-[#0da371] dark:hover:bg-[#12cf91]
            text-white dark:text-slate-900 font-extrabold rounded-full 
            shadow-lg shadow-[#10B77F]/30 dark:shadow-[#10B77F]/20 
            transition-all duration-300 flex items-center justify-center"
        >
          <Plus size={25} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}