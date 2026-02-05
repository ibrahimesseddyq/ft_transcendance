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

interface AuthState {
  user: User | null;
  profile: any | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  setHasProfile: (status: boolean) => void;
  setProfile: (profile: any) => void;
  clearAuth: () => void;
  updateAvatar: (url: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user, token) => set((state) => ({ 
        user: { ...user, hasProfile: state.hasProfile },
        token 
      })),

      setHasProfile: (status) => 
        set((state) => ({
          user: state.user ? { ...state.user, hasProfile: status } : null
        })),

      setProfile: (status) =>
        set((state) =>({
          user: state.user ? {...state.user, profile: status} : null
        })),

      clearAuth: () => set({ user: null, token: null }),
      updateAvatar: (url) => 
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null
        })),
    }),
    { name: 'auth-storage' }
  )
);