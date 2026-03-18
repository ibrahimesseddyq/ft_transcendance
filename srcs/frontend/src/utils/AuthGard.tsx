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
  const [isLoading, setIsLoading] = useState(!userId);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const location = useLocation();
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;
  

  // if (!hasHydrated) {
  //   return <Loading />;
  // }

  if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }
  useEffect(() => {
    const verifySession = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await mainService.get(`${env_main_api}/users/me`);
        const fetchedUserId = response.data.data.user.id;

        if (!fetchedUserId) {
          clearAuth();
        }
      } catch (error) {

        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [userId]);


   if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};