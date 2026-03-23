"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { Plus, Edit2, Trash2, X, Save, Shield, Award, Sparkles, PlusCircle, Image as ImageIcon, Upload } from "lucide-react";

type ItemType = "badge" | "hero";

const COLOR_PRESETS = [
  { name: "Red", class: "bg-red-500" },
  { name: "Yellow", class: "bg-yellow-400" },
  { name: "Blue", class: "bg-blue-500" },
  { name: "Green", class: "bg-green-400" },
  { name: "Orange", class: "bg-orange-500" },
  { name: "Purple", class: "bg-purple-500" },
  { name: "Pink", class: "bg-pink-400" },
  { name: "Cyan", class: "bg-cyan-400" },
];

export default function CompactAchievementPage() {
  const [activeView, setActiveView] = useState<ItemType>("badge");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<ItemType>("hero");
  
  const [formData, setFormData] = useState({
    name: "", role: "", era: "Kemerdekaan", icon: "", color: "bg-red-500",
    description: "", bio: "", contribution: "", missionRequired: "", minPoints: 0,
    moralValues: [""]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const bSnap = await getDocs(collection(db, "badges"));
      const hSnap = await getDocs(collection(db, "heroes"));
      setItems([
        ...bSnap.docs.map(d => ({ id: d.id, ...d.data(), type: 'badge' })),
        ...hSnap.docs.map(d => ({ id: d.id, ...d.data(), type: 'hero' }))
      ]);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // FUNGSI HANDLE UPLOAD GAMBAR (CONVERT KE BASE64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, icon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addMoralValue = () => setFormData({ ...formData, moralValues: [...formData.moralValues, ""] });
  const updateMoralValue = (index: number, val: string) => {
    const newV = [...formData.moralValues]; newV[index] = val;
    setFormData({ ...formData, moralValues: newV });
  };
  const removeMoralValue = (idx: number) => setFormData({ ...formData, moralValues: formData.moralValues.filter((_, i) => i !== idx) });

  const closeModal = () => {
    setIsModalOpen(false); setEditingId(null);
    setFormData({ name: "", role: "", era: "Kemerdekaan", icon: "", color: "bg-red-500", description: "", bio: "", contribution: "", missionRequired: "", minPoints: 0, moralValues: [""] });
  };

  return (
    <div className="p-3 md:p-6 font-mono min-h-screen text-sm bg-gray-50">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
             <Sparkles size={24} className="text-blue-600" /> HQ-PANEL
          </h1>
          <p className="text-[9px] bg-black text-white px-2 py-0.5 inline-block font-bold mt-1 shadow-[2px_2px_0_#ef4444]">ASSETS MANAGER</p>
        </div>
        <button 
          onClick={() => { setFormType("badge"); setIsModalOpen(true); }}
          className="w-full sm:w-auto bg-green-400 border-[3px] border-black px-4 py-2 font-black uppercase shadow-[4px_4px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} /> New Entry
        </button>
      </div>

      {/* --- TABS --- */}
      <div className="flex border-[3px] border-black mb-6 bg-white shadow-[4px_4px_0_#000] overflow-hidden">
        <button onClick={() => setActiveView("badge")} className={`flex-1 py-2 font-black uppercase flex items-center justify-center gap-2 text-[10px] sm:text-xs ${activeView === 'badge' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
          <Award size={14}/> Badges ({items.filter(i => i.type === 'badge').length})
        </button>
        <button onClick={() => setActiveView("hero")} className={`flex-1 py-2 font-black uppercase flex items-center justify-center gap-2 border-l-[3px] border-black text-[10px] sm:text-xs ${activeView === 'hero' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
          <Shield size={14}/> Heroes ({items.filter(i => i.type === 'hero').length})
        </button>
      </div>

      {/* --- GRID LIST --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.filter(i => i.type === activeView).map((item) => (
          <div key={item.id} className="bg-white border-[3px] border-black shadow-[4px_4px_0_#000] flex flex-col group relative overflow-hidden">
            <div className={`${item.color} aspect-square border-b-[3px] border-black flex items-center justify-center relative overflow-hidden`}>
              {item.icon ? (
                <img src={item.icon} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={48} className="text-black/20" />
              )}
              <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => { setEditingId(item.id); setFormType(item.type); setFormData({...item}); setIsModalOpen(true); }} className="bg-white border-2 border-black p-1 hover:bg-yellow-400 shadow-[2px_2px_0_#000]"><Edit2 size={12}/></button>
                <button onClick={async () => { if(confirm("Hapus?")) { await deleteDoc(doc(db, item.type === "badge" ? "badges" : "heroes", item.id)); fetchData(); }}} className="bg-white border-2 border-black p-1 hover:bg-red-500 shadow-[2px_2px_0_#000]"><Trash2 size={12}/></button>
              </div>
            </div>
            <div className="p-2 flex-1 space-y-1 bg-white">
              <h3 className="font-black text-[11px] uppercase truncate">{item.name}</h3>
              <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black bg-yellow-200 px-1 border border-black">{item.minPoints} PTS</span>
                 <span className="text-[8px] font-bold text-gray-400 italic uppercase">ID: {item.id.slice(0,5)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL POP-UP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-[4px] border-black w-full max-w-xl shadow-[12px_12px_0_#000] relative my-auto animate-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center p-3 border-b-[4px] border-black bg-white sticky top-0 z-20">
              <h2 className="text-sm font-black uppercase italic tracking-widest flex items-center gap-2">
                {editingId ? <Edit2 size={16}/> : <Plus size={16}/>} Asset Configuration
              </h2>
              <button onClick={closeModal} className="bg-red-500 text-white border-2 border-black p-1 active:scale-90"><X size={20}/></button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const coll = formType === "badge" ? "badges" : "heroes";
              const id = editingId || formData.name.toLowerCase().trim().replace(/\s+/g, '-');
              await setDoc(doc(db, coll, id), { ...formData, type: formType, unlocked: true }, { merge: true });
              closeModal(); fetchData();
            }} className="p-4 overflow-y-auto max-h-[85vh]">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* --- CLASSIFICATION --- */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[9px] uppercase font-black">Entry Classification</label>
                  <select 
                    disabled={!!editingId}
                    value={formType} 
                    onChange={(e) => setFormType(e.target.value as ItemType)}
                    className="w-full bg-yellow-300 border-[3px] border-black p-2 font-black uppercase text-xs outline-none shadow-[3px_3px_0_#000] disabled:bg-gray-100"
                  >
                    <option value="badge">🏅 Achievement Badge</option>
                    <option value="hero">🏛️ National Hero Card</option>
                  </select>
                </div>

                {/* --- LEFT: BASIC & IMAGE --- */}
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase block mb-1">Display Name</label>
                    <input required className="w-full border-[3px] border-black p-2 text-xs outline-none focus:bg-blue-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  {/* UPLOAD BOX */}
                  <div>
                    <label className="text-[9px] font-black uppercase block mb-1">Asset Icon/Image</label>
                    <div className="relative group cursor-pointer border-[3px] border-black border-dashed h-32 flex flex-col items-center justify-center bg-gray-50 overflow-hidden transition-all hover:bg-gray-100">
                      {formData.icon ? (
                        <img src={formData.icon} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload size={24} className="mb-2 text-gray-400" />
                          <p className="text-[8px] font-bold text-gray-400 uppercase">Click to Upload</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase block mb-1">Min. Points to Unlock</label>
                    <input type="number" className="w-full border-[3px] border-black p-2 text-xs outline-none shadow-[2px_2px_0_#000]" value={formData.minPoints || 0} onChange={e => setFormData({...formData, minPoints: parseInt(e.target.value) || 0})} />
                  </div>
                </div>

                {/* --- RIGHT: THEME & META --- */}
                <div className="space-y-4">
                   {/* COLOR PICKER */}
                   <div>
                    <label className="text-[9px] font-black uppercase block mb-1">Visual Theme</label>
                    <div className="grid grid-cols-4 gap-1 p-2 border-[3px] border-black bg-gray-50">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c.class}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: c.class })}
                          className={`h-5 border-2 border-black ${c.class} ${formData.color === c.class ? "ring-2 ring-black scale-110 z-10" : "opacity-40"}`}
                        />
                      ))}
                    </div>
                  </div>

                  {formType === "hero" ? (
                    <>
                      <div>
                        <label className="text-[9px] font-black uppercase block mb-1">Hero Role</label>
                        <input placeholder="e.g. Panglima Perang" className="w-full border-[3px] border-black p-2 text-xs outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase block mb-1 italic">Mission Requirement</label>
                        <input placeholder="e.g. Selesaikan Modul Proklamasi" className="w-full border-[3px] border-black p-2 text-[10px] outline-none font-bold bg-slate-100" value={formData.missionRequired} onChange={e => setFormData({...formData, missionRequired: e.target.value})} />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-[9px] font-black uppercase block mb-1">Badge Description</label>
                      <textarea rows={5} className="w-full border-[3px] border-black p-2 text-[11px] outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                  )}
                </div>

                {/* --- HERO SPECIFIC LARGE FIELDS --- */}
                {formType === "hero" && (
                  <div className="sm:col-span-2 space-y-4 pt-3 border-t-2 border-black border-dashed">
                    <div>
                      <label className="text-[9px] font-black uppercase block mb-1 tracking-widest text-blue-700 font-bold">📜 Biography & History</label>
                      <textarea rows={3} className="w-full border-[3px] border-black p-2 text-[11px] outline-none" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                    </div>

                    <div className="bg-white border-[3px] border-black p-3 shadow-[4px_4px_0_#000]">
                      <label className="text-[9px] font-black uppercase block mb-2 underline">Nilai Moral (Poin-poin)</label>
                      <div className="grid grid-cols-1 gap-2">
                        {formData.moralValues.map((v, i) => (
                          <div key={i} className="flex gap-1">
                            <input className="flex-1 border-2 border-black p-1.5 text-[10px] outline-none bg-slate-50 focus:bg-white" value={v} onChange={(e) => updateMoralValue(i, e.target.value)} placeholder="e.g. Pantang Menyerah" />
                            <button type="button" onClick={() => removeMoralValue(i)} className="bg-red-200 border-2 border-black px-2 hover:bg-red-400"><Trash2 size={12}/></button>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addMoralValue} className="mt-3 text-[8px] font-black uppercase bg-black text-white px-3 py-1.5 flex items-center gap-1">
                        <Plus size={10}/> Add Value
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* --- ACTION BUTTON --- */}
              <div className="mt-6 sticky bottom-0 bg-white pt-2 border-t-4 border-black border-double">
                <button type="submit" className="w-full bg-blue-600 text-white p-3 font-black uppercase text-lg shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
                  <Save size={20} /> SYNC TO FIREBASE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}