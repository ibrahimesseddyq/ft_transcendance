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
  isVerified: boolean;
  hasProfile: boolean;
}

type State = {
  user: User | null;
  profile: any | null;
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
      // Initial State
      user: null,
      token: null,
      profile: null,

      // Actions
      setUser: (user, token) =>
        set(() => ({
          user: { ...user, hasProfile: user.hasProfile ?? false },
          token,
        })),

      setProfile: (profileData) =>
        set((state) => ({
          profile: profileData,
          user: state.user
            ? {
                ...state.user,
                hasProfile: true,
                avatarUrl: profileData?.avatarUrl || profileData?.avatar || state.user.avatarUrl,
              }
            : null,
        })),

      clearAuth: () => set(() => ({ user: null, token: null, profile: null })),

      updateAvatar: (url) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null,
        })),
    }),
    { name: 'auth-storage' }
  )
);