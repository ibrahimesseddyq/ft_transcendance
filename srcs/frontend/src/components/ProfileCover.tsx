import { Link } from 'react-router-dom';
import { ArrowDownFromLine } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/utils/ZuStand';

interface props{
  profile: any;
  user: any;
}

export function ProfileCover({ profile, user }: props) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const resumeUrl = `${BACKEND_URL}${profile?.resumeUrl}`;
  const avatarUrl = `${BACKEND_URL}${user?.avatarUrl}`;
  const loggedUser = useAuthStore((state) => state.user);
  const [profileUrl] = useState(window.location.href);
  const [copyState, setCopyState] = useState('');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopyState('Copied!');
    setTimeout(() => { setCopyState('') }, 2000);
  }

  return (
    <div className="relative flex flex-col gap-4 p-6 pt-20 bg-white dark:bg-slate-900 border 
      border-gray-100 dark:border-slate-800 rounded-xl items-center shadow-sm transition-colors duration-300">

      <div 
        style={{ backgroundImage: `url("${avatarUrl}")` }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
            h-32 w-32 rounded-full bg-cover bg-center border-4 border-white dark:border-slate-900 shadow-xl z-10"
      />

      <div className="text-center">
        <h2 className="font-bold text-2xl text-slate-900 dark:text-white">
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
      
      {/* Actions Section */}
      <div className="flex flex-wrap gap-3 mt-4 w-full justify-center">
        <div className="flex gap-2 flex-1 w-full sm:w-96 max-w-80">
          <a 
            href={resumeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 border border-[#00adef] rounded-lg 
                       text-[#00adef] py-2 text-sm font-semibold hover:bg-[#00adef]/10 transition-colors"
          >
            <ArrowDownFromLine className="h-4 w-4"/>
            CV
          </a>
          <button onClick={handleCopy}
            className="flex-1 bg-[#00adef] rounded-lg text-white py-2 text-sm 
              font-semibold hover:bg-[#009cd6] transition-colors shadow-lg shadow-[#00adef]/20">
            {copyState ? <span className="animate-in fade-in zoom-in-95 duration-200">{copyState}</span> : "Share"}
          </button>
        </div>

        {loggedUser?.id === user?.id && (
          <Link 
            to="/EditProfile"
            className="w-full sm:w-auto px-4 py-2 text-center bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 
              dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Edit Profile
          </Link>
        )}
      </div>
    </div>
  );
}