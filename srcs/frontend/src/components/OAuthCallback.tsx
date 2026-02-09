import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { Loading } from '@/components/Loading'
import { ProfileChecker } from '@/components/ProfileChecker';

export const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const setProfile = useAuthStore((state) => state.setProfile);

    useEffect(() => {

    const processOAuth = async () => {
        const token = searchParams.get('token');
        const userFromUrl = searchParams.get('user');
        
        if (token && userFromUrl) {
            try {
                const user = JSON.parse(userFromUrl);
                const hasProfile = await ProfileChecker({ user, token, setProfile });
                const updatedUser = { ...user, hasProfile: hasProfile };
                const destination = hasProfile ? "/Dashboard" : "/Createprofile";

                setUser(updatedUser, token);
                navigate(destination, { replace: true });
            } catch (error) {
                navigate('/Login', { replace: true });
            }
        }else{
            navigate('/Login', { replace: true });
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