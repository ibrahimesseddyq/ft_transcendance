import { useEffect, useState } from 'react';
import { Loading } from "@/components/Loading";
import JobForm from "@/components/ui/CreateOrEditJobForm";
import {ToastContainer} from "react-toastify";
import JobDescription from "@/components/ui/JobDescription";
import JobFilter from "@/components/ui/JobFilter"
import JobCards  from '@/components/ui/JobCards'

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
  const [jobDescp, setJobDescp] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className=" flex h-full w-full gap-5 overflow-hidden">
        <ToastContainer/>
      {/* Job Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md  p-4">
          <div className="relative bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-lg  shadow-2xl">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 text-gray-100 hover:text-white transition-colors">
              ✕
            </button>
            <JobForm jobItem={jobItem} setIsFormOpen={setIsFormOpen} setJobsArray={setJobsArray}/>
          </div>
        </div>
      )}

      {/* Job Descriptions */}
      {jobDescp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl  p-4">
            <JobDescription jobItem={jobItem} setJobDescp={setJobDescp}/>
        </div>
      )}

      <JobFilter
        totalJobs={jobsArray}
        setJobsArray={setJobsArray}
        setIsLoading={setIsLoading}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <JobCards 
          jobsArray={jobsArray}
          setJobsArray={setJobsArray}
          setJobDescp={setJobDescp}
          setJobItem={setJobItem}
          setIsFormOpen={setIsFormOpen}
        />
      )}

      <button 
        onClick={() => {setJobItem(null); setIsFormOpen(true)}}
        className="fixed bottom-10 right-10 z-50 bg-[#10B77F] hover:bg-[#0d9668] 
          text-black font-bold py-3 px-4 rounded-md 
          shadow-2xl transition-all transform hover:scale-105 active:scale-95">
        + Post Job
      </button>
    </div>
  );
}