
interface ProfileProps {
    user: any;
    token: string;
    setUser: (user: any, token: string) => void;
    setProfile: (profile: any) => void;
}

export async function ProfileChecker({ user, token, setProfile }: Omit<ProfileProps, 'setUser'>) {
    try {
        const res = await fetch(`http://localhost:3000/api/profiles/${user.id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok){
            setProfile(result);
            return true;
        }
    } catch (error) {
        console.error("Profile check error:", error);
        return false;
    }
    return false;
}