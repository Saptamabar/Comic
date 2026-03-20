"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";

// ✅ CSS Wajib
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";

export function ProblemSection() {
  const [problemData, setProblemData] = useState({
    title: "Mengapa Sejarah Terasa Membosankan",
    cards: [
      { title: "Terlalu Banyak Teks", description: "Buku sejarah tradisional terasa berat dan sulit dinikmati." },
      { title: "Belajar Pasif", description: "Siswa hanya membaca dan menghafal tanpa interaksi." },
      { title: "Tanpa Koneksi Emosional", description: "Peristiwa sejarah terasa jauh dan sulit dihubungkan." }
    ]
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.problem) setProblemData(data.problem);
      }
    });
    return () => unsub();
  }, []);

  const icons = ["📚", "😴", "❌"];

  return (
    <section className="relative py-20 bg-white overflow-hidden border-b-8 border-black">
      {/* 💡 CSS Khusus Dots Swiper agar terlihat jelas & bergaya Comic */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #000 !important;
          opacity: 0.3;
          border: 2px solid #000;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: #FFDE00 !important; /* Warna Kuning Pop */
          width: 16px;
          border-radius: 5px;
        }
        .swiper-pagination {
          bottom: 0px !important;
        }
      `}</style>

      <div className="absolute inset-0 bg-pop-blue opacity-10 bg-halftone bg-[length:16px_16px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="inline-block font-bangers text-2xl md:text-5xl text-white tracking-wider px-8 py-4 bg-pop-blue border-4 border-black shadow-pop transform -rotate-1">
            {problemData.title}
          </h2>
        </div>

        {/* 📱 MOBILE → SWIPER */}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={50}
            slidesPerView={1}
            loop={true}
            centeredSlides={true}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: false, 
            }}
            className="!px-6 !pt-12 !pb-12" 
            style={{ overflow: 'visible' }} 
          >
            {problemData.cards.map((problem, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div
                  className={`bg-white border-4 border-black p-8 shadow-pop relative min-h-[250px] flex flex-col justify-center mx-1 ${
                    index % 2 === 0 ? "rotate-1" : "-rotate-1"
                  }`}
                >
                  <div className="absolute -top-6 -left-6 w-14 h-14 bg-pop-yellow border-4 border-black rounded-full flex items-center justify-center text-2xl shadow-pop z-30">
                    {icons[index % icons.length]}
                  </div>

                  <h3 className="font-bangers text-2xl text-pop-red mb-3 uppercase leading-none">
                    {problem.title}
                  </h3>

                  <p className="font-comic text-lg font-bold text-gray-800 leading-tight">
                    {problem.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-10 max-w-6xl mx-auto mt-10">
          {problemData.cards.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`bg-white border-4 border-black p-8 shadow-pop relative ${
                index % 2 === 0 ? "rotate-1" : "-rotate-1"
              }`}
            >
              <div className="absolute -top-7 -left-7 w-16 h-16 bg-pop-yellow border-4 border-black rounded-full flex items-center justify-center text-3xl shadow-pop z-10">
                {icons[index % icons.length]}
              </div>
              <h3 className="font-bangers text-3xl text-pop-red mb-4 uppercase">{problem.title}</h3>
              <p className="font-comic text-xl font-bold text-gray-800 leading-snug">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}