"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, BookOpen, Heart, Star } from "lucide-react";

const heroes = [
  {
    id: "soekarno",
    name: "Ir. Soekarno",
    role: "Proklamator & Presiden RI Pertama",
    era: "Kemerdekaan",
    icon: "🦁",
    color: "bg-pop-red",
    unlocked: true,
    bio: "Soekarno adalah pemimpin karismatik yang membawa Indonesia ke kemerdekaan pada 17 Agustus 1945. Ia dikenal sebagai orator ulung dan arsitek persatuan bangsa.",
    contribution: "Memproklamasikan kemerdekaan Indonesia, merancang Pancasila, memimpin pembebasan dari penjajahan.",
    moralValues: ["Semangat juang yang pantang padam", "Kecintaan terhadap tanah air", "Kemampuan berdiplomasi dan berpidato"],
    missionRequired: "Proklamasi & Revolusi 1945"
  },
  {
    id: "hatta",
    name: "Mohammad Hatta",
    role: "Proklamator & Wakil Presiden RI Pertama",
    era: "Kemerdekaan",
    icon: "📜",
    color: "bg-pop-blue",
    unlocked: false,
    bio: "Hatta adalah ekonom dan ideolog yang memiliki pikiran jernih dan integritas tinggi. Ia menjadi penyeimbang sempurna bagi Soekarno dalam kepemimpinan bangsa.",
    contribution: "Menenangkan situasi Rengasdengklok, merumuskan teks proklamasi, mengembangkan konsep koperasi Indonesia.",
    moralValues: ["Integritas dan kejujuran yang teguh", "Kesederhanaan dalam hidup", "Dedikasi pada hukum dan keadilan"],
    missionRequired: "Proklamasi & Revolusi 1945"
  },
  {
    id: "sudirman",
    name: "Jend. Sudirman",
    role: "Panglima Besar TNI Pertama",
    era: "Kemerdekaan",
    icon: "⚔️",
    color: "bg-green-600",
    unlocked: false,
    bio: "Jenderal Sudirman adalah simbol keteguhan dan keberanian militer Indonesia. Meskipun menderita penyakit TBC parah, ia memimpin perang gerilya dari tandu.",
    contribution: "Memimpin perang gerilya, mempertahankan kedaulatan dari agresi Belanda, membangun TNI dari dasar.",
    moralValues: ["Keteguhan dalam penderitaan", "Keberanian menghadapi ketidakpastian", "Pengorbanan diri untuk bangsa"],
    missionRequired: "Pertahanan Kedaulatan"
  },
  {
    id: "kartini",
    name: "R.A. Kartini",
    role: "Pahlawan Emansipasi Wanita",
    era: "Pra-Kemerdekaan",
    icon: "🌸",
    color: "bg-pink-500",
    unlocked: false,
    bio: "Kartini adalah pelopor emansipasi wanita Indonesia yang melalui surat-suratnya kepada sahabat Belanda, mendorong kesetaraan hak perempuan dan pendidikan.",
    contribution: "Memperjuangkan hak pendidikan wanita, mendirikan sekolah perempuan, meninggalkan warisan berupa surat-surat inspiratif.",
    moralValues: ["Semangat belajar tanpa mengenal batas", "Keberanian berbicara untuk keadilan", "Empati terhadap sesama"],
    missionRequired: "Coming Soon"
  },
];

export default function HeroesPage() {
  const [selected, setSelected] = useState<typeof heroes[0] | null>(null);
  const [tab, setTab] = useState<"bio" | "contribution" | "values">("bio");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bangers text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">🦸 GALERI PAHLAWAN</h1>
        <p className="font-comic font-bold text-gray-500 mt-2">Temui dan pelajari pahlawan yang kamu jumpai dalam misi!</p>
      </div>

      {/* Hero Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {heroes.map((hero, i) => (
          <motion.button
            key={hero.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            onClick={() => setSelected(hero)}
            className={`flex flex-col items-center gap-3 p-5 border-4 border-black text-center shadow-[4px_4px_0_#000] relative overflow-hidden transition-all hover:shadow-[6px_6px_0_#000]
              ${hero.unlocked ? hero.color : "bg-gray-200"}`}
          >
            {!hero.unlocked && (
              <div className="absolute inset-0 bg-gray-900/50 flex flex-col items-center justify-center gap-2 z-10">
                <Lock size={28} className="text-white" />
                <p className="font-comic text-xs text-white font-bold px-2">Selesaikan:<br/>{hero.missionRequired}</p>
              </div>
            )}
            <span className="text-5xl">{hero.icon}</span>
            <p className={`font-bangers text-xl leading-tight ${hero.unlocked ? "text-white" : "text-gray-400"}`}>{hero.name}</p>
            <span className={`font-comic text-xs font-bold px-2 py-0.5 border-2 ${hero.unlocked ? "bg-black/20 border-white/40 text-white" : "border-gray-400 text-gray-400"}`}>
              {hero.era}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Placeholder for locked state */}
      {heroes.every(h => !h.unlocked) && (
        <div className="bg-black text-white border-4 border-black p-6 shadow-[6px_6px_0_#facc15] text-center">
          <p className="font-bangers text-3xl text-pop-yellow">MULAI MISIMU!</p>
          <p className="font-comic text-sm text-gray-300 mt-2">Selesaikan misi di Story Mode untuk membuka profil pahlawan dan membaca biografi lengkapnya.</p>
        </div>
      )}

      {/* Hero Detail Modal */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-6 z-50 max-h-[80vh] overflow-y-auto md:max-w-2xl md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:border-4 md:shadow-[12px_12px_0_#000]"
            >
              {/* Header */}
              <div className={`${selected.color} border-4 border-black p-4 flex items-center gap-4 mb-4 -mx-6 -mt-6`}>
                <span className="text-6xl">{selected.icon}</span>
                <div>
                  <h3 className="font-bangers text-3xl text-white">{selected.name}</h3>
                  <p className="font-comic text-sm font-bold text-white/80">{selected.role}</p>
                </div>
                <button onClick={() => setSelected(null)} className="ml-auto text-white font-bangers text-2xl border-2 border-white w-10 h-10 flex items-center justify-center hover:bg-black/20">✕</button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {([["bio", "Biografi", BookOpen], ["contribution", "Kontribusi", Star], ["values", "Nilai Sikap", Heart]] as const).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id as any)}
                    className={`flex items-center gap-1 font-bangers text-lg px-4 py-2 border-4 border-black transition-all ${
                      tab === id ? "bg-black text-white shadow-none" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={16} /> {label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-gray-50 border-4 border-black p-4 min-h-[120px] font-comic text-black">
                {tab === "bio" && <p className="font-bold leading-relaxed">{selected.bio}</p>}
                {tab === "contribution" && (
                  <ul className="space-y-2">
                    {selected.contribution.split(", ").map((c, i) => (
                      <li key={i} className="flex gap-2 font-bold"><span className="text-pop-yellow font-bangers text-xl">★</span> {c}</li>
                    ))}
                  </ul>
                )}
                {tab === "values" && (
                  <ul className="space-y-2">
                    {selected.moralValues.map((v, i) => (
                      <li key={i} className="flex gap-2 font-bold"><span className="text-pop-red font-bangers text-xl">♥</span> {v}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
