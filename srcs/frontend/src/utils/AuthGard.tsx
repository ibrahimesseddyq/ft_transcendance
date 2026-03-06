import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { mainApi } from '@/utils/Api';
import { Loading } from '@/components/Loading';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { userId, setUserId, clearAuth, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!userId);
  const location = useLocation();

  console.log("AuthGuard userId :", userId);
  if (!user) {
    return <Navigate to="/Login" state={{ from: location }} replace />;
  }
  
  useEffect(() => {
    const verifySession = async () => {
      if (userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await mainApi.get(`/api/users/${userId}/me`);
        const fetchedUserId = response.data.userId;
        console.log("response.data :", fetchedUserId);

        if (fetchedUserId) {
          setUserId(fetchedUserId);
        } else {
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
  }, [userId, setUserId, clearAuth]);

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