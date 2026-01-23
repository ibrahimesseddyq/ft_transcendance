import { useEffect, useState } from "react";
import { Search } from 'lucide-react';

interface FilterData{
    category: string,
    status: string,
    lucation: string,
    employmentType: string,
}

const JobFilter = () => {
    const [filter, setFilter] = useState<FilterData>();
    const [islocations, setIslocations] = useState(false);
    const [choises, setChoises] = useState({
        category: "",
        employmentType: "",
        status: "",
        location: "",

    })

    const FilterSubmit = async (data: FilterData) => {
        console.log("data = ", data);
        // try {
            //   const response = await fetch("http://localhost:3000/api/jobs", {
                //       method: "POST",
                //       headers: {
                    //           "Content-Type": "application/json",
                    //       },
                    //       body: JSON.stringify(data),
                    //   });
                    
            //   if (!response.ok) {
            //       throw new Error(`Server responded with status: ${response.status}`);
            //   }
            //   Notification("Job added successfully!", "success");
        // } catch (error) {
            //   console.error("Submission failed:", error);
            //   Notification("error Create Job field", "error");
        // } finally{
                                
        // }
     }; 

  const selectClass = "text-green-600 text-xs h-8 w-24 flex gap-1 border border-[#1e2e52] bg-[#1d273e] outline-none\
  focus:border-[#10B77F] transition-colors rounded-lg items-center place-content-center";

  return (
    <div className="relative h-auto w-full flex flex-col items-center">
      <div className='h-20 w-full max-w-[700px] bg-[#121b31]/50 py-2 px-4 rounded-2xl border border-[#1e2e52] max-h-[80vh] overflow-y-auto custom-scrollbar shadow-2xl'>
        <form onSubmit={()=>{FilterSubmit}} className='flex justify-between gap-4 w-full h-full items-center'>
            <div className="flex flex-wrap justify-between h-full w-full items-center">
                <select value={choises.category} onChange={(e) => choises({..., e.target.value})}
                    className={selectClass}>
                    <option selected >Category</option> 
                    <option value="Frontend">Frontend</option> 
                    <option value="Backend">Backend</option>
                    <option value="Devops">Devops</option>  
                </select>
                <select name="employmentType" id="employmentType"
                    className={selectClass}>
                    <option selected>Type</option> 
                    <option value="Fulltime">Full time</option> 
                    <option value="Parttime">Part time</option> 
                </select>
                <select name="status" id="status"
                    className={selectClass}>
                    <option selected>Status</option> 
                    <option value="open">open</option> 
                    <option value="close">close</option>  
                </select>
                <select name="location" id="location"
                    className={selectClass}>
                    <option selected>Location</option> 
                    <option value="khouribga">khouribga</option> 
                    <option value="casablanca">casablanca</option>  
                    <option value="agadir">agadir</option>  
                </select>
                {/* <select name="Category" id="Category"
                    className={selectClass}>
                    <option selected>Category</option> 
                    <option value="dddffdf">dddffdf</option> 
                    <option value="dsfds">dsfds</option>  
                    <option value="dddfefgdsfdf">dddfefgdsfdf</option>  
                </select> */}

            </div>
            <div className=" h-8 w-24 flex gap-1 bg-[#10B77F] hover:bg-[#0d9668] 
                transition-colors rounded-lg items-center place-content-center">
                <Search className="h-4 w-4"/>
                <button type="submit" className=" text-black text-[10px] font-bold ">
                    Filter Jobs
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default JobFilter;