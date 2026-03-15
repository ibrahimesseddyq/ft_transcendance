import { useState } from 'react';
import Icon  from '@/components/ui/Icon'
import { Loading } from "@/components/Loading";
import JobForm from "@/components/ui/CreateOrEditJobForm";
import { ToastContainer } from "react-toastify";
import JobFilter from "@/components/ui/JobFilter";
import JobCards from '@/components/ui/JobCards';
import { useAuthStore } from '@/utils/ZuStand';

export function Jobs() {
  const [jobsArray, setJobsArray] = useState<any[]>([]);
  const [jobItem, setJobItem] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const user = useAuthStore((state) => state.user);
  const isAdminOrRecruiter = ["admin", "recruiter"].includes(user?.role ?? "");

  return (
    <div className="w-full h-screen md:h-[calc(100vh-80px)] flex
      flex-col md:flex-row gap-5 overflow-hidden duration-300 items-start">
      <ToastContainer />

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/20 dark:bg-black/40 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => setIsFormOpen(false)}
            className="absolute top-6 right-6 text-2xl text-gray-600 dark:text-gray-500 hover:text-red-400"
          >
            ✕
          </button>
          <JobForm jobItem={jobItem} setIsFormOpen={setIsFormOpen} setJobsArray={setJobsArray}/>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-full md:w-64 h-fit md:h-full">
        <JobFilter
          totalJobs={jobsArray}
          setJobsArray={setJobsArray}
          setIsLoading={setIsLoading}
          setTotalPages={setTotalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 h-full w-full overflow-hidden">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loading />
          </div>
        ) : (
          <JobCards 
            jobsArray={jobsArray}
            setJobsArray={setJobsArray}
            setJobItem={setJobItem}
            setIsFormOpen={setIsFormOpen}
            currentPage={currentPage}
            totalPages={totalPages} 
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {isAdminOrRecruiter && (
        <button 
          onClick={() => {setJobItem(null); setIsFormOpen(true)}}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 bg-accent hover:bg-[#0da371] text-white rounded-full shadow-lg transition-all flex items-center justify-center"
        >
          <Icon name='Plus' size={25} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}