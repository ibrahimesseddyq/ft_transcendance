import { useEffect, useState } from 'react';
import JobForm from "@/components/ui/JobForm";
import {ToastContainer} from "react-toastify";
import JobFilter from "@/components/ui/JobFilter"

interface Job {
  id: number;
  title: string,
  department: string,
  description: string,
  requirements: string,
  location: string,
  employmentType: string,
  salaryMin: string
}

const MOCK_JOBS: Job[] = [
  {
    id: 1,
    title: "Front-End Developer",
    department: "Engineering",
    description: "Looking for a React expert to build modern web interfaces.",
    requirements: "",
    location: "Remote",
    employmentType: "",
    salaryMin: "10 000-15 000"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    department: "Design",
    description: "Creative designer needed for mobile app prototyping.",
    requirements: "",
    location: "Casablanca",
    employmentType: "",
    salaryMin: "5 000-8 000"
  }
];

export function Jobs() {
  const [jobsArray, setJobsArray] = useState<Job[]>(MOCK_JOBS);
  const [isFormOpen, setIsFormOpen] = useState(false);
 
  useEffect(() => {
        const GetJobs = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/jobs", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (response) {
                    const data = await response.json();
                    // setJobsArray(data);
                } else {
                    console.log("");
                }
            } catch (error) {
                console.error("Auth Get Data", error);
            }
        };

        GetJobs();
    }, []);
  return (
    <div className="relative flex flex-col h-full w-full gap-5 overflow-auto items-center min-h-screen ">
        <ToastContainer/>
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md  p-4">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl w-full max-w-lg relative shadow-2xl">
            <button 
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
  
            <JobForm setIsFormOpen={setIsFormOpen}/>
          </div>
        </div>
      )}
      <div className='flex flex-col gap-5 h-full w-full'>
          <JobFilter/>
          <div className='flex flex-col '>
              <div className="pl-5 font-extrabold text-white  text-3xl">Jobs For You</div>

              <div className="h-full w-full flex flex-col items-center gap-5 px-4 mb-24">
                {jobsArray.length > 0 ? (
                  jobsArray.map((item) => (
                    <div 
                    key={item.id} 
                    className="flex flex-col w-full max-w-[600px] border border-gray-800 bg-gray-900/50 p-6 gap-3 rounded-lg hover:border-gray-600 transition-all"
                    >
                      <p className="text-white font-medium bg-[#44BC19] w-fit px-2 rounded-sm text-xs">
                        {item.department}
                      </p>
                      <p className="text-white font-bold text-xl">{item.title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                      <div className="flex justify-between text-[#6E6E6E] text-xs sm:text-sm mt-2 font-medium">
                          <span>{item.employmentType}</span>
                          <span>{item.location}</span>
                          <span className="text-green-500">${item.salaryMin}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 mt-10 italic">No jobs posted yet.</div>
                )}
              </div>
          </div>
        </div>

      <button 
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-10 right-10 z-50 bg-blue-600 hover:bg-blue-700 
          text-white font-bold py-4 px-8 rounded-md shadow-2xl transition-all transform hover:scale-105 active:scale-95"
      >
        + Post Job
      </button>
    </div>
  );
}