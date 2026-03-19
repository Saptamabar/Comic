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
    <section className="relative py-16 md:py-24 bg-white overflow-hidden border-b-8 border-black flex items-center justify-center">
      {/* Background radial lines - Ukuran disesuaikan untuk mobile */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle, transparent 20%, #000 20%, #000 21%, transparent 21%, transparent 100%)",
          backgroundSize: "40px 40px" 
        }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border-4 md:border-8 border-black p-6 md:p-16 shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[16px_16px_0_0_rgba(0,0,0,1)] text-center relative mt-10 mb-10"
        >
          {/* Tanda Kutip Komik - Ukuran dikecilkan di mobile agar tidak menabrak teks */}
          <div className="absolute -top-12 -left-2 md:-top-16 md:-left-6 font-bangers text-7xl md:text-9xl text-pop-yellow drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000] select-none">
            "
          </div>
          <div className="absolute -bottom-16 -right-2 md:-bottom-24 md:-right-6 font-bangers text-7xl md:text-9xl text-pop-yellow drop-shadow-[2px_2px_0_#000] md:drop-shadow-[4px_4px_0_#000] rotate-180 select-none">
            "
          </div>

          {/* Judul Utama */}
          <h2 className="font-bangers text-3xl md:text-6xl text-pop-red mb-4 md:mb-8 uppercase tracking-wide leading-tight">
            {emotionalData.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br className="hidden md:block" /> 
                <span className="md:hidden"> </span> 
              </React.Fragment>
            ))}
          </h2>
          
          <div className="w-16 md:w-24 h-1.5 md:h-2 bg-black mx-auto mb-6 md:mb-8" />
          
          {/* Paragraf - Padding dan ukuran font disesuaikan */}
          <div className="border-l-4 md:border-l-8 border-pop-blue pl-4 md:pl-6 text-left md:text-center">
            <p className="font-comic text-base md:text-3xl text-gray-800 font-bold leading-relaxed italic">
              {emotionalData.paragraph.split('\n').map((line, i) => (
                 <React.Fragment key={i}>
                   {line}
                   <br />
                 </React.Fragment>
              ))}
            </p>
          </div>

          {/* Dekorasi Titik-titik */}
          <div className="mt-8 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-black" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}