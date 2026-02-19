import { useState } from "react";
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
    <div className="flex-1 flex justify-center items-center relative px-4" >
      <button 
        className="inline-flex items-center justify-center h-6 w-6"
        onClick={() => setIsOpen(!isOpen)} >
        <Bell className={`h-full w-full transition-colors ${isOpen ? 'text-green-600' : 'text-black'} hover:text-green-600`} />
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