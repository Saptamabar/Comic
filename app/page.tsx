"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {LandingPage} from "@/components/landing/LandingPage";

function SejarahKuApp() {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inisialisasi Audio
    const audio = new Audio("/assets/audio/bgm/pusaka-landingPage.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // Fungsi sakti agar otomatis play
    const startAudio = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(() => {
          console.log("Menunggu interaksi pertama untuk memutar musik...");
        });
      }
    };

    // Jalankan langsung saat komponen dimuat
    startAudio();

    // Browser butuh interaksi user (klik/tap) sebelum memutar audio otomatis.
    // Listener ini akan memicu play pada klik pertama di mana saja.
    window.addEventListener("click", startAudio, { once: true });
    window.addEventListener("touchstart", startAudio, { once: true });

    return () => {
      audio.pause();
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };


  return (
    <div className="relative min-h-screen">
     <LandingPage/>

      {/* Tombol Audio Otomatis Pojok Kiri Bawah */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, x: 2, y: 2 }}
        onClick={toggleMute}
        className="fixed bottom-6 left-6 z-[100] flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-yellow-400 border-[3px] border-black shadow-[4px_4px_0_#000] active:shadow-none transition-all"
      >
        <span className="text-xl md:text-2xl select-none">
          {isMuted ? "🔇" : "🔊"}
        </span>
        
        {/* Label Kecil khas komik */}
        <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black px-1 border-2 border-black -rotate-12 uppercase shadow-[2px_2px_0_#000]">
          BGM
        </div>
      </motion.button>
    </div>
  );
}

export default function Home() {
  return (    
      <SejarahKuApp />    
  );
}