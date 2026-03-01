import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { Loading } from '@/components/Loading';

export function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setUserId = useAuthStore((state) => state.setUserId);
    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) 
            return;
        hasProcessed.current = true;

        const userId = searchParams.get('userId');
        
        try {
            if (userId) {
                // setUserId(userId);
                navigate('/otp', { replace: true });
            } else {
                navigate('/Login', { replace: true });
            }
        } catch (error) {
            navigate('/Login', { replace: true });
        }
    }, []);

    return (
        <div className='h-screen w-screen items-center'>
            <Loading />
        </div>
    );
}