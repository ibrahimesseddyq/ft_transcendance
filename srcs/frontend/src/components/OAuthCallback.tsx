import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { ProfileChecker } from '@/components/ProfileChecker';

export const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const setHasProfile = useAuthStore((state) => state.setHasProfile);
    const setProfile = useAuthStore((state) => state.setProfile);
    const initialized = useRef(false); 

    useEffect(() => {
    let isMounted = true;
    if (initialized.current) return;
    initialized.current = true;

    const processOAuth = async () => {
        const token = searchParams.get('token');
        const userFromUrl = searchParams.get('user');

        if (!token || !userFromUrl) {
            navigate('/Login', { replace: true });
            return;
        }
        try {
            const user = JSON.parse(decodeURIComponent(userFromUrl));
            localStorage.setItem("token", token);

            const hasProfile = await ProfileChecker({ user, token, setHasProfile, setProfile });

            if (isMounted) {
                const destination = hasProfile ? "/Dashboard" : "/Createprofile";
                setUser(user, token);
                navigate(destination, { replace: true });
            }
        } catch (error) {
            console.error("OAuth error:", error);
            if (isMounted) navigate('/Login', { replace: true });
        }
    };

    processOAuth();
    return () => { isMounted = false; };
}, []);

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00adef] mx-auto mb-4"></div>
                <p className="text-black font-medium">Authenticating...</p>
            </div>
        </div>
    );
};