import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';

interface LogoutProps {
  className?: string;
}

export function Logout({ className }: LogoutProps) {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/Login', { replace: true });
  };

  return (
    <button 
      onClick={handleLogout}
      className={className || "w-fit text-red-500 border rounded-md p-2 px-10 shadow-sm\
        hover:text-red-600 font-medium transition-colors bg-white backdrop-sepia-0"}
    >
      Logout
    </button>  
  );
}