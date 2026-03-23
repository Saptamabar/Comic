"use client";

import React from "react";
import { ComicButton } from "@/components/ui/ComicButton";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  const heroData = {
    title: "HISTOPLAY",
    subtitle: "MISI PERDANA: JEJAK JUANG",
    description:
      "Takdir bangsa bukan sekadar cerita—ini adalah pilihanmu. Masuklah ke petualangan sejarah interaktif dan ukir masa depan!",
    buttonText: "MULAI PETUALANGAN",
    secondaryButtonText: "BADGE KOLEKSI",
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black"
    >
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover opacity-80"
        style={{ backgroundImage: 'url("/assets/backgrounds/bgsection.png")' }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-[1]" />
      <div className="absolute inset-0 bg-black/20 z-[1]" />
      
      <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/recycled-paper.png')] z-[2]" />
      <div className="absolute inset-0 opacity-10 bg-halftone z-[2] pointer-events-none" />

      <div className="relative z-10 mt-14 container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl">
        
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full md:w-5/12 flex justify-center mt-10 md:mt-0"
        >
          <div className="absolute top-1/2  left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-red-600 rounded-full blur-[120px] opacity-30 animate-pulse" />
          
          <img
            src="/assets/characters/soekarnold.png"
            alt="Tokoh Utama"
            className="h-[40vh] md:h-[70vh] w-auto object-contain filter drop-shadow-[10px_10px_0_rgba(0,0,0,0.8)] z-10"
          />
          
          <div className="absolute bottom-4 left-1/2 md:left-10 -translate-x-1/2 md:translate-x-0 bg-yellow-400 text-black px-4 py-1 border-[3px] border-black -rotate-2 shadow-[4px_4px_0_#000] z-20">
            <span className="font-comic font-black italic text-xs md:text-sm uppercase tracking-tighter">SANG PROKLAMATOR</span>
          </div>
        </motion.div>

        <div className="w-full md:w-6/12 flex flex-col items-center md:items-start space-y-5">
          
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center md:text-left"
          >
            <h2 className="bg-red-700 text-white inline-block px-3 py-0.5 font-comic font-bold text-xs  tracking-widest border-2 border-black mb-2 shadow-[2px_2px_0_#000]">
              {heroData.subtitle}
            </h2>
            <h1 className="text-6xl md:text-7xl font-comic font-black text-white italic tracking-tighter drop-shadow-[6px_6px_0_#e63946] uppercase leading-[0.9]">
              {heroData.title}
            </h1>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="bg-white p-4 md:p-6 border-4 my-0 md:my-2 border-black shadow-[10px_10px_0_#000]  relative">
              {/* Bubble Tail */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 hidden md:block">
                <div className="w-0 h-0 border-t-[15px] border-t-transparent border-r-[30px] border-r-black border-b-[15px] border-b-transparent relative after:content-[''] after:absolute after:-top-[11px] after:left-[4px] after:border-t-[11px] after:border-t-transparent after:border-r-[26px] after:border-r-white after:border-b-[11px] after:border-b-transparent" />
              </div>

              <p className="font-comic text-sm md:text-lg font-bold text-black leading-tight italic">
                “{heroData.description}”
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-nowrap mb-4 items-center gap-3 md:gap-6 justify-center md:justify-start pt-2 w-full"
          >
            <ComicButton
              onClick={onStart}
              className="whitespace-nowrap text-base md:text-xl px-6 md:px-10 py-4 md:py-5 bg-red-700 text-white border-[3px] border-black shadow-[6px_6px_0_#000] md:shadow-[8px_8px_0_#000] hover:shadow-[4px_4px_0_#000] transition-all active:translate-y-1 active:shadow-none uppercase flex-shrink-0"
            >
              {heroData.buttonText}
            </ComicButton>

            <button
              onClick={() => document.getElementById("gamification")?.scrollIntoView({ behavior: "smooth" })}
              className="flex-shrink-0 whitespace-nowrap font-comic font-black text-xs md:text-base text-white hover:text-yellow-400 border-b-2 border-yellow-400 transition-all pb-1"
            >
              {heroData.secondaryButtonText} 🏅
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 border-[6px] border-black pointer-events-none z-30" />
      
      <div className="absolute top-25 right-6 z-40 bg-white text-black px-3 py-1 font-comic font-black border-2 border-black text-[10px] shadow-[3px_3px_0_#000]">
        ISSUE #01
      </div>
    </section>
  );
}