import Icon  from '@/components/ui/Icon'
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '@/utils/ZuStand';
import { chatSocket } from '@/services/chatSocket';
import { mainService } from '@/utils/Api';

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
  rejected: 'text-danger-hover',
  newMessage: 'text-blue-400',
  applicationReceived: 'text-yellow-400',
};

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = useAuthStore((state) => state.user);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!user) return;

    chatSocket.connect();

    mainService.get('/api/main/notifications')
      .then((res) => {
        if (res.data?.data) setNotifications(res.data.data.filter((n: Notification) => !n.isRead));
      })
      .catch(() => {});

    const handleNew = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    const handleCleared = ({ conversationId }: { conversationId: string }) => {
      setNotifications((prev) =>
        prev.filter(
          (n) => !(n.type === 'newMessage' && n.referenceType === 'conversation' && n.referenceId === conversationId)
        )
      );
    };

    chatSocket.on('onNotificationNew', handleNew);
    chatSocket.on('onNotificationCleared', handleCleared);

    return () => {
      chatSocket.off('onNotificationNew', handleNew);
      chatSocket.off('onNotificationCleared', handleCleared);
    };
  }, [user]);

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
      await mainService.patch(`/api/main/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await mainService.patch('/api/main/notifications/read-all');
      setNotifications([]);
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
        <Icon name='Bell'
          className={`h-full w-full transition-colors ${
            isOpen ? 'text-green-600' : 'text-black dark:text-surface-main'
          } hover:text-green-600`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-surface-main text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>


      {isOpen && (
        <div className="
          /* Positioning: Absolute on desktop, fixed/centered on mobile */
          fixed md:absolute 
          top-16 md:top-11 
          left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0

          /* Size: Responsive width */
          w-[92vw] md:w-80 

          /* Styling */
          bg-[#1F2027] border border-[#5F88B8] rounded-md shadow-2xl z-[100]
        ">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <span className="text-surface-main text-xs font-bold">
              Notifications {unreadCount > 0 && <span className="text-[#5F88B8]">({unreadCount})</span>}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-accent text-[10px] hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-[60vh] md:max-h-72 overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!item.isRead) markAsRead(item.id);
                    if (item.type === 'newMessage' && item.referenceId) {
                      sessionStorage.setItem('chat_conversationId', item.referenceId);
                      setIsOpen(false);
                      navigate('/Chat');
                    }
                  }}
                  className={`flex flex-col gap-1 p-4 md:p-3 cursor-pointer border-b border-gray-800 last:border-0 transition-colors
                    ${item.isRead ? 'hover:bg-[#2A2B35]' : 'bg-[#252730] hover:bg-[#2A2B35]'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold flex items-center gap-1 ${TYPE_COLORS[item.type] ?? 'text-surface-main'}`}>
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
                    <p className="text-[#94999A] text-[11px] md:text-[10px] leading-snug">
                      {item.message}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-[#94999A] text-xs">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
