"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

// --- SUB-KOMPONEN KARTU (FIXED SPACING) ---
const ProblemCard = ({ title, description, icon, index }: { title: string; description: string; icon: string; index: number }) => (
  <div className={`
    bg-[#fdf6e3] 
    border-[3px] border-[#3e2723] 
    p-6 md:p-8 
    /* Padding Top Ekstra (pt-10 atau pt-12) agar judul tidak tertutup icon */
    pt-12 md:pt-14 
    shadow-[8px_8px_0px_0px_rgba(62,39,35,0.9)] 
    relative h-full flex flex-col items-start
    transition-all duration-300 hover:translate-x-1 hover:translate-y-1 hover:shadow-none
    ${index % 2 === 0 ? "md:rotate-1" : "md:-rotate-1"}
  `}>
    {/* Icon Bubble - Posisinya tetap absolute tapi kita beri sedikit offset agar lebih manis */}
    <div className="absolute -top-6 -left-4 md:-top-8 md:-left-6 w-14 h-14 md:w-18 md:h-18 bg-[#ffca28] border-4 border-[#3e2723] rounded-xl flex items-center justify-center text-3xl md:text-4xl shadow-[4px_4px_0px_0px_rgba(62,39,35,1)] z-20">
      <span className="select-none">{icon}</span>
    </div>

    {/* Judul Kartu - Diberi leading-tight agar tidak memakan terlalu banyak ruang vertikal */}
    <h3 className="font-bangers text-2xl md:text-3xl text-[#b71c1c] mb-3 uppercase tracking-wide leading-[1.1]">
      {title}
    </h3>

    {/* Deskripsi */}
    <p className="font-comic text-base md:text-xl font-bold text-[#3e2723] leading-snug flex-grow">
      {description}
    </p>

    {/* Dekorasi Tape Vintage */}
    <div className="absolute top-2 right-2 w-8 h-2 bg-[#d4a373] opacity-30 rotate-45" />
  </div>
);

export function ProblemSection() {
  const [problemData, setProblemData] = useState({
    title: "Kenapa Sejarah Membosankan?",
    cards: [
      { title: "Teks Berlebihan", description: "Buku sejarah tradisional terasa berat dan sulit dinikmati oleh pembaca." },
      { title: "Pembelajaran Pasif", description: "Siswa hanya membaca dan menghafal tanpa adanya interaksi yang nyata." },
      { title: "Tanpa Koneksi Emosional", description: "Peristiwa sejarah terasa jauh dan sulit untuk dipahami secara emosional." }
    ]
  });

  const icons = ["📚", "😴", "❌"];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/web_settings");
        if (res.ok) {
          const data = await res.json();
          if (data.problem) setProblemData(data.problem);
        }
      } catch (err) { console.error(err); }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative py-20 md:py-32 bg-[#e9dcc0] overflow-hidden border-b-8 border-[#3e2723]">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-multiply"
          style={{ backgroundImage: "url('/assets/backgrounds/bgproblemsec.png')" }} 
        />
        <div className="absolute inset-0 bg-halftone bg-[length:24px_24px] opacity-10 mix-blend-soft-light" />
        <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10" />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="text-center mb-16 md:mb-28">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block font-bangers text-xl md:text-5xl lg:text-4xl text-[#fdf6e3] tracking-widest px-3 py-3 md:px-12 md:py-4 bg-[#0d47a1] border-4 border-[#3e2723] shadow-[10px_10px_0px_0px_rgba(62,39,35,1)] transform -rotate-1"
          >
            {problemData.title}
          </motion.h2>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 3500 }}
            pagination={{ clickable: true }}
            className="pb-16 !overflow-visible"
          >
            {problemData.cards.map((problem, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <ProblemCard 
                  title={problem.title} 
                  description={problem.description} 
                  icon={icons[index % icons.length]} 
                  index={index} 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid grid-cols-3 gap-10 lg:gap-14 max-w-7xl mx-auto items-stretch">
          {problemData.cards.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
              className="h-full pt-4" 
            >
              <ProblemCard 
                title={problem.title} 
                description={problem.description} 
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
        .swiper-pagination { bottom: 0px !important; }
      `}</style>
    </section>
  );
}