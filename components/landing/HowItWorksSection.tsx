"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

export function HowItWorksSection() {
  const [howItWorksData, setHowItWorksData] = useState({
    title: "Mulai Dalam 3 Langkah",
    steps: [
      {
        title: "Pilih Cerita",
        description: "Contoh: Proklamasi Kemerdekaan, Sumpah Pemuda, Era Majapahit"
      },
      {
        title: "Ambil Keputusan",
        description: "Pengguna memilih dialog atau tindakan yang akan memengaruhi jalannya cerita."
      },
      {
        title: "Buka Pencapaian",
        description: "Kumpulkan badge dan jelajahi berbagai kemungkinan akhir cerita."
      }
    ]
  });
  const illustrations = [
    (
      <div key="ill-1" className="w-full h-32 bg-[#dcc9a6] border-4 border-[#3e2723] relative overflow-hidden flex items-center justify-center font-bangers text-2xl text-[#3e2723]/60 italic tracking-tighter">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3e2723 1px, transparent 0)', backgroundSize: '8px 8px' }} />
        📜 SELECT STORY
      </div>
    ),
    (
      <div key="ill-2" className="w-full h-32 bg-[#2b5ba9] border-4 border-[#3e2723] relative overflow-hidden flex flex-col items-center justify-center p-2 gap-2">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
        <div className="w-3/4 h-8 bg-[#fdf6e3] border-2 border-[#3e2723] rounded-sm shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex items-center px-2 font-comic text-[10px] font-bold text-[#3e2723]">A. Maju Pantang Mundur</div>
        <div className="w-3/4 h-8 bg-[#fdf6e3] border-2 border-[#3e2723] rounded-sm shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex items-center px-2 font-comic text-[10px] font-bold text-[#3e2723]">B. Atur Strategi...</div>
      </div>
    ),
    (
      <div key="ill-3" className="w-full h-32 bg-[#ffca28] border-4 border-[#3e2723] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-conic-gradient(from 0deg, #3e2723 0deg 20deg, transparent 20deg 40deg)' }}></div>
        <div className="w-16 h-16 bg-[#fdf6e3] rounded-full border-4 border-[#3e2723] flex items-center justify-center text-3xl shadow-[4px_4px_0_0_rgba(62,39,35,1)] transform rotate-12 z-10">
          🏆
        </div>
      </div>
    )
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/web_settings");
        if (res.ok) {
          const data = await res.json();
          if (data.howItWorks) setHowItWorksData(data.howItWorks);
        }
      } catch (err) { console.error(err); }
    };
    fetchSettings();
  }, []);

  return (
    <section id="how-it-works" className="relative py-24 bg-[#fdf6e3] overflow-hidden border-b-8 border-[#3e2723]">
      <style jsx global>{`
        .how-swiper .swiper-pagination-bullet {
          background: #3e2723 !important;
          opacity: 0.3;
          width: 10px;
          height: 10px;
        }
        .how-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #ffca28 !important;
          width: 25px;
          border-radius: 4px;
          border: 2px solid #3e2723;
        }
      `}</style>
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#3e2723 1.5px, transparent 0)', backgroundSize: '24px 24px' }} 
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <div className="absolute inset-0 bg-[#3e2723] transform translate-x-3 translate-y-3 -rotate-1" />
            <h2 className="font-bangers text-xl md:text-5xl text-white tracking-widest relative z-10 px-8 py-6 bg-[#2b5ba9] border-4 border-[#3e2723] transform -rotate-1 uppercase">
              {howItWorksData.title}
            </h2>
            <div className="absolute -top-6 -left-6 w-14 h-14 bg-[#b71c1c] border-4 border-[#3e2723] rounded-full flex items-center justify-center font-bangers text-white text-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] z-20 hidden md:flex animate-bounce">
              !
            </div>
          </motion.div>
        </div>

        {/* MOBILE VIEW (Swiper) */}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            className="how-swiper !pb-16"
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            style={{ overflow: 'visible' }}
          >
            {howItWorksData.steps.map((step, index) => (
              <SwiperSlide key={index}>
                <div className="relative flex flex-col items-center px-4">
                  <div className="absolute -top-6 -left-2 w-14 h-14 bg-[#ffca28] border-4 border-[#3e2723] rounded-sm flex items-center justify-center font-bangers text-3xl text-[#3e2723] shadow-[4px_4px_0_0_rgba(0,0,0,1)] z-30 transform -rotate-12">
                    {index + 1}
                  </div>
                  <div className="bg-[#fcf8ef] border-4 border-[#3e2723] shadow-[8px_8px_0_0_rgba(62,39,35,1)] w-full z-10 min-h-[300px]">
                    <div className="p-4 border-b-4 border-[#3e2723] bg-[#f2e6cf]">
                      {illustrations[index % illustrations.length]}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-bangers text-2xl text-[#b71c1c] mb-2 uppercase">
                        {step.title}
                      </h3>
                      <p className="font-comic text-lg font-bold text-[#3e2723] leading-snug">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-12 max-w-6xl mx-auto relative">
          {howItWorksData.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
              className="relative group"
            >
              {index < 2 && (
                <div className="absolute top-1/2 -right-12 text-5xl text-[#3e2723] z-0 opacity-20 font-bangers hidden lg:block transform -translate-y-12">
                  &gt;&gt;
                </div>
              )}

              <div className="absolute -top-6 -left-6 w-16 h-16 bg-[#ffca28] border-4 border-[#3e2723] rounded-sm flex items-center justify-center font-bangers text-4xl text-[#3e2723] shadow-[6px_6px_0_0_rgba(62,39,35,1)] z-20 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                {index + 1}
              </div>

              <div className="bg-[#fcf8ef] border-4 border-[#3e2723] shadow-[12px_12px_0_0_rgba(62,39,35,1)] w-full z-10 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[16px_16px_0_0_rgba(62,39,35,1)]">
                <div className="p-4 border-b-4 border-[#3e2723] bg-[#f2e6cf]">
                  {illustrations[index % illustrations.length]}
                </div>
                <div className="p-8 text-center">
                  <h3 className="font-bangers text-3xl text-[#b71c1c] mb-3 uppercase tracking-wider">
                    {step.title}
                  </h3>
                  <div className="w-12 h-1 bg-[#3e2723] mx-auto mb-4 opacity-20" />
                  <p className="font-comic text-xl font-bold text-[#3e2723] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute right-[-2%] bottom-5 font-bangers text-[12rem] text-[#3e2723] opacity-5 select-none pointer-events-none transform rotate-3">
        NUSAQUEST
      </div>
    </section>
  );
}