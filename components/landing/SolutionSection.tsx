"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";

// ✅ Import Swiper dan Modulnya
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

export function SolutionSection() {
  const [solutionData, setSolutionData] = useState({
    title: "A New Way to Experience History",
    cards: [
      { title: "Interactive Storytelling", description: "Experience history like a visual novel where you choose the path." },
      { title: "Branching Decisions", description: "Your choices influence how historical events unfold." },
      { title: "Gamified Learning", description: "Unlock badges and achievements while exploring history." }
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
    <section className="relative py-24 bg-pop-yellow overflow-hidden border-b-8 border-black">
      <style jsx global>{`
        .solution-swiper .swiper-pagination-bullet {
          background: #000 !important;
          opacity: 0.3;
          width: 12px;
          height: 12px;
          border: 2px solid #000;
        }
        .solution-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #3B82F6 !important; /* Warna Biru Pop */
          width: 24px;
          border-radius: 6px;
        }
      `}</style>

      {/* Halftone background */}
      <div className="absolute inset-0 bg-halftone opacity-20 bg-[length:24px_24px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* TITLE */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <div className="absolute -inset-4 bg-white transform rotate-2 border-4 border-black shadow-pop z-[-1]" />
            <h2 className="font-bangers text-2xl md:text-7xl text-pop-red tracking-wider  py-4 uppercase leading-tight ">
              {solutionData.title}
            </h2>
            <div className="absolute -top-17 -left-4 w-14 h-14 md:w-16 md:h-16 bg-pop-blue border-4 border-black shadow-pop flex items-center justify-center font-bangers text-3xl text-white transform -rotate-12">
              !
            </div>
          </motion.div>
        </div>

        {/*MOBILE*/}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            className="solution-swiper !pb-16"
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            speed={800}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            style={{ overflow: 'visible' }} 
          >
            {solutionData.cards.map((solution, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 relative flex flex-col items-center text-center mx-2 min-h-[320px] justify-center">
                  <div className="w-20 h-20 bg-pop-blue border-4 border-black rounded-full flex items-center justify-center text-4xl mb-6 shadow-pop">
                    {icons[index % icons.length]}
                  </div>
                  <h3 className="font-bangers text-2xl text-black mb-4 uppercase tracking-wide decoration-pop-red underline decoration-4 underline-offset-4">
                    {solution.title}
                  </h3>
                  <p className="font-comic text-lg font-bold text-gray-700 leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/*  DESKTOP */}
        <div className="hidden md:flex flex-row gap-8 justify-center items-stretch max-w-6xl mx-auto">
          {solutionData.cards.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 150 }}
              className="flex-1 bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] p-8 relative flex flex-col items-center text-center transform hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all"
            >
              <div className="w-24 h-24 bg-pop-blue border-4 border-black rounded-full flex items-center justify-center text-5xl mb-6 shadow-pop">
                {icons[index % icons.length]}
              </div>
              <h3 className="font-bangers text-3xl text-black mb-4 uppercase tracking-wide decoration-pop-red underline decoration-4 underline-offset-4">
                {solution.title}
              </h3>
              <p className="font-comic text-xl font-bold text-gray-700 leading-relaxed">
                {solution.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute right-10 top-1/2 font-bangers text-5xl text-black opacity-10 transform rotate-12 select-none pointer-events-none hidden md:block">
        BOOM!
      </div>
      <div className="absolute left-10 bottom-20 font-bangers text-4xl text-black opacity-10 transform -rotate-12 select-none pointer-events-none hidden md:block">
        POW!
      </div>
    </section>
  );
}