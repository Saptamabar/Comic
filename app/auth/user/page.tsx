"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User, Lock, Mail, Zap, AtSign, LogIn, UserPlus } from "lucide-react";
import { useUiSound } from "@/hooks/useUiSound";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { playClick, playHover } = useUiSound();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    playClick();

    try {
      if (isLogin) {
        // LOGIN FLOW
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Verify user in Firestore
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          // If auth exists but no firestore doc, create one just in case 
          // (shouldn't happen with our register flow, but good fallback)
          await setDoc(docRef, {
            email: user.email,
            role: "user",
            createdAt: new Date().toISOString()
          });
        } else {
          const data = snap.data();
          if (data.role === "admin") {
            // Admin logging in via user portal is weird but allowed, maybe alert them
            // "Welcome Admin" but proceed. Or block them. Let's allow for now.
          }
        }

        const token = await user.getIdToken();
        document.cookie = `token=${token}; path=/`;
        document.cookie = `role=user; path=/`;
        
        router.push("/dashboard");
        
      } else {
        // REGISTER FLOW
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Create firestore document for new user
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user",
          createdAt: new Date().toISOString(),
          // Default empty arrays for gamification tracking can be added later
          badges: [],
          completedStories: [],
        });

        const token = await user.getIdToken();
        document.cookie = `token=${token}; path=/`;
        document.cookie = `role=user; path=/`;

        alert("KA-POW! Account created successfully! Welcome to Histoplay.");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
         alert("BOOM! That email is already registered.");
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
         alert("ZAP! Invalid email or password.");
      } else {
         alert("CRASH! An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pop-blue flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 2px, transparent 2px)",
          backgroundSize: "30px 30px"
        }}
      />
      
      {/* Return to Home Link */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 font-bangers text-3xl text-white hover:text-pop-yellow transition-colors drop-shadow-[2px_2px_0_#000] z-20"
        onClick={() => playClick()}
        onMouseEnter={() => playHover()}
      >
        &larr; BACK TO HOME
      </Link>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md relative z-10"
      >
        
        {/* Toggle Login/Register Tabs */}
        <div className="flex mb-4">
          <button
            onClick={() => { setIsLogin(true); playClick(); }}
            onMouseEnter={() => playHover()}
            className={`flex-1 py-3 font-bangers text-2xl uppercase border-4 border-black border-r-2 ${
              isLogin ? "bg-pop-yellow shadow-[4px_-4px_0_0_#000] z-10" : "bg-gray-200 text-gray-500 translate-y-1"
            } transition-all`}
          >
            <LogIn className="inline-block mr-2 mb-1" size={24} />
            LOGIN
          </button>
          <button
             onClick={() => { setIsLogin(false); playClick(); }}
             onMouseEnter={() => playHover()}
            className={`flex-1 py-3 font-bangers text-2xl uppercase border-4 border-black border-l-2 ${
              !isLogin ? "bg-pop-yellow shadow-[4px_-4px_0_0_#000] z-10" : "bg-gray-200 text-gray-500 translate-y-1"
            } transition-all`}
          >
             <UserPlus className="inline-block mr-2 mb-1" size={24} />
            REGISTER
          </button>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
          
          <div className="text-center mb-8">
            <h1 className="font-bangers text-5xl uppercase text-pop-red tracking-wider drop-shadow-[2px_2px_0_#000]">
              {isLogin ? "WELCOME BACK!" : "JOIN THE ADVENTURE!"}
            </h1>
            <p className="font-comic font-bold text-gray-600 mt-2">
              {isLogin ? "Enter your credentials to continue your historical journey." : "Create an account to start exploring Indonesian history."}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black uppercase">Email Address</label>
              <div className="flex items-center">
                <div className="bg-pop-blue border-y-4 border-l-4 border-black p-3 rounded-l-md">
                  <AtSign className="text-white" size={24} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@histoplay.id"
                  className="w-full border-4 border-black p-3 font-comic text-lg text-black bg-white focus:outline-none focus:ring-4 focus:ring-pop-yellow disabled:bg-gray-200"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black uppercase">Secret Code (Password)</label>
              <div className="flex items-center">
                <div className="bg-pop-red border-y-4 border-l-4 border-black p-3 rounded-l-md">
                  <Lock className="text-white" size={24} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  minLength={6}
                  className="w-full border-4 border-black p-3 font-comic text-lg text-black bg-white focus:outline-none focus:ring-4 focus:ring-pop-yellow disabled:bg-gray-200"
                  required
                  disabled={loading}
                />
              </div>
              {!isLogin && <p className="font-comic text-sm text-gray-500 mt-1">Must be at least 6 characters long.</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="w-full bg-black text-white font-bangers text-3xl uppercase py-4 border-4 border-black relative group overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed transform transition-transform active:scale-95"
            >
              <div className="absolute inset-0 bg-pop-yellow w-0 group-hover:w-full transition-all duration-300 ease-out z-0"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-black transition-colors">
                {loading ? "TRANSMITTING..." : (isLogin ? "GO! GO! GO!" : "CREATE ACCOUNT")}
                {!loading && <Zap fill="currentColor" />}
              </span>
            </button>
          </form>

        </div>
      </motion.div>

      {/* Decorative Comic Elements */}
      <div className="absolute bottom-10 right-10 hidden md:block select-none pointer-events-none">
        <div className="bg-white border-4 border-black p-4 rounded-full font-bangers text-4xl text-pop-red animate-bounce shadow-pop transform rotate-12">
          POW!
        </div>
      </div>
      <div className="absolute top-20 right-20 hidden lg:block select-none pointer-events-none opacity-50">
        <div className="bg-white border-4 border-black p-3 rounded-xl font-comic font-bold text-xl text-black shadow-pop transform -rotate-6">
          Ready to learn?
        </div>
      </div>

    </div>
  );
}
