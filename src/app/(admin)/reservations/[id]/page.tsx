"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, Car, Banknote, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

const STATUS_CFG: Record<string, { l: string; c: string }> = {
  CONFIRMED: { l: "Confirmée", c: "text-brand-green-400 bg-brand-green-500/10 border-brand-green-500/20" },
  PENDING:   { l: "En attente", c: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
  CANCELLED: { l: "Annulée", c: "text-red-400 bg-red-500/10 border-red-500/20" },
  CONVERTED: { l: "Convertie", c: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
};

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { reservations, clients, vehicles, confirmReservation, cancelReservation } = useStore();
  const r = reservations.find((x) => x.id === id);
  const client = clients.find((c) => c.id === r?.clientId);
  const vehicle = vehicles.find((v) => v.id === r?.vehicleId);

  if (!r) return <div className="text-center py-20 text-slate-500"><p>Réservation introuvable</p><button onClick={() => router.back()} className="mt-3 text-brand-green-400 text-sm hover:underline">← Retour</button></div>;

  const cfg = STATUS_CFG[r.status];
  const days = Math.ceil((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86400000);

  return (
    <div className="space-y-5 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-300 hover:bg-[#161b22] transition-colors"><ArrowLeft size={16} /></button>
        <div className="flex-1">
          <div className="flex items-center gap-3"><h1 className="text-2xl font-bold text-white font-mono">{r.refCode}</h1><span className={cn("inline-flex text-xs font-bold px-2.5 py-1 rounded-full border", cfg.c)}>{cfg.l}</span></div>
          <p className="text-slate-500 text-sm">Créée le {new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
        <div className="flex gap-2">
          {r.status === "PENDING" && <>
            <button onClick={() => confirmReservation(id)} className="px-3 py-2 rounded-lg bg-brand-green-600 hover:bg-brand-green-500 text-white text-xs font-semibold">Confirmer</button>
            <button onClick={() => cancelReservation(id)} className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/20">Annuler</button>
          </>}
          {r.status === "CONFIRMED" && (
            <Link href="/locations/nouveau">
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-green-600 hover:bg-brand-green-500 text-white text-sm font-semibold rounded-lg"><ArrowRight size={14} /> Convertir en location</button>
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#21262d] bg-[#161b22] p-5 space-y-3">
        <p className="text-sm font-bold text-slate-200 border-b border-[#21262d] pb-2">Détails</p>
        {[
          ["Date de début", new Date(r.startDate).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })],
          ["Date de fin", new Date(r.endDate).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })],
          ["Durée", `${days} jour${days > 1 ? "s" : ""}`],
          ["Montant estimé", `${r.totalAmount.toLocaleString("fr-FR")} MAD`],
        ].map(([l, v]) => (
          <div key={l} className="flex justify-between py-2 border-b border-[#21262d] last:border-0">
            <span className="text-xs text-slate-500 uppercase font-semibold">{l}</span>
            <span className="text-sm font-semibold text-slate-200">{v}</span>
          </div>
        ))}
        {r.notes && <p className="text-xs text-slate-500 italic pt-1">{r.notes}</p>}
      </div>

      {client && (
        <button onClick={() => router.push(`/clients/${client.id}`)}
          className="w-full text-left rounded-xl border border-[#21262d] bg-[#161b22] p-4 hover:border-brand-green-500/30 hover:bg-[#1c2130] transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green-600 to-brand-green-800 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">{client.firstName[0]}{client.lastName[0]}</div>
            <div className="flex-1"><p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Client</p><p className="text-sm font-bold text-slate-200">{client.firstName} {client.lastName}</p><p className="text-xs text-slate-500">{client.phone} · {client.city}</p></div>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 group-hover:text-brand-green-400"><polyline points="9 18 15 12 9 6" /></svg>
          </div>
        </button>
      )}

      {vehicle && (
        <button onClick={() => router.push(`/vehicules/${vehicle.id}`)}
          className="w-full text-left rounded-xl border border-[#21262d] bg-[#161b22] p-4 hover:border-brand-green-500/30 hover:bg-[#1c2130] transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1c2130] border border-[#21262d] flex items-center justify-center flex-shrink-0"><Car size={18} className="text-slate-500" /></div>
            <div className="flex-1"><p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Véhicule</p><p className="text-sm font-bold text-slate-200">{vehicle.brand} {vehicle.model} {vehicle.year}</p><p className="text-xs text-slate-500 font-mono">{vehicle.plate} · {vehicle.dailyRate} MAD/j</p></div>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600 group-hover:text-brand-green-400"><polyline points="9 18 15 12 9 6" /></svg>
          </div>
        </button>
      )}
    </div>
  );
}
