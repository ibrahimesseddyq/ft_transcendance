import { useEffect, useState } from "react";
import { Search } from 'lucide-react';
import { SearchField } from "@/components/ui/SearchField";
interface JobsArrayProps {
  totalJobs: any,
  setJobsArray: (data: any) => void;
  setIsLoading: (data: boolean) => void;
}
const SKILLS = ["ui", "ux", "figma", "adobe xd", "react", "typescript"];
const JobFilter = ({ totalJobs, setJobsArray, setIsLoading }: JobsArrayProps) => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    department: [] as string[],
    employmentType: [] as string[],
    status: [] as string[],
    skills: [] as string[],
    isRemote: null as boolean | null,
  });

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (search) 
        params.append("keyword", search);
      if (filters.department.length > 0)
        params.append("department", filters.department.join(","));
      if (filters.employmentType.length > 0)
        params.append("employmentType", filters.employmentType.join(","));
      if (filters.status.length > 0)
          params.append("status", filters.status.join(","));
      if (filters.skills.length > 0)
        params.append("skills", filters.skills.join(","));
      if (filters.isRemote !== null)
        params.append("isRemote", String(filters.isRemote));

      const fetchPromise = fetch(`http://localhost:3000/api/jobs?${params.toString()}`);
  
      const timerPromise = new Promise(resolve => setTimeout(resolve, 800));

      const [response] = await Promise.all([fetchPromise, timerPromise]);
      if (response.ok) {
        const result = await response.json();
        setJobsArray(result.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }finally{
      setIsLoading(false);
    }
  };

  const getCount = (key: any, value: string | boolean) => {
    return totalJobs.filter(job => {
      if (typeof value === 'string') {
        return String(job[key]).toLowerCase() === value.toLowerCase();
      }
      return job[key] === value;
    }).length;
  };

  const getSkillCount = (skill: string) => {
    return totalJobs.filter(job => 
      job.skills?.toLowerCase().includes(skill.toLowerCase())
    ).length;
  };

  const toggleFilter = (key: 'department' | 'employmentType' | 'skills' | 'status', value: string) => {
  const normalizedValue = value.toLowerCase();

  setFilters(prev => {
    // Access the current array for the specific key
    const currentValues = prev[key]; 
    
    // Check if the normalized value is already there
    const isAlreadySelected = currentValues.includes(normalizedValue);

    // If it exists, remove otherwise, add
    const updatedValues = isAlreadySelected
      ? currentValues.filter(v => v !== normalizedValue)
      : [...currentValues, normalizedValue];

    return {
      ...prev,
      [key]: updatedValues
    };
  });
};

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchJobs(), 300);
    return () => clearTimeout(delayDebounce);
  }, [filters, search]);


  return (
    <div className="w-64 bg-[#1e1e1e] text-white p-5 rounded-2xl 
      flex flex-col gap-6 sticky top-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Filter</h2>
          <p className="text-gray-500 text-xs font-semibold">Total ({totalJobs.length})</p>
        </div>
        <button 
          onClick={() => {setSearch(""); setFilters({department: [],employmentType: [], status: [], skills: [], isRemote: null})}}
          className="bg-[#ff3b3b] hover:bg-red-600 text-[10px] px-3 py-1.5 rounded-md font-bold transition"
        >
          Clear all
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a keyword"
          className="w-full bg-[#f3f4f6] text-gray-900 text-xs py-2.5 px-4 rounded-xl outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      <div className="h-[1px] bg-gray-800 w-full" />


      <div className="flex flex-col gap-6  overflow-auto no-scrollbar">

          {/* Job departments */}
          <FilterSection title="Job department">
            <Checkbox 
              label="Engineering" 
              count={getCount('department', 'Engineering')}
              checked={filters.department.includes("engineering")} 
              onChange={() => toggleFilter("department", "engineering")}
            />
            <Checkbox 
              label="Design" 
              count={getCount('department', 'Design')} 
              checked={filters.department.includes("design")} 
              onChange={() => toggleFilter("department", "design")}
              />
            <Checkbox 
              label="Marketing" 
              count={getCount('department', 'marketing')}  
              checked={filters.department.includes("marketing")} 
              onChange={() => toggleFilter("department", "marketing")}
              />
            <Checkbox 
              label="Sales" 
              count={getCount('department', 'sales')}
              checked={filters.department.includes("sales")} 
              onChange={() => toggleFilter("department", "sales")}
            />
          </FilterSection>

          <FilterSection title="Job contract">
            <Checkbox 
              label="Full-time" 
              count={getCount('employmentType', 'full-time')} 
              checked={filters.employmentType.includes("full-time")} 
              onChange={() => toggleFilter("employmentType", "full-time")}
            />
            <Checkbox 
              label="Part-time" 
              count={getCount('employmentType', 'part-time')} 
              checked={filters.employmentType.includes("part-time")} 
              onChange={() => toggleFilter("employmentType", "part-time")}
            />
            <Checkbox 
              label="Internship" 
              count={getCount('employmentType', 'internship')}
              checked={filters.employmentType.includes("internship")} 
              onChange={() => toggleFilter("employmentType", "internship")}
            />
            <Checkbox 
              label="Temporary" 
              count={getCount('employmentType', 'temporary')} 
              checked={filters.employmentType.includes("temporary")} 
              onChange={() => toggleFilter("employmentType", "Temporary")}
            /> 
          </FilterSection>

          {/* Remote Status */}
          <FilterSection title="Location Preference">
            <Checkbox 
              label="Remote" 
              count={getCount('isRemote', true)}
              checked={filters.isRemote === true} 
              onChange={() => setFilters(p => ({...p, isRemote: p.isRemote === true ? null : true}))}
            />
          </FilterSection>


          {/* Job Status */}
          <FilterSection title="Job status">
            <Checkbox 
              label="open" 
              count={getCount('status', "open")} 
              checked={filters.status.includes("open")} 
              onChange={() => toggleFilter("status", "open")}
              />
            <Checkbox 
              label="closed" 
              count={getCount('status', "closed")} 
              checked={filters.status.includes("closed")} 
              onChange={() => toggleFilter("status", "closed")}
              />
            <Checkbox 
              label="archived" 
              count={getCount('status', "archived")} 
              checked={filters.status.includes("archived")} 
              onChange={() => toggleFilter("status", "archived")}
              />
          </FilterSection>

          {/* Job Skills */}
          <FilterSection title="Job Skills">
            {SKILLS.map((skill) => (
              <Checkbox 
                key={skill}
                label={skill} 
                count={getSkillCount(skill)}
                checked={filters.skills.includes(skill)} 
                onChange={() => toggleFilter("skills", skill)}
              />
            ))}
          </FilterSection>
      </div>
            
            
    </div>
  );
};

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
    <div className="flex flex-col gap-2.5">{children}</div>
    <div className="h-[1px] bg-gray-800 w-full mt-2" />
  </div>
);

const Checkbox = ({ label, count, checked, onChange }: any) => (
  <label className="flex items-center cursor-pointer group">
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition 
        ${checked ? 'bg-[#00adef] border-[#00adef]' : 'border-gray-600 bg-transparent'}`}>
      {checked && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
    </div>
    <span className={`ml-3 text-xs font-medium transition ${checked ? 'text-[#00adef]' : 'text-gray-400'}`}>
      {label} <span className="text-[#00adef] ml-0.5">({count})</span>
    </span>
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
  </label>
);

export default JobFilter;