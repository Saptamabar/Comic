"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function EmotionalSection() {
  const [emotionalData, setEmotionalData] = useState({
    title: "Discover the Stories\nThat Built Indonesia",
    paragraph: "Through Histoplay, history is no longer just something you read.\n\nIt becomes a journey where you experience the struggles, decisions, and courage that shaped the nation."
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
    <section className="relative py-24 bg-white overflow-hidden border-b-8 border-black flex items-center justify-center">
      {/* Background radial lines */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle, transparent 20%, #000 20%, #000 21%, transparent 21%, transparent 100%)",
          backgroundSize: "60px 60px"
        }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border-8 border-black p-8 md:p-16 shadow-[16px_16px_0_0_rgba(0,0,0,1)] text-center relative"
        >
          {/* Quote Marks */}
          <div className="absolute -top-10 -left-6 font-bangers text-9xl text-pop-yellow drop-shadow-[4px_4px_0_#000]">
            "
          </div>
          <div className="absolute -bottom-20 -right-6 font-bangers text-9xl text-pop-yellow drop-shadow-[4px_4px_0_#000] rotate-180">
            "
          </div>

          <h2 className="font-bangers text-5xl md:text-6xl text-pop-red mb-8 uppercase tracking-wide leading-tight">
            {emotionalData.title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </h2>
          
          <div className="w-24 h-2 bg-black mx-auto mb-8" />
          
          <p className="font-comic text-2xl md:text-3xl text-gray-800 font-bold leading-relaxed text-center italic border-l-8 border-pop-blue pl-6">
            {emotionalData.paragraph.split('\n').map((line, i) => (
               <React.Fragment key={i}>
                 {line}
                 <br />
               </React.Fragment>
            ))}
          </p>

          <div className="mt-8 flex justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-black" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
