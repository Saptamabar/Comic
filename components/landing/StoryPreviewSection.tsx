"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUiSound } from "@/hooks/useUiSound";
import { ComicButton } from "@/components/ui/ComicButton";

interface StoryPreviewSectionProps {
  onPlayClick: () => void;
}

export function StoryPreviewSection({ onPlayClick }: StoryPreviewSectionProps) {
  const { playClick, playHover } = useUiSound();

  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await fetch("/api/missions");
        if (res.ok) {
          const data = await res.json();
          setMissions(data);
        }
      } catch (err) {
         console.error(err);
      }
    };
    fetchMissions();
  }, []);

  const eraMeta: Record<string, string> = {
    era_kemerdekaan: "bg-pop-red",
    era_orde_lama: "bg-pop-yellow",
    era_order_lama: "bg-pop-yellow",
    era_orde_baru: "bg-pop-blue",
    era_order_baru: "bg-pop-blue",
    era_reformasi: "bg-green-500",
  };

  return (
    <section id="explore-stories" className="relative py-16 bg-gray-100 overflow-hidden border-b-8 border-black">
      <div className="absolute inset-0 bg-halftone opacity-5 bg-[length:12px_12px] pointer-events-none" />
      
      <div className="container mx-auto px-3 relative z-10">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <div className="absolute -inset-1 bg-black transform -rotate-1 z-[-1]" />
            <h2 className="font-bangers text-3xl md:text-6xl text-white tracking-wider px-6 py-2 uppercase shadow-pop">
              JELAJAHI SEJARAH
            </h2>
          </motion.div>
        </div>

        {/* Responsive Grid: 2 Columns on Mobile, 2 Columns on Desktop */}
        <div className="grid grid-cols-2 gap-4 md:gap-8  max-w-6xl mx-auto">
          {missions.map((story, index) => {
            const bgColor = story.era ? eraMeta[story.era as string] || "bg-pop-red" : "bg-pop-red";
            return (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border-[3px] md:border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col group"
            >
              {/* Header */}
              <div className={`${bgColor} border-b-[3px] md:border-b-4 border-black p-2 md:p-4`}>
                <h3 className="font-bangers text-sm md:text-3xl text-white uppercase leading-tight drop-shadow-[1.5px_1.5px_0_#000]">
                  {story.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-2 md:p-6 flex-1 flex flex-col">
                <div className="inline-block bg-black text-white font-bangers px-2 py-0.5 mb-2 text-[10px] md:text-lg transform -rotate-1 self-start uppercase">
                  {story.era?.replace(/_/g, " ") || "Misi Sejarah"}
                </div>
                
                <p className="font-comic text-gray-800 text-[11px] md:text-lg mb-3 md:mb-6 leading-snug flex-1 line-clamp-3 md:line-clamp-none">
                  {story.description || "Tidak ada deskripsi."}
                </p>

                {/* Info Box - Hidden or simplified on small mobile to save space */}
                <div className="hidden xs:block bg-gray-50 border-[1px] md:border-2 border-black p-1.5 md:p-3 mb-3 md:mb-6">
                  <p className="font-comic text-[9px] md:text-sm truncate">
                    <span className="font-bold text-pop-red">GOAL:</span> {story.goal || "Selesaikan Misi"}
                  </p>
                  <p className="font-comic text-[9px] md:text-sm mt-0.5 md:mt-1 truncate">
                    <span className="font-bold text-pop-blue">HERO:</span> {story.hero || "Pahlawan Indonesia"}
                  </p>
                </div>

                <div className="text-center mt-auto">
                  <ComicButton 
                    variant="primary" 
                    className="w-full text-xs md:text-xl py-1.5 md:py-3 my-2 "
                    onClick={() => { 
                      playClick();
                      onPlayClick();
                    }}
                    onMouseEnter={() => playHover()}
                  >
                    MAIN <span className="hidden md:inline">CERITA</span> &rarr;
                  </ComicButton>
                </div>
              </div>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  );
}