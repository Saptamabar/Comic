"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Edit3, Plus, BookOpen, Filter } from "lucide-react";

interface Mission {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  type: "interactive_experience" | "explorations" | "challenge";
}

export default function ComicManagement() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const q = query(collection(db, "missions"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Mission[]);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Hapus permanen misi ini?")) {
      await deleteDoc(doc(db, "missions", id));
    }
  };

  
  const filteredMissions = missions.filter((m) => {
    if (filterType === "all") return true;
    return m.type === filterType;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const currentMissions = filteredMissions.slice(indexOfLast - itemsPerPage, indexOfLast);

  return (
    <div className="p-6 min-h-screen font-mono text-black">
      {/* HEADER & FILTER */}
      <div className="flex flex-wrap justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Mission Library</h1>
          <div className="flex items-center gap-3 bg-white border-2 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-black text-white p-1.5">
              <Filter size={14} />
            </div>
            <select 
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-[10px] font-black uppercase outline-none pr-4 cursor-pointer"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="interactive_experience">INTERACTIVE</option>
              <option value="explorations">EXPLORATIONS</option>
              <option value="challenge">CHALLENGE</option>
            </select>
          </div>
        </div>

        <Link href="/admin/komik/create">
          <button className="bg-yellow-400 border-4 border-black px-5 py-2 font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2">
            <Plus size={18} /> ADD NEW
          </button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black text-white text-[10px] uppercase tracking-widest">
            <tr>
              <th className="p-4 border-r border-white/10">Preview</th>
              <th className="p-4 border-r border-white/10">Title</th>
              <th className="p-4 border-r border-white/10 w-1/3">Description</th>
              <th className="p-4 border-r border-white/10">Type</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {currentMissions.length > 0 ? (
              currentMissions.map((m) => (
                <tr key={m.id} className="hover:bg-yellow-50 transition-colors">
                  <td className="p-4 w-40">
                    <div className="relative aspect-video border-2 border-black bg-slate-100 overflow-hidden">
                      {m.thumbnail ? (
                        <Image src={m.thumbnail} alt={m.title} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center opacity-20"><BookOpen size={20}/></div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-black uppercase text-sm italic border-r border-black/5">
                    {m.title}
                  </td>
                  <td className="p-4 text-[10px] font-bold text-gray-600 leading-tight border-r border-black/5">
                    <p className="line-clamp-3">{m.description || "No description provided."}</p>
                  </td>
                  <td className="p-4 border-r border-black/5">
                    <span className={`text-[9px] font-black px-2 py-0.5 border border-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                      m.type === 'challenge' ? 'bg-red-400' : 
                      m.type === 'explorations' ? 'bg-blue-400' : 'bg-green-400'
                    }`}>
                      {m.type?.replace('_', ' ') || 'EXPERIENCE'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <Link href={`/admin/komik/edit/${m.id}`}>
                        <button className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Edit">
                          <Edit3 size={16} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(m.id)}
                        className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center font-black italic opacity-30 text-xs">
                  NO MISSION FOUND FOR THIS CATEGORY
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {filteredMissions.length > itemsPerPage && (
        <div className="mt-8 flex justify-center items-center gap-4 text-[10px] font-black">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)} 
            className="hover:underline disabled:opacity-20"
          >
            PREVIOUS
          </button>
          <span className="bg-black text-white px-3 py-1 italic">PAGE {currentPage}</span>
          <button 
            disabled={indexOfLast >= filteredMissions.length} 
            onClick={() => setCurrentPage(p => p + 1)} 
            className="hover:underline disabled:opacity-20"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
}