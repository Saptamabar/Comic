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

  const [storyData, setStoryData] = useState({
    title: "Jelajahi Sejarah",
    modules: [
      {
        title: "Proklamasi 1945",
        subtitle: "Rengasdengklok",
        description: "Bawa Bung Karno ke Rengasdengklok dan amankan teks Proklamasi dari Jepang!",
        goal: "Kemerdekaan RI",
        characters: "Soekarno, Hatta",
        bgColor: "bg-[#b71c1c]", 
      },
      {
        title: "Pertahanan 1945",
        subtitle: "Garis Depan",
        description: "Atur strategi 'Supit Urang' bersama Sudirman untuk memukul mundur Sekutu.",
        goal: "Usir Penjajah",
        characters: "Jend. Sudirman",
        bgColor: "bg-[#2b5ba9]",
      },
      {
        title: "KAA Bandung",
        subtitle: "Panggung Dunia",
        description: "Seimbangkan diplomasi Asia-Afrika di tengah Perang Dingin demi marwah bangsa.",
        goal: "Dasasila Bandung",
        characters: "Ali Sastroamidjojo",
        bgColor: "bg-[#ffca28]",
      },
      {
        title: "Reformasi 1998",
        subtitle: "Mei Berdarah",
        description: "Menjadi saksi sejarah di balik runtuhnya Orde Baru demi demokrasi.",
        goal: "Transisi",
        characters: "Aktivis",
        bgColor: "bg-green-700",
      }
    ]
  });

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
    <section id="explore-stories" className="relative py-16 overflow-hidden border-b-8 border-[#3e2723]">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/backgrounds/bgexplore.png')" }}
      />
      <div className="absolute inset-0 bg-[#fdf6e3]/50 z-[1] pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-10 z-[2] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#3e2723 1.2px, transparent 0)', backgroundSize: '20px 20px' }} 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <div className="absolute inset-0 bg-[#3e2723] transform -rotate-1 translate-x-2 translate-y-2 z-[-1]" />
            <h2 className="font-bangers text-3xl md:text-6xl text-white tracking-widest px-8 py-3 bg-[#b71c1c] border-4 border-[#3e2723] uppercase">
              {storyData.title}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-8 max-w-6xl mx-auto">
          {storyData.modules.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-[#fcf8ef] border-[3px] md:border-4 border-[#3e2723] shadow-[4px_4px_0_0_rgba(62,39,35,1)] md:shadow-[10px_10px_0_0_rgba(62,39,35,1)] flex flex-col group"
            >
              <div className={`${story.bgColor} border-b-[3px] md:border-b-4 border-[#3e2723] p-2 md:p-4`}>
                <h3 className="font-bangers text-xs md:text-3xl text-white uppercase leading-tight drop-shadow-[1.5px_1.5px_0_#3e2723]">
                  {story.title}
                </h3>
              </div>

              <div className="p-2 md:p-6 flex-1 flex flex-col bg-[radial-gradient(#e5e7eb_0.5px,transparent_0.5px)] [background-size:8px_8px]">
                <div className="inline-block bg-[#3e2723] text-[#ffca28] font-bangers px-2 py-0.5 mb-2 text-[10px] md:text-lg transform -rotate-1 self-start uppercase">
                  {story.subtitle}
                </div>
                
                <p className="font-comic text-[#3e2723] text-[10px] md:text-lg mb-3 md:mb-6 leading-tight flex-1 line-clamp-3 md:line-clamp-none font-bold">
                  {story.description}
                </p>

                <div className="bg-[#f2e6cf] border-[1px] md:border-2 border-[#3e2723] p-1.5 md:p-3 mb-3 md:mb-6 shadow-[3px_3px_0_0_rgba(62,39,35,1)]">
                  <p className="font-comic text-[8px] md:text-sm text-[#3e2723] leading-none">
                    <span className="font-black text-[#b71c1c]">GOAL:</span> {story.goal}
                  </p>
                  <p className="font-comic text-[8px] md:text-sm mt-1 text-[#3e2723] leading-none">
                    <span className="font-black text-[#2b5ba9]">HERO:</span> {story.characters}
                  </p>
                </div>

                <div className="mt-auto">
                  <ComicButton 
                    variant="primary" 
                    className="w-full text-[10px] md:text-xl py-1.5 md:py-3 shadow-[2px_2px_0_0_#000] md:shadow-[4px_4px_0_0_#000]"
                    onClick={() => { 
                      playClick();
                      onPlayClick();
                    }}
                    onMouseEnter={() => playHover()}
                  >
                    <span className="md:hidden">PLAY &rarr;</span>
                    <span className="hidden md:inline">MULAI PETUALANGAN &rarr;</span>
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