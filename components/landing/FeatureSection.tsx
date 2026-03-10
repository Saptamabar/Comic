"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface MissionCard {
  title: string;
  desc: string;
  color: string;
}

export function FeatureSection() {
  const [missionData, setMissionData] = useState<{
    title: string;
    cards: MissionCard[];
  }>({
    title: "MISSION BRIEFING",
    cards: [],
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.mission) {
          setMissionData({
            title: data.mission.title || "MISSION BRIEFING",
            cards: data.mission.cards || [],
          });
        }
      }
    });

    return () => unsub();
  }, []);

  const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

  return (
    <section className="py-20 bg-white bg-halftone bg-[length:10px_10px] overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bangers text-center mb-16 drop-shadow-[4px_4px_0_#000] tracking-tighter"
        >
          {missionData.title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {missionData.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              style={{ backgroundColor: card.color || "#000" }}
              className={`p-4 border-4 border-black shadow-pop ${
                rotations[index % rotations.length]
              } hover:scale-105 transition-transform group`}
            >
              <div className="bg-white border-4 border-black p-6 h-full relative overflow-hidden">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-black rotate-45" />
                <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-black rotate-45" />

                <h3 className="font-bangers text-3xl mb-4 text-center border-b-4 border-black pb-3 group-hover:text-pop-red transition-colors">
                  {card.title}
                </h3>

                <p className="font-comic text-lg text-center font-bold leading-tight text-slate-800">
                  {card.desc}
                </p>

                <div className="absolute inset-0 opacity-5 pointer-events-none bg-halftone bg-[length:5px_5px]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}