import OverviewChart from "@/components/ui/OverviewChart"

export function OverviewStatistics({ data }: { data: any }) { 
  const chartData = data?.labels?.map((label: string, index: number) => ({
    name: label,
    uv: data.datasets.received[index] || 0,
    processed: data.datasets.processed[index] || 0
  })) || [];


  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Applications Overview
          </h3>
          <button className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
            View Report
          </button>
        </header>
        <div className="p-5 flex-1">
            <OverviewChart data={chartData} />
        </div>
    </div>
  );
}