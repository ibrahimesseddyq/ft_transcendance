import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'candidate' | 'recruiter' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  isVerified: boolean;
  hasProfile: boolean;
}
interface Profile{
  availableFrom: string;
  currentCompany: string;
  currentTitle: string;
  linkedinUrl: string;
  phone: string;
  portfolioUrl: string;
  resumeUrl: string;
  skills: string;
  user: User;
  userId: string;
  yearsExperience: string;
}

type State = {
  user: User | null;
  profile: Profile | null;
  token: string | null;
};


type Action = {
  setUser: (user: User, token: string) => void;
  setProfile: (profileData: any) => void;
  clearAuth: () => void;
  updateAvatar: (url: string) => void;
};

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      profile: null,

      setUser: (user, token) =>
        set(() => ({
          user: { ...user, hasProfile: user.hasProfile ?? false },
          token,
        })),

      setProfile: (profileData) =>
        set((state) => ({
          profile: profileData,
          user: state.user 
            ? { ...state.user, avatarUrl: profileData.avatarUrl,
              phone: profileData.phone } 
            : null,
        })),

      clearAuth: () => set(() => ({ user: null, token: null, profile: null })),

      updateAvatar: (url) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null,
          profile: state.profile 
            ? { ...state.profile, user: { ...state.profile.user, avatarUrl: url } } 
            : null,
        })),
    }),
    { name: 'auth-storage' }
  )
);