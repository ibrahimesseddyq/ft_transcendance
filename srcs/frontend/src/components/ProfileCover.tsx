import { Link, useNavigate } from 'react-router-dom';
import Icon  from '@/components/ui/Icon'
import { useState } from 'react';
import { useAuthStore } from '@/utils/ZuStand';
import { chatApi } from '@/services/chatApi';
import Notification from '@/utils/TostifyNotification';

interface props {
  profile: any;
  user: any;
}

export function ProfileCover({ profile, user }: props) {
  const BACKEND_URL = import.meta.env.VITE_SERVICE_URL;
  const resumeUrl = `${BACKEND_URL}${profile?.resumeUrl}`;
  const avatarUrl = user?.avatarUrl
    ? (String(user.avatarUrl).startsWith('http') ? user.avatarUrl : `${BACKEND_URL}${user.avatarUrl}`)
    : '/icons/placeholder.jpg';
  const loggedUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [profileUrl] = useState(window.location.href);
  const [copyState, setCopyState] = useState('');
  
  const isRecruiter = loggedUser?.role === 'recruiter';
  const isOwnProfile = loggedUser?.id === user?.id;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopyState('Copied!');
    setTimeout(() => { setCopyState('') }, 2000);
  }

  const handleStartChat = async () => {
    if (!loggedUser || !isRecruiter) return;
    try {
      if (!user?.id) {
        Notification('Candidate profile is not ready yet. Please try again.', 'warning');
        return;
      }

      const conversations = await chatApi.getConversations();

      const existing = conversations.find((conv: any) =>
        conv.participants?.some((p: any) => (p.userId === user.id) || (p.user?.id === user.id))
      );

      if (existing) {
        sessionStorage.setItem('chat_conversationId', existing.id);
        navigate('/Chat');
      } else {
        const newConversation = await chatApi.createConversation(user.id);
        sessionStorage.setItem('chat_conversationId', newConversation.id);
        navigate('/Chat');
      }
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;
      const message = Array.isArray(apiErrors) && apiErrors.length > 0
        ? apiErrors.join(', ')
        : (error?.response?.data?.message || 'Unable to start conversation.');
      Notification(message, 'error');
    }
  }

  return (
    <div className="relative flex flex-col items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 pt-16 shadow-sm transition-colors duration-300 sm:p-6 sm:pt-20 dark:border-slate-800 dark:bg-slate-900">

      <div 
        style={{ backgroundImage: `url("${avatarUrl}")` }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
            h-24 w-24 rounded-full border-4 border-white bg-cover bg-center shadow-lg sm:h-32 sm:w-32 dark:border-slate-900"
      />

      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-slate-100">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-sm font-medium uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">{user?.role}</p>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-x-4 gap-y-2 text-center text-slate-600 dark:text-slate-400">
        <span className="break-all text-sm font-medium">{user?.email}</span>
        {user?.phone && (
          <span className="break-all border-l border-slate-300 pl-4 text-sm font-medium dark:border-slate-700">
            {user?.phone}
          </span>
        )}
      </div>
      
      <div className="mt-4 flex w-full flex-col gap-3 justify-center">
        <div className="flex w-full flex-wrap justify-center gap-2">
          
          {isRecruiter && !isOwnProfile && (
            <button 
              onClick={handleStartChat}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto sm:min-w-[170px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Icon name='MessageSquarePlus' className="h-4 w-4"/>
              Message
            </button>
          )}

          <a 
            href={resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto sm:min-w-[170px] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Icon name='ArrowDownFromLine' className="h-4 w-4"/>
            CV
          </a>

          <button onClick={handleCopy}
            className="inline-flex w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 sm:w-auto sm:min-w-[170px] dark:border-slate-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white">
            {copyState ? <span className="animate-in fade-in zoom-in-95 duration-200">{copyState}</span> : "Share"}
          </button>
          
        </div>

        {isOwnProfile && (
          <Link 
            to="/EditProfile"
            className="w-full self-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit Profile
          </Link>
        )}
      </div>
    </div>
  );
}