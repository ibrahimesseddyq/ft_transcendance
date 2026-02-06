import OverviewChart  from "@/components/ui/OverviewChart"

export function OverviewStatistics() { 
  return (
    <div className="w-full h-full border maincard  overflow-hidden">
        <header className="flex items-center justify-between
              h-full w-full max-h-16 sticky top-0 z-20">
          <h3 className="header-title ml-5 m-3">Overviews</h3>
        </header>
        <div className="p-3 overflow-auto no-scrollbar">
            <OverviewChart />
        </div>
    </div>
  );
}