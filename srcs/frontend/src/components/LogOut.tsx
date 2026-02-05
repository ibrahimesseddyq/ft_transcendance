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
      className={className || "text-red-500 hover:text-red-700 font-medium transition-colors"}
    >
      Logout
    </button>  
  );
}