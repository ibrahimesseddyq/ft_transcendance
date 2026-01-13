import { ActiveJobStatus } from "@/components/ActiveJobStatus";
import {RecentActivity} from "@/components/RecentActivity"
import {SourceOfHire} from "@/components/SourceOfHire"
import {RecuiretmentStatus} from "@/components/RecuiretmentStatus"

export function Dashboard(){
   const TotalStatistics = () =>{
    return (
      <div className="h-full w-full flex flex-wrap md:justify-between items-center gap-2">
        <div className="px-3 py-3  mx-auto flex flex-col justify-between h-[95px] w-[180px] 
            text-lg text-white border border-[#10B77F] card-color rounded-md">
          <p className="text-[12px] font-bold text-white">Active Job Opening</p>
          <p className="text-xl text-white">20</p>
          <p className="text-xs text-gray-400">+3 last 30 days</p>
        </div>
        <div className="px-3 py-3  mx-auto flex flex-col justify-between h-[95px] w-[180px] 
            text-lg text-white border border-[#10B77F] card-color rounded-md">
          <p className="text-[12px] font-bold text-white">Total Active Condidates</p>
          <p className="text-xl text-white">215</p>
          <p className="text-xs text-gray-400">+3 last 30 days</p>
        </div>
        <div className="px-3 py-3  mx-auto flex flex-col justify-between h-[95px] w-[180px] 
            text-lg text-white border border-[#10B77F] card-color rounded-md">
          <p className="text-[12px] font-bold text-white">New Condidates (last day)</p>
          <p className="text-xl text-white">48</p>
          <p className="text-xs text-gray-400">12% from last week</p>
        </div>
        <div className="px-3 py-3  mx-auto flex flex-col justify-between h-[95px] w-[180px] 
            text-lg text-white border border-[#10B77F] card-color rounded-md">
          <p className="text-[12px] font-bold text-white">Average Time To Hire</p>
          <p className="text-xl text-white">20</p>
          <p className="text-xs text-gray-400">5 days from last month</p>
        </div>
      </div>
    );
  }
  return (
        <div className="w-full h-full p-2 grid grid-cols-1 lg:grid-cols-8 lg:grid-rows-7 gap-4">
              <div className="lg:h-[150px] w-full h-full col-span-1 lg:col-span-8 lg:row-span-1 ">
                  <TotalStatistics/>
              </div>
            {/* Left Column - Main Content */}
              <div className="col-span-1 lg:col-span-5 lg:row-span-3 h-[500px] lg:h-full w-full place-content-center justify-between ">
                <RecuiretmentStatus />   
              </div>
              <div className="col-span-1 lg:col-span-3 lg:row-span-3 h-[500px] lg:h-full w-full items-center
                  justify-between ">
                <ActiveJobStatus />
              </div>
    
            
            {/* Right Column - Sidebar Content */}

              <div className="col-span-1 lg:col-span-3 lg:row-span-3 h-[500px] lg:h-full w-full
                 rounded-lg ">
                <RecentActivity />
              </div>
              
              <div className="col-span-1 lg:col-span-5 lg:row-span-3 h-[500px] lg:h-full w-full">
                <SourceOfHire />
              </div>
        </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  );
};
