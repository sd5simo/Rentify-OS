"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // On bloque la vérification au tout début
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // SOLUTION : On attend 500ms pour laisser le temps au navigateur 
    // de charger complètement la mémoire locale (Zustand persist)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // On n'expulse l'utilisateur QUE si le chargement est fini ET qu'il n'est pas connecté
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, isLoading]);

  // Affiche le spinner vert pendant qu'on patiente
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-green-500/30 border-t-brand-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Si tout est bon, on affiche le Dashboard
  return <>{children}</>;
}