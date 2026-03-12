import { useState } from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export function RecentActivity() {
  const [users] = useState([
    { id: 1, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Back-end', status: 'Rejected', time: '2h ago' },
    { id: 2, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Front-end', status: 'Accepted', time: '5h ago' },
    { id: 3, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Front-end', status: 'Accepted', time: '1d ago' },
    { id: 4, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Front-end', status: 'Rejected', time: '2d ago' },
    { id: 5, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Front-end', status: 'Accepted', time: '6d ago' },

  ]);

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <header className="flex items-center justify-between h-full w-full max-h-16 sticky top-0 z-20 border-b border-gray-50 dark:border-slate-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-surface-main ml-5 m-3">
          Recent Activity
        </h3>
      </header>

      <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800 overflow-auto custom-scrollbar">
        {users.map((item) => (
          <div 
            key={item.id} 
            className="group p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
          >
            <div className="flex items-start gap-4">

              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                {item.firstName[0]}{item.lastName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-surface-main truncate">
                    {item.firstName} {item.lastName}
                  </p>

                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    item.status === "Accepted" 
                      ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20" 
                      : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-danger-hover border-red-200 dark:border-red-500/20"
                  }`}>
                    {item.status === "Accepted" 
                      ? <CheckCircle2 size={12} className="mr-1"/> 
                      : <XCircle size={12} className="mr-1"/>
                    }
                    {item.status}
                  </span>
                </div>
                  
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Applied for <span className="font-medium text-gray-800 dark:text-gray-200">{item.Offer}</span>
                </p>
                  
                <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                  <Clock size={12} className="mr-1" />
                  {item.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}