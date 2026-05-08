import { create } from 'zustand';
import type { AuthUser } from '@/types';

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  _hydrate: () => void;
}

// Mock users for demo
interface MockUser extends AuthUser {
  password: string;
}

let mockUsers: MockUser[] = [
  { id: "u1", name: "Admin", email: "admin@musicapp.com", password: "123456", avatar: "" },
];

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  _hydrate: () => {
    // Restore user session from localStorage without async call
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('musicapp_user');
        if (stored) {
          const data = JSON.parse(stored);
          const { password, ...user } = data;
          set({ user, isAuthenticated: true });
        }
      } catch {}
    }
  },

  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...user } = found;
      set({ user, isAuthenticated: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem('musicapp_user', JSON.stringify(found));
      }
      return true;
    }
    return false;
  },

  register: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }
    const newUser: MockUser = {
      id: "u" + Date.now(),
      name,
      email,
      password,
      avatar: "",
    };
    mockUsers.push(newUser);
    const { password: _, ...user } = newUser;
    set({ user, isAuthenticated: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('musicapp_user', JSON.stringify(newUser));
    }
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('musicapp_user');
    }
  },
}));

// Hydrate on load
if (typeof window !== 'undefined') {
  useAuthStore.getState()._hydrate();
}
