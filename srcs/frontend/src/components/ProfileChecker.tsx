
import api from '@/utils/Api';

interface ProfileProps {
    userId: string | null;
    setProfile: (profile: any) => void;
}

export async function ProfileChecker({ userId, setProfile }: ProfileProps) {
    try {
        const res = await api.get(`/api/profiles/${userId}`);
        console.log("profile checker :", res.data);
        setProfile(res.data);
    } catch (error) {
        console.log("No Profile Provided", error);
        return false;
    }
    return true;
}