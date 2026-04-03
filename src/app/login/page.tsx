"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError("Tous les champs sont requis."); return; }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600)); // Simulate auth delay
    const ok = login(username, password);
    setLoading(false);
    if (ok) {
      router.push("/dashboard/statistiques");
    } else {
      setError("Identifiants incorrects. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(#21262d 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.4 }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-green-500 to-brand-green-700 shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-4">
            <Car size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Kharrazi</h1>
          <p className="text-brand-green-400 font-semibold text-sm mt-1">Car You — Administration</p>
          <p className="text-slate-600 text-xs mt-1">Accès réservé au personnel autorisé</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-[#21262d] bg-[#161b22] p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-1">Connexion</h2>
          <p className="text-slate-500 text-sm mb-6">Entrez vos identifiants pour accéder au tableau de bord.</p>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Nom d'utilisateur</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-9 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-green-500/60 focus:ring-1 focus:ring-brand-green-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 block">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-green-500/60 focus:ring-1 focus:ring-brand-green-500/20 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-brand-green-600 hover:bg-brand-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.35)]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Lock size={15} />
              )}
              {loading ? "Vérification..." : "Accéder au tableau de bord"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#21262d]">
            <p className="text-[11px] text-slate-600 text-center">
              🔐 Accès sécurisé — Kharrazi Car You · Plateforme interne v1.0
            </p>
          </div>
        </div>

        {/* Hint for demo */}
        <div className="mt-4 p-3 rounded-lg border border-[#21262d] bg-[#0d1117]/80 text-center">
          <p className="text-xs text-slate-600">Compte démo: <span className="text-slate-400 font-mono">admin</span> / <span className="text-slate-400 font-mono">kharrazi2025</span></p>
        </div>
      </div>
    </div>
  );
}
