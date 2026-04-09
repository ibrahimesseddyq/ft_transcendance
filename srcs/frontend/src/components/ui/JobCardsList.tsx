import JobCard from '@/components/ui/JobCard'
import Pagination from '@/components/ui/Pagination'


interface props {
  jobsArray: any[];
  currentPage: number;
  totalPages: number;
  setJobsArray: (item: any) => void;
  setJobItem: (item: any) => void;
  setIsFormOpen: (open: boolean) => void;
  setCurrentPage: (item: number) => void;
  setTotalPages: (item: number) => void;
}

const JobCardsList = ({ jobsArray, currentPage, totalPages, setTotalPages, setJobsArray, setJobItem, setIsFormOpen, setCurrentPage }: props) => {
 


  return (
    <div className="relative flex-1 h-full w-full overflow-auto no-scrollbar p-6 md:p-8 transition-colors duration-300">
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {jobsArray.length > 0 ? (
          jobsArray.map((item: any) => (
            <JobCard key={item.id}
              job={item}
              setTotalPages={setTotalPages}
              setJobItem={setJobItem}
              setJobsArray={setJobsArray} 
              setIsFormOpen={setIsFormOpen}/>
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            No jobs found.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          setCurrentPage={setCurrentPage}/>
      )}

    </div>
  );
};

export default JobCardsList;
      
