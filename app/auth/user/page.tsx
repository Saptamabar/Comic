"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Lock, Zap, AtSign, LogIn, UserPlus } from "lucide-react";
import { useUiSound } from "@/hooks/useUiSound";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function UserAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const { playClick, playHover } = useUiSound();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    playClick();

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Verify/Sync user in Firestore
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          await setDoc(docRef, {
            email: user.email,
            role: "user",
            createdAt: serverTimestamp(),
            badges: [],
            completedStories: [],
          });
        }

        const token = await user.getIdToken();
        document.cookie = `token=${token}; path=/`;
        document.cookie = `role=user; path=/`;
        
        router.push("/dashboard");
        
      } else {
        // --- REGISTER FLOW ---
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Create firestore document
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
          badges: [],
          completedStories: [],
        });

        const token = await user.getIdToken();
        document.cookie = `token=${token}; path=/`;
        document.cookie = `role=user; path=/`;

        alert("KA-POW! Akun berhasil dibuat! Selamat datang di Histoplay.");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth Error:", error.code, error.message);
      
      // Handle Firebase v10+ generic error code
      if (
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/user-not-found'
      ) {
        setErrorMessage("ZAP! Email atau password salah.");
      } else if (error.code === 'auth/email-already-in-use') {
        setErrorMessage("BOOM! Email ini sudah terdaftar.");
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage("CRASH! Terlalu banyak percobaan. Coba lagi nanti.");
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage("POW! Password terlalu lemah (min. 6 karakter).");
      } else {
        setErrorMessage("Ouch! Terjadi kesalahan teknis. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pop-blue flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 2px, transparent 2px)",
          backgroundSize: "30px 30px"
        }}
      />
      
      <Link 
        href="/" 
        className="absolute top-6 left-6 font-bangers text-3xl text-white hover:text-pop-yellow transition-colors drop-shadow-[2px_2px_0_#000] z-20"
        onClick={() => playClick()}
        onMouseEnter={() => playHover()}
      >
        &larr; KEMBALI
      </Link>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Error Notification */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-red-600 border-4 border-black p-3 mb-4 shadow-[4px_4px_0_#000] text-white font-black italic flex items-center gap-2"
            >
              <Zap size={20} fill="white" /> {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tabs */}
        <div className="flex mb-0 relative z-10">
          <button
            onClick={() => { setIsLogin(true); setErrorMessage(null); playClick(); }}
            className={`flex-1 py-3 font-bangers text-2xl uppercase border-4 border-black border-b-0 transition-all ${
              isLogin ? "bg-pop-yellow translate-y-0 shadow-[4px_0_0_0_#000]" : "bg-gray-300 text-gray-500 translate-y-2"
            }`}
          >
            <LogIn className="inline-block mr-2 mb-1" size={24} /> LOGIN
          </button>
          <button
             onClick={() => { setIsLogin(false); setErrorMessage(null); playClick(); }}
            className={`flex-1 py-3 font-bangers text-2xl uppercase border-4 border-black border-b-0 transition-all ${
              !isLogin ? "bg-pop-yellow translate-y-0 shadow-[-4px_0_0_0_#000]" : "bg-gray-300 text-gray-500 translate-y-2"
            }`}
          >
             <UserPlus className="inline-block mr-2 mb-1" size={24} /> REGISTER
          </button>
        </div>

        {/* Card */}
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-20">
          <div className="text-center mb-8">
            <h1 className="font-bangers text-5xl uppercase text-pop-red tracking-wider drop-shadow-[2px_2px_0_#000]">
              {isLogin ? "SELAMAT DATANG!" : "MULAI PETUALANGAN!"}
            </h1>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black uppercase">Email Address</label>
              <div className="flex items-center">
                <div className="bg-pop-blue border-y-4 border-l-4 border-black p-3">
                  <AtSign className="text-white" size={24} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pahlawan@histoplay.id"
                  className="w-full border-4 border-black p-3 font-comic text-lg focus:outline-none focus:bg-yellow-50 disabled:bg-gray-100"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black uppercase">Password</label>
              <div className="flex items-center">
                <div className="bg-pop-red border-y-4 border-l-4 border-black p-3">
                  <Lock className="text-white" size={24} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full border-4 border-black p-3 font-comic text-lg focus:outline-none focus:bg-yellow-50 disabled:bg-gray-100"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bangers text-3xl uppercase py-4 border-4 border-black relative group overflow-hidden active:scale-95 transition-transform disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-pop-yellow w-0 group-hover:w-full transition-all duration-300 z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-black">
                {loading ? "MEMPROSES..." : (isLogin ? "MASUK SEKARANG!" : "DAFTAR AKUN")}
                {!loading && <Zap fill="currentColor" />}
              </span>
            </button>
          </form>
        </div>
      </motion.div>

      {/* Pop Art Decoration */}
      <div className="absolute bottom-10 right-10 hidden md:block select-none pointer-events-none">
        <div className="bg-white border-4 border-black p-4 rounded-full font-bangers text-4xl text-pop-red animate-bounce shadow-[6px_6px_0_#000] transform rotate-12">
          BOOM!
        </div>
      </div>
    </div>
  );
}