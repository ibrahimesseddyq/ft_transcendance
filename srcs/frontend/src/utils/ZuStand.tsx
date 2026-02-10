import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'candidate' | 'recruiter' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  numberPhone?: string | null;
  avatarUrl?: string | null;
  isVerified: boolean;
  hasProfile: boolean;
}

interface Profile {
  userId: string
  availableFrom: string | null
  currentCompany: string | null
  currentTitle: string
  linkedinUrl: string
  numberPhone: string
  portfolioUrl: string | null
  resumeUrl: string
  skills: string | null
  yearsExperience: string
  user: User;
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

      setProfile: (profileData) => set({ profile: profileData }),

      clearAuth: () => set(() => ({ user: null, token: null, profile: null })),

      updateAvatar: (url) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null,
        })),
    }),
    { name: 'auth-storage' }
  )
);