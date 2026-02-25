import OverviewChart from "@/components/ui/OverviewChart"

export function OverviewStatistics() { 
  return (
    <div className="w-full h-full flex flex-col overflow-hidden ">
        <header className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-slate-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">
            Applications Overview
          </h3>
          <button className="text-xs text-[#1194b1] dark:text-[#00adef] font-semibold hover:underline">
            View Report
          </button>
        </header>
        <div className="p-5 flex-1">
            <OverviewChart />
        </div>
    </div>
  );
}