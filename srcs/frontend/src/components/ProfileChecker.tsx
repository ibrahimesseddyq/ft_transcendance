import { mainService } from '@/utils/Api';

interface ProfileProps {
    userId: string | null;
    setProfile: (profile: any) => void;
}

export async function ProfileChecker({ userId, setProfile }: ProfileProps) {
    const env_main_api = import.meta.env.VITE_MAIN_API_URL;
    try {
        const res = await mainService.get(`${env_main_api}/profiles/${userId}`);
        setProfile(res.data);
    } catch (error) {
        return false;
    }
    return true;
}