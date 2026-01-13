import { useState } from 'react';

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

  const handleDeleteJob = (id:Number) => {
    setJobsArray(jobsArray.filter(jobsArray => jobsArray.id !== id));
  };
  return (
    <div className="flex flex-col  h-full w-full gap-5 overflow-auto m-auto">
       <div className="Title font-extrabold text-white pl-36 pt-14">Jobs For You:</div>
       <div className="flex flex-col items-center gap-5 overflow-auto custom-scrollbar">
          {jobsArray.map((item) => {
            return (
              <div
                className="flex flex-col w-[600px] h-[150px] border border-transparent hover:border-[#14cdb4]
                  card-border card-color pl-10 pt-4 gap-3"
              >
                <p className="text-white font-medium bg-[#44BC19] w-fit px-2 py-[1px] rounded-sm">{item.category}</p>
                <div className="flex flex-col gap-0">
                  <p className="text-white font-bold">{item.title}</p>
                  <p className="text-gray-400 font-light">{item.description}</p>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-10">
                    <p className="text-[#6E6E6E]">{item.type}</p>
                    <p className="text-[#6E6E6E]">{item.location}</p>
                    <p className="text-[#6E6E6E]">{item.salary}</p>
                  </div>
                  <div className="flex gap-1 pr-10">
                    <a href="#" className="pramary-text hover:underline">view job</a>
                  </div>
                </div>
              </div>
            );
        })}

       </div>
       <button onClick={handleAddJob} className='fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 
        text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-200">'>
          Post Job
        </button>
    </div>
    );
}