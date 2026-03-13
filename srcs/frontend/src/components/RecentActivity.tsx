import Icon from '@/components/ui/Icon'

export function RecentActivity({ activities }: { activities: any[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <header className="flex items-center justify-between h-full w-full max-h-16 sticky top-0 z-20 border-b border-gray-50 dark:border-slate-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-surface-main ml-5 m-3">
          Recent Activity
        </h3>
      </header>

      <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800 overflow-auto custom-scrollbar">
        {activities && activities.length > 0 ? activities.map((item: any) => {
          const firstName = item.candidate?.firstName || 'Unknown';
          const lastName = item.candidate?.lastName || '';
          const fullName = `${firstName} ${lastName}`;
          const initials = `${firstName[0]}${lastName[0] || ''}`.toUpperCase();
          const jobTitle = item.job?.title || 'Unknown Position';

          return (
            <div 
              key={item.id} 
              className="group p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                  {initials || <Icon name='User' size={16} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-surface-main truncate">
                      {fullName}
                    </p>

                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      item.status === "completed" 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-amber-100 text-amber-700 border-amber-200"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                    
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Applied for <span className="font-medium text-gray-800 dark:text-gray-200">{jobTitle}</span>
                  </p>
                    
                  <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <Icon name='Clock' size={12} className="mr-1" />
                    {formatDate(item.appliedAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
            <div className="p-10 text-center text-gray-400 text-sm">No recent activity.</div>
        )}
      </div>
    </div>
  );
}