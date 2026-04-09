import Icon from '@/components/ui/Icon'

export function RecentActivity({ activities }: { activities: any[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <header className="sticky top-0 z-20 flex h-full w-full max-h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <h3 className="m-3 ml-5 text-base font-semibold text-slate-900 dark:text-slate-100">
          Recent Activity
        </h3>
      </header>

      <div className="flex flex-col divide-y divide-slate-200 overflow-auto custom-scrollbar dark:divide-slate-800">
        {activities && activities.length > 0 ? activities.map((item: any) => {
          const firstName = item.candidate?.firstName || 'Unknown';
          const lastName = item.candidate?.lastName || '';
          const fullName = `${firstName} ${lastName}`;
          const initials = `${firstName[0]}${lastName[0] || ''}`.toUpperCase();
          const jobTitle = item.job?.title || 'Unknown Position';

          return (
            <div 
              key={item.id} 
              className="group p-4 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {initials || <Icon name='User' size={16} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {fullName}
                    </p>

                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.status === "completed" 
                        ? "border-green-200 bg-green-100 text-green-700 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-300" 
                        : "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                    
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Applied for <span className="font-medium text-slate-800 dark:text-slate-200">{jobTitle}</span>
                  </p>
                    
                  <div className="mt-2 flex items-center text-xs text-slate-500 dark:text-slate-400">
                    <Icon name='Clock' size={12} className="mr-1" />
                    {formatDate(item.appliedAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
            <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">No recent activity.</div>
        )}
      </div>
    </div>
  );
}