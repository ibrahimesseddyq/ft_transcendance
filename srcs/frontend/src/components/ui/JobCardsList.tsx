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
    <div className="relative flex-1 h-full w-full overflow-auto no-scrollbar p-6 transition-colors duration-300">
      <div className="flex flex-wrap gap-6 justify-center">
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
          <div className="text-center w-full py-10 text-gray-400">No jobs found.</div>
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
      
