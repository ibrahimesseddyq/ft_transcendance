import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from '@/utils/ZuStand';
import { chatSocket } from '@/services/chatSocket';
import { mainApi } from '@/utils/Api';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  referenceType: string | null;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
  accepted: 'text-green-400',
  rejected: 'text-red-400',
  newMessage: 'text-blue-400',
};

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = useAuthStore((state) => state.user);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Connect socket and fetch existing notifications on login
  useEffect(() => {
    if (!user) return;

    chatSocket.connect();

    mainApi.get('/api/notifications')
      .then((res) => {
        if (res.data?.data) setNotifications(res.data.data);
      })
      .catch(() => {});

    const handleNew = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    chatSocket.on('onNotificationNew', handleNew);

    return () => {
      chatSocket.off('onNotificationNew', handleNew);
    };
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await mainApi.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await mainApi.patch('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex-1 flex justify-center items-center relative px-4" ref={dropdownRef}>
      <button
        className="inline-flex items-center justify-center h-6 w-6 relative"
        onClick={() => setIsOpen((o) => !o)}
      >
        <Bell
          className={`h-full w-full transition-colors ${
            isOpen ? 'text-green-600' : 'text-black dark:text-white'
          } hover:text-green-600`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-11 right-0 w-80 bg-[#1F2027] border border-[#5F88B8] rounded-md shadow-2xl z-[100]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <span className="text-white text-xs font-bold">
              Notifications {unreadCount > 0 && <span className="text-[#5F88B8]">({unreadCount})</span>}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[#10B77F] text-[10px] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && markAsRead(item.id)}
                  className={`flex flex-col gap-1 p-3 cursor-pointer border-b border-gray-800 last:border-0 transition-colors
                    ${item.isRead ? 'hover:bg-[#2A2B35]' : 'bg-[#252730] hover:bg-[#2A2B35]'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold flex items-center gap-1 ${TYPE_COLORS[item.type] ?? 'text-white'}`}>
                      {item.title}
                      {!item.isRead && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      )}
                    </p>
                    <span className="text-[#94999A] text-[9px] shrink-0">
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                  {item.message && (
                    <p className="text-[#94999A] text-[10px] leading-snug">{item.message}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[#94999A] text-xs">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
