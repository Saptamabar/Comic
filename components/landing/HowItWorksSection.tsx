"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

export function HowItWorksSection() {
  const [howItWorksData, setHowItWorksData] = useState({
    title: "Mulai Perjalanan Anda dalam 3 Langkah",
    steps: [
      { title: "Pilih Cerita", description: "Contoh: Proklamasi Kemerdekaan, Sumpah Pemuda, Era Majapahit" },
      { title: "Buat Keputusan Anda", description: "Pengguna memilih dialog atau tindakan yang membentuk cerita." },
      { title: "Raih Pencapaian", description: "Kumpulkan lencana dan jelajahi hasil cerita yang berbeda." }
    ]
  });

  const illustrations = [
    (
      <div key="ill-1" className="w-full h-32 bg-gray-200 border-4 border-black relative overflow-hidden flex items-center justify-center font-bangers text-3xl text-gray-400">
        <div className="absolute inset-0 bg-halftone opacity-10 bg-[length:8px_8px]" />
        TAMPILAN PETA
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
    <section id="how-it-works" className="relative py-24 bg-white overflow-hidden border-b-8 border-black">
      <style jsx global>{`
        .how-swiper .swiper-pagination-bullet {
          background: #000 !important;
          opacity: 0.3;
          width: 10px;
          height: 10px;
        }
        .how-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #EF4444 !important; /* Merah sesuai tema Title */
          width: 20px;
          border-radius: 4px;
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        {/* TITLE */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <h2 className="font-bangers text-2xl md:text-7xl text-black tracking-wider relative z-10 px-8 py-4 bg-pop-red text-white border-4 border-black shadow-pop transform rotate-1 uppercase">
              {howItWorksData.title}
            </h2>
            <div className="absolute -inset-8 bg-[repeating-conic-gradient(#000_0_5deg,transparent_0_10deg)] opacity-10 z-[-1] rounded-full" />
          </motion.div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            className="how-swiper !pb-14"
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            style={{ overflow: 'visible' }}
          >
            {howItWorksData.steps.map((step, index) => (
              <SwiperSlide key={index}>
                <div className="relative flex flex-col items-center px-4">
                  {/* Step Number Badge */}
                  <div className="absolute -top-6 -left-2 w-14 h-14 bg-pop-yellow border-4 border-black rounded-full flex items-center justify-center font-bangers text-3xl text-black shadow-pop z-30 transform -rotate-12">
                    {index + 1}
                  </div>

                  {/* Card Content */}
                  <div className="bg-white border-4 border-black shadow-pop w-full z-10 min-h-[300px]">
                    <div className="p-4 border-b-4 border-black bg-gray-50">
                      {illustrations[index % illustrations.length]}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-bangers text-2xl text-pop-blue mb-2 uppercase">
                        {step.title}
                      </h3>
                      <p className="font-comic text-lg font-bold text-gray-700 leading-snug">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/*  DESKTOP */}
        <div className="hidden md:grid grid-cols-3 gap-12 max-w-5xl mx-auto">
          {howItWorksData.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.3, type: "spring" }}
              className="relative flex flex-col items-center"
            >
              {index < howItWorksData.steps.length - 1 && (
                <div className="absolute top-1/2 -right-12 text-6xl text-black z-10 transform -translate-y-12">
                  &rarr;
                </div>
              )}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-pop-yellow border-4 border-black rounded-full flex items-center justify-center font-bangers text-4xl text-black shadow-pop z-20 transform -rotate-12">
                {index + 1}
              </div>
              <div className="bg-white border-4 border-black shadow-pop w-full z-10 transform hover:-translate-y-1 transition-transform">
                <div className="p-4 border-b-4 border-black">{illustrations[index % illustrations.length]}</div>
                <div className="p-6 text-center">
                  <h3 className="font-bangers text-3xl text-pop-blue mb-2 uppercase">{step.title}</h3>
                  <p className="font-comic text-xl font-bold text-gray-700">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}