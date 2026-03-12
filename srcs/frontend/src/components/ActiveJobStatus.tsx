import { User } from "lucide-react";

export function ActiveJobStatus({ data }: { data: any[] }) {

    const candidates = data || [];

    return (
      <div className="flex flex-col w-full h-full overflow-hidden">
        <header className="flex items-center justify-between h-full w-full max-h-16 sticky top-0 z-20 border-b border-gray-50 dark:border-slate-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-surface-main ml-5 m-3">
            Active Candidates
          </h3>
        </header>

        <div className="flex flex-col gap-2 p-3 overflow-auto custom-scrollbar">
          {candidates.length > 0 ? candidates.map((item: any, id:number) => (
              <div 
                key={id}
                className="flex items-center border border-gray-100 dark:border-slate-800 rounded-xl
                  p-3 justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    {/* Use profile */}
                    {item.profileImage ? (
                        <div 
                            className="h-11 w-11 rounded-full bg-slate-100 bg-cover bg-center border-2 border-surface-main dark:border-secondary-darkbg"
                            style={{ backgroundImage: `url(${item.profileImage})` }}
                        />
                    ) : (
                        <div className="h-11 w-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-surface-main dark:border-secondary-darkbg">
                            <User className="text-gray-400" size={20} />
                        </div>
                    )}
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-main dark:border-secondary-darkbg xl:hidden bg-green-400`} />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xs xl:text-sm text-black dark:text-surface-main font-bold">
                      {item.firstName} {item.lastName}
                    </span>
                    <span className="text-[11px] xl:text-xs font-medium text-gray-500 dark:text-gray-400">
                      {item.role || 'Candidate'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5 items-center">
                  <div className="h-2 w-2 rounded-full hidden xl:block bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                  <h3 className="text-xs xl:text-sm font-bold tracking-tight text-green-500 dark:text-green-400 uppercase">
                    {item.status || 'ACTIVE'}
                  </h3> 
                </div>
              </div>
            )) : (
                <div className="p-10 text-center text-gray-400 text-sm">No active candidates.</div>
            )}
        </div>
      </div>
    );
}