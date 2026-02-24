import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { Loading } from '@/components/Loading'

export const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setUserId = useAuthStore((state) => state.setUserId);
    const setToken = useAuthStore((state) => state.setToken);


    useEffect(() => {
        const processOAuth = async () => {
            const token = searchParams.get('token');
            const userId = searchParams.get('userId');

            if (token && userId) {
                try {
                    setToken(token);
                    setUserId(userId);
                    navigate('/otp', { replace: true });
                } catch (error) {
                    navigate('/Login', { replace: true });
                }
            }
        };
        processOAuth();
    }, []);

   return (
        <div className="w-full h-screen flex items-center justify-center bg-[#F0F3FA]">
            <Loading />
        </div>
    );
};