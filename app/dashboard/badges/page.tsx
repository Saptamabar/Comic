"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Award, CheckCircle, Lock } from "lucide-react";

const badges = [
  { id: "b1", name: "Proklamator Muda", description: "Selesaikan Misi Proklamasi & Revolusi 1945", icon: "⚡", color: "bg-pop-yellow", unlocked: true },
  { id: "b2", name: "Pejuang Tangguh", description: "Selesaikan 3 misi tanpa salah keputusan", icon: "🛡️", color: "bg-pop-red", unlocked: false },
  { id: "b3", name: "Diplomat Agung", description: "Selesaikan misi Konferensi Asia Afrika", icon: "🌏", color: "bg-pop-blue", unlocked: false },
  { id: "b4", name: "Penjelajah Jadwal", description: "Buka 6 misi dari 3 era berbeda", icon: "🗺️", color: "bg-green-500", unlocked: false },
  { id: "b5", name: "Quiz Master", description: "Raih skor sempurna di Quest Mode", icon: "🏆", color: "bg-purple-500", unlocked: false },
  { id: "b6", name: "Pejuang Pertama", description: "Selesaikan misi pertamamu", icon: "🌟", color: "bg-orange-400", unlocked: false },
];

const borders = [
  { id: "br1", name: "Golden Hero", color: "border-yellow-400", unlocked: true },
  { id: "br2", name: "Patriot Red", color: "border-red-500", unlocked: false },
  { id: "br3", name: "Republic Blue", color: "border-blue-500", unlocked: false },
  { id: "br4", name: "Nusantara Green", color: "border-green-500", unlocked: false },
];

export default function BadgeGalleryPage() {
  const [activeBadge, setActiveBadge] = useState<typeof badges[0] | null>(null);
  const [activeBorder, setActiveBorder] = useState("br1");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bangers text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">🏅 BADGE GALLERY</h1>
        <p className="font-comic font-bold text-gray-500 mt-2">Koleksi pencapaian dan kustomisasi identitas digitalmu!</p>
      </div>

      {/* Profile Preview */}
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000] flex flex-col md:flex-row items-center gap-6">
        <div className={`w-28 h-28 rounded-full border-8 ${borders.find(b => b.id === activeBorder)?.color ?? "border-gray-300"} bg-gray-100 flex items-center justify-center text-5xl shadow-[4px_4px_0_#000]`}>
          👤
        </div>
        <div>
          <h2 className="font-bangers text-3xl text-black">Profil Kartu Pemain</h2>
          <p className="font-comic text-sm text-gray-500 font-bold">Selesaikan misi untuk buka border dan badge eksklusif!</p>
        </div>
      </div>

      {/* Profile Borders */}
      <div>
        <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Profile Borders</h2>
        <p className="font-comic text-sm text-gray-500 font-bold mb-4">Klik border untuk pratinjau pemasangan.</p>
        <div className="flex flex-wrap gap-4">
          {borders.map((border) => (
            <button
              key={border.id}
              onClick={() => setActiveBorder(border.id)}
              className={`flex flex-col items-center gap-2 p-4 border-4 transition-all ${
                activeBorder === border.id ? "bg-pop-yellow border-black shadow-[4px_4px_0_#000] -translate-y-1" : "bg-white border-gray-300 hover:border-black"
              }`}
            >
              <div className={`w-14 h-14 rounded-full border-8 ${border.color} bg-gray-100`} />
              <span className="font-comic font-bold text-sm text-black">{border.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      <div>
        <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Koleksi Badge</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <motion.button
              key={badge.id}
              whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
              onClick={() => badge.unlocked && setActiveBadge(badge)}
              className={`flex flex-col items-center gap-3 p-5 border-4 border-black text-center transition-all shadow-[4px_4px_0_#000] relative overflow-hidden
                ${badge.unlocked ? `${badge.color} cursor-pointer hover:shadow-[6px_6px_0_#000]` : "bg-gray-200 cursor-default"}`}
            >
              {!badge.unlocked && (
                <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                  <Lock size={32} className="text-white" />
                </div>
              )}
              <span className="text-5xl">{badge.icon}</span>
              <p className={`font-bangers text-xl leading-tight ${badge.unlocked ? "text-black" : "text-gray-400"}`}>{badge.name}</p>
              {badge.unlocked && (
                <CheckCircle size={20} className="text-black" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {activeBadge && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setActiveBadge(null)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-4 border-black p-8 shadow-[12px_12px_0_#000] z-50 w-80 text-center"
            >
              <div className={`w-20 h-20 ${activeBadge.color} border-4 border-black rounded-full flex items-center justify-center text-5xl mx-auto mb-4`}>
                {activeBadge.icon}
              </div>
              <h3 className="font-bangers text-3xl mb-2">{activeBadge.name}</h3>
              <p className="font-comic text-sm text-gray-600 font-bold mb-4">{activeBadge.description}</p>
              <button className="flex items-center gap-2 bg-black text-white font-bangers text-xl uppercase px-6 py-3 border-4 border-black mx-auto hover:bg-pop-yellow hover:text-black transition-all">
                <Download size={20} /> Download Badge
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
