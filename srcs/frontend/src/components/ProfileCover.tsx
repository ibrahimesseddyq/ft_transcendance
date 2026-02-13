import { Link } from 'react-router-dom';
import { ArrowDownFromLine } from 'lucide-react';

interface props{
  profile: any;
  user: any;
}
export function ProfileCover({ profile, user }: props) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const resumeUrl = `${BACKEND_URL}${profile?.resumeUrl}`;
  const avatarUrl = `${BACKEND_URL}${user?.avatarUrl}`;

  return (
    <div className="relative flex flex-col gap-4 p-6 pt-20 bg-white border rounded-xl items-center shadow-sm">
      {/* Avatar */}
      <div 
        style={{ backgroundImage: `url("${avatarUrl}")` }}
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
            h-32 w-32 rounded-full bg-cover bg-center border-4 border-white shadow-xl z-10"
      />

      {/* Identity Section */}
      <div className="text-center">
        <h2 className="font-bold text-2xl text-slate-900">
          {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-lg font-medium text-slate-500">{user?.role}</p>
      </div>

      {/* Contact Info */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600">
        <span className="text-sm font-light">{user?.email}</span>
        {user?.phone && (
          <span className="text-sm font-light border-l border-slate-300 pl-4">
            {user?.phone}
          </span>
        )}
      </div>
      
      {/* Actions Section */}
      <div className="flex flex-wrap gap-3  mt-4">
        <div className="flex gap-2 flex-1 w-full sm:w-96">
          <Link 
            target="_blank" 
            to={resumeUrl} 
            className="flex-1 flex items-center justify-center gap-2 border border-[#00adef] rounded-lg text-[#00adef] py-2 text-sm font-semibold hover:bg-[#00adef]/5 transition-colors"
          >
            <ArrowDownFromLine className="h-4 w-4"/>
            CV
          </Link>
          <button className="flex-1 bg-[#00adef] rounded-lg text-white py-2 text-sm font-semibold hover:bg-[#009cd6] transition-colors">
            Share
          </button>
        </div>

        <Link 
          to="/Settings"
          className="w-full sm:w-auto px-4 py-2 text-center bg-slate-100 rounded-lg text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
}