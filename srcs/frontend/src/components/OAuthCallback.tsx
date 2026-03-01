import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { Loading } from '@/components/Loading';

export function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const currentUserId = useAuthStore((state) => state.userId);
    const setUserId = useAuthStore((state) => state.setUserId);
    const setFirstLogin = useAuthStore((state) => state.setFirstLogin);

    useEffect(() => {
        const userIdFromUrl = searchParams.get('userId');
        const firstLoginFromUrl = searchParams.get('firstLogin') === 'true';

        if (!userIdFromUrl) {
            navigate('/Login', { replace: true });
            return;
        }
        if (currentUserId !== userIdFromUrl) {
            setUserId(userIdFromUrl);
            setFirstLogin(firstLoginFromUrl);
            navigate('/otp', { replace: true });
        } else {
            navigate('/otp', { replace: true });
        }
        
    }, [currentUserId, searchParams, setUserId, setFirstLogin, navigate]);

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <Loading />
        </div>
    );
}