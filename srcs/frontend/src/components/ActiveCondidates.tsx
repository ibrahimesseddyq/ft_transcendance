import Icon from '@/components/ui/Icon'

export function ActiveCondidates({ data }: { data: any[] }) {
  const candidates = data || [];
  const BACKEND_URL = import.meta.env.VITE_SERVICE_URL;

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <header className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-slate-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-surface-main">
          Active Candidates
        </h3>
      </header>

      <div className="flex flex-col gap-3 p-4 overflow-auto custom-scrollbar">
        {candidates.length > 0 ? candidates.map((item: any) => {
          const initials = `${item.firstName?.[0] || ''}${item.lastName?.[0] || ''}`.toUpperCase();
          const fullAvatarUrl = item.avatarUrl ? `${BACKEND_URL}${item.avatarUrl}` : null;

          return (
            <div 
              key={item.id}
              className="flex items-center border border-gray-100 dark:border-slate-800 rounded-xl p-3 justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all"
            >
              <div className="flex gap-3 items-center">
                <div className="relative shrink-0 h-11 w-11">
                  
                  {item.avatarUrl && (
                    <img 
                      src={fullAvatarUrl!} 
                      alt={item.firstName}
                      className="absolute inset-0 h-11 w-11 rounded-full object-cover border-2 border-white dark:border-slate-700 z-10"
                    />
                  )}

                  <div className="h-11 w-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-white dark:border-slate-700 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">
                    {initials || <Icon name='User' size={18} />}
                  </div>

                  {/* Status Indicator */}
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 z-20 ${
                    item.applicationStatus === 'inProgress' ? 'bg-amber-400' : 'bg-green-400'
                  }`} />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-gray-900 dark:text-surface-main font-bold truncate">
                    {item.firstName} {item.lastName}
                  </span>
                  <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                    {item.currentTitle || 'Candidate'} • <span className="text-gray-400 dark:text-gray-500">{item.jobTitle}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center px-2 py-1 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  item.applicationStatus === 'inProgress' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {item.applicationStatus}
                </span>
              </div>
            </div>
          );
        }) : (
          <div className="p-10 text-center text-gray-400 text-sm">No active candidates.</div>
        )}
      </div>
    </div>
  );
}