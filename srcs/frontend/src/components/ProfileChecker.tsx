
import { mainApi } from '@/utils/Api';

interface ProfileProps {
    userId: string | null;
    setProfile: (profile: any) => void;
}

export async function ProfileChecker({ userId, setProfile }: ProfileProps) {
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;
    try {
        const res = await mainApi.get(`${env_main_api}/profiles/${userId}`);
        console.log("profile checker :", res.data);
        setProfile(res.data);
    } catch (error) {
        console.log("No Profile Provided", error);
        return false;
    }
    return true;
}