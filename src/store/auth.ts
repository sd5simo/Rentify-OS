import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  credentials: Record<string, string>; // Ajouté : Stocke les mots de passe actuels
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updatePassword: (user: string, newPass: string) => void; // Ajouté : Fonction pour changer
}

// Les identifiants par défaut (si jamais le système est réinitialisé)
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
        const cleanUser = username.trim().toLowerCase();
        const cleanPass = password.trim();
        const currentCreds = get().credentials;

        // On vérifie avec les identifiants en mémoire
        if (currentCreds[cleanUser] === cleanPass) {
          set({ isAuthenticated: true, username: cleanUser });
          return true;
        }
        return false;
      },
      
      logout: () => set({ isAuthenticated: false, username: null }),
      
      // La nouvelle fonction pour changer le mot de passe
      updatePassword: (user, newPass) => set((state) => ({
        credentials: { ...state.credentials, [user]: newPass }
      })),
    }),
    { name: "kharrazi-auth" } // Sauvegarde dans le LocalStorage
  )
);