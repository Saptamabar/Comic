"use client";

import { useEffect, useState, ReactNode } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { Save, Layout, Target, Users, Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";

interface MissionCard {
  title: string;
  color: string;
  desc: string;
}

interface AgentCard {
  name: string;
  role: string;
  image: string;
  rotate: string;
  color: string;
  description: string;
}

interface HeroData {
  title: string;
  subTitle: string;
  description: string;
}

interface MissionData {
  title: string;
  cards: MissionCard[];
}

interface AgentData {
  title: string;
  description: string;
  cards: AgentCard[];
}

interface SectionWrapperProps {
  children: ReactNode;
  title: string;
  color: string;
  icon: ReactNode;
}

const defaultHero: HeroData = { title: "", subTitle: "", description: "" };
const defaultMission: MissionData = { title: "", cards: [] };
const defaultAgent: AgentData = { title: "", description: "", cards: [] };

export default function WebSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const [hero, setHero] = useState<HeroData>(defaultHero);
  const [mission, setMission] = useState<MissionData>(defaultMission);
  const [agent, setAgent] = useState<AgentData>(defaultAgent);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "web_settings", "homepage");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setHero(data.hero || defaultHero);
          setMission({
            title: data.mission?.title || "",
            cards: data.mission?.cards || [],
          });
          setAgent({
            title: data.agent?.title || "",
            description: data.agent?.description || "",
            cards: data.agent?.cards || [],
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uploadImage = async (file: File, index: number) => {
    setUploadingIdx(index);
    try {
      const signRes = await fetch("/api/sign-cloudinary", { method: "POST" });
      const { signature, timestamp } = await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "revolusi45/agents");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error.message);

      const newCards = [...agent.cards];
      newCards[index].image = data.secure_url;
      setAgent({ ...agent, cards: newCards });
    } catch (err:unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan Intel";
      alert(`Gagal: ${errorMessage}`);
    } finally {
      setUploadingIdx(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "web_settings", "homepage"), {
        hero,
        mission,
        agent,
        updatedAt: new Date(),
      });
      alert("MISSION SUCCESS: Intel telah disimpan!");
    } catch (error:unknown) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan Intel";
      alert(`Gagal: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-yellow-400">
      <div className="font-black text-4xl italic animate-bounce uppercase border-8 border-black p-10 bg-white shadow-pop">
        LOADING INTEL...
      </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-24 font-mono max-w-7xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 border-4 border-black shadow-pop">

    <div>
      <h2 className="text-3xl font-black uppercase italic leading-none">
        Markas <span className="text-red-600">Besar</span>
      </h2>

      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
        Web Configuration Terminal
      </p>
    </div>

    <button
      onClick={handleSave}
      disabled={saving}
      className="flex items-center gap-2 bg-green-400 border-4 border-black px-8 py-4 font-black shadow-pop active:shadow-none transition-all uppercase italic"
    >
      {saving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
      {saving ? "SAVING..." : "DEPLOY CHANGES"}
    </button>

  </div>

      {/* SECTION 1: HERO */}
      <SectionWrapper title="1. Hero Briefing" color="bg-blue-400" icon={<Layout />}>
        <div className="grid gap-6">
          <InputGroup label="Headline" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
          <InputGroup label="Sub-Headline" value={hero.subTitle} onChange={(v) => setHero({ ...hero, subTitle: v })} />
          <div className="flex flex-col">
            <label className="font-black uppercase text-xs mb-1 italic text-slate-500 underline">Mission Context</label>
            <textarea
              className="border-4 border-black p-4 font-bold focus:bg-blue-50 outline-none shadow-pop min-h-[120px]"
              value={hero.description}
              onChange={(e) => setHero({ ...hero, description: e.target.value })}
            />
          </div>
        </div>
      </SectionWrapper>

      {/* SECTION 2: MISSION CARDS */}
      <SectionWrapper title="2. Tactical Mission" color="bg-red-500" icon={<Target />}>
        <div className="mb-8">
          <InputGroup label="Section Title" value={mission.title} onChange={(v) => setMission({ ...mission, title: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mission.cards?.map((card, idx) => (
            <div key={idx} className="border-4 border-black p-6 bg-yellow-50 relative shadow-pop">
              <button
                onClick={() => {
                  const newCards = mission.cards.filter((_, i) => i !== idx);
                  setMission({ ...mission, cards: newCards });
                }}
                className="absolute -top-4 -right-4 bg-black text-white p-2 border-2 border-white hover:bg-red-600 z-10"
              >
                <Trash2 size={20} />
              </button>
              <div className="space-y-4">
                <InputGroup label="Objective Title" value={card.title} onChange={(v) => {
                  const newCards = [...mission.cards];
                  newCards[idx].title = v;
                  setMission({ ...mission, cards: newCards });
                }} />
                
                {/* COLOR PICKER INTEGRATION */}
               <div className="flex flex-col w-full group/color">
                  <label className="font-black uppercase text-[11px] mb-1 italic tracking-widest text-slate-500">
                    Mission Theme Color
                  </label>
                  <div className="relative w-full h-14 border-4 border-black shadow-pop transition-all active:translate-x-1 active:translate-y-1 active:shadow-none overflow-hidden bg-white">
                    {/* Input Color*/}
                    <input
                      type="color"
                      value={card.color || "#3b82f6"}
                      onChange={(e) => {
                        const v = e.target.value;
                        const newCards = [...mission.cards];
                        newCards[idx].color = v;
                        setMission({ ...mission, cards: newCards });
                      }}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                    />
                    
                    {/* Preview Visual */}
                    <div 
                      className="w-full h-full flex items-center justify-center transition-colors duration-300"
                      style={{ backgroundColor: card.color || "#3b82f6" }}
                    >
                      <span className="font-black text-xs bg-black text-white px-2 py-0.5 mix-blend-difference tracking-tighter">
                        {card.color?.toUpperCase() || "#3B82F6"}
                      </span>
                    </div>
                  </div>
                </div>

                <InputGroup label="Brief Info" value={card.desc} onChange={(v) => {
                  const newCards = [...mission.cards];
                  newCards[idx].desc = v;
                  setMission({ ...mission, cards: newCards });
                }} />
              </div>
            </div>
          ))}
          <button
            onClick={() => setMission({ ...mission, cards: [...mission.cards, { title: "", color: "#3b82f6", desc: "" }] })}
            className="border-4 border-dashed border-black p-10 font-black text-xl bg-white hover:bg-yellow-100 shadow-pop transition-all uppercase flex flex-col items-center justify-center gap-2"
          >
            <Plus size={40} /> ADD MISSION OBJECTIVE
          </button>
        </div>
      </SectionWrapper>

      {/* SECTION 3: AGENTS */}
      <SectionWrapper title="3. Agent Roster" color="bg-purple-500" icon={<Users />}>
        <div className="grid gap-6 mb-10 border-b-4 border-black pb-8">
          <InputGroup label="Roster Heading" value={agent.title} onChange={(v) => setAgent({ ...agent, title: v })} />
          <InputGroup label="Roster Description" value={agent.description} onChange={(v) => setAgent({ ...agent, description: v })} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {agent.cards?.map((card, idx) => (
            <div 
              key={idx} 
              className={`border-4 border-black p-5 shadow-pop relative transform ${card.rotate} transition-transform hover:rotate-0`}
              style={{ backgroundColor: card.color || "#ffffff" }} 
            >
              <button
                onClick={() => {
                  const newCards = agent.cards.filter((_, i) => i !== idx);
                  setAgent({ ...agent, cards: newCards });
                }}
                className="absolute -top-4 -right-4 bg-red-600 text-white p-2 border-2 border-black z-20 shadow-pop-small"
              >
                <Trash2 size={20} />
              </button>

              <div className="flex flex-col gap-5">
                {/* UPLOAD PHOTO SECTION */}
                <div className="border-4 border-black aspect-3/4 bg-slate-200 relative overflow-hidden group">
                  {uploadingIdx === idx && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center flex-col font-black italic text-xs">
                      <Loader2 className="animate-spin mb-2" /> UPLOADING...
                    </div>
                  )}
                  {card.image ? (
                    <Image 
                      src={card.image} 
                      alt={`Agent ${card.name}`} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 italic font-black p-4 text-center text-xs">
                      <ImageIcon size={32} className="mb-2" /> NO PHOTO
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <label className="bg-white border-2 border-black px-3 py-1 font-black text-[10px] cursor-pointer shadow-pop-small">
                      UPDATE PHOTO
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const localUrl = URL.createObjectURL(file);
                          const newCards = [...agent.cards];
                          newCards[idx].image = localUrl;
                          setAgent({ ...agent, cards: newCards });
                          uploadImage(file, idx);
                        }
                      }} />
                    </label>
                  </div>
                </div>

                {/* INPUT CODENAME */}
                <InputGroup label="Codename" value={card.name} onChange={(v) => {
                  const newCards = [...agent.cards];
                  newCards[idx].name = v;
                  setAgent({ ...agent, cards: newCards });
                }} />

                {/* COLOR PICKER (BG COLOR)*/}
                <div className="flex flex-col w-full group/color">
                    <label className="font-black uppercase text-[10px] mb-1 italic tracking-widest text-slate-500">
                      Card Theme Color
                    </label>
                    <div className="relative w-full h-14 border-4 border-black shadow-pop transition-all active:translate-x-1 active:translate-y-1 active:shadow-none overflow-hidden">
                      {/* Input Color */}
                      <input
                        type="color"
                        value={card.color || "#ffffff"}
                        onChange={(e) => {
                          const v = e.target.value;
                          const newCards = [...agent.cards];
                          newCards[idx].color = v;
                          setAgent({ ...agent, cards: newCards });
                        }}
                        className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                      />
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: card.color || "#ffffff" }}
                      >
                        <span className="font-black text-[10px] bg-black text-white px-2 py-0.5 mix-blend-difference">
                          {card.color?.toUpperCase() || "#FFFFFF"}
                        </span>
                      </div>
                    </div>
                  </div>

                <div className="flex flex-col">
                  <label className="font-black uppercase text-[10px] mb-1 italic text-slate-600">Agent Dossier</label>
                  <textarea
                    className="border-4 border-black p-3 font-bold focus:bg-white/50 outline-none shadow-pop-small text-xs h-24 resize-none bg-white/30"
                    value={card.description}
                    onChange={(e) => {
                      const newCards = [...agent.cards];
                      newCards[idx].description = e.target.value;
                      setAgent({ ...agent, cards: newCards });
                    }}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-black uppercase text-[10px] mb-1 italic">Photo Angle</label>
                  <select
                    className="border-4 border-black p-2 font-black bg-white/50 text-[10px] outline-none"
                    value={card.rotate}
                    onChange={(e) => {
                      const newCards = [...agent.cards];
                      newCards[idx].rotate = e.target.value;
                      setAgent({ ...agent, cards: newCards });
                    }}
                  >
                    <option value="-rotate-2">Tilt Left (-2°)</option>
                    <option value="rotate-0">Straight (0°)</option>
                    <option value="rotate-2">Tilt Right (2°)</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => setAgent({ ...agent, cards: [...agent.cards, { name: "", role: "", image: "", rotate: "rotate-0", description: "", color: "#ffffff" }] })}
            className="border-4 border-dashed border-black font-black text-xl flex flex-col items-center justify-center gap-3 bg-white hover:bg-purple-50 shadow-pop p-20"
          >
            <Plus size={60} /> RECRUIT AGENT
          </button>
        </div>
      </SectionWrapper>
    </div>
  );
}

// --- COMPONENTS ---
function SectionWrapper({ children, title, color, icon }: SectionWrapperProps) {
  return (
    <section className="bg-white border-8 border-black p-8 shadow-pop relative">
      <div className={`flex items-center gap-4 mb-12 ${color} text-white px-8 py-4 border-4 border-black w-fit transform -rotate-2 shadow-pop-black uppercase font-black italic text-2xl`}>
        {icon} <span>{title}</span>
      </div>
      {children}
    </section>
  );
}

function InputGroup({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="flex flex-col w-full">
      <label className="font-black uppercase text-[11px] mb-1 italic tracking-widest text-slate-500">{label}</label>
      <input
        type={type}
        className={`border-4 border-black p-4 font-black focus:bg-yellow-50 outline-none shadow-pop transition-all text-sm ${type === 'color' ? 'h-16 cursor-pointer p-1' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}