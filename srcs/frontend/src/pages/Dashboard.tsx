import {OverviewStatistics} from "@/components/OverviewStatistics"
import { ActiveJobStatus } from "@/components/ActiveJobStatus";
import { RecentActivity } from "@/components/RecentActivity";
import { SourceOfHire } from "@/components/SourceOfHire";
import { ToastContainer } from "react-toastify";

const TotalStats = [
  {
    id: 1,
    title: 'Active Job',
    number: 20,
    day: '+3 last 30 days'
  },
  {
    id: 2,
    title: 'Active Condidates',
    number: 215,
    day: '+3 last 30 days'
  },
  {
    id: 3,
    title: 'New Condidates',
    number: 48,
    day: '12% from last week'
  },
  {
    id: 4,
    title: 'Time To Hire',
    number: 20,
    day: '5 days from last month'
  },
]

export function Dashboard() {
  const TotalStatistics = () => {
    return (
      <div className="flex flex-col md:flex-row gap-2 items-center h-full w-full">
        {TotalStats.map((item) => {
          return (
            <div 
              key={item.id} 
              className="w-full p-4 m-auto flex flex-col justify-between flex-1 overflow-hidden 
                         bg-white dark:bg-slate-800 
                         text-black dark:text-white 
                         border border-gray-200 dark:border-slate-700 
                         hover:border-[#1194b1] dark:hover:border-[#1194b1] 
                         rounded-xl transition-colors duration-200"
            >
              <p className="text-xl font-bold">{item.title}</p>
              <p className="text-md opacity-80">{item.number}</p>
              <p className="text-xs text-[#1194b1] font-semibold">{item.day}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 flex flex-col gap-4 overflow-y-auto custom-scrollbar 
                    bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      
      <ToastContainer />

      <div className="w-full h-fit p-2 place-content-center">
        <TotalStatistics />
      </div>

      {/* Chart Sections */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-[500px] w-full items-center bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <OverviewStatistics /> 
        </div>
        <div className="h-[500px] w-full items-center bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          <ActiveJobStatus />
        </div>
      </div>

      {/* Activity Sections */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-[500px] w-full rounded-xl bg-white dark:bg-slate-800 border dark:border-slate-700 ">
          <RecentActivity />
        </div>
        
        <div className="h-[500px] w-full rounded-xl bg-white dark:bg-slate-800 border dark:border-slate-700">
          <SourceOfHire />
        </div>
      </div>
    </div>
  );
}