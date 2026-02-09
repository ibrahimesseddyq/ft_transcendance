import { useState } from "react";
import { User, CheckCircle2, XCircle, Clock } from "lucide-react";

export function RecentActivity() {
  const [users] = useState([
    { id: 1, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Back-end', status: 'Rejected', time: '2h ago' },
    { id: 2, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Front-end', status: 'Accepted', time: '5h ago' },
    { id: 3, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Front-end', status: 'Accepted', time: '1d ago' },
    { id: 4, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Front-end', status: 'Rejected', time: '2d ago' },
    { id: 5, firstName: 'Abdellatif', lastName: 'Elfagrouch', Offer: 'Front-end', status: 'Accepted', time: '6d ago' },

  ]);

  return (
    <div className="flex flex-col w-full h-full border  maincard overflow-hidden">
        <header className="flex items-center justify-between
            h-full w-full max-h-16 sticky top-0 z-20">
            <h3 className="header-title ml-5 m-3">Recent Activity</h3>
        </header>

      <div className="flex flex-col divide-y divide-gray-100 overflow-auto custom-scrollbar">
        {users.map((item) => (
          <div key={item.id} className="group p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-start gap-4">
              {/* Avatar Placeholder */}
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                {item.firstName[0]}{item.lastName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {item.firstName} {item.lastName}
                  </p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === "Accepted" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {item.status === "Accepted" ? <CheckCircle2 size={12} className="mr-1"/> : <XCircle size={12} className="mr-1"/>}
                    {item.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600">
                  Applied for <span className="font-medium text-gray-800">{item.Offer}</span>
                </p>
                
                <div className="flex items-center mt-2 text-xs text-gray-400">
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