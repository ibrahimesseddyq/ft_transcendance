import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { mainService } from '@/utils/Api';
import { Loading } from '@/components/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { userId, clearAuth, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true); // always start true
  const location = useLocation();
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;

  useEffect(() => {
    const verifySession = async () => {
      if (!userId || !user) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await mainService.get(`${env_main_api}/users/me`);
        const fetchedUserId = response.data?.data?.user?.id; // safe chain
        if (!fetchedUserId) clearAuth();
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, [userId]);

  // isLoading MUST come first — prevents flash redirect on valid sessions
  if (isLoading) return <div className="flex-1 flex items-center justify-center"><Loading /></div>;
  if (!user || !userId) return <Navigate to="/Login" state={{ from: location }} replace />;
  return <>{children}</>;
};