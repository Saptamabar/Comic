"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Lock, CheckCircle, Clock, Play, Star } from "lucide-react";
import Link from "next/link";

const eras = [
  { id: "1945", label: "Era Kemerdekaan", years: "1945 – 1959", color: "bg-pop-red" },
  { id: "orde", label: "Orde Lama & Baru", years: "1959 – 1998", color: "bg-pop-blue" },
  { id: "modern", label: "Reformasi & Modern", years: "1998 – Sekarang", color: "bg-green-500" },
];

const missions: Record<string, {
  id: string; title: string; subtitle: string; duration: string;
  unlocked: boolean; completed: boolean; era: string;
}[]> = {
  "1945": [
    { id: "proklamasi", title: "Proklamasi & Revolusi 1945", subtitle: "Diculik untuk Merdeka", duration: "15 mnt", unlocked: true, completed: false, era: "1945" },
    { id: "pertahanan", title: "Pertahanan Kedaulatan", subtitle: "Garis Depan Tanpa Takut", duration: "20 mnt", unlocked: false, completed: false, era: "1945" },
  ],
  "orde": [
    { id: "kaa", title: "Konferensi Asia-Afrika", subtitle: "Panggung Dunia di Asia Afrika", duration: "15 mnt", unlocked: false, completed: false, era: "orde" },
    { id: "g30s", title: "G30S & Pergolakan Politik", subtitle: "Malam yang Mengubah Segalanya", duration: "25 mnt", unlocked: false, completed: false, era: "orde" },
  ],
  "modern": [
    { id: "reformasi", title: "Reformasi 1998", subtitle: "Mei yang Mengubah Segalanya", duration: "20 mnt", unlocked: false, completed: false, era: "modern" },
    { id: "demokrasi", title: "Era Demokrasi Digital", subtitle: "Suara Rakyat di Era Baru", duration: "15 mnt", unlocked: false, completed: false, era: "modern" },
  ],
};

const progressItems = [
  { era: "Era Kemerdekaan", done: 0, total: 2 },
  { era: "Orde Lama & Baru", done: 0, total: 2 },
  { era: "Reformasi & Modern", done: 0, total: 2 },
];

export default function StoryModePage() {
  const [selectedEra, setSelectedEra] = useState("1945");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-bangers text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
          📖 STORY MODE
        </h1>
        <p className="font-comic font-bold text-gray-500 mt-2">
          Pilih misi dan jadilah bagian dari sejarah Indonesia!
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000]">
        <h2 className="font-bangers text-2xl mb-4 border-b-4 border-black inline-block">Progres Keseluruhan</h2>
        <div className="space-y-3">
          {progressItems.map((p) => (
            <div key={p.era}>
              <div className="flex justify-between mb-1">
                <span className="font-comic font-bold text-sm text-black">{p.era}</span>
                <span className="font-comic font-bold text-sm text-gray-500">{p.done}/{p.total} Misi</span>
              </div>
              <div className="h-4 bg-gray-200 border-2 border-black">
                <div
                  className="h-full bg-pop-yellow border-r-2 border-black transition-all"
                  style={{ width: `${p.total > 0 ? (p.done / p.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Era Tabs */}
      <div>
        <h2 className="font-bangers text-2xl mb-3">Pilih Era Sejarah</h2>
        <div className="flex flex-wrap gap-3">
          {eras.map((era) => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`font-bangers text-xl px-6 py-2 border-4 border-black transition-all
                ${selectedEra === era.id ? `${era.color} text-white shadow-[4px_4px_0_#000] -translate-y-1` : "bg-white text-black hover:bg-gray-100"}`}
            >
              {era.label}
              <span className="block font-comic text-xs font-bold mt-0.5 opacity-80">{era.years}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(missions[selectedEra] ?? []).map((mission, i) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`border-4 border-black bg-white shadow-[6px_6px_0_#000] overflow-hidden ${!mission.unlocked ? "opacity-70" : ""}`}
          >
            <div className={`${eras.find(e => e.id === mission.era)?.color ?? "bg-gray-500"} p-4 border-b-4 border-black flex justify-between items-start`}>
              <div>
                <p className="font-comic text-xs font-bold text-white/80 uppercase">Misi</p>
                <h3 className="font-bangers text-2xl text-white leading-tight">{mission.title}</h3>
                <p className="font-comic text-sm font-bold text-white/90 italic">{mission.subtitle}</p>
              </div>
              {mission.completed && <CheckCircle className="text-white" size={28} />}
              {!mission.unlocked && <Lock className="text-white" size={28} />}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-gray-500 font-comic text-sm mb-4">
                <Clock size={16} />
                <span>Estimasi: {mission.duration}</span>
              </div>
              {mission.unlocked ? (
                <Link
                  href={`/dashboard/story/${mission.id}`}
                  className="flex items-center justify-center gap-2 bg-black text-white font-bangers text-xl uppercase py-3 px-6 border-4 border-black hover:bg-pop-yellow hover:text-black transition-all shadow-[4px_4px_0_rgba(0,0,0,0.2)]"
                >
                  <Play size={20} fill="currentColor" /> MULAI MISI
                </Link>
              ) : (
                <div className="flex items-center justify-center gap-2 bg-gray-200 text-gray-500 font-bangers text-xl uppercase py-3 px-6 border-4 border-gray-300 cursor-not-allowed">
                  <Lock size={20} /> TERKUNCI
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline Teaser */}
      <div className="bg-black text-white border-4 border-black p-6 shadow-[6px_6px_0_#facc15]">
        <h2 className="font-bangers text-3xl text-pop-yellow mb-2">🕒 Garis Waktu Kronoligis</h2>
        <p className="font-comic text-gray-300 text-sm">Selesaikan misi untuk membuka peta garis waktu sejarah Indonesia secara lengkap!</p>
        <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
          {["1945", "1949", "1955", "1965", "1998", "2002", "Sekarang"].map((year, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-pop-yellow text-black font-bangers text-sm px-3 py-1 border-2 border-yellow-300">{year}</div>
              {i < 6 && <div className="w-8 h-1 bg-gray-600" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
