import { FunnielOverview } from "@/components/FunnielOverview";
import { ActiveJobStatus } from "@/components/ActiveJobStatus";
import { RecentActivity } from "@/components/RecentActivity";
import { SourceOfHire } from "@/components/SourceOfHire";


export function HomePage(){
   const TotalStatistics = () =>{
    return (
      <div className="h-full w-full flex justify-between items-center ">
        <div className="pl-5 py-2  mx-auto flex flex-col justify-between h-[95px] w-[200px] text-lg text-white border border-[#5F88B8] rounded-md">
          <p className="text-[14px] text-white">Active Job Opening</p>
          <p className="text-xl text-white">20</p>
          <p className="text-xs text-gray-400">+3 last 30 days</p>
        </div>
        <div className="pl-5 py-2 mx-auto flex flex-col justify-between h-[95px] w-[200px] text-lg text-white border border-[#5F88B8] rounded-md">
          <p className="text-[14px] text-white">Total Active Condidates</p>
          <p className="text-xl text-white">215</p>
          <p className="text-xs text-gray-400">+3 last 30 days</p>
        </div>
        <div className="pl-5 py-2  mx-auto flex flex-col justify-between h-[95px] w-[200px] text-lg text-white border border-[#5F88B8] rounded-md">
          <p className="text-[14px] text-white">New Condidates (last day)</p>
          <p className="text-xl text-white">48</p>
          <p className="text-xs text-gray-400">12% from last week</p>
        </div>
        <div className="pl-5 py-2 mx-auto m flex flex-col justify-between h-[95px] w-[200px] text-lg text-white border border-[#5F88B8] rounded-md">
          <p className="text-[14px] text-white">Average Time To Hire</p>
          <p className="text-xl text-white">20</p>
          <p className="text-xs text-gray-400">5 days from last month</p>
        </div>
      </div>
    );
  }
  return (
        <div className="w-full h-full p-2 grid grid-cols-1 lg:grid-cols-8 lg:grid-rows-7 gap-4">
              <div className="h-[300px] w-full lg:h-full col-span-1 lg:col-span-8 lg:row-span-1 ">
                  <TotalStatistics/>
              </div>
            {/* Left Column - Main Content */}
              <div className="col-span-1 lg:col-span-5 lg:row-span-3 h-[500px] lg:h-full w-full place-content-center
                border border-[#5F88B8] rounded-xl  justify-between overflow-auto bg-transparent
                  [&::-webkit-scrollbar]:w-2
                  [&::-webkit-scrollbar-track]:bg-transparent
                  [&::-webkit-scrollbar-thumb]:bg-white
                  [&::-webkit-scrollbar-thumb]:rounded-full">
                {/* <HeroSection />    */}
              </div>
              <div className="col-span-1 lg:col-span-3 lg:row-span-3 h-[500px] lg:h-full w-full items-center
                border border-[#5F88B8] rounded-xl  justify-between overflow-auto bg-transparent 
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-white
                [&::-webkit-scrollbar-thumb]:rounded-full">
                {/* <ActiveJobStatus /> */}
              </div>
    
            
            {/* Right Column - Sidebar Content */}

              <div className="col-span-1 lg:col-span-3 lg:row-span-3 w-full h-full
                border border-[#5F88B8] rounded-lg overflow-auto
                bg-transparent
                [&::-webkit-scrollbar]:w-3
                [&::-webkit-scrollbar-track]:bg-[#948a8a]
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-white
                [&::-webkit-scrollbar-thumb]:h-5
                [&::-webkit-scrollbar-thumb]:rounded-full">
                {/* <RecentActivity /> */}
              </div>
              
              <div className="col-span-1 lg:col-span-5 lg:row-span-3 w-full h-full
                border border-[#5F88B8] rounded-lg overflow-auto
                bg-transparent
                [&::-webkit-scrollbar]:w-3
                [&::-webkit-scrollbar-track]:bg-[#948a8a]
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-white
                [&::-webkit-scrollbar-thumb]:h-5
                [&::-webkit-scrollbar-thumb]:rounded-full">
                {/* <SourceOfHire /> */}
              </div>
        </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  );
};
