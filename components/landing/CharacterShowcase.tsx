"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface AgentCard {
  name: string;
  description: string;
  image: string;
  color: string;
  rotate: string;
}

export function CharacterShowcase() {
  const [agentData, setAgentData] = useState<{
    title: string;
    cards: AgentCard[];
  }>({
    title: "AGENTS OF CHANGE",
    cards: [],
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.agent) {
          setAgentData({
            title: data.agent.title || "AGENTS OF CHANGE",
            cards: data.agent.cards || [],
          });
        }
      }
    });

    return () => unsub();
  }, []);

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="container mx-auto px-4 z-10 relative">
        <motion.h2
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          className="text-6xl font-bangers text-center mb-20 text-pop-yellow drop-shadow-[4px_4px_0_#fff]"
        >
          {agentData.title}
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-12">
          {agentData.cards.map((char, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="relative group w-64 text-center"
            >
              {/* Card Background */}
              <div
                style={{ backgroundColor: char.color }}
                className={`absolute inset-0 transform ${
                  char.rotate || "rotate-3"
                } rounded-lg border-4 border-white transition-transform group-hover:rotate-6`}
              />

              {/* Content */}
              <div className="relative bg-white border-4 border-black p-4 transform -rotate-2 group-hover:rotate-0 transition-transform">
                <div className="w-full h-64 bg-gray-200 mb-4 border-2 border-black relative overflow-hidden flex items-center justify-center">
                  <div
                    style={{ backgroundColor: char.color }}
                    className="w-full h-full opacity-50 absolute"
                  />

                  {char.image ? (
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-cover z-10"
                    />
                  ) : (
                    <span className="font-bangers text-4xl opacity-20 z-0 text-black">
                      IMG
                    </span>
                  )}
                </div>

                <h3 className="font-bangers text-3xl text-black">
                  {char.name}
                </h3>
                <p className="font-comic font-bold text-gray-600 uppercase">
                  {char.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}