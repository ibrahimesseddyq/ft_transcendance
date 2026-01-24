import { ActiveJobStatus } from "@/components/ActiveJobStatus";
import {RecentActivity} from "@/components/RecentActivity"
import {SourceOfHire} from "@/components/SourceOfHire"
import {ToastContainer} from "react-toastify";
import {RecuiretmentStatus} from "@/components/RecuiretmentStatus"

export function Dashboard(){
   const TotalStatistics = () =>{
    return (
      <div className="flex flex-wrap md:flex-row gap-2 md:justify-between 
        items-center h-full w-full">
        <div className="w-36 h-auto min-h-20 p-2  m-auto flex flex-col justify-between 
            overflow-hidden text-lg text-white bg-[#131D34]  border border-[#10B77F] card-color rounded-md">
          <p className="text-xs font-bold text-white">Active Job</p>
          <p className="text-md text-white">20</p>
          <p className="text-xs text-gray-400">+3 last 30 days</p>
        </div>
        <div className="w-36 h-auto min-h-20  p-2 mx-auto flex flex-col justify-between overflow-hidden
            text-lg text-white  bg-[#131D34]  border border-[#10B77F] card-color rounded-md">
          <p className="text-xs font-bold text-white">Active Condidates</p>
          <p className="text-md text-white">215</p>
          <p className="text-xs text-gray-400">+3 last 30 days</p>
        </div>
        <div className="w-36 h-auto min-h-20 p-2 mx-auto flex flex-col justify-between overflow-hidden 
            text-lg text-white  bg-[#131D34]  border border-[#10B77F] card-color rounded-md">
          <p className="text-xs font-bold text-white">New Condidates</p>
          <p className="text-md text-white">48</p>
          <p className="text-xs text-gray-400">12% from last week</p>
        </div>
        <div className="w-36 h-auto min-h-20 p-2 mx-auto flex flex-col justify-between overflow-hidden
            text-lg text-white bg-[#131D34]  border border-[#10B77F] card-color rounded-md">
          <p className="text-xs font-bold text-white">Time To Hire</p>
          <p className="text-md text-white">20</p>
          <p className="text-xs text-gray-400">5 days from last month</p>
        </div>
      </div>
    );
  }
  return (
      <div className="w-full h-full p-2 flex flex-col gap-4">
          <ToastContainer />
            <div className="w-full h-fit p-2 place-content-center">
                <TotalStatistics/>
            </div>
          {/* Left Column - Main Content */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="min-h-[400px] w-full place-content-center justify-between ">
              <RecuiretmentStatus /> 
            </div>
            <div className="min-h-[400px] w-full items-center justify-between ">
              <ActiveJobStatus />
            </div>
          </div>
  
          
          {/* Right Column - Sidebar Content */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="min-h-[400px] w-full
               rounded-lg ">
              <RecentActivity />
            </div>
            
            <div className="min-h-[400px] w-full">
              <SourceOfHire />
            </div>
          </div>

      </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  );
};
