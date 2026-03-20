"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

export function GamificationSection() {
  const [gamificationData, setGamificationData] = useState({
    title: "Learn. Play. Achieve.",
    cards: [
      { title: "Historical Badges", description: "Buka pencapaian saat Anda menyelesaikan cerita." },
      { title: "Progress Tracking", description: "Lihat sejauh mana Anda telah menjelajahi sejarah Indonesia." },
      { title: "Leaderboard", description: "Bersaing dengan teman dan pelajar lainnya." }
    ]
  });

  const icons = ["🎖️", "📊", "🏆"];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/web_settings");
        if (res.ok) {
          const data = await res.json();
          if (data.gamification) setGamificationData(data.gamification);
        }
      } catch (err) { console.error(err); }
    };
    fetchSettings();
  }, []);

  return (
    <section id="gamification" className="relative py-24 bg-pop-blue overflow-hidden border-b-8 border-black">
      <style jsx global>{`
        .gamify-swiper .swiper-pagination-bullet {
          background: #fff !important;
          opacity: 0.5;
        }
        .gamify-swiper .swiper-pagination-bullet-active {
          background: #facc15 !important; /* Yellow pop */
          opacity: 1;
          width: 25px;
          border-radius: 4px;
        }
      `}</style>

      {/* Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)),linear-gradient(-45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1))] bg-[length:40px_40px] pointer-events-none" />
      
      <div className="container  mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <div className="absolute -inset-2 bg-black transform rotate-1 z-[-1]" />
              <h2 className="font-bangers text-2xl md:text-6xl text-pop-yellow tracking-wider px-8 py-4 uppercase shadow-pop">
                {gamificationData.title}
              </h2>
            <div className="font-comic my-2 text-lg md:text-xl font-bold text-white bg-black px-4 py-1 -mt-4 transform -rotate-2 inline-block border-2 border-white">
              GAMIFIKASI
            </div>
          </motion.div>
        </div>

        {/* MOBILE*/}
        <div className="md:hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            className="gamify-swiper !pb-14"
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
          >
            {gamificationData.cards.map((feature, index) => (
              <SwiperSlide key={index}>
                <div className={`bg-white border-4 border-black p-8 relative shadow-pop text-center h-full ${
                  index % 2 === 0 ? "transform -rotate-1" : "transform rotate-1"
                }`}>
                  <div className="w-16 h-16 mx-auto bg-pop-red border-4 border-black rounded-lg flex items-center justify-center text-3xl mb-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                    {icons[index % icons.length]}
                  </div>
                  <h3 className="font-bangers text-2xl text-black mb-2 uppercase">
                    {feature.title}
                  </h3>
                  <p className="font-comic text-md font-bold text-gray-700 leading-tight border-t-2 border-black pt-3 border-dashed">
                    {feature.description}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:flex gap-8 justify-center items-stretch max-w-5xl mx-auto">
          {gamificationData.cards.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
              className={`flex-1 bg-white border-4 border-black p-8 relative shadow-pop text-center group hover:-translate-y-2 transition-transform ${
                index % 2 === 0 ? "transform -rotate-1" : "transform rotate-1"
              }`}
            >
              <div className="w-20 h-20 mx-auto bg-pop-red border-4 border-black rounded-lg flex items-center justify-center text-4xl mb-6 shadow-[4px_4px_0_0_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform">
                {icons[index % icons.length]}
              </div>
              <h3 className="font-bangers text-3xl text-black mb-3 uppercase">
                {feature.title}
              </h3>
              <p className="font-comic text-lg font-bold text-gray-700 leading-tight border-t-4 border-black pt-3 border-dashed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="hidden sm:block absolute top-20 right-20 font-bangers text-6xl text-white opacity-20 transform rotate-45 select-none pointer-events-none">
        DING!
      </div>
      <div className="hidden sm:block absolute bottom-20 left-20 font-bangers text-5xl text-white opacity-20 transform -rotate-12 select-none pointer-events-none">
        NAIK LEVEL!
      </div>
    </section>
  );
}