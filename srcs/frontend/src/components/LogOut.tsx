import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { LogOut } from 'lucide-react';
import { mainApi } from '@/utils/Api';

interface LogoutProps {
  className?: string;
}

export function Logout({ className }: LogoutProps) {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;

  const handleLogout = async () => {
    console.log("Iam in logout");
    await mainApi.post(`${env_main_api}/auth/logout`);
    clearAuth();
    navigate('/Login', { replace: true });
  };

  return (
    <button 
      onClick={handleLogout}
      className={`flex items-center justify-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20 
        text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group`}
      title="Logout"
    >
      <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className={className || `ml-2 text-xs font-bold uppercase tracking-tight`}>
        Logout
      </span>
    </button>
  );
}
 