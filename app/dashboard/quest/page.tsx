"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Zap, Star, Search, Shield, CheckCircle } from "lucide-react";

const questData = [
  {
    id: "q1",
    title: "Siapa Proklamator Kemerdekaan Indonesia?",
    options: ["Soekarno & Hatta", "Soeharto & Hamid", "Tan Malaka & Soekarno", "M. Yamin & Sjahrir"],
    correct: 0,
    points: 100,
    timeLimit: 10,
    evidence: null,
  },
  {
    id: "q2",
    title: "Teks proklamasi pertama kali diketik oleh...?",
    options: ["Sayuti Melik", "Ahmad Subardjo", "Hatta", "Ki Hajar Dewantara"],
    correct: 0,
    points: 150,
    timeLimit: 12,
    evidence: "📜 Naskah Proklamasi Asli",
  },
  {
    id: "q3",
    title: "Di mana peristiwa Rengasdengklok berlangsung?",
    options: ["Karawang, Jawa Barat", "Bogor, Jawa Barat", "Bandung, Jawa Barat", "Bekasi, Jawa Barat"],
    correct: 0,
    points: 120,
    timeLimit: 8,
    evidence: null,
  },
];

export default function QuestModePage() {
  const [phase, setPhase] = useState<"lobby" | "playing" | "result">("lobby");
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const question = questData[currentQ];

  useEffect(() => {
    if (phase !== "playing" || showFeedback) return;
    setTimeLeft(question.timeLimit);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleAnswer(-1); // time out
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, currentQ, showFeedback]);

  const handleAnswer = (idx: number) => {
    clearInterval(timerRef.current!);
    setSelected(idx);
    setShowFeedback(true);
    if (idx === question.correct) {
      const bonus = Math.floor((timeLeft / question.timeLimit) * question.points);
      setScore((s) => s + question.points + bonus);
    }
    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      if (currentQ + 1 >= questData.length) {
        setPhase("result");
      } else {
        setCurrentQ((q) => q + 1);
      }
    }, 1800);
  };

  const restart = () => {
    setPhase("lobby");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowFeedback(false);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="font-bangers text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">⚔️ QUEST MODE</h1>
        <p className="font-comic font-bold text-gray-500 mt-2">Tantangan sejarah berhadiah! Jawab cepat, raih poin bonus!</p>
      </div>

      {/* LOBBY */}
      {phase === "lobby" && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_#000] text-center space-y-6"
        >
          <div className="text-6xl">🏆</div>
          <h2 className="font-bangers text-4xl">Quest: Kemerdekaan Indonesia</h2>
          <p className="font-comic font-bold text-gray-600">{questData.length} pertanyaan · Batas waktu per soal · Poin bonus kecepatan!</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-pop-yellow border-4 border-black p-3">
              <Zap size={24} className="mx-auto mb-1" />
              <p className="font-bangers text-xl">CEPAT</p>
              <p className="font-comic text-xs font-bold">Bonus Poin Waktu</p>
            </div>
            <div className="bg-pop-blue border-4 border-black p-3">
              <Star size={24} className="mx-auto mb-1 text-white" />
              <p className="font-bangers text-xl text-white">AKURAT</p>
              <p className="font-comic text-xs font-bold text-white">Jawaban Benar</p>
            </div>
            <div className="bg-pop-red border-4 border-black p-3">
              <Search size={24} className="mx-auto mb-1 text-white" />
              <p className="font-bangers text-xl text-white">TEMUKAN</p>
              <p className="font-comic text-xs font-bold text-white">Barang Bukti</p>
            </div>
          </div>
          <button
            onClick={() => setPhase("playing")}
            className="bg-pop-red text-white font-bangers text-3xl uppercase px-10 py-4 border-4 border-black shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] transition-all"
          >
            MULAI QUEST!
          </button>
        </motion.div>
      )}

      {/* PLAYING */}
      {phase === "playing" && (
        <motion.div key={currentQ} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="space-y-4"
        >
          {/* Timer & Score */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 bg-black text-white font-bangers text-2xl px-4 py-2 border-4 border-black">
              <Timer size={24} />
              <span className={timeLeft <= 3 ? "text-red-400 animate-pulse" : "text-pop-yellow"}>{timeLeft}s</span>
            </div>
            <div className="font-bangers text-2xl bg-pop-yellow border-4 border-black px-4 py-2">
              POIN: {score}
            </div>
          </div>

          {/* Timer Bar */}
          <div className="h-4 border-4 border-black bg-gray-200">
            <motion.div
              key={currentQ}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: question.timeLimit, ease: "linear" }}
              className="h-full bg-pop-red"
            />
          </div>

          {/* Evidence Badge */}
          {question.evidence && (
            <div className="flex items-center gap-2 bg-purple-100 border-4 border-purple-500 p-3">
              <Shield size={20} className="text-purple-500" />
              <span className="font-comic font-bold text-purple-700">Barang Bukti Ditemukan: {question.evidence}</span>
            </div>
          )}

          {/* Question */}
          <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000]">
            <p className="font-comic text-sm font-bold text-gray-500 mb-2">Soal {currentQ + 1} / {questData.length}</p>
            <h2 className="font-bangers text-3xl text-black leading-tight">{question.title}</h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              let style = "bg-white text-black border-black hover:bg-pop-yellow hover:shadow-[4px_4px_0_#000]";
              if (showFeedback) {
                if (idx === question.correct) style = "bg-green-400 border-green-700 text-white";
                else if (idx === selected) style = "bg-red-400 border-red-700 text-white";
                else style = "bg-white text-gray-300 border-gray-300 opacity-60";
              }
              return (
                <button
                  key={idx}
                  disabled={showFeedback}
                  onClick={() => handleAnswer(idx)}
                  className={`font-comic font-bold text-lg p-4 border-4 transition-all text-left ${style}`}
                >
                  <span className="font-bangers text-2xl mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* RESULT */}
      {phase === "result" && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="bg-white border-4 border-black p-10 shadow-[10px_10px_0_#000] text-center space-y-6"
        >
          <div className="text-7xl">🎉</div>
          <h2 className="font-bangers text-5xl text-pop-red">QUEST SELESAI!</h2>
          <div className="bg-pop-yellow border-4 border-black p-6 inline-block">
            <p className="font-comic font-bold text-sm uppercase">Total Poin Diraih</p>
            <p className="font-bangers text-6xl text-black">{score}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={restart} className="bg-pop-blue text-white font-bangers text-2xl uppercase px-8 py-3 border-4 border-black shadow-[4px_4px_0_#000] hover:-translate-y-1 transition-all">
              MAIN LAGI
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
