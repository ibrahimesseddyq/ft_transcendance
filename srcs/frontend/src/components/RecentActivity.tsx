import { CheckCircle2, XCircle, Clock, User } from "lucide-react";

export function RecentActivity({ activities }: any) {

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <header className="flex items-center justify-between h-full w-full max-h-16 sticky top-0 z-20 border-b border-gray-50 dark:border-slate-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-surface-main ml-5 m-3">
          Recent Activity
        </h3>
      </header>

      <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800 overflow-auto custom-scrollbar">
        {activities.length > 0 ? activities.map((item: any) => (
          <div 
            key={item.id} 
            className="group p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                {item.userInitials || <User size={16} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-surface-main truncate">
                    {item.userName}
                  </p>

                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    item.type === "success" 
                      ? "bg-green-100 text-green-700 border-green-200" 
                      : "bg-blue-100 text-blue-700 border-blue-200"
                  }`}>
                    {item.actionType}
                  </span>
                </div>
                  
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
                  
                <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {item.timeAgo}
                </div>
              </div>
            </div>
          </div>
        )) : (
            <div className="p-10 text-center text-gray-400 text-sm">No recent activity.</div>
        )}
      </div>
    </div>
  );
}