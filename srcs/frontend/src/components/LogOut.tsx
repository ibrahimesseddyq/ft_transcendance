import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { mainApi } from '@/utils/Api';

interface LogoutProps {
  className?: string;
}

export function Logout({ className }: LogoutProps) {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Iam in logout");
    await mainApi.post('/api/auth/logout');
    clearAuth();
    navigate('/Login', { replace: true });
  };

  return (
    <button 
      onClick={handleLogout}
      className={className || "w-fit text-red-500 border rounded-md p-2 px-10 shadow-sm\
        hover:text-red-600 font-medium transition-colors bg-white dark:bg-cyan-500/20 backdrop-sepia-0"}
    >
      Logout
    </button>  
  );
}