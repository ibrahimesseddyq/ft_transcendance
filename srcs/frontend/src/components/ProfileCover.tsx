import { Link, useNavigate } from 'react-router-dom';
import Icon  from '@/components/ui/Icon'
import { useState } from 'react';
import { useAuthStore } from '@/utils/ZuStand';
import { chatApi } from '@/services/chatApi';

interface props {
  profile: any;
  user: any;
}

export function ProfileCover({ profile, user }: props) {
  const BACKEND_URL = import.meta.env.VITE_MAIN_SERVICE_URL;
  const resumeUrl = `${BACKEND_URL}${profile?.resumeUrl}`;
  const avatarUrl = `${BACKEND_URL}${user?.avatarUrl}`;
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
      const conversations = await chatApi.getConversations();

      const existing = conversations.find((conv: any) =>
        conv.participants?.some((p: any) => p.id === user?.id)
      );

      if (existing) {
        sessionStorage.setItem('chat_conversationId', existing.id);
        navigate('/Chat');
      } else {
        const newConversation = await chatApi.createConversation(user?.id);
        sessionStorage.setItem('chat_conversationId', newConversation.id);
        navigate('/Chat');
      }
    } catch (error) {
      console.error('Failed to open conversation:', error);
    }
  }

  return (
    <div className="relative flex flex-col gap-4 p-6 pt-20 bg-surface-main dark:bg-secondary-darkbg border 
      border-gray-100 dark:border-slate-800 rounded-xl items-center shadow-sm transition-colors duration-300">

      <div 
        style={{ backgroundImage: `url("${avatarUrl}")` }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
            h-32 w-32 rounded-full bg-cover bg-center border-4 border-surface-main dark:border-secondary-darkbg shadow-xl z-10"
      />

      <div className="text-center">
        <h2 className="font-bold text-2xl text-secondary-darkbg dark:text-surface-main">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">{user?.role}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 dark:text-slate-400">
        <span className="text-sm font-light">{user?.email}</span>
        {user?.phone && (
          <span className="text-sm font-light border-l border-slate-300 dark:border-slate-700 pl-4">
            {user?.phone}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 mt-4 w-full justify-center">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto min-w-[320px] max-w-full">
          
          {isRecruiter && !isOwnProfile && (
            <button 
              onClick={handleStartChat}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 dark:bg-indigo-500 
                rounded-lg text-surface-main py-2 px-4 text-sm font-semibold hover:bg-indigo-700 transition-all 
                shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Icon name='MessageSquarePlus' className="h-4 w-4"/>
              Message
            </button>
          )}

          <a 
            href={resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-primary rounded-lg 
                       text-primary py-2 px-4 text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            <Icon name='ArrowDownFromLine' className="h-4 w-4"/>
            CV
          </a>

          <button onClick={handleCopy}
            className="flex-1 bg-primary rounded-lg text-surface-main py-2 px-4 text-sm 
              font-semibold hover:bg-[#009cd6] transition-colors shadow-lg shadow-primary/20">
            {copyState ? <span className="animate-in fade-in zoom-in-95 duration-200">{copyState}</span> : "Share"}
          </button>
          
        </div>

        {isOwnProfile && (
          <Link 
            to="/EditProfile"
            className="w-full sm:w-auto px-6 py-2 text-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 
              dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Edit Profile
          </Link>
        )}
      </div>
    </div>
  );
}