import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { Loading } from '@/components/Loading';

export function OAuthCallback (){
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = useAuthStore((state) => state.userId);
    const setUserId = useAuthStore((state) => state.setUserId);

    useEffect(() => {
        const processOAuth = async () => {
            const userId = searchParams.get('userId');
            console.log("userId :", userId);
            try {
                if (userId) {
                    console.log("Iam here");
                    setUserId(userId);
                    navigate('/otp', { replace: true });
                } else {
                    navigate('/Login', { replace: true });
                }
            } catch (error) {
                navigate('/Login', { replace: true });
            } finally {
            }
        };
        processOAuth();
    }, [userId]);
    return <div></div>;
};