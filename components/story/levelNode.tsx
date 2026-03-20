"use client";
import React from "react";
import { motion } from "framer-motion";
import { Lock, Check, Star } from "lucide-react";
import Link from "next/link";

interface Mission {
  id: string;
  title: string;
  unlocked: boolean;
  completed: boolean;
}

export default function LevelNode({ mission, index, color, onClick }: { mission: Mission, index: number, color: string, onClick?: () => void }) {
  const xOffsets = [-60, -100, -60, 0, 60, 100, 60, 0];
  const currentX = xOffsets[index % xOffsets.length];

  const statusStyle = mission.completed
    ? "bg-green-500 border-black text-white shadow-[0_10px_0_#000]"
    : mission.unlocked
    ? `${color} border-black text-white shadow-[0_10px_0_#000] active:translate-y-2 active:shadow-none`
    : "bg-gray-300 border-gray-500 text-gray-400 cursor-not-allowed shadow-[0_6px_0_#666]";

  return (
    <div className="flex justify-center w-full my-12 relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        style={{ x: currentX }}
        className="relative flex items-center justify-center"
      >
        {mission.unlocked && !mission.completed && (
          <div className="absolute w-[120%] h-[120%] pointer-events-none z-0">
             <div className="w-full h-full rounded-full border-[6px] border-dashed border-black/30 animate-[spin_15s_linear_infinity]" />
          </div>
        )}

        <button
          onClick={() => {
             if (mission.unlocked && onClick) onClick();
          }}
          className={`
            relative z-10 w-24 h-24 rounded-full border-[5px] flex items-center justify-center 
            transition-all transform group hover:scale-110 active:scale-95 outline-none
            ${statusStyle}
          `}
        >
          {mission.completed ? (
            <Check size={48} strokeWidth={4} className="drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]" />
          ) : !mission.unlocked ? (
            <Lock size={32} />
          ) : (
            <Star size={42} fill="currentColor" strokeWidth={2.5} className="drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]" />
          )}

          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-y-2 group-hover:translate-y-0 z-50">
            <div className="bg-black text-white font-black text-[10px] px-4 py-2 rounded-lg border-2 border-white shadow-[5px_5px_0_#000] uppercase italic whitespace-nowrap relative">
              {mission.title}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-black" />
            </div>
          </div>
        </button>
      </motion.div>
    </div>
  );
}