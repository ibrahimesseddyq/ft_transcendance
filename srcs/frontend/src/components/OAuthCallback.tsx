import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/utils/ZuStand';
import { Loading } from '@/components/Loading'
import { ProfileChecker } from '@/components/ProfileChecker';

export const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const setHasProfile = useAuthStore((state) => state.setHasProfile);
    const setProfile = useAuthStore((state) => state.setProfile);

    useEffect(() => {

    const processOAuth = async () => {
        const token = searchParams.get('token');
        const userFromUrl = searchParams.get('user');
        
        if (token && userFromUrl) {
            try {
                localStorage.setItem("token", token);
                const user = JSON.parse(userFromUrl);
                const hasProfile = await ProfileChecker({ user, token, setHasProfile, setProfile });
                const destination = hasProfile ? "/Dashboard" : "/Createprofile";
                setUser(user, token);
                navigate(destination, { replace: true });
                console.log("iam hereeeeeeeee&&&&&&");
            } catch (error) {
                console.error("OAuth error:", error);
                navigate('/Login', { replace: true });
            }
        }else{
            navigate('/Login', { replace: true });
            console.log("iam hereeeeeeeeeééééééé");
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