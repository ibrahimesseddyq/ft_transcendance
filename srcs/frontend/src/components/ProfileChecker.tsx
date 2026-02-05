
interface ProfileProps {
    user: any;
    token: string;
    setUser: (user: any, token: string) => void;
    setHasProfile: (hasProfile: boolean) => void;
    setProfile: (profile: any) => void;
}

export async function ProfileChecker({ user, token, setHasProfile, setProfile }: Omit<ProfileProps, 'setUser'>) {
    try {
        const res = await fetch(`http://localhost:3000/api/profiles/${user.id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = res.json();
        const exists = res.ok && result !== null;
        setProfile(result);
        setHasProfile(exists);
        return exists;
    } catch (error) {
        console.error("Profile check error:", error);
        setHasProfile(false);
        return false;
    }
}