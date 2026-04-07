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
  accepted: 'text-emerald-600 dark:text-emerald-400',
  rejected: 'text-rose-600 dark:text-rose-400',
  newMessage: 'text-sky-600 dark:text-sky-400',
  applicationReceived: 'text-amber-600 dark:text-amber-400',
};

const TYPE_BADGES: Record<string, string> = {
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800',
  newMessage: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800',
  applicationReceived: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800',
};

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const user = useAuthStore((state) => state.user);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;

  useEffect(() => {
    if (!user) return;

    chatSocket.connect();

    mainService.get(`${env_main_api}/notifications`)
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
      await mainService.patch(`${env_main_api}/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await mainService.patch(`${env_main_api}/notifications/read-all`);
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
    <div className="flex-1 flex justify-center items-center relative px-2 sm:px-4" ref={dropdownRef}>
      <button
        className="inline-flex items-center justify-center h-9 w-9 relative rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Toggle notifications"
      >
        <Icon name='Bell'
          className={`h-5 w-5 transition-colors ${
            isOpen ? 'text-[#00adef]' : 'text-slate-700 dark:text-slate-200'
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center leading-none border border-white dark:border-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>


      {isOpen && (
        <div className="fixed md:absolute top-16 md:top-11 left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0 w-[94vw] max-w-[420px] md:w-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-[100] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40">
            <div className="flex flex-col">
              <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                Notifications {unreadCount > 0 && <span className="text-[#00adef]">({unreadCount})</span>}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Realtime updates and activity</span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[#00adef] text-xs font-medium hover:text-[#008fcc] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[66vh] md:max-h-80 overflow-y-auto custom-scrollbar">
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
                  className="p-4 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${TYPE_BADGES[item.type] ?? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`}>
                          {item.type}
                        </span>
                        {!item.isRead && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
                      </div>
                      <p className={`text-sm font-semibold leading-snug ${TYPE_COLORS[item.type] ?? 'text-slate-900 dark:text-slate-100'}`}>
                        {item.title}
                      </p>
                      {item.message && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 break-words">
                          {item.message}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] shrink-0 text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatTime(item.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center">
                <div className="mx-auto w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Icon name='Bell' className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You are all caught up for now.</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/30">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Click a message notification to open chat directly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
