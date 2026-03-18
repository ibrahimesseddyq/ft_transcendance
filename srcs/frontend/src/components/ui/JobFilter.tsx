import { useEffect, useState } from "react";
import Icon  from '@/components/ui/Icon'
import { mainService } from '@/utils/Api';


const SKILLS = ["ui", "ux", "figma", "adobe xd", "react", "typescript"];
const JobFilter = ({ totalJobs, currentPage, setJobsArray, setIsLoading, setTotalPages, setCurrentPage }: any) => {
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;
  const [search, setSearch] = useState("");
  const limit = 6;
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
      if (search) params.append("keyword", search);
      if (filters.department.length > 0) params.append("department", filters.department.join(","));
      if (filters.employmentType.length > 0) params.append("employmentType", filters.employmentType.join(","));
      if (filters.status.length > 0) params.append("status", filters.status.join(","));
      if (filters.skills.length > 0) params.append("skills", filters.skills.join(","));
      if (filters.isRemote !== null) params.append("isRemote", String(filters.isRemote));
      
      params.append("page", String(currentPage));
      params.append("limit", String(limit));
      
      const url = `${env_main_api}/jobs?${params.toString()}`;
      const [response] = await Promise.all([
        mainService.get(url),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);

      const result = response.data; 

      if (result) {
        setJobsArray(result.data || []);
        setTotalPages(result.meta?.totalPages || 1);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const getCount = (key: string, value: any) => {
    if (!Array.isArray(totalJobs)) return 0;
    return totalJobs.filter((job: any) => {
      if (typeof value === 'boolean') return job[key] === value;
      return String(job[key]).toLowerCase() === String(value).toLowerCase();
    }).length;
  };

  const getSkillCount = (skill: string) => {
    if (!Array.isArray(totalJobs)) return 0;
    return totalJobs.filter((job: any) => 
      job.skills?.toLowerCase().includes(skill.toLowerCase())
    ).length;
  };

  const toggleFilter = (key: keyof typeof filters, value: string) => {
    const val = value.toLowerCase();
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(val)
        ? (prev[key] as string[]).filter(v => v !== val)
        : [...(prev[key] as string[]), val]
    }));
  };

  useEffect(() => { setCurrentPage(1); }, [filters, search]);
 
  useEffect(() => { fetchJobs(); }, [filters, search, currentPage]);


  return (
    <div className="flex flex-col w-full md:w-64 h-fit md:max-h-[calc(100vh-90px)] bg-[#1e1e1e] 
      text-surface-main p-5 rounded-2xl gap-6 sticky ">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Filter</h2>
          <p className="text-gray-500 text-xs font-semibold">Total ({totalJobs.length})</p>
        </div>

        <button 
          onClick={() => {setSearch(""); setFilters({department: [],employmentType: [], status: [], skills: [], isRemote: null})}}
          className="bg-danger hover:bg-red-600 text-[10px] px-3 py-1.5 rounded-md font-bold transition"
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
        <Icon name='Search' className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
      </div>

      <div className="h-[1px] bg-gray-800 w-full" />


      <div 
        className={`hidden md:flex md:flex-col gap-6 overflow-auto no-scrollbar`}>

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

          <FilterSection title="Location Preference">
            <Checkbox 
              label="Remote" 
              count={getCount('isRemote', filters.isRemote === true)}
              checked={filters.isRemote === true} 
              onChange={() => setFilters(p => ({...p, isRemote: p.isRemote === true ? null : true}))}
            />
          </FilterSection>


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
    <div className="h-[1px] bg-gray-800 w-full mt-2 hidden md:flex" />
  </div>
);

const Checkbox = ({ label, count, checked, onChange }: any) => (
  <label className="flex items-center cursor-pointer group">
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition 
        ${checked ? 'bg-primary border-primary' : 'border-gray-600 bg-transparent'}`}>
      {checked && <div className="w-1.5 h-1.5 bg-surface-main rounded-sm" />}
    </div>
    <span className={`ml-3 text-xs font-medium transition ${checked ? 'text-primary' : 'text-gray-400'}`}>
      {label} <span className="text-primary ml-0.5">({count})</span>
    </span>
    <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
  </label>
);

export default JobFilter;