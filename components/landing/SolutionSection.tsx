"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

const SolutionCard = ({ title, description, icon, index }: { title: string; description: string; icon: string; index: number }) => (
  <div className={`
    bg-[#fdf6e3] 
    border-[3px] border-[#3e2723] 
    p-8 md:p-10 
    pt-14 md:pt-16
    shadow-[8px_8px_0px_0px_rgba(62,39,35,0.9)] 
    relative h-full flex flex-col items-center text-center
    transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none
    ${index % 2 === 0 ? "md:-rotate-1" : "md:rotate-1"}
  `}>
    <div className="absolute -top-7 w-16 h-16 md:w-20 md:h-20 bg-[#ffca28] border-4 border-[#3e2723] rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-[4px_4px_0px_0px_rgba(62,39,35,1)] z-20">
      <span className="select-none">{icon}</span>
    </div>

    <h3 className="font-bangers text-2xl md:text-3xl text-[#b71c1c] mb-4 uppercase tracking-wide leading-tight decoration-[#ffca28] underline decoration-4 underline-offset-4">
      {title}
    </h3>

    <p className="font-comic text-base md:text-xl font-bold text-[#3e2723] leading-relaxed flex-grow">
      {description}
    </p>
  </div>
);

export function SolutionSection() {
  const [solutionData, setSolutionData] = useState({
    title: "Cara Baru Menjelajahi Sejarah",
    cards: [
      { title: "Cerita Interaktif", description: "Rasakan sejarah seperti visual novel di mana kamu menentukan alur cerita." },
      { title: "Pilihan Bercabang", description: "Keputusanmu memengaruhi bagaimana peristiwa sejarah berlangsung." },
      { title: "Pembelajaran Gamifikasi", description: "Buka badge dan pencapaian sambil menjelajahi sejarah." }
    ]
  });

  const icons = ["🎮", "🧭", "🏆"];

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.solution) setSolutionData(data.solution);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section className="relative py-24 bg-[#e9dcc0] overflow-hidden border-b-8 border-[#3e2723]">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
          style={{ backgroundImage: "url('/assets/backgrounds/bgsol.png')" }} 
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-[#e9dcc0] via-transparent to-[#e9dcc0] opacity-80" />
        
        <div className="absolute inset-0 bg-halftone opacity-5 bg-[length:20px_20px]" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="text-center mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <div className="absolute -inset-4 md:-inset-6 bg-[#2b5ba9] transform -rotate-1 border-4 border-[#3e2723] shadow-[10px_10px_0px_0px_rgba(62,39,35,1)] z-[-1]" />
            
            <h2 className="font-bangers text-xl md:text-4xl text-[#fdf6e3] tracking-wider px-6 py-2 uppercase leading-tight">
              {solutionData.title}
            </h2>
            
            <div className="absolute -top-10 -right-8 w-14 h-14 md:w-16 md:h-16 bg-[#ffca28] border-4 border-[#3e2723] shadow-[4px_4px_0px_0px_rgba(62,39,35,1)] flex items-center justify-center font-bangers text-3xl text-black transform rotate-12">
              !
            </div>
          </motion.div>
        </div>

        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            className="!pb-16 !overflow-visible"
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 4000 }}
            pagination={{ clickable: true }}
          >
            {solutionData.cards.map((solution, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <SolutionCard 
                  title={solution.title} 
                  description={solution.description} 
                  icon={icons[index % icons.length]} 
                  index={index} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-10 lg:gap-14 max-w-7xl mx-auto items-stretch">
          {solutionData.cards.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
              className="h-full pt-6"
            >
              <SolutionCard 
                title={solution.title} 
                description={solution.description} 
                icon={icons[index % icons.length]} 
                index={index} 
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet { background: #3e2723 !important; opacity: 0.3; }
        .swiper-pagination-bullet-active { background: #ffca28 !important; width: 25px; border-radius: 10px; border: 2px solid #3e2723; opacity: 1; }
      `}</style>
    </section>
  );
}