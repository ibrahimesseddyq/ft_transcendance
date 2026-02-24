
interface ProfileProps {
    userId: string | null;
    setProfile: (profile: any) => void;
}

export async function ProfileChecker({ userId, setProfile }: ProfileProps) {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    try {
        const res = await fetch(`${BACKEND_URL}/api/profiles/${userId}`, {
            method: "GET",
            credentials: 'include'
        });
        const result = await res.json();
        if (res.ok){
            setProfile(result.data);
            return true;
        }
    } catch (error) {
        console.error("Profile check error:", error);
        return false;
    }
    return false;
}