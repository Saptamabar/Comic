"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { Mail, Lock, Zap } from "lucide-react";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        alert("POW! Anda tidak memiliki akses Admin!");
        return;
      }

      const token = await user.getIdToken();
      
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("role", "admin", { expires: 7 });

      window.location.href = "/admin/dashboard";
    } catch (error) {
      alert("BOOM! Login gagal. Cek email/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4 font-mono uppercase">
      <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] max-w-md w-full transform -rotate-1">
        <div className="mb-8 text-center relative">
          <div className="absolute -top-12 -left-6 bg-red-500 text-white px-4 py-1 border-2 border-black font-bold transform -rotate-12 text-xl shadow-[4px_4px_0_#000]">
            Admin Only!
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter">
            LOGIN <span className="text-blue-600">BASE</span>
          </h1>
        </div>

        <form onSubmit={loginAdmin} className="space-y-6 font-bold">
          <div>
            <label className="block text-sm mb-1 italic">Identity (Email)</label>
            <div className="flex items-center">
              <span className="bg-black p-3 border-2 border-black text-white"><Mail size={20} /></span>
              <input type="email" onChange={(e)=>setEmail(e.target.value)} className="w-full border-4 border-black p-2 outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 italic">Secret Code</label>
            <div className="flex items-center">
              <span className="bg-black p-3 border-2 border-black text-white"><Lock size={20} /></span>
              <input type="password" onChange={(e)=>setPassword(e.target.value)} className="w-full border-4 border-black p-2 outline-none" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-red-500 border-4 border-black py-3 text-white text-xl font-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all">
            {loading ? "TRANSMITTING..." : "GO! GO! GO!"}
          </button>
        </form>
      </div>
    </div>
  );
}