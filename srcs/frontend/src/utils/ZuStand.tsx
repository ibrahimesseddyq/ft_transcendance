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
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  clearAuth: () => void;
  updateAvatar: (url: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      setVerified: () => 
        set((state) => ({
          user: state.user 
            ? { ...state.user, isVerified: true } 
            : null
        })),
      clearAuth: () => set({ user: null, token: null }),
      updateAvatar: (url) => 
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null
        })),
    }),
    {
      name: 'rh-connect-auth',
    }
  )
);