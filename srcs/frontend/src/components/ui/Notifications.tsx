import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";

const MOCK_NOTIFICATION = [
  { id: 1, note: "Post a job", recruter: "RH", category: "Front-End" },
  { id: 2, note: "Post a job", recruter: "RH", category: "Front-End" },
  { id: 3, note: "Post a job", recruter: "RH", category: "Front-End" },
  { id: 4, note: "Post a job", recruter: "RH", category: "Front-End" },
];

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex-1 flex justify-center items-center relative" >
      <button 
        className="relative inline-flex items-center justify-center h-10 w-10 childcard"
        onClick={() => setIsOpen(!isOpen)} >
        <Bell className={`h-5 w-5 transition-colors ${isOpen ? 'text-green-600' : 'text-gray-300'} hover:text-green-600`} />
      </button>

      {isOpen && (
        <div className="absolute top-11 w-80 bg-[#1F2027] border border-[#5F88B8] rounded-md shadow-2xl z-[100]">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {MOCK_NOTIFICATION.length > 0 ? (
              MOCK_NOTIFICATION.map((item) => (
                <div key={item.id} className="flex gap-2 p-3 rounded-md hover:bg-[#2A2B35] cursor-pointer border-b border-gray-800 last:border-0">
                    <p className="text-white text-xs font-bold">{item.recruter}</p>
                    <p className="text-[#10B77F] text-[10px]">{item.note}</p>
                    <p className="text-[#94999A] text-[10px] flex items-center gap-1">
                      in {item.category}
                    </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[#94999A] text-xs">No Notification found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}