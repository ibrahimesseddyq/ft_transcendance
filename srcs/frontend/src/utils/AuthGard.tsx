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
  const location = useLocation();
  const env_main_api = import.meta.env.VITE_MAIN_API_URL;

  console.log("AuthGuard userId :", userId);
  
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
        console.log('Session verification failed:', error);
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