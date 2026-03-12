import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainApi } from '@/utils/Api'
import {MapPinHouse}  from 'lucide-react'
import { useParams } from 'react-router-dom'
import Notification from "@/utils/TostifyNotification"

interface props{
    app: any,
}
const AppCard = ({app}:props) => {
    const navigate = useNavigate();
    const [job, setJob] = useState([]);
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;

    const fetchJob = async () =>{
      try{
        const res = await mainApi.get(`${env_main_api}/jobs/${app?.jobId}`)
        setJob(res.data.data);
      } catch (err){
        console.log(err);
      }
    }

    useEffect(()=>{
      fetchJob();
    }, [])

    const handleSeePhases = () => {
      if (app.status === 'rejected')
        Notification("You are rejected from this job", "error")
      else if (app.status === 'accepted')
        Notification("You are rejected from this job", "success")
      else
        navigate(`/UserPhase/${app.id}`);
    };
    const handleSeeDetails = () => {
      navigate(`/ApplicationDetails/${app.id}`);
    };

    return (
      <div className="group min-h-20 w-full
          overflow-hidden p-4 bg-gray-50 dark:bg-slate-800/80 items-center rounded-xl 
          shadow-lg dark:shadow-none border border-transparent dark:border-slate-700 
          transition-colors duration-300">
          
        <div className="h-full flex flex-col justify-between items-center">

            <div className="mt-6 flex flex-col gap-5 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-sm font-medium 
                  text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300 
                  dark:ring-blue-500/30 transition-colors duration-300">
                  {(job as any)?.department}
                </span>
                <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-sm 
                  font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-900/30 
                  dark:text-purple-300 dark:ring-purple-500/30 transition-colors duration-300">
                  {(job as any)?.employmentType}
                </span>

                <span className="inline-flex items-center px-2.5 py-1 text-sm 
                  font-medium text-slate-600 dark:text-slate-300 transition-colors duration-300">
                  <div className="flex gap-1">
                    <MapPinHouse className="text-gray-400 w-4 h-4"/> {(job as any)?.location}
                  </div>
                </span>
                <span className="inline-flex items-center px-2.5 py-1 text-sm 
                  font-medium text-green-700 dark:text-green-400 transition-colors duration-300">
                  💰 ${(job as any)?.salaryMin} - ${(job as any)?.salaryMax}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50 
                border border-slate-100 dark:border-slate-700 transition-colors duration-300">
                <h3 className="mb-2 text-sm font-bold text-[#445a84] dark:text-slate-200">
                  Job Description
                </h3>
                <p className="text-sm font-normal leading-relaxed text-slate-600 
                  dark:text-slate-400 break-words transition-colors duration-300">
                  {(job as any)?.description}
                </p>
              </div>
            </div>

            <div className="flex mt-6 md:mt-4 gap-2 w-full items-center justify-center">
              <button onClick={handleSeeDetails}
                className='text-center font-medium font-sans w-full md:w-52 h-10
                rounded-xl border border-[#25aeca] dark:border-[#5bc8f5] 
                text-[#25aeca] dark:text-[#5bc8f5] hover:bg-[#25aeca] hover:text-white 
                dark:hover:bg-[#5bc8f5] dark:hover:text-slate-900 p-2 transition-colors duration-300'>
                Details
              </button>

              <button onClick={handleSeePhases}
                className='text-center font-medium font-sans w-full md:w-52 h-10
                rounded-xl bg-[#25aeca] dark:bg-[#00adef] text-white
                hover:bg-[#25aeca]/80 dark:hover:bg-[#00adef]/80 p-2 transition-colors duration-300'>
                Phases
              </button>
            </div>

        </div>
      </div>
    );
};

export default AppCard;