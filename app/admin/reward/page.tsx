"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { Plus, Edit2, Trash2, X, Save, Shield, Award, ChevronDown, Sparkles, Star, PlusCircle, History } from "lucide-react";

type ItemType = "badge" | "hero";

// Preset Warna Brutalist untuk dipilih
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
    name: "", role: "", era: "Kemerdekaan", icon: "🦁", color: "bg-red-500",
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

  const addMoralValue = () => setFormData({ ...formData, moralValues: [...formData.moralValues, ""] });
  const updateMoralValue = (index: number, val: string) => {
    const newV = [...formData.moralValues]; newV[index] = val;
    setFormData({ ...formData, moralValues: newV });
  };
  const removeMoralValue = (idx: number) => setFormData({ ...formData, moralValues: formData.moralValues.filter((_, i) => i !== idx) });

  const closeModal = () => {
    setIsModalOpen(false); setEditingId(null);
    setFormData({ name: "", role: "", era: "Kemerdekaan", icon: "🦁", color: "bg-red-500", description: "", bio: "", contribution: "", missionRequired: "", minPoints: 0, moralValues: [""] });
  };

  return (
    <div className="p-3 md:p-6 font-mono min-h-screen text-sm">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter flex items-center gap-2">
             <Sparkles size={24} className="text-blue-600" /> HQ-PANEL
          </h1>
          <p className="text-[9px] bg-black text-white px-2 py-0.5 inline-block font-bold mt-1 shadow-[2px_2px_0_#ef4444]">REWARDS & HEROES ENGINE</p>
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
            <div className={`${item.color} p-4 border-b-[3px] border-black text-center relative`}>
              <span className="text-5xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">{item.icon}</span>
              <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(item.id); setFormType(item.type); setFormData({...item}); setIsModalOpen(true); }} className="bg-white border-2 border-black p-1 hover:bg-yellow-400"><Edit2 size={12}/></button>
                <button onClick={async () => { if(confirm("Hapus?")) { await deleteDoc(doc(db, item.type === "badge" ? "badges" : "heroes", item.id)); fetchData(); }}} className="bg-white border-2 border-black p-1 hover:bg-red-500"><Trash2 size={12}/></button>
              </div>
            </div>
            <div className="p-2 flex-1 space-y-1 bg-white">
              <h3 className="font-black text-[11px] uppercase truncate">{item.name}</h3>
              <div className="flex justify-between items-center">
                 <span className="text-[9px] font-black bg-yellow-200 px-1 border border-black">{item.minPoints} PTS</span>
                 <span className="text-[8px] font-bold text-gray-400 italic">#{item.id.slice(0,5)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- COMPACT MODAL POP-UP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-[4px] border-black w-full max-w-xl shadow-[12px_12px_0_#000] relative my-auto animate-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center p-3 border-b-[4px] border-black bg-white sticky top-0 z-20">
              <h2 className="text-sm font-black uppercase italic tracking-widest flex items-center gap-2">
                {editingId ? <Edit2 size={16}/> : <Plus size={16}/>} Configuration: {formType}
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
                
                {/* --- HEADER SELECTOR --- */}
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

                {/* --- LEFT COLUMN: BASIC INFO --- */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-black uppercase block mb-1">Display Name</label>
                    <input required className="w-full border-[3px] border-black p-2 text-xs outline-none focus:bg-blue-50" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-black uppercase block mb-1">Icon (Emoji)</label>
                      <input className="w-full border-[3px] border-black p-2 text-center text-xl outline-none" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase block mb-1">Unlock Pts</label>
                      <input type="number" className="w-full border-[3px] border-black p-2 text-xs outline-none" value={formData.minPoints || 0} onChange={e => setFormData({...formData, minPoints: parseInt(e.target.value) || 0})} />
                    </div>
                  </div>

                  {/* --- COLOR PICKER --- */}
                  <div>
                    <label className="text-[9px] font-black uppercase block mb-1.5 underline">Theme Color Picker</label>
                    <div className="grid grid-cols-4 gap-1.5 p-2 border-[3px] border-black bg-gray-50">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c.class}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: c.class })}
                          className={`h-6 w-full border-2 border-black transition-all ${c.class} ${
                            formData.color === c.class ? "scale-110 shadow-[2px_2px_0_#000] z-10" : "grayscale-[0.5] hover:grayscale-0"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* --- RIGHT COLUMN: DETAILS --- */}
                <div className="space-y-3">
                  {formType === "hero" ? (
                    <>
                      <div>
                        <label className="text-[9px] font-black uppercase block mb-1">Hero Role</label>
                        <input className="w-full border-[3px] border-black p-2 text-xs outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase block mb-1">History Era</label>
                        <input className="w-full border-[3px] border-black p-2 text-xs outline-none font-bold" value={formData.era} onChange={e => setFormData({...formData, era: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[9px] font-black uppercase block mb-1 italic">Mission Requirement</label>
                        <input className="w-full border-[3px] border-black p-2 text-[10px] outline-none font-bold bg-slate-100" value={formData.missionRequired} onChange={e => setFormData({...formData, missionRequired: e.target.value})} />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-[9px] font-black uppercase block mb-1">Badge Description</label>
                      <textarea rows={8} className="w-full border-[3px] border-black p-2 text-[11px] outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                  )}
                </div>

                {/* --- HERO SPECIFIC LARGE FIELDS --- */}
                {formType === "hero" && (
                  <div className="sm:col-span-2 space-y-4 pt-3 border-t-2 border-black border-dashed">
                    <div>
                      <label className="text-[9px] font-black uppercase block mb-1 tracking-widest text-blue-700">📜 Biography & Story</label>
                      <textarea rows={3} className="w-full border-[3px] border-black p-2 text-[11px] outline-none" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                    </div>

                    {/* --- MORAL VALUES ARRAY SECTION --- */}
                    <div className="bg-white border-[3px] border-black p-3 shadow-[4px_4px_0_#000]">
                      <label className="text-[9px] font-black uppercase block mb-2 underline">Nilai Moral (Poin-poin)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {formData.moralValues.map((v, i) => (
                          <div key={i} className="flex gap-1">
                            <input className="flex-1 border-2 border-black p-1.5 text-[10px] outline-none bg-slate-50 focus:bg-white" value={v} onChange={(e) => updateMoralValue(i, e.target.value)} placeholder="e.g. Patriotisme" />
                            <button type="button" onClick={() => removeMoralValue(i)} className="bg-red-200 border-2 border-black px-2 hover:bg-red-400"><Trash2 size={12}/></button>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addMoralValue} className="mt-3 text-[8px] font-black uppercase bg-black text-white px-3 py-1.5 flex items-center gap-1 active:scale-95 transition-all">
                        <Plus size={10}/> Add Moral Point
                      </button>
                    </div>

                    <div>
                      <label className="text-[9px] font-black uppercase block mb-1">Main Contribution</label>
                      <textarea rows={2} className="w-full border-[3px] border-black p-2 text-[11px] outline-none italic" value={formData.contribution} onChange={e => setFormData({...formData, contribution: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>

              {/* --- ACTION BUTTON --- */}
              <div className="mt-8 sticky bottom-0 bg-white pt-2 border-t-4 border-black border-double">
                <button type="submit" className="w-full bg-blue-600 text-white p-4 font-black uppercase text-xl shadow-[6px_6px_0_#000] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
                  <Save size={24} /> SAVE TO ARCHIVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}