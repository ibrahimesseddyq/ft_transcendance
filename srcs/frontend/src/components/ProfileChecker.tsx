import { useSecureFetch } from '@/utils/SecureFetch'

interface ProfileProps {
    userId: string | null;
    setProfile: (profile: any) => void;
    secureFetch: ReturnType<typeof useSecureFetch>;
}

export async function ProfileChecker({ userId, setProfile, secureFetch }: ProfileProps) {
    try {
        const res = await secureFetch(`/api/profiles/${userId}`, {
            method: 'GET',
        });

        if (!res.ok)
            throw new Error("Profile Checker failed");

        const result = await res.json();
        if (result.ok) {
            setProfile(result.data);
            return true;
        }
    } catch (error) {
        console.error("Profile check error:", error);
        return false;
    }
    return false;
}