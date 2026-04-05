import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  credentials: Record<string, string>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePassword: (user: string, newPass: string) => void;
}

const DEFAULT_CREDENTIALS: Record<string, string> = {
  admin: "kharrazi2026v1",
  manager: "carayou123",
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      username: null,
      credentials: DEFAULT_CREDENTIALS,
      
      login: (username, password) => {
        if (!username || !password) return false;
        
        const cleanUser = username.trim().toLowerCase();
        const cleanPass = password.trim();
        
        // SÉCURITÉ : Si la mémoire cache est corrompue, on utilise les mots de passe par défaut
        const currentCreds = get().credentials || DEFAULT_CREDENTIALS;

        if (currentCreds[cleanUser] === cleanPass) {
          set({ 
            isAuthenticated: true, 
            username: cleanUser,
            credentials: currentCreds // Réécrit la mémoire pour la réparer si besoin
          });
          return true;
        }
        return false;
      },
      
      logout: () => set({ isAuthenticated: false, username: null }),
      
      updatePassword: (user, newPass) => set((state) => ({
        credentials: { ...(state.credentials || DEFAULT_CREDENTIALS), [user]: newPass }
      })),
    }),
    { 
      name: "kharrazi-auth",
      version: 2, // 🔴 C'EST LA MAGIE ICI : Ça va forcer tous les navigateurs à vider l'ancien cache cassé
    }
  )
);