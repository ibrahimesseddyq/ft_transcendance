import { useEffect, useState } from "react";
import { Search } from 'lucide-react';


interface FilterData {
    id?: string;
    title?: string;
    description?: string;
    department?: string;
    location?: string;
    requirements?: string; 
    employmentType?: string;
    status?: string;
    isRemote?: string;
    salaryCurrency?: string;
    salaryMin?: bigint;
    salaryMax?: bigint;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
    closedAt?: string;
}

interface JobsArrayProps {
  setJobsArray: (data: any) => void;
}

const JobFilter = ({ setJobsArray }: JobsArrayProps) => {
  const [filters, setFilters] = useState<FilterData>({});

  const fetchJobs = async () => {
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );
      
      const queryParams = new URLSearchParams(activeFilters).toString();
      const response = await fetch(`http://localhost:3000/api/jobs?${queryParams}`);

      if (response.ok) {
        const result = await response.json();
        console.log(result.data);
        setJobsArray(result.data); 
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

    useEffect(()=>{fetchJobs();}, [])
  const selectClass = "text-green-500 text-[10px] h-9 w-full sm:w-28 border border-[#1e2e52] bg-[#1d273e] \
    outline-none focus:border-[#10B77F] transition-colors rounded-lg px-2 cursor-pointer appearance-none";

  return (
    <div className=" h-auto w-full flex flex-col items-center py-4 sticky">
      <div className='h-auto w-full max-w-[900px] bg-[#121b31]/50 p-4 rounded-2xl border border-[#1e2e52] shadow-2xl'>
        <div className='flex flex-wrap lg:flex-nowrap gap-3 w-full items-center justify-center'>
          
          {/* Title / Role */}
          <select name="title" value={filters.title} onChange={handleChange} className={selectClass}>
            <option value="">All Roles</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Devops">Devops</option>
          </select>

          {/* Department */}
          <select name="department" value={filters.department} onChange={handleChange} className={selectClass}>
            <option value="">All Depts</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>

          {/* Employment Type */}
          <select name="employmentType" value={filters.employmentType} onChange={handleChange} className={selectClass}>
            <option value="">All Types</option>
            <option value="Fulltime">Full-time</option>
            <option value="Parttime">Part-time</option>
            <option value="Contract">Contract</option>
          </select>

          {/* Remote Status */}
          <select name="isRemote" value={filters.isRemote} onChange={handleChange} className={selectClass}>
            <option value="">Remote?</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>

          {/* Location */}
          <select name="location" value={filters.location} onChange={handleChange} className={selectClass}>
            <option value="">Locations</option>
            <option value="khouribga">Khouribga</option>
            <option value="casablanca">Casablanca</option>
            <option value="agadir">Agadir</option>
          </select>

          {/* Status */}
          <select name="status" value={filters.status} onChange={handleChange} className={selectClass}>
            <option value="">Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>

          <button 
            onClick={fetchJobs}
            className="h-9 px-6 flex gap-2 bg-[#10B77F] hover:bg-[#0d9668] 
                transition-colors rounded-lg items-center justify-center shrink-0 ml-auto"
          >
            <Search className="h-4 w-4 text-black"/>
            <span className="text-black text-xs font-bold whitespace-nowrap">Filter Jobs</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobFilter;