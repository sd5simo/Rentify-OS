"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";

export default function NouveauClientPage() {
  const router = useRouter();
  const { addClient } = useStore();
  const [form, setForm] = useState({ cin: "", firstName: "", lastName: "", phone: "", email: "", address: "", city: "", licenseNum: "", licenseExp: "", notes: "" });
  const [saved, setSaved] = useState(false);
  const F = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  const valid = form.cin && form.firstName && form.lastName && form.phone;

  const submit = () => {
    if (!valid) return;
    addClient({ ...form, email: form.email || null, address: form.address || null, city: form.city || null, licenseNum: form.licenseNum || null, licenseExp: form.licenseExp || null, notes: form.notes || null, isBlacklist: false, blacklistReason: null, blacklistedAt: null });
    setSaved(true);
    setTimeout(() => router.push("/clients/liste"), 1500);
  };

  const Input = ({ label, field, type = "text", placeholder = "", required = false }: { label: string; field: keyof typeof form; type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <input type={type} value={form[field]} onChange={F(field)} placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-green-500/50 transition-all" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-300 hover:bg-[#161b22] transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div><h1 className="text-2xl font-bold text-white">Nouveau Client</h1><p className="text-slate-500 text-sm">Enregistrer un nouveau client</p></div>
      </div>

      {saved && <div className="rounded-lg border border-brand-green-500/30 bg-brand-green-500/10 p-3 text-sm text-brand-green-400 flex items-center gap-2"><CheckCircle size={14} />Client créé! Redirection...</div>}

      <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6 space-y-4">
        <p className="text-sm font-bold text-slate-200 border-b border-[#21262d] pb-3">Identité</p>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Prénom" field="firstName" placeholder="Youssef" required />
          <Input label="Nom" field="lastName" placeholder="Benali" required />
          <Input label="CIN" field="cin" placeholder="AB123456" required />
          <Input label="Téléphone" field="phone" placeholder="0661234567" required />
          <Input label="Email" field="email" type="email" placeholder="email@example.ma" />
          <Input label="Ville" field="city" placeholder="Casablanca" />
        </div>
        <Input label="Adresse" field="address" placeholder="12 Rue Hassan II, Casablanca" />
      </div>

      <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6 space-y-4">
        <p className="text-sm font-bold text-slate-200 border-b border-[#21262d] pb-3">Permis de conduire</p>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Numéro" field="licenseNum" placeholder="MA-12345" />
          <Input label="Expiration" field="licenseExp" type="date" />
        </div>
      </div>

      <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-6">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 block">Notes internes</label>
        <textarea value={form.notes} onChange={F("notes")} placeholder="Observations, préférences..." rows={3}
          className="w-full px-3 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-green-500/50 resize-none" />
      </div>

      <button onClick={submit} disabled={!valid} className="w-full flex items-center justify-center gap-2 py-3 bg-brand-green-600 hover:bg-brand-green-500 disabled:opacity-40 text-white font-semibold rounded-lg transition-colors">
        <Save size={15} /> Enregistrer le client
      </button>
    </div>
  );
}
