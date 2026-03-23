"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function EmotionalSection() {
  const [emotionalData, setEmotionalData] = useState({
    title: "Temukan Kisah\nYang Membangun Bangsa",
    paragraph: "Melalui Histoplay, sejarah bukan lagi sekadar bacaan.\n\nIni adalah perjalanan untuk merasakan perjuangan, keputusan, dan keberanian yang membentuk Indonesia."
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.emotional) setEmotionalData(data.emotional);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="relative py-12 md:py-20 overflow-hidden border-b-8 border-[#3e2723] flex items-center justify-center min-h-[500px]">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/backgrounds/bgemo.png')" }}
      />
      
      <div className="absolute inset-0 bg-[#fdf6e3]/40 z-[1] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 max-w-2xl"> {/* Ukuran container dipersempit ke max-w-2xl */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#fcf8ef] border-[3px] md:border-6 border-[#3e2723] p-6 md:p-10 shadow-[6px_6px_0_0_rgba(62,39,35,1)] md:shadow-[10px_10px_0_0_rgba(62,39,35,1)] text-center relative"
        >
          {/* Tanda Kutip - Ukuran dikecilkan */}
          <div className="absolute -top-10 -left-1 md:-top-12 md:-left-4 font-bangers text-6xl md:text-8xl text-[#ffca28] drop-shadow-[2px_2px_0_#3e2723] select-none">
            "
          </div>
          <div className="absolute -bottom-14 -right-1 md:-bottom-18 md:-right-4 font-bangers text-6xl md:text-8xl text-[#ffca28] drop-shadow-[2px_2px_0_#3e2723] rotate-180 select-none">
            "
          </div>

          {/* Judul Utama - Ukuran font dikecilkan dari 6xl ke 4xl (desktop) */}
          <h2 className="font-bangers text-2xl md:text-4xl text-[#b71c1c] mb-3 md:mb-6 uppercase tracking-wide leading-tight">
            {emotionalData.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br className="hidden md:block" /> 
                <span className="md:hidden"> </span> 
              </React.Fragment>
            ))}
          </h2>
          
          <div className="w-12 md:w-16 h-1 bg-[#3e2723] mx-auto mb-4 md:mb-6" />
          
          {/* Paragraf - Ukuran font dikecilkan dari 3xl ke xl (desktop) */}
          <div className="border-l-[3px] md:border-l-4 border-[#2b5ba9] pl-4 text-left md:text-center">
            <p className="font-comic text-sm md:text-xl text-[#3e2723] font-bold leading-relaxed italic">
              {emotionalData.paragraph.split('\n').map((line, i) => (
                 <React.Fragment key={i}>
                   {line}
                   <br />
                 </React.Fragment>
              ))}
            </p>
          </div>

          {/* Dekorasi Titik-titik */}
          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#b71c1c] border-[1.5px] border-[#3e2723]" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}