import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { useSecureFetch } from '@/utils/SecureFetch';
import { Loading } from '@/components/Loading'

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { userId, setUserId, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!userId);
  const secureFetch = useSecureFetch();
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      if (userId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await secureFetch('/api/users/me');
        
        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
        } else {
          clearAuth();
        }
      } catch (error) {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [userId, setUserId, clearAuth, secureFetch]);

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