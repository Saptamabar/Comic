"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

export function GamificationSection() {
  const [gamificationData, setGamificationData] = useState({
    title: "Belajar. Main. Berprestasi.",
    cards: [
      { 
        title: "Lencana Sejarah", 
        description: "Buka pencapaian unik setiap kali kamu menyelesaikan modul cerita." 
      },
      { 
        title: "Pantau Progres", 
        description: "Lihat sejauh mana kamu telah menjelajahi lini masa sejarah Indonesia." 
      },
      { 
        title: "Papan Peringkat", 
        description: "Bersaing dengan teman dan penjelajah lain untuk jadi yang terbaik." 
      }
    ]
  });

  const icons = ["🎖️", "📊", "🏆"];

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.gamification) setGamificationData(data.gamification);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="gamification" className="relative py-24 bg-[#fdf6e3] overflow-hidden border-b-8 border-[#3e2723]">
      <style jsx global>{`
        .gamify-swiper .swiper-pagination-bullet {
          background: #3e2723 !important;
          opacity: 0.3;
        }
        .gamify-swiper .swiper-pagination-bullet-active {
          background: #b71c1c !important;
          opacity: 1;
          width: 25px;
          border-radius: 4px;
        }
      `}</style>

      {/* Corak Diagonal Tetap Ada */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(62,39,35,0.05)_25%,transparent_25%,transparent_75%,rgba(62,39,35,0.05)_75%,rgba(62,39,35,0.05)),linear-gradient(-45deg,rgba(62,39,35,0.05)_25%,transparent_25%,transparent_75%,rgba(62,39,35,0.05)_75%,rgba(62,39,35,0.05))] bg-[length:40px_40px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <div className="absolute -inset-2 bg-[#3e2723] transform rotate-1 z-[-1]" />
            <h2 className="font-bangers text-2xl md:text-6xl text-[#ffca28] bg-[#b71c1c] border-4 border-[#3e2723] tracking-wider px-8 py-4 uppercase">
              {gamificationData.title}
            </h2>
            <div className="font-comic my-2 text-lg md:text-xl font-bold text-white bg-[#3e2723] px-4 py-1 -mt-4 transform -rotate-2 inline-block border-2 border-white">
              GAMIFIKASI
            </div>
          </motion.div>
        </div>

        {/* MOBILE LAYOUT */}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            className="gamify-swiper !pb-14"
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {gamificationData.cards.map((feature, index) => (
              <SwiperSlide key={index}>
                <div className={`bg-[#fcf8ef] border-4 border-[#3e2723] p-8 relative shadow-[6px_6px_0_0_#3e2723] text-center h-full ${
                  index % 2 === 0 ? "transform -rotate-1" : "transform rotate-1"
                }`}>
                  <div className="w-16 h-16 mx-auto bg-[#b71c1c] border-4 border-[#3e2723] rounded-lg flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0_0_#3e2723]">
                    {icons[index % icons.length]}
                  </div>
                  <h3 className="font-bangers text-2xl text-[#3e2723] mb-2 uppercase">
                    {feature.title}
                  </h3>
                  <p className="font-comic text-md font-bold text-[#3e2723]/80 leading-tight border-t-2 border-[#3e2723] pt-3 border-dashed">
                    {feature.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* DESKTOP LAYOUT */}
        <div className="hidden md:flex gap-8 justify-center items-stretch max-w-5xl mx-auto">
          {gamificationData.cards.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
              className={`flex-1 bg-[#fcf8ef] border-4 border-[#3e2723] p-8 relative shadow-[10px_10px_0_0_#3e2723] text-center group hover:-translate-y-2 transition-transform ${
                index % 2 === 0 ? "transform -rotate-1" : "transform rotate-1"
              }`}
            >
              <div className="w-20 h-20 mx-auto bg-[#b71c1c] border-4 border-[#3e2723] rounded-lg flex items-center justify-center text-4xl mb-6 shadow-[4px_4px_0_0_#3e2723] group-hover:rotate-12 transition-transform">
                {icons[index % icons.length]}
              </div>
              <h3 className="font-bangers text-3xl text-[#3e2723] mb-3 uppercase">
                {feature.title}
              </h3>
              <p className="font-comic text-lg font-bold text-[#3e2723]/80 leading-tight border-t-4 border-[#3e2723] pt-3 border-dashed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Dekorasi Teks Melayang */}
      <div className="hidden sm:block absolute top-20 right-20 font-bangers text-6xl text-[#3e2723] opacity-10 transform rotate-45 select-none pointer-events-none uppercase">
        Hebat!
      </div>
      <div className="hidden sm:block absolute bottom-20 left-20 font-bangers text-5xl text-[#3e2723] opacity-10 transform -rotate-12 select-none pointer-events-none uppercase">
        Naik Level!
      </div>
    </section>
  );
}