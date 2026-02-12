import OverviewChart  from "@/components/ui/OverviewChart"

export function OverviewStatistics() { 
  return (
    <div className="w-full h-full border bg-white rounded-xl shadow-sm flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-5 border-b border-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Applications Overview</h3>
          <button className="text-xs text-[#1194b1] font-semibold hover:underline">View Report</button>
        </header>
        <div className="p-5 flex-1">
            <OverviewChart />
        </div>
    </div>
  );
}