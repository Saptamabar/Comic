"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function HowItWorksSection() {
  const [howItWorksData, setHowItWorksData] = useState({
    title: "Start Your Journey in 3 Steps",
    steps: [
      { title: "Choose a Story", description: "Example: Proclamation of Independence, Youth Pledge, Majapahit Era" },
      { title: "Make Your Decisions", description: "Users choose dialogue or actions that shape the story." },
      { title: "Unlock Achievements", description: "Collect badges and explore different story outcomes." }
    ]
  });

  const illustrations = [
    (
      <div key="ill-1" className="w-full h-32 bg-gray-200 border-4 border-black relative overflow-hidden flex items-center justify-center font-bangers text-3xl text-gray-400">
        <div className="absolute inset-0 bg-halftone opacity-10 bg-[length:8px_8px]" />
        MAP VIEW
      </div>
    ),
    (
      <div key="ill-2" className="w-full h-32 bg-pop-blue border-4 border-black relative overflow-hidden flex flex-col items-center justify-center p-2 gap-2">
        <div className="w-3/4 h-8 bg-white border-2 border-black rounded-lg" />
        <div className="w-3/4 h-8 bg-white border-2 border-black rounded-lg" />
      </div>
    ),
    (
      <div key="ill-3" className="w-full h-32 bg-pop-yellow border-4 border-black relative overflow-hidden flex items-center justify-center">
        <div className="w-16 h-16 bg-white rounded-full border-4 border-black flex items-center justify-center text-3xl shadow-pop transform rotate-12">
          🏅
        </div>
      </div>
    )
  ];

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.howItWorks) setHowItWorksData(data.howItWorks);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="how-it-works" className="relative py-24 bg-white overflow-hidden border-b-8 border-black">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <h2 className="font-bangers text-5xl md:text-7xl text-black tracking-wider relative z-10 px-8 py-4 bg-pop-red text-white border-4 border-black shadow-pop transform rotate-1">
              {howItWorksData.title.split('\n').map((line: string, i: number) => (
                <span key={i}>{line}<br/></span>
              ))}
            </h2>
            {/* Action Lines */}
            <div className="absolute -inset-8 bg-[repeating-conic-gradient(#000_0_5deg,transparent_0_10deg)] opacity-10 z-[-1] rounded-full" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {howItWorksData.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.3, type: "spring" }}
              className="relative flex flex-col items-center"
            >
              {/* Connection Arrows (Desktop only) */}
              {index < howItWorksData.steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-12 text-6xl text-black z-10 transform -translate-y-12">
                  &rarr;
                </div>
              )}

              {/* Step Number Badge */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-pop-yellow border-4 border-black rounded-full flex items-center justify-center font-bangers text-4xl text-black shadow-pop z-20 transform -rotate-12">
                {index + 1}
              </div>

              {/* Card Content */}
              <div className="bg-white border-4 border-black shadow-pop w-full z-10">
                <div className="p-4 border-b-4 border-black">
                  {illustrations[index % illustrations.length]}
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bangers text-3xl text-pop-blue mb-2 uppercase">
                    {step.title}
                  </h3>
                  <p className="font-comic text-lg font-bold text-gray-700">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
