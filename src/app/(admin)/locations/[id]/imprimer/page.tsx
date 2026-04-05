import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function PrintContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const rental = await prisma.rental.findUnique({
    where: { id: id },
    include: {
      client: true,
      vehicle: true,
    }
  })

  if (!rental) notFound()

  // Fonction pour séparer la date et l'heure comme dans le PDF ("Début: 12/05/2024 à 14:30")
  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('fr-FR'),
      time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const start = formatDateTime(rental.startDate);
  const end = formatDateTime(rental.endDate);

  // Style forcé pour que les fonds gris s'impriment sur papier
  const printBgStyle = { 
    backgroundColor: '#e5e7eb', 
    WebkitPrintColorAdjust: "exact" as const, 
    printColorAdjust: "exact" as const 
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:py-0 print:bg-white text-black font-sans text-[11px]">
      
      {/* Bouton d'impression (Utilise une astuce JS pour ne pas avoir besoin de 'use client') */}
      <div className="print:hidden max-w-[210mm] mx-auto mb-4 flex justify-between items-center bg-white p-4 rounded shadow">
        <h1 className="text-xl font-bold text-gray-800">Aperçu du contrat</h1>
        <a 
          href="javascript:window.print()" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow transition cursor-pointer"
        >
          🖨️ Imprimer le Contrat
        </a>
      </div>

      {/* CONTENEUR FORMAT A4 EXACT */}
      <div className="bg-white w-[210mm] min-h-[297mm] mx-auto p-[10mm] shadow-lg print:shadow-none print:w-full print:h-full print:p-0">
        
        {/* EN-TÊTE : Logos et Titre exact */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-[120px] h-[60px] border border-gray-400 flex items-center justify-center text-gray-400">
            [Image 1]
          </div>
          <div className="text-center">
            <h1 className="text-[18px] font-extrabold uppercase mb-1">
              CONTRAT DE LOCATION, N°. {rental.contractNum}
            </h1>
          </div>
          <div className="w-[120px] h-[60px] border border-gray-400 flex items-center justify-center text-gray-400">
             [Image 2]
          </div>
        </div>

        {/* LIGNE 1 : LOCATAIRE | VEHICULE | LOCATION */}
        <div className="flex border border-black mb-6 w-full leading-snug">
          
          {/* LOCATAIRE */}
          <div className="w-1/3 border-r border-black flex flex-col">
            <div className="text-center font-bold border-b border-black py-1 uppercase" style={printBgStyle}>
              LOCATAIRE
            </div>
            <div className="p-2 space-y-3 flex-grow">
              <p><span className="font-bold">Locataire:</span> {rental.client.lastName} {rental.client.firstName}</p>
              <p><span className="font-bold">Date de naissance:</span> ___________________</p>
              <p><span className="font-bold">CIN / Passeport:</span> {rental.client.cin}</p>
            </div>
          </div>

          {/* VEHICULE */}
          <div className="w-1/3 border-r border-black flex flex-col">
            <div className="text-center font-bold border-b border-black py-1 uppercase" style={printBgStyle}>
              VEHICULE
            </div>
            <div className="p-2 space-y-3 flex-grow">
              <p><span className="font-bold">Marque/Modèle:</span> {rental.vehicle.brand} {rental.vehicle.model}</p>
              <p><span className="font-bold">Immatriculation:</span> {rental.vehicle.plate}</p>
              <p><span className="font-bold">Options:</span> ___________________</p>
            </div>
          </div>

          {/* LOCATION */}
          <div className="w-1/3 flex flex-col">
            <div className="text-center font-bold border-b border-black py-1 uppercase" style={printBgStyle}>
              LOCATION
            </div>
            <div className="p-2 space-y-3 flex-grow">
              <p><span className="font-bold">Début:</span> {start.date} <span className="font-bold">à</span> {start.time}</p>
              <p><span className="font-bold">Fin:</span> {end.date} <span className="font-bold">à</span> {end.time}</p>
              <p><span className="font-bold">Durée:</span> {rental.totalDays} Jours</p>
              <p><span className="font-bold">Prix total:</span> <span className="font-bold text-[13px]">{rental.totalAmount} MAD</span></p>
              <p><span className="font-bold">Montant de la caution:</span> {rental.deposit} MAD</p>
            </div>
          </div>

        </div>

        {/* LIGNE 2 : TABLEAU DES CONDUCTEURS */}
        <div className="border border-black mb-6">
          <div className="text-center font-bold border-b border-black py-1 uppercase tracking-widest" style={printBgStyle}>
            CONDUCTEURS
          </div>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b border-black font-bold text-[10px]">
                <td className="py-1 border-r border-black">Nom</td>
                <td className="py-1 border-r border-black">Prénom</td>
                <td className="py-1 border-r border-black">Date de naissance</td>
                <td className="py-1 border-r border-black">N° de permis</td>
                <td className="py-1">Date d&apos;obtention</td>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[11px]">
                <td className="py-2 border-r border-black uppercase">{rental.client.lastName}</td>
                <td className="py-2 border-r border-black capitalize">{rental.client.firstName}</td>
                <td className="py-2 border-r border-black text-gray-300">_________________</td>
                <td className="py-2 border-r border-black uppercase">{rental.client.licenseNum || "_________________"}</td>
                <td className="py-2 text-gray-300">_________________</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LIGNE 3 : DEPART / RETOUR */}
        <div className="flex border border-black mb-4 w-full">
          
          {/* DEPART */}
          <div className="w-1/2 border-r border-black flex flex-col">
            <div className="text-center font-bold border-b border-black py-1 uppercase tracking-widest" style={printBgStyle}>
              DEPART
            </div>
            <div className="p-3 flex flex-col h-[200px]">
              <div className="flex justify-between mb-2">
                <p><span className="font-bold">Kms compteur:</span> {rental.mileageStart}</p>
                <p><span className="font-bold">Carburant:</span> {rental.fuelLevelStart}</p>
              </div>
              
              <div className="flex-grow border border-gray-300 mb-3 flex items-center justify-center text-gray-300 text-[10px]">
                [Espace pour croquis voiture]
              </div>

              <p className="mb-4"><span className="font-bold">Commentaire:</span> _______________________________</p>
              
              <div className="flex justify-between font-bold px-2">
                <p>Le Client</p>
                <p>Le loueur</p>
              </div>
            </div>
          </div>

          {/* RETOUR */}
          <div className="w-1/2 flex flex-col">
            <div className="text-center font-bold border-b border-black py-1 uppercase tracking-widest" style={printBgStyle}>
              RETOUR
            </div>
            <div className="p-3 flex flex-col h-[200px]">
              <div className="flex justify-between mb-2">
                <p><span className="font-bold">Kms compteur:</span> ____________</p>
                <p><span className="font-bold">Carburant:</span> ____________</p>
              </div>
              
              <div className="flex-grow border border-gray-300 mb-3 flex items-center justify-center text-gray-300 text-[10px]">
                [Espace pour croquis voiture]
              </div>

              <p className="mb-4"><span className="font-bold">Commentaire:</span> _______________________________</p>
              
              <div className="flex justify-between font-bold px-2">
                <p>Le Client</p>
                <p>Le loueur</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
