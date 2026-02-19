import { userInfo } from 'os';
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

interface Profile {
  userId: string;
  availableFrom: string;
  currentCompany: string;
  currentTitle: string;
  linkedinUrl: string;
  numberPhone: string;
  portfolioUrl: string;
  resumeUrl: string;
  skills: string;
  yearsExperience: string;
  user: User;
}

type State = {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  qrVerified: boolean;
  userId: string | null;
  firstLogin: boolean;
};


type Action = {
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setProfile: (profileData: any) => void;
  clearAuth: () => void;
  updateAvatar: (url: string) => void;
  setUserId: (id: string) => void;
  setQrVerified: (qrVerified:boolean) => void;
  setFirstLogin: (firstLogin:boolean) => void;
};

export const useAuthStore = create<State & Action>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      profile: null,
      userId: null,
      qrVerified: false,
      firstLogin: false,

      setFirstLogin: (status) =>
        set(()=>({
          firstLogin: status,
        })),

      setQrVerified: (status) =>
        set(() => ({
          qrVerified: status,
      })),
      setToken: (status) =>
        set(() => ({
          token: status,
      })),

      setUserId: (status) =>
        set(() => ({
          userId: status,
      })),
      setUser: (user) =>
        set(() => ({
          user: { ...user, hasProfile: user.hasProfile ?? false },
        })),

      setProfile: (profileData) =>
        set((state) => ({
          profile: profileData,
          user: state.user 
            ? { ...state.user, avatarUrl: profileData.avatarUrl,
              phone: profileData.phone } 
            : null,
        })),

      clearAuth: () => set({ 
        user: null, 
        token: null, 
        profile: null, 
        userId: null, 
        qrVerified: false,
        firstLogin: false
      }),

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