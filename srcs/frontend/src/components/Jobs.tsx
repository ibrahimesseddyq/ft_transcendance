import { useState } from 'react';
import { Link } from 'react-router-dom';
import JobForm  from "@/components/ui/JobForm"

export function Jobs() {
   
interface Job {
  id: number;
  category: string;
  title: string;
  description: string;
  type: string;
  location: string;
  salary: string;
}

const Job = {
  category: "Enginering",
  title: "Front-End",
  description: "jhdsjii9oi iuudsufhudsu dsfosdiof 8e uuhdjs 8 udf isd ofu",
  type: "Full-time",
  location: "Remote",
  salary: "10 000-15 000"
};
const [jobsArray, setJobsArray] = useState<Job[]>(
  Array.from({ length: 1 }, (_, i) => ({
    id: i + 1,
    ...Job
  }))
  );
  const handleAddJob = () => {
    const newjobsArray = prompt("Enter new jobsArray:");
    if (newjobsArray && newjobsArray.trim()) {
      const category = prompt("Enter category (e.g., webDev, CS):");
      if (!category || !category.trim()) return;

      const title = prompt("Enter title (e.g., webDev, CS):");
      if (!title || !title.trim()) return;

      const description = prompt("Enter description :");
      if (!description || !description.trim()) return;

      const type = prompt("Enter type (e.g., Full-time):");
      if (!type || !type.trim()) return;
      
      const location = prompt("Enter location :");
      if (!location || !location.trim()) return;
      
      const salary = prompt("Enter salary in dolar (e.g., 10 000):");
      if (!salary || !salary.trim()) return;

      setJobsArray([...jobsArray, {
        id: Date.now(),
        category: category.trim(),
        title: title.trim(),
        description: description.trim(),
        type: type.trim(),
        location: location.trim(),
        salary: salary.trim()
      }]);
    }
  };

  
  return (
    <div className="relative flex flex-col  h-full w-full gap-5 overflow-auto items-center ">
       <div className="Title font-extrabold text-white pt-14 mx-auto">Jobs For You:</div>
       <div className="h-full w-full flex flex-col items-center gap-5 overflow-auto 
        custom-scrollbar mx-auto">
          {jobsArray.map((item) => {
            return (
              <div
                className="flex flex-col w-full max-w-[600px] h-auto border maincard  pl-10 p-4 gap-3">

                <p className="text-white font-medium bg-[#44BC19] w-fit px-2 rounded-sm">{item.category}</p>
                <div className="flex flex-col">
                  <p className="text-white font-bold">{item.title}</p>
                  <p className="text-gray-400 font-light text-xs sm:text-lg">{item.description}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-[#6E6E6E] text-xs sm:text-lg">{item.type}</p>
                    <p className="text-[#6E6E6E] text-xs sm:text-lg">{item.location}</p>
                    <p className="text-[#6E6E6E] text-xs sm:text-lg">{item.salary}</p>
                    <a href="#" className="pramary-text hover:underline text-xs sm:text-lg">view job</a>
                </div>
              </div> 
            );
        })}

       </div>
       <Link to={"/JobForm"} className=' absolute bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 
        text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-200">'>
          Post Job
        </Link>
        <div className='h-auto w-full z-50 p-4 mx-auto my-auto '>
          <JobForm/>
        </div>
    </div>
    );
}