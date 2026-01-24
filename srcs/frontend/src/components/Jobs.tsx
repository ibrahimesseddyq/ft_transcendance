import { useEffect, useState } from 'react';
import JobForm from "@/components/ui/JobForm";
import {ToastContainer} from "react-toastify";
import JobFilter from "@/components/ui/JobFilter"
import JobCards  from '@/components/ui/JobCards'

interface Job {
  id : number;
  title : string;
  description: string;
  department : string;
  location : string;
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
  const [isFormOpen, setIsFormOpen] = useState(false);
 
  return (
    <div className=" flex flex-col h-full w-full gap-5 overflow-hidden items-center min-h-screen ">
        <ToastContainer/>
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md  p-4">
          <div className="relative bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-lg  shadow-2xl">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute  top-6 right-6 text-gray-100 hover:text-white transition-colors"
            >
              ✕
            </button>
            <JobForm setIsFormOpen={setIsFormOpen}/>
          </div>
        </div>
      )}
      <div className='flex flex-col gap-5 h-full w-full'>
          {/* <div className="pl-5 font-extrabold text-white  text-3xl">Jobs For You</div> */}
          <JobFilter
            setJobsArray={setJobsArray}
          />
          <div className='flex flex-col overflow-auto no-scrollbar'>
            <JobCards 
              jobsArray={jobsArray}
            />
          </div>
      </div>

      <button 
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-10 right-10 z-50 bg-[#10B77F] hover:bg-[#0d9668] 
          text-black font-bold py-3 px-4 rounded-md 
          shadow-2xl transition-all transform hover:scale-105 active:scale-95">
        + Post Job
      </button>
    </div>
  );
}