"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Star, ArrowRight, Trophy, Loader2, 
  AlertCircle, CheckCircle2, XCircle, 
  Volume2, VolumeX, X 
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSound from 'use-sound';

/* ─────────────────────────────────────────────
    TYPES & INTERFACES
───────────────────────────────────────────── */
interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  scoreDelta: number;
  isCorrect: boolean;
  feedback?: string;      
  feedbackStyle?: "pop" | "subtle" | "none";
}

interface Scene {
  id: string;
  dialogue: string;
  explanation?: string;
  characterName: string;
  characterImage?: string;
  backgroundImage?: string;
  backgroundClass?: string;
  choices: Choice[];
  duration: string | null;
}

/* ─────────────────────────────────────────────
    SUB-COMPONENTS
───────────────────────────────────────────── */

const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div className="fixed top-0 left-0 w-full z-[60] p-3 sm:p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3">
        <div className="bg-[#3e2723] text-yellow-400 px-2 py-0.5 text-[10px] sm:text-xs font-black uppercase italic border-2 border-[#3e2723] rotate-[-1deg] shadow-[2px_2px_0_#ef4444] font-serif whitespace-nowrap">
          MISSION
        </div>
        <div className="flex-1 h-3 bg-[#fcf8ef] border-2 border-[#3e2723] shadow-[2px_2px_0_#3e2723] overflow-hidden relative">
          <div 
            className="h-full bg-red-600 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="bg-yellow-400 border-2 border-[#3e2723] px-1.5 py-0.5 text-[10px] sm:text-xs font-black italic shadow-[2px_2px_0_#3e2723]">
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  );
};

const HalftoneBg = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] z-0" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
        <circle cx="7" cy="7" r="2" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

/* ─────────────────────────────────────────────
    MAIN COMPONENT
───────────────────────────────────────────── */
export default function GamePlayPage() {
  const params = useParams();
  const missionId = params.id as string;
  
  // --- AUDIO STATES & HOOKS ---
  const [isMuted, setIsMuted] = useState(false);
  const [playBgm, { stop: stopBgm }] = useSound('/assets/audio/bgm/bgs.mpeg', { 
    volume: 0.3, 
    loop: true,
    soundEnabled: !isMuted 
  });
  const [playClick] = useSound('/assets/audio/sfx/click.mp3', { 
    volume: 0.5, 
    soundEnabled: !isMuted 
  });

  useEffect(() => {
    playBgm();
    return () => stopBgm();
  }, [playBgm, stopBgm]);

  // --- GAME STATES ---
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [scenes, setScenes] = useState<Record<string, Scene>>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [choiceAnim, setChoiceAnim] = useState<number | null>(null);
  const [feedbackData, setFeedbackData] = useState<{ 
    text: string; 
    style: "pop" | "subtle" | "none"; 
    isCorrect: boolean 
  } | null>(null);

  const [visitedScenes, setVisitedScenes] = useState<Set<string>>(new Set());

  const totalScenesCount = useMemo(() => {
    const count = Object.keys(scenes).length;
    return count > 0 ? count : 1;
  }, [scenes]);

  const currentScene = useMemo(() => 
    currentSceneId ? scenes[currentSceneId] : null
  , [currentSceneId, scenes]);

  useEffect(() => {
    if (currentSceneId) {
      setVisitedScenes(prev => new Set(prev).add(currentSceneId));
    }
  }, [currentSceneId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setUserId(user ? user.uid : null));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!missionId) return;
    const fetchMission = async () => {
      try {
        const docRef = doc(db, "missions", missionId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setScenes(data.scenes || {});
          setCurrentSceneId(data.startSceneId || Object.keys(data.scenes)[0]);
        }
      } catch (err) {
        console.error("Error loading mission:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, [missionId]);

  const handleNext = useCallback(async (choice: Choice, idx?: number) => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    playClick();

    if (idx !== undefined) setChoiceAnim(idx);

    const hasFeedback = choice.feedbackStyle && choice.feedbackStyle !== "none";
    if (hasFeedback) {
      setFeedbackData({
        text: choice.feedback || (choice.isCorrect ? "LUAR BIASA!" : "YAH, SALAH!"),
        style: choice.feedbackStyle || "pop",
        isCorrect: choice.isCorrect
      });
    }

    const delay = hasFeedback ? 1600 : 300;

    setTimeout(() => {
      setScore(prev => prev + (choice.scoreDelta || 0));
      setChoiceAnim(null);
      setFeedbackData(null);

      if (!choice.nextSceneId || choice.nextSceneId === "end") {
        setIsGameOver(true);
      } else {
        setCurrentSceneId(choice.nextSceneId);
      }
      setIsProcessing(false);
    }, delay);
  }, [isProcessing, playClick]);

  useEffect(() => {
    const canStartTimer = currentScene && !isGameOver && !isProcessing && currentScene.duration;
    if (!canStartTimer) {
      setTimeLeft(null);
      return;
    }
    const duration = parseInt(currentScene.duration!);
    if (isNaN(duration)) return;
    setTimeLeft(duration);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          if (currentScene.choices && currentScene.choices.length > 0) {
            handleNext(currentScene.choices[0]);
          }
          return null;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSceneId, isGameOver, isProcessing, currentScene, handleNext]);

  // LOGIKA UPDATE SCORE & EXP KE FIRESTORE
  useEffect(() => {
    if (isGameOver && userId && missionId) {
      const saveResult = async () => {
        try {
          // 1. Simpan Riwayat ke Sub-koleksi
          const historyRef = doc(db, "users", userId, "completedMissions", missionId);
          await setDoc(historyRef, { 
            missionId, 
            finalScore: score, 
            completedAt: serverTimestamp(), 
            status: "completed" 
          }, { merge: true });

          // 2. Akumulasi Poin & EXP ke Profil Utama User
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            score: increment(score), // Menambah skor hasil main
            exp: increment(50),      // Menambah EXP tetap +50
            lastPlayed: serverTimestamp()
          });

          console.log("Data user berhasil di-update!");
        } catch (e) { 
          console.error("Gagal simpan data:", e); 
        }
      };
      saveResult();
    }
  }, [isGameOver, userId, missionId, score]);

  if (loading) return <LoadingScreen />;
  if (isGameOver) return <GameOverScreen score={score} />;
  if (!currentScene) return <div className="h-screen bg-[#3e2723] flex items-center justify-center text-[#fcf8ef] p-6 font-bold uppercase tracking-widest">SCENE NOT FOUND</div>;

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden flex flex-col select-none font-bangers"
      style={{ 
        backgroundColor: currentScene.backgroundClass || "#1a1a2e"
      }}
    >
      <ProgressBar current={visitedScenes.size} total={totalScenesCount} />

      {currentScene.backgroundImage && (
        <div className="absolute inset-0 z-0 bg-[#3e2723]">
          <Image src={currentScene.backgroundImage} alt="bg" fill className="object-cover opacity-100" priority />
        </div>
      )}

      <HalftoneBg />

      <button onClick={() => setIsMuted(!isMuted)} className="fixed bottom-6 right-6 z-[70] bg-[#3e2723] border-4 border-[#fcf8ef] p-3 shadow-[4px_4px_0_#3e2723] text-[#fcf8ef] hover:bg-yellow-400 hover:text-[#3e2723] transition-all active:scale-90">
        {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
      </button>

      <div className="relative z-50 p-3 pt-14 sm:pt-20 flex justify-between items-start w-full max-w-6xl mx-auto pointer-events-none">
        <div className="flex gap-2 sm:gap-4 items-start pointer-events-auto">
          <Link href="/dashboard/story" className="bg-red-600 border-2 border-[#3e2723] px-2 sm:px-3 py-1 shadow-[3px_3px_0_#3e2723] flex items-center gap-1 sm:gap-2 text-[#fcf8ef] hover:-translate-y-1 transition-transform active:scale-95 font-black italic rotate-1">
            <X size={18} strokeWidth={3} className="sm:w-5 sm:h-5" /> 
            <span className="hidden sm:inline text-sm uppercase">Keluar</span>
          </Link>
          <div className="bg-yellow-400 border-2 border-[#3e2723] px-2 sm:px-3 py-1 shadow-[3px_3px_0_#3e2723] flex items-center gap-1 sm:gap-2 text-[#3e2723] text-base sm:text-2xl font-black italic -rotate-2">
            <Star fill="#3e2723" className="w-4 h-4 sm:w-6 sm:h-6 text-[#3e2723]" /> {score}
          </div>
        </div>
        {timeLeft !== null && (
          <div className={`pointer-events-auto border-2 border-[#3e2723] px-3 py-1 font-black text-lg sm:text-2xl shadow-[3px_3px_0_#3e2723] rotate-2 ${timeLeft <= 3 ? "bg-red-600 text-[#fcf8ef] animate-bounce" : "bg-[#fcf8ef] text-[#3e2723]"}`}>
            {timeLeft}s
          </div>
        )}
      </div>

      <div className="flex-1 relative z-10 w-full flex flex-col overflow-hidden pb-4 sm:pb-8">
         {/* FIXED CHARACTER REGION: Fills remaining vertical space above text so it never jumps */}
         <div className="flex-1 relative w-full max-w-5xl mx-auto min-h-0 pointer-events-none z-10">
            {currentScene.characterImage && (
              <div className="absolute inset-0 bottom-0 left-4 sm:left-8 w-[65%] sm:w-[50%] lg:w-[45%]">
                <Image src={currentScene.characterImage} alt={currentScene.characterName} fill className="object-contain object-left-bottom drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]" priority />
              </div>
            )}
         </div>

         {/* DIALOGUE & CHOICES REGION: Fixed height keeps everything anchored */}
         <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 relative z-20 shrink-0 h-[50vh] sm:h-[45vh] flex flex-col pointer-events-auto">
            <div className="h-full overflow-y-auto custom-scrollbar flex flex-col gap-2 sm:gap-3 pb-2 pt-4 pr-1">
              <div className="relative shrink-0 mt-2">
                <div className="absolute -top-3 left-4 z-30 bg-red-600 border-2 border-[#3e2723] px-3 py-0.5 shadow-[2px_2px_0_#3e2723] text-white text-[10px] sm:text-sm uppercase italic -rotate-1">
                  {currentScene.characterName}
                </div>
                <div className="bg-[#fcf8ef] border-4 border-[#3e2723] shadow-[4px_4px_0_#3e2723] p-4 sm:p-5 lg:p-6 min-h-[80px] sm:min-h-[100px] flex flex-col justify-center relative">
                  <div className="absolute -top-2.5 left-8 w-4 h-4 bg-[#fcf8ef] border-l-4 border-t-4 border-[#3e2723] rotate-45 z-20" />
                  <p className="text-[#3e2723] font-comic font-bold italic leading-snug text-base sm:text-lg lg:text-2xl relative z-10">&ldquo;{currentScene.dialogue}&rdquo;</p>
                </div>
              </div>

              {currentScene.explanation && !isProcessing && (
                <div className="bg-[#fcf8ef] border-2 border-[#3e2723] shadow-[2px_2px_0_#3e2723] p-2 sm:p-2.5 flex gap-2 animate-in fade-in slide-in-from-left duration-500 self-start max-w-3xl ml-2 sm:ml-6 shrink-0 mt-1">
                   <AlertCircle className="text-blue-600 shrink-0 w-3 h-3 sm:w-4 sm:h-4 mt-0.5" />
                   <p className="font-sans font-bold text-[9px] sm:text-xs text-[#3e2723]/80 italic leading-tight">{currentScene.explanation}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 shrink-0 mt-1">
                {currentScene.choices?.map((choice, idx) => {
                  let btnStateClass = "bg-[#3e2723] text-[#fcf8ef] hover:bg-yellow-400 hover:text-[#3e2723] shadow-[3px_3px_0_#3e2723] hover:-translate-y-1 hover:shadow-[4px_4px_0_#3e2723] disabled:opacity-50";
                  let isSelected = choiceAnim === idx;
                  
                  if (isSelected) {
                    if (choice.isCorrect === true) {
                       btnStateClass = "bg-green-500 text-white translate-y-1 shadow-none animate-comic-pop border-green-700";
                    } else if (choice.isCorrect === false) {
                       btnStateClass = "bg-red-500 text-white translate-y-1 shadow-none animate-shake border-red-700";
                    } else {
                       btnStateClass = "bg-yellow-400 text-[#3e2723] translate-y-1 shadow-none";
                    }
                  }

                  return (
                  <button key={choice.id || idx} disabled={isProcessing} onClick={() => handleNext(choice, idx)} className={`group relative flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-4 sm:py-3 font-comic font-black uppercase italic border-2 border-[#3e2723] transition-all active:scale-95 ${btnStateClass}`}>
                    <span className={`text-xs sm:text-sm shrink-0 italic ${isSelected && choice.isCorrect !== undefined ? "text-white/80" : "text-yellow-400"}`}>#0{idx + 1}</span>
                    <span className="flex-1 text-left text-[11px] sm:text-sm lg:text-base leading-snug break-words">{choice.text}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                  );
                })}
              </div>
            </div>
         </div>
      </div>

      {feedbackData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3e2723]/60 backdrop-blur-sm p-4 text-center">
          <div className={feedbackData.style === "pop" ? "animate-comic-pop" : "animate-subtle-slide"}>
            <div className={`bg-[#fcf8ef] border-4 sm:border-8 border-[#3e2723] p-6 sm:p-10 -rotate-2 shadow-[10px_10px_0_#3e2723]`}>
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                {feedbackData.isCorrect ? <CheckCircle2 className="w-12 h-12 sm:w-20 sm:h-20 text-green-500 animate-bounce" /> : <XCircle className="w-12 h-12 sm:w-20 sm:h-20 text-red-500 animate-shake" />}
                <h2 className={`text-2xl sm:text-4xl lg:text-6xl font-black italic uppercase leading-none ${feedbackData.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{feedbackData.text}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes comic-pop { 0% { transform: scale(0) rotate(-10deg); opacity: 0; } 70% { transform: scale(1.05) rotate(5deg); opacity: 1; } 100% { transform: scale(1) rotate(-2deg); } }
        @keyframes subtle-slide { 0% { transform: translateY(50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-comic-pop { animation: comic-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-subtle-slide { animation: subtle-slide 0.3s ease-out forwards; }
        .animate-shake { animation: shake 0.15s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulseBg 12s infinite ease-in-out; }
        @keyframes pulseBg { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3e2723; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}

const GameOverScreen = ({ score }: { score: number }) => (
  <div className="h-screen bg-yellow-400 flex items-center justify-center p-4 relative overflow-hidden">
    <HalftoneBg />
    <div className="relative z-10 bg-[#fcf8ef] border-4 border-[#3e2723] p-6 sm:p-10 shadow-[10px_10px_0_#3e2723] text-center max-w-sm w-full -rotate-1">
      <Trophy className="mx-auto mb-4 text-yellow-500 w-16 h-16 sm:w-20 sm:h-20" strokeWidth={2.5} />
      <h1 className="text-4xl sm:text-6xl font-black uppercase italic mb-1 text-[#3e2723]">TAMAT!</h1>
      <p className="text-sm sm:text-lg font-bold mb-6 text-[#3e2723]/80">Misi selesai!</p>
      <div className="bg-[#3e2723] text-yellow-400 border-4 border-[#3e2723] p-4 sm:p-6 mb-6">
        <span className="text-[10px] sm:text-xs block uppercase text-[#fcf8ef]/70 mb-1 font-sans font-bold">Reward: Score & +50 EXP</span>
        <p className="text-6xl sm:text-8xl font-black tracking-tighter leading-none">{score}</p>
      </div>
      <Link href="/dashboard/story" className="block bg-red-600 text-white p-4 font-black text-xl sm:text-2xl uppercase italic border-4 border-[#3e2723] shadow-[5px_5px_0_#3e2723] hover:translate-y-[-2px] transition-transform active:translate-y-1">
        MENU UTAMA
      </Link>
    </div>
  </div>
);

const LoadingScreen = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-yellow-400 p-6 relative">
    <HalftoneBg />
    <div className="bg-[#fcf8ef] border-4 border-[#3e2723] px-8 py-5 shadow-[8px_8px_0_#3e2723] -rotate-3 mb-8">
      <p className="text-3xl sm:text-5xl font-black tracking-widest text-[#3e2723] animate-pulse">LOADING...</p>
    </div>
    <Loader2 className="w-10 h-10 sm:w-14 sm:h-14 animate-spin text-[#3e2723]" strokeWidth={4} />
  </div>
);