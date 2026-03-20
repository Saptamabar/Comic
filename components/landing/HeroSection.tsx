"use client";

import React, { useEffect, useState } from "react";
import { ComicButton } from "@/components/ui/ComicButton";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onStart: () => void;
}

export function HeroSection({ onStart }: HeroSectionProps) {
  const [heroData, setHeroData] = useState({
    title: "Di mana sejarah menjadi sebuah petualangan.",
    subTitle: 'NUSAQUEST',
    description:
      "Rasakan sejarah Indonesia melalui cerita interaktif di mana pilihanmu menentukan akhir cerita.",
    buttonText: "Mulai Misimu",
    secondaryButtonText: "Kumpulkan Badge"
  });

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col items-center justify-center bg-pop-yellow bg-halftone bg-[length:24px_24px] overflow-hidden p-4 pt-24"
    >

      {/* Action line comic background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none select-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, transparent 20%, #000 20%, #000 21%, transparent 21%, transparent 100%)",
          backgroundSize: "40px 40px",
        }}
      >
        <div className="absolute inset-0 bg-[repeating-conic-gradient(#000_0_15deg,transparent_0_30deg)] opacity-20" />
      </div>

      {/* Floating comic elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-32 right-[10%] w-32 h-32 bg-pop-red border-4 border-black rotate-12 flex items-center justify-center shadow-pop hidden md:flex"
      >
        <span className="font-bangers text-white text-3xl">ZAP!</span>
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="absolute bottom-40 left-[5%] w-24 h-24 bg-pop-blue rounded-full border-4 border-black -rotate-12 flex items-center justify-center shadow-pop hidden md:flex"
      >
        <span className="font-bangers text-white text-2xl">BAM!</span>
      </motion.div>

      {/* Main Content */}
      <div className="z-10 text-center max-w-5xl w-full relative">

        {/* Title Bubble or Text */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="mb-8 relative auto mx-auto flex justify-center"
        >
          <div className="relative inline-block bg-white border-4 border-black p-6 shadow-pop rotate-[-1deg] max-w-4xl">
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-t-[30px] border-t-black border-r-[20px] border-r-transparent after:content-[''] after:absolute after:-top-[34px] after:-left-[16px] after:border-l-[16px] after:border-l-transparent after:border-t-[26px] after:border-t-white after:border-r-[16px] after:border-r-transparent" />
              <h1 className="font-bangers text-2xl  md:text-5xl text-pop-red drop-shadow-[3px_3px_0_#000] tracking-wider uppercase leading-none">
                {heroData.title}
              </h1>
          </div>
        </motion.div>

        {/* Description Box */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mb-12 bg-white/90 p-4 border-4 border-black shadow-pop rotate-1"
        >
          <p className="font-comic text-base md:text-2xl font-black text-black">
            {heroData.description}
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
          className="relative flex flex-row items-center justify-center gap-3 md:gap-6"
        >
          <ComicButton
            onClick={onStart}
            variant="primary"
            className="text-xs md:text-xl px-4 md:px-12 py-3 md:py-6 hover:scale-110 transition-transform active:scale-95 animate-bounce-slight"
          >
            {heroData.buttonText} &rarr;
          </ComicButton>
          <ComicButton
            onClick={() => {
              const el = document.getElementById("gamification");
              if(el) el.scrollIntoView({ behavior: "smooth" });
            }}
            variant="neutral"
            className="text-xs md:text-xl px-4 md:px-8 py-3 md:py-5 hover:scale-110 transition-transform active:scale-95 bg-pop-blue text-white"
          >
            {heroData.secondaryButtonText} 🏆
          </ComicButton>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pop-red border-8 border-black rotate-45 shadow-pop" />
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-pop-blue border-8 border-black -rotate-45 shadow-pop" />
      
      {/* Background SFX Words */}
      <div className="absolute bottom-10 right-10 font-bangers text-5xl text-black opacity-30 rotate-12 select-none pointer-events-none">
        CRASH!
      </div>
      <div className="absolute top-32 left-10 font-bangers text-4xl text-black opacity-30 -rotate-12 select-none pointer-events-none">
        WHAM!
      </div>
    </section>
  );
}