import SourceOfHireChart from "@/components/ui/SourceOfHireChart";

export function SourceOfHire({ data }: { data: any }) {
  return (
    <div className="h-full w-full flex flex-col rounded-xl overflow-hidden">
        <header className="p-5 border-b border-gray-50 dark:border-slate-800">
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">
                Hiring Funnel
            </h3>
        </header>
        <div className="p-5 flex-1">
            {data ? (
                <SourceOfHireChart data={data} />
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                    No funnel data available
                </div>
            )}
        </div>
    </div>
  );
}