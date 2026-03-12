"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ComicButton } from "@/components/ui/ComicButton";
import { useUiSound } from "@/hooks/useUiSound";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface StoryPreviewSectionProps {
  onPlayClick: () => void;
}

export function StoryPreviewSection({ onPlayClick }: StoryPreviewSectionProps) {
  const { playClick, playHover } = useUiSound();

  const [storyData, setStoryData] = useState({
    title: "Explore Indonesian History",
    modules: [
      {
        title: "Proklamasi & Revolusi 1945",
        subtitle: "Diculik untuk Merdeka",
        description: "Kamu adalah seorang pemuda pejuang yang harus meyakinkan Bung Karno dan Bung Hatta di tengah ketegangan antara Golongan Tua dan Muda. Akankah kamu berhasil membawa mereka ke Rengasdengklok tepat waktu sebelum tentara Jepang menyadari rencanamu?",
        goal: "Mengamankan teks Proklamasi dari pengaruh asing.",
        characters: "Soekarno, Hatta, Wikana",
        bgColor: "bg-pop-red",
      },
      {
        title: "Pertahanan Kedaulatan",
        subtitle: "Garis Depan Tanpa Takut",
        description: "Menghadapi Sekutu dengan persenjataan terbatas. Sebagai asisten strategi Jenderal Sudirman, kamu harus memutuskan kapan waktu yang tepat untuk melancarkan serangan 'Supit Urang'. Satu keputusan salah, benteng pertahanan kita akan runtuh!",
        goal: "Memukul mundur pasukan Sekutu dari tanah Jawa Tengah.",
        characters: "Kolonel Sudirman, Isdiman",
        bgColor: "bg-pop-blue",
      },
      {
        title: "Orde Lama - KAA",
        subtitle: "Panggung Dunia di Asia Afrika",
        description: "Menjadi bagian dari panitia konferensi internasional pertama di Indonesia. Kamu harus menyeimbangkan diplomasi antar negara-negara Asia-Afrika yang baru merdeka di tengah tarikan Perang Dingin. Bisakah kamu menjaga marwah Indonesia di mata dunia?",
        goal: "Menghasilkan Dasasila Bandung yang legendaris.",
        characters: "Ali Sastroamidjojo, Nehru, Zhou Enlai",
        bgColor: "bg-pop-yellow",
      },
      {
        title: "Orde Baru ke Reformasi (1998)",
        subtitle: "Mei yang Mengubah Segalanya",
        description: "Di tengah hiruk-pikuk tuntutan perubahan di Jakarta, kamu berperan sebagai jurnalis kampus yang harus mendokumentasikan kebenaran. Pilihanmu: tetap diam demi keamanan atau menyebarkan semangat perubahan melalui selebaran rahasia?",
        goal: "Mengawal transisi demokrasi menuju Indonesia baru.",
        characters: "Mahasiswa, Tokoh Reformasi",
        bgColor: "bg-green-500",
      }
    ]
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "web_settings", "homepage"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.stories) setStoryData(data.stories);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="explore-stories" className="relative py-24 bg-gray-100 overflow-hidden border-b-8 border-black">
      {/* Background Dots */}
      <div className="absolute inset-0 bg-halftone opacity-10 bg-[length:16px_16px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block relative"
          >
            <div className="absolute -inset-2 bg-black transform -rotate-2 z-[-1]" />
            <h2 className="font-bangers text-5xl md:text-7xl text-white tracking-wider px-8 py-4 uppercase shadow-pop">
              {storyData.title}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {storyData.modules.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[12px_12px_0_0_rgba(0,0,0,1)] transition-all flex flex-col"
            >
              {/* Comic Banner/Header */}
              <div className={`${story.bgColor} border-b-4 border-black p-4 relative`}>
                <div className="absolute inset-0 bg-white opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]" />
                <h3 className="font-bangers text-3xl md:text-4xl text-white uppercase relative z-10 drop-shadow-[2px_2px_0_#000]">
                  {story.title}
                </h3>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="inline-block bg-black text-white font-bangers px-3 py-1 mb-4 text-xl transform -rotate-2 self-start">
                  "{story.subtitle}"
                </div>
                
                <p className="font-comic text-gray-800 text-lg mb-6 leading-relaxed flex-1">
                  {story.description}
                </p>

                <div className="bg-gray-100 border-2 border-black p-4 mb-6 relative">
                  <div className="absolute -left-2 -top-2 w-4 h-4 bg-pop-yellow border-2 border-black rounded-full" />
                  <p className="font-comic text-sm">
                    <span className="font-bold text-pop-red uppercase">Tujuan:</span> {story.goal}
                  </p>
                  <p className="font-comic text-sm mt-2">
                    <span className="font-bold text-pop-blue uppercase">Tokoh Utama:</span> {story.characters}
                  </p>
                </div>

                <div className="text-center mt-auto">
                  <ComicButton 
                    variant="primary" 
                    className="w-full text-xl py-3"
                    onClick={() => {
                      playClick();
                      onPlayClick();
                    }}
                    onMouseEnter={() => playHover()}
                  >
                    Play Story &rarr;
                  </ComicButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
