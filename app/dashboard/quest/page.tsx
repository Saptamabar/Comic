"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, Zap, Star, Search, Shield, RotateCcw, Volume2, VolumeX, BookOpen, Award, Loader2 } from "lucide-react";
import Image from "next/image";
import useSound from 'use-sound';
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp, 
  query, 
  where 
} from "firebase/firestore";

/* ─────────────────────────────────────────────
    INTERFACES
───────────────────────────────────────────── */
interface Quest {
  id: string;
  title: string;
  options: string[];
  correct: number;
  points: number;
  timeLimit: number;
  evidence: string | null;
}

interface MissionData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  type?: string; 
  scenes: Record<string, {
    id: string;
    dialogue: string;
    duration?: number;
    evidenceText?: string;
    choices: Array<{
      text: string;
      isCorrect: boolean;
      scoreDelta: number;
    }>;
  }>;
}

export default function QuestModePage() {
  const [phase, setPhase] = useState<"lobby" | "briefing" | "playing" | "result">("lobby");
  const [questData, setQuestData] = useState<Quest[]>([]);
  const [missionInfo, setMissionInfo] = useState<MissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOutOfMissions, setIsOutOfMissions] = useState(false);
  
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [playBgm, { stop: stopBgm }] = useSound("/assets/audio/bgm/bgs.mpeg", { volume: 0.2, loop: true, soundEnabled: !isMuted });
  const [playClick] = useSound("/assets/audio/sfx/click.mp3", { volume: 0.5, soundEnabled: !isMuted });

  const DEFAULT_BG = "/assets/backgrounds/bgq.png";

  useEffect(() => {
    const fetchNextQuest = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);
          const completedSnap = await getDocs(collection(db, "users", user.uid, "completedMissions"));
          const completedIds = completedSnap.docs.map(d => d.id);

          const q = query(collection(db, "missions"), where("type", "==", "challenge"));
          const challengeMissionsSnap = await getDocs(q);
          
          if (challengeMissionsSnap.empty) {
            setIsOutOfMissions(true);
            return;
          }

          const allChallenges = challengeMissionsSnap.docs.map(d => ({ 
            id: d.id, 
            ...d.data() 
          } as MissionData));

          const available = allChallenges.filter(m => !completedIds.includes(m.id));
          let target = available.length > 0 ? available[0] : allChallenges[Math.floor(Math.random() * allChallenges.length)];

          if (target) {
            setMissionInfo(target);
            const mappedQuests: Quest[] = Object.values(target.scenes || {}).map((s) => ({
              id: s.id,
              title: s.dialogue,
              options: s.choices.map((c) => c.text),
              correct: s.choices.findIndex((c) => c.isCorrect),
              points: s.choices.find((c) => c.isCorrect)?.scoreDelta || 100,
              timeLimit: s.duration || 10,
              evidence: s.evidenceText || null,
            }));
            setQuestData(mappedQuests);
            setIsOutOfMissions(false);
          }
        } catch (err) {
          console.error("Fetch Error:", err);
          setIsOutOfMissions(true);
        } finally {
          setIsLoading(false);
        }
      });
      return () => unsubscribe();
    };
    fetchNextQuest();
  }, []);

  const question = questData[currentQ];

  useEffect(() => {
    if (phase === "playing") playBgm();
    return () => stopBgm();
  }, [phase, playBgm, stopBgm]);

  useEffect(() => {
    if (phase !== "playing" || showFeedback || !question) return;
    setTimeLeft(question.timeLimit);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleAnswer(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, currentQ, showFeedback, question]);

  const saveFinalResult = async (finalScore: number) => {
    const user = auth.currentUser;
    if (!user || !missionInfo) return;

    try {
      await setDoc(doc(db, "users", user.uid, "completedMissions", missionInfo.id), {
        missionId: missionInfo.id,
        score: finalScore,
        completedAt: serverTimestamp(),
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        score: increment(finalScore),
        exp: increment(50),
        lastActive: serverTimestamp()
      });
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  const handleAnswer = (idx: number) => {
    if (!question) return;
    clearInterval(timerRef.current!);
    playClick();
    setSelected(idx);
    setShowFeedback(true);
    
    let currentNewScore = score;
    if (idx === question.correct) {
      const bonus = Math.floor((timeLeft / question.timeLimit) * question.points);
      currentNewScore = score + question.points + bonus;
      setScore(currentNewScore);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      if (currentQ + 1 >= questData.length) {
        setPhase("result");
        saveFinalResult(currentNewScore);
      } else {
        setCurrentQ((q) => q + 1);
      }
    }, 1200);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black relative overflow-hidden font-sans select-none">
      
      {/* --- DYNAMIC BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={missionInfo?.thumbnail || DEFAULT_BG} 
          alt="BG" 
          fill 
          className="object-cover opacity-90 brightness-[0.7] transition-all duration-700" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      </div>

      <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-1" 
           style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="w-full max-w-2xl relative z-10 px-4 h-full flex flex-col justify-center">
        
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
             <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
             <p className="font-bangers text-2xl text-white italic tracking-widest uppercase">MEMUAT QUEST...</p>
          </div>
        ) : isOutOfMissions ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0_#000] text-center">
             <div className="bg-red-500 w-20 h-20 flex items-center justify-center mx-auto mb-4 border-4 border-black shadow-[4px_4px_0_#000]">
                <Search size={40} className="text-white" />
             </div>
             <h2 className="font-bangers text-4xl text-black mb-2 uppercase italic leading-none">TIDAK ADA CHALLENGE</h2>
             <button onClick={() => window.history.back()} className="bg-black text-white font-bangers text-2xl px-10 py-4 border-2 border-black shadow-[4px_4px_0_#ef4444] active:translate-y-1 transition-all uppercase">
               KEMBALI KE MARKAS
             </button>
          </motion.div>
        ) : (
          <>
            <header className="mb-4 flex flex-col items-center shrink-0">
              <motion.h1 initial={{ y: -10 }} animate={{ y: 0 }} className="font-bangers text-4xl sm:text-6xl text-yellow-400 drop-shadow-[4px_4px_0_#000] uppercase italic text-center">
                ⚔️ Quest Mode
              </motion.h1>
              <div className="bg-red-600 text-white px-3 py-0.5 -rotate-1 font-bold italic shadow-[2px_2px_0_#000] text-[10px] sm:text-xs uppercase mt-2">
                Mission: {missionInfo?.title}
              </div>
            </header>

            {phase === "lobby" && (
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-[3px] border-black p-5 shadow-[8px_8px_0_#000] space-y-5">
                <div className="text-center">
                  <h2 className="font-bangers text-2xl text-red-600 italic uppercase">READY, DETECTIVE?</h2>
                  <p className="font-bold text-xs text-slate-600 uppercase tracking-wider">Tuntaskan Tantangan Ini!</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[{ icon: <Zap size={16}/>, color: "bg-yellow-400", label: "SPEED" }, { icon: <Star size={16}/>, color: "bg-blue-500", label: "ACCURACY", text: "text-white" }, { icon: <Search size={16}/>, color: "bg-red-500", label: "EVIDENCE", text: "text-white" }].map((item, i) => (
                    <div key={i} className={`${item.color} border-2 border-black p-2 flex flex-col items-center shadow-[2px_2px_0_#000]`}>
                      <div className={item.text || "text-black"}>{item.icon}</div>
                      <p className={`font-bangers text-[9px] mt-1 ${item.text || "text-black"}`}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPhase("briefing")} className="w-full bg-red-600 text-white font-bangers text-2xl uppercase py-4 border-[3px] border-black shadow-[4px_4px_0_#000] active:translate-y-1 transition-all">
                  MULAI QUEST!
                </button>
              </motion.div>
            )}

            {phase === "briefing" && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white border-[4px] border-black shadow-[10px_10px_0_#000] flex flex-col">
                  <div className="relative h-40 bg-black overflow-hidden">
                    <Image src={missionInfo?.thumbnail || DEFAULT_BG} alt="Thumb" fill className="object-cover opacity-90 brightness-[0.8]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4"><h2 className="text-yellow-400 font-bangers text-3xl italic uppercase drop-shadow-[2px_2px_0_#000]">{missionInfo?.title}</h2></div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex gap-4">
                        <div className="bg-indigo-600 p-2 border-2 border-black text-white shrink-0 h-fit shadow-[2px_2px_0_#000]"><BookOpen size={20}/></div>
                        <p className="font-bold text-xs text-slate-700 leading-relaxed italic">&ldquo;{missionInfo?.description}&rdquo;</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="border-2 border-black p-2 bg-yellow-400 shadow-[3px_3px_0_#000]">
                          <p className="text-[8px] font-black uppercase text-black">Reward</p>
                          <p className="font-bangers text-lg flex items-center gap-1 text-black"><Award size={14}/> +50 EXP</p>
                        </div>
                        <div className="border-2 border-black p-2 bg-slate-100 shadow-[3px_3px_0_#000]">
                          <p className="text-[8px] font-black uppercase text-black">Scenes</p>
                          <p className="font-bangers text-lg italic text-black">{questData.length} TOTAL</p>
                        </div>
                    </div>
                    <button onClick={() => setPhase("playing")} className="w-full bg-black text-white font-bangers text-2xl py-3 border-2 border-black hover:bg-red-600 transition-colors shadow-[4px_4px_0_#000] uppercase italic">
                      Luncurkan Misi
                    </button>
                  </div>
              </motion.div>
            )}

            {phase === "playing" && question && (
              <div className="space-y-4">
                <div className="flex justify-between items-center shrink-0">
                  <div className="bg-black text-white px-3 py-1.5 border-2 border-black shadow-[3px_3px_0_#ef4444] -rotate-1 flex items-center gap-2">
                    <Timer size={16} className="text-yellow-400" />
                    <span className={`font-bangers text-xl ${timeLeft <= 3 ? "text-red-500 animate-pulse" : ""}`}>{timeLeft}s</span>
                  </div>
                  <div className="bg-yellow-400 px-3 py-1.5 border-2 border-black shadow-[3px_3px_0_#000] rotate-1 font-bangers text-xl text-black">SCORE: {score}</div>
                </div>
                <div className="h-3 border-2 border-black bg-white/30 backdrop-blur-sm shadow-[2px_2px_0_#000] shrink-0">
                  <motion.div key={currentQ} initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: question.timeLimit, ease: "linear" }} className={`h-full ${timeLeft <= 3 ? "bg-red-600" : "bg-red-500"}`} />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={currentQ} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white/95 backdrop-blur-md border-[3px] border-black p-4 sm:p-6 shadow-[10px_10px_0_#000] relative">
                    {question.evidence && (
                      <div className="absolute -top-3 left-4 bg-purple-600 text-white border-2 border-black px-2 py-0.5 font-bangers text-[10px] flex items-center gap-1 shadow-md rotate-[-2deg]"><Shield size={12} /> {question.evidence}</div>
                    )}
                    <p className="font-bold text-red-600 text-[10px] uppercase mb-1 italic">SCENE #{currentQ + 1}</p>
                    <h2 className="font-bangers text-xl sm:text-3xl text-black leading-tight mb-4 italic uppercase">
                      &#34;{question.title}&#34;
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {question.options.map((opt, idx) => {
                        let btnStyle = "bg-white border-black text-black hover:bg-yellow-50 shadow-[4px_4px_0_#000]";
                        if (showFeedback) {
                          if (idx === question.correct) btnStyle = "bg-green-500 text-white shadow-none translate-y-1 border-black";
                          else if (idx === selected) btnStyle = "bg-red-500 text-white shadow-none animate-shake translate-y-1 border-black";
                          else btnStyle = "bg-slate-100 text-slate-400 border-slate-200 shadow-none opacity-40";
                        }
                        return (
                          <button key={idx} disabled={showFeedback} onClick={() => handleAnswer(idx)} className={`font-bold text-xs sm:text-sm p-3 border-2 transition-all text-left flex items-center gap-3 ${btnStyle}`}>
                            <span className="bg-black text-white w-6 h-6 flex items-center justify-center font-bangers text-sm shrink-0">{String.fromCharCode(65 + idx)}</span> {opt}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {phase === "result" && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-yellow-400 border-[4px] border-black p-8 shadow-[12px_12px_0_#000] text-center">
                <h2 className="font-bangers text-4xl text-black mb-1 uppercase italic drop-shadow-md leading-none">QUEST CLEAR!</h2>
                <div className="bg-white border-2 border-black p-5 inline-block my-4 shadow-[6px_6px_0_#000] transform -rotate-2">
                  <p className="font-bold text-[10px] uppercase text-slate-500 mb-1">TOTAL SKOR QUEST</p>
                  <p className="font-bangers text-7xl text-black leading-none">{score}</p>
                </div>
                <div className="mt-2 mb-6 bg-black text-white py-2 px-4 inline-block font-bangers text-lg italic uppercase shadow-[4px_4px_0_#ef4444]">Reward: +{score} Pts & +50 EXP</div>
                <div className="mt-6">
                  <button onClick={() => window.location.reload()} className="bg-black text-white font-bangers text-2xl uppercase px-10 py-4 border-2 border-black shadow-[4px_4px_0_#ef4444] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto">
                    <RotateCcw size={24} /> NEXT CHALLENGE
                  </button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* MUTE TOGGLE - POSISI DIATASKAN (bottom-24) */}
      <button 
        onClick={() => setIsMuted(!isMuted)} 
        className="fixed bottom-24 right-6 bg-white border-2 border-black p-3 shadow-[4px_4px_0_#000] z-[100] hover:bg-yellow-400 active:translate-y-1 transition-all"
      >
        {isMuted ? <VolumeX size={20} className="text-black" /> : <Volume2 size={20} className="text-black" />}
      </button>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.1s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}