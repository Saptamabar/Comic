"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Heart, Loader2 } from "lucide-react";
import { useUiSound } from "@/hooks/useUiSound";

interface Hero {
  id: string;
  name: string;
  role: string;
  era: string;
  icon: string;
  color: string;
  bio: string;
  contribution: string;
  moralValues: string[];
  minPoints: number;
}

interface HeroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HeroModal({ isOpen, onClose }: HeroModalProps) {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Hero | null>(null);
  const [tab, setTab] = useState<"bio" | "contribution" | "values">("bio");
  const { playClick, playHover } = useUiSound();

  useEffect(() => {
    if (!isOpen) return;
    const fetchHeroes = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/heroes");
        if (res.ok) {
          const data = await res.json();
          setHeroes(data);
        }
      } catch (err) {
        console.error("Failed to fetch heroes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroes();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={() => { playClick(); onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="bg-neutral-100 w-full max-w-6xl h-[85vh] border-4 border-black shadow-[10px_10px_0_#fff] overflow-hidden flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black shrink-0">
            <h2 className="font-bangers text-3xl md:text-5xl text-pop-yellow tracking-wider drop-shadow-[2px_2px_0_#ff4733] italic">
              🦸 GALERI PAHLAWAN (ARSIP)
            </h2>
            <button
              onClick={() => { playClick(); onClose(); }}
              className="bg-red-600 text-white font-bangers text-xl md:text-2xl px-4 py-1 border-2 border-white hover:scale-105 active:scale-95 transition-transform"
            >
              TUTUP X
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4 md:p-8 bg-[url('/assets/backgrounds/paper_texture.png')] bg-repeat relative">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="animate-spin text-red-600" size={60} />
                <p className="font-bangers text-2xl uppercase text-black">Memuat Arsip Rahasia...</p>
              </div>
            ) : selected ? (
              <div className="flex flex-col md:flex-row gap-6 h-full p-4 md:p-8">
                {/* Back button for mobile mainly, or overlaying detail */}
                <div className="w-full h-full bg-white border-4 border-black shadow-[8px_8px_0_#000] flex flex-col md:flex-row max-w-4xl mx-auto overflow-hidden animate-in fade-in zoom-in duration-300">
                  {/* Left Hero Icon */}
                  <div className={`${selected.color} w-full md:w-1/3 p-6 flex flex-col items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-black relative`}>
                    <button 
                      onClick={() => { playClick(); setSelected(null); }}
                      className="absolute top-4 left-4 bg-white text-black font-bangers border-2 border-black px-2 py-1 shadow-[2px_2px_0_#000] active:translate-y-1"
                    >
                      &larr; KEMBALI
                    </button>
                    <div className="bg-white border-4 border-black p-4 text-8xl shadow-[4px_4px_0_#000] -rotate-2 mt-10 md:mt-0 flex w-32 h-32 md:w-48 md:h-48 items-center justify-center shrink-0">
                      {selected.icon?.startsWith('http') ? (
                        <img src={selected.icon} alt={selected.name} className="w-full h-full object-cover border-2 border-black" />
                      ) : (
                        selected.icon
                      )}
                    </div>
                    <h2 className="font-bangers text-4xl mt-6 text-white text-center drop-shadow-[2px_2px_0_#000] uppercase">
                      {selected.name}
                    </h2>
                    <p className="font-comic font-black text-sm uppercase mt-2 bg-black text-white px-3 py-1 -rotate-1">
                      {selected.role}
                    </p>
                  </div>

                  {/* Right Details */}
                  <div className="w-full md:w-2/3 p-6 flex flex-col bg-yellow-50 overflow-y-auto">
                    <div className="flex gap-2 mb-6">
                      {["bio", "contribution", "values"].map((t) => (
                        <button 
                          key={t} 
                          onClick={() => { playClick(); setTab(t as any); }} 
                          className={`flex-1 py-2 font-bangers text-lg border-[3px] border-black transition-all ${tab === t ? "bg-black text-white shadow-none translate-y-1" : "bg-white shadow-[4px_4px_0_#000] active:translate-y-1"}`}
                        >
                          {t === "bio" ? "KISAH" : t === "contribution" ? "JASA" : "TELADAN"}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1">
                      {tab === "bio" && (
                        <p className="font-comic font-bold text-lg md:text-xl leading-relaxed italic text-gray-800">
                          "{selected.bio}"
                        </p>
                      )}
                      {tab === "contribution" && (
                        <div className="space-y-3">
                          {selected.contribution?.split(",").map((c, idx) => (
                            <div key={idx} className={`flex gap-3 bg-white border-2 border-black p-3 font-comic font-black text-sm md:text-base uppercase shadow-[3px_3px_0_#000] animate-in slide-in-from-bottom-2`} style={{ animationDelay: `${idx * 50}ms` }}>
                              <Star size={20} className="text-yellow-500 fill-yellow-500 shrink-0" /> {c.trim()}
                            </div>
                          ))}
                        </div>
                      )}
                      {tab === "values" && (
                        <div className="space-y-3">
                          {selected.moralValues?.map((v, idx) => (
                            <div key={idx} className={`flex items-center gap-3 bg-red-50 border-2 border-black p-3 font-bangers text-xl md:text-2xl uppercase shadow-[3px_3px_0_#000] animate-in slide-in-from-bottom-2`} style={{ animationDelay: `${idx * 50}ms` }}>
                              <Heart size={20} className="text-red-500 fill-red-500 shrink-0" /> {v}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {heroes.map((hero, i) => (
                  <motion.button
                    key={hero.id}
                    onMouseEnter={() => playHover()}
                    onClick={() => { playClick(); setSelected(hero); }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className={`group relative flex flex-col items-center p-4 border-[4px] border-black transition-all ${hero.color} shadow-[6px_6px_0_#000] active:translate-y-1 active:shadow-none`}
                  >
                    <span className="text-6xl mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform flex w-20 h-20 items-center justify-center">
                      {hero.icon?.startsWith('http') ? (
                        <img src={hero.icon} alt={hero.name} className="w-full h-full object-cover border-2 border-black bg-white" />
                      ) : (
                        hero.icon
                      )}
                    </span>
                    <p className="font-bangers text-xl md:text-2xl leading-tight uppercase text-center text-white drop-shadow-[1px_1px_0_#000]">
                      {hero.name}
                    </p>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
