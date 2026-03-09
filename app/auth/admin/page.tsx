"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, Zap } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        alert("WHAM! Data user tidak ditemukan!");
        return;
      }

      const data = snap.data();

      if (data.role !== "admin") {
        alert("POW! Anda bukan admin!");
        return;
      }
      const token = await result.user.getIdToken();
      document.cookie = `token=${token}; path=/`;
      document.cookie = `role=admin; path=/`;
      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("BOOM! Login gagal. Periksa kembali kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4 font-mono">
      {/* Container Utama*/}
      <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-md w-full transform -rotate-1">
        
        {/* Header Tema Komik */}
        <div className="mb-8 text-center relative">
          <div className="absolute -top-12 -left-6 bg-red-500 text-white px-4 py-1 border-2 border-black font-bold uppercase tracking-tighter transform -rotate-12 text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Admin Only!
          </div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter text-black">
            LOGIN <span className="text-blue-600 italic">BASE</span>
          </h1>
          <div className="h-2 bg-black mt-2 w-full"></div>
        </div>

        <form onSubmit={loginAdmin} className="space-y-6">
          {/* Input Email */}
          <div className="relative">
            <label className="block text-sm font-bold mb-1 uppercase italic">Identity (Email)</label>
            <div className="flex items-center">
              <span className="bg-black p-3 border-2 border-black">
                <Mail className="text-white" size={20} />
              </span>
              <input
                type="email"
                placeholder="super@hero.com"
                className="w-full border-4 border-black p-2 focus:bg-blue-50 outline-none font-bold"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="relative">
            <label className="block text-sm font-bold mb-1 uppercase italic">Secret Code</label>
            <div className="flex items-center">
              <span className="bg-black p-3 border-2 border-black">
                <Lock className="text-white" size={20} />
              </span>
              <input
                type="password"
                placeholder="********"
                className="w-full border-4 border-black p-2 focus:bg-blue-50 outline-none font-bold"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group relative inline-block focus:outline-none"
          >
            <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>
            <span className="relative flex items-center justify-center gap-2 border-4 border-black bg-red-500 px-8 py-3 text-xl font-black uppercase tracking-widest text-white group-active:bg-red-600">
              {loading ? "TRANSMITTING..." : "GO! GO! GO!"}
              <Zap fill="currentColor" />
            </span>
          </button>
        </form>

        <p className="mt-6 text-center text-xs font-bold uppercase tracking-widest italic">
          © 2026 Justice Web Inc.
        </p>
      </div>

      {/* Dekorasi */}
      <div className="fixed bottom-10 right-10 hidden md:block">
        <div className="bg-white border-4 border-black p-4 rounded-full font-black text-2xl animate-bounce shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          ?!!
        </div>
      </div>
    </div>
  );
}