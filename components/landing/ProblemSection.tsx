"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function ProblemSection() {
  const [problemData, setProblemData] = useState({
    title: "Why History Feels Boring",
    cards: [
      { title: "Too Much Text", description: "Traditional history books feel heavy and difficult to enjoy." },
      { title: "Passive Learning", description: "Students only read and memorize without interaction." },
      { title: "No Emotional Connection", description: "Historical events feel distant and hard to relate to." }
    ]
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.problem) setProblemData(data.problem);
      }
    });
    return () => unsub();
  }, []);

  const icons = ["📚", "😴", "❌"];

  return (
    <section className="relative py-24 bg-white overflow-hidden border-b-8 border-black">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-pop-blue opacity-10 bg-halftone bg-[length:16px_16px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <h2 className="font-bangers text-2xl md:text-5xl text-black tracking-wider relative z-10 px-8 py-4 bg-pop-blue border-4 border-black shadow-pop transform -rotate-1">
              {problemData.title}
            </h2>
            <div className="absolute -bottom-4 right-8 w-12 h-12 bg-pop-red border-4 border-black rounded-full shadow-pop flex items-center justify-center font-bangers text-xl text-white transform rotate-12">
              ?
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {problemData.cards.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
              className={`bg-white border-4 border-black p-8 shadow-pop relative ${
                index % 2 === 0 ? "transform rotate-1" : "transform -rotate-1"
              }`}
            >
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-pop-yellow border-4 border-black rounded-full flex items-center justify-center text-3xl shadow-pop">
                {icons[index % icons.length]}
              </div>
              <h3 className="font-bangers text-3xl text-pop-red mb-4 mt-4 uppercase tracking-wide">
                {problem.title}
              </h3>
              <p className="font-comic text-xl font-bold text-gray-800 leading-relaxed text-justify">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Corner comic effects */}
      <div className="absolute bottom-8 right-8 font-bangers text-4xl text-gray-300 transform -rotate-12 select-none pointer-events-none">
        SIGH...
      </div>
      <div className="absolute top-24 left-8 font-bangers text-4xl text-gray-300 transform rotate-12 select-none pointer-events-none">
        YAWN!
      </div>
    </section>
  );
}
