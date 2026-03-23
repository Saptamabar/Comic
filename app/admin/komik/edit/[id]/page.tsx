"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useForm, useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase"; 
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { 
  Trash2, Save, Image as ImageIcon, 
  Upload, Loader2, User, Palette, ChevronRight, Activity, ArrowLeft, Hash, Calendar, FileText, X, Plus
} from "lucide-react";
import Link from "next/link";


type FeedbackStyle = "none" | "pop" | "subtle";
type MissionType = "interactive_experience" | "explorations" | "challenge";
type HistoricalEra = "era_kemerdekaan" | "era_orde_lama" | "era_orde_baru" | "era_reformasi";

interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  scoreDelta: number;
  isCorrect?: boolean;
  feedback: string;
  feedbackStyle?: FeedbackStyle;
}

interface Scene {
  id: string;
  characterName: string;
  characterImage?: string;
  backgroundImage?: string;
  backgroundClass: string;
  dialogue: string;
  explanation?: string;
  evidenceText?: string;
  choices: Choice[];
  duration?: number | null;
}

interface MissionFormData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  type: MissionType;
  era?: HistoricalEra;
  orderIndex?: number;
  startSceneId: string;
  scenes: Scene[];
}

type UploadPath = `thumbnail` | `scenes.${number}.characterImage` | `scenes.${number}.backgroundImage`;

export default function EditComicPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const { register, control, handleSubmit, setValue, watch, reset } = useForm<MissionFormData>();

  const { fields: sceneFields, append: appendScene, remove: removeScene } = useFieldArray({
    control, name: "scenes"
  });

  const selectedType = watch("type");

  
  useEffect(() => {
    const fetchMission = async () => {
      if (!params.id) return;
      try {
        const docRef = doc(db, "missions", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const scenesArray = data.scenes ? Object.values(data.scenes).sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0)) : [];
          reset({ ...data, scenes: scenesArray } as MissionFormData);
        } else {
          alert("Misi tidak ditemukan!");
          router.push("/admin/komik");
        }
      } catch (error) {
        console.error("Error fetching mission:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchMission();
  }, [params.id, reset, router]);

  
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>, fieldName: UploadPath) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(fieldName);

    try {
      const sigRes = await fetch("/api/sign-cloudinary", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "revolusi45/missions" })
      });
      const { signature, timestamp } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "");
      formData.append("folder", "revolusi45/missions");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const result = await res.json();
      if (result.secure_url) {
        setValue(fieldName, result.secure_url);
      }
    } catch (err) {
      console.error("Cloudinary Error:", err);
    } finally {
      setUploadingField(null);
    }
  };

  
  const onSubmit = async (data: MissionFormData) => {
    setLoading(true);
    try {
      const scenesRecord: Record<string, any> = {};
      
      data.scenes.forEach((s, idx) => { 
        
        const sceneData: any = { 
          ...s, 
          duration: s.duration || null,
          orderIndex: idx 
        };

        
        if (data.type === "challenge") {
          delete sceneData.backgroundImage;
          delete sceneData.characterImage;
          delete sceneData.characterName;
          delete sceneData.explanation;
        } else {
          delete sceneData.evidenceText;
        }

        scenesRecord[s.id] = sceneData;
      });

      
      const finalPayload: any = {
        ...data,
        scenes: scenesRecord,
        updatedAt: serverTimestamp()
      };

      
      if (data.type !== "explorations") {
        delete finalPayload.era;
      }

      const missionRef = doc(db, "missions", data.id);
      await updateDoc(missionRef, finalPayload);

      alert("DATA BERHASIL DISIMPAN!");
      router.push("/admin/komik");
    } catch (error) { 
      console.error("Update Error:", error);
      alert("Gagal Update: " + error); 
    } finally { 
      setLoading(false); 
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center font-mono italic">
      <Loader2 className="animate-spin mr-2" /> SYNCHRONIZING WITH CLOUD...
    </div>
  );

  return (
    <div className="w-full min-h-screen p-4 md:p-6 font-mono text-black bg-[#f4f4f4]">
      {/* STICKY HEADER */}
      <header className="w-full border-b-4 border-black bg-indigo-600 p-6 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-wrap justify-between items-center gap-4 text-white sticky top-0 z-[50]">
        <div className="flex items-center gap-4">
          <Link href="/admin/komik" className="bg-black p-2 border-2 border-white hover:bg-yellow-400 hover:text-black transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Mission Architect</h1>
            <p className="font-bold text-[9px] bg-white text-black inline-block px-2 py-0.5 mt-2 uppercase">ID: {params.id}</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="bg-yellow-400 text-black border-4 border-black px-6 py-3 font-black text-sm hover:bg-black hover:text-yellow-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none flex items-center gap-2 uppercase italic"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Push to Production
        </button>
      </header>

      <form className="w-full space-y-10" onSubmit={(e) => e.preventDefault()}>
        {/* METADATA SECTION */}
        <section className="w-full border-4 border-black bg-white p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Fixed ID</label>
                <input {...register("id")} disabled className="w-full border-2 border-black p-2 text-xs font-bold bg-gray-100 cursor-not-allowed" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-indigo-400">Entry Scene</label>
                <input {...register("startSceneId")} className="w-full border-2 border-black p-2 text-xs font-bold bg-indigo-50 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-orange-400">Mission Type</label>
                <select 
                  {...register("type")} 
                  className="w-full border-2 border-black p-2 text-xs font-black bg-orange-50 outline-none cursor-pointer"
                >
                  <option value="interactive_experience">INTERACTIVE</option>
                  <option value="explorations">EXPLORATIONS</option>
                  <option value="challenge">CHALLENGE</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-teal-600">Order</label>
                <input type="number" {...register("orderIndex", { valueAsNumber: true })} className="w-full border-2 border-black p-2 text-xs font-black bg-teal-50" />
              </div>
            </div>

            {selectedType === "explorations" && (
              <div className="p-4 border-2 border-black bg-green-50 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black uppercase text-green-700 flex items-center gap-1 mb-2">
                  <Calendar size={12} /> Timeline Era
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["era_kemerdekaan", "era_orde_lama", "era_orde_baru", "era_reformasi"].map((e) => (
                    <label key={e} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" value={e} {...register("era")} className="w-4 h-4 accent-black" />
                      <span className="text-[11px] font-bold uppercase group-hover:text-green-600">{e.replace(/_/g, " ")}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <input {...register("title")} className="w-full border-2 border-black p-3 font-black text-2xl outline-none focus:bg-yellow-50 uppercase italic shadow-inner" placeholder="MISSION TITLE..." />
            <textarea {...register("description")} className="w-full border-2 border-black p-3 h-24 text-xs font-bold outline-none focus:bg-slate-50" placeholder="MISSION DESCRIPTION..." />
          </div>

          <div className="lg:col-span-1">
              <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Thumbnail</label>
              <div className="border-4 border-black w-full aspect-square bg-slate-100 relative group overflow-hidden flex items-center justify-center">
                {watch("thumbnail") ? <img src={watch("thumbnail")} className="w-full h-full object-cover" alt="thumb" /> : <ImageIcon size={40} className="opacity-10" />}
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 cursor-pointer transition-all text-white font-black text-[10px] uppercase gap-2">
                  <Upload size={20} />
                  <span>Change Image</span>
                  <input type="file" className="hidden" onChange={(e) => handleUpload(e, "thumbnail")} />
                </label>
              </div>
          </div>
        </section>

        {/* PANELS SECTION */}
        <div className="w-full space-y-16 pb-20">
          {sceneFields.map((field, index) => (
            <div key={field.id} className="w-full border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute -top-5 left-6 bg-yellow-400 border-4 border-black px-4 py-1 font-black text-sm italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10 uppercase">
                {selectedType === "challenge" ? "Question" : "Scene"} #{index + 1}
              </div>

              <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-8 mt-4">
                
                {/* VISUAL SETTINGS (HIDE ON CHALLENGE) */}
                {selectedType !== "challenge" && (
                  <div className="xl:col-span-3 space-y-5 animate-in slide-in-from-left-4 duration-500">
                    <div className="border-2 border-black p-4 bg-indigo-50 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase flex items-center gap-1"><Palette size={12}/> BG Color</label>
                        <input type="color" {...register(`scenes.${index}.backgroundClass`)} className="w-8 h-8 border-2 border-black cursor-pointer bg-transparent" />
                      </div>
                      <div className="aspect-video border-2 border-black bg-white relative group/img overflow-hidden flex items-center justify-center">
                        {watch(`scenes.${index}.backgroundImage`) ? <img src={watch(`scenes.${index}.backgroundImage`)} className="w-full h-full object-cover" alt="bg" /> : <Upload size={16} className="opacity-10" />}
                        <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <Upload size={16} className="text-white" />
                          <input type="file" className="hidden" onChange={(e) => handleUpload(e, `scenes.${index}.backgroundImage` as const)} />
                        </label>
                      </div>
                    </div>

                    <div className="border-2 border-black p-4 bg-orange-50 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <label className="text-[9px] font-black uppercase flex items-center gap-1"><User size={12}/> Character</label>
                      <input {...register(`scenes.${index}.characterName`)} className="w-full border-2 border-black p-2 text-xs font-black outline-none bg-white" placeholder="Name..." />
                      <div className="aspect-square border-2 border-black bg-white relative group/char overflow-hidden flex items-center justify-center">
                         {watch(`scenes.${index}.characterImage`) ? <img src={watch(`scenes.${index}.characterImage`)} className="h-full object-contain" alt="actor" /> : <Upload size={16} className="opacity-10" />}
                         <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/60 opacity-0 group-hover/char:opacity-100 transition-opacity">
                          <Upload size={16} className="text-white" />
                          <input type="file" className="hidden" onChange={(e) => handleUpload(e, `scenes.${index}.characterImage` as const)} />
                         </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* CONTENT AREA */}
                <div className={`${selectedType === "challenge" ? "xl:col-span-12" : "xl:col-span-9"} space-y-5 transition-all`}>
                     <div className="flex flex-wrap gap-4 items-end border-b-2 border-black pb-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-black uppercase text-gray-400">Internal Scene ID</label>
                          <input {...register(`scenes.${index}.id`)} className="w-full border-2 border-black p-2 text-xs font-mono font-bold bg-slate-50 outline-none" />
                        </div>
                        <div className="w-20 space-y-1 text-center">
                          <label className="text-[9px] font-black uppercase text-gray-400 block">Duration</label>
                          <input type="number" {...register(`scenes.${index}.duration`)} className="w-full border-2 border-black p-2 text-xs font-black text-center" placeholder="∞" />
                        </div>
                        <button type="button" onClick={() => removeScene(index)} className="bg-red-500 text-white border-2 border-black p-2 px-4 font-black text-[10px] uppercase hover:bg-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Delete</button>
                     </div>

                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase italic">
                          {selectedType === "challenge" ? "Question Text" : "Dialogue / Narration"}
                        </label>
                        <textarea {...register(`scenes.${index}.dialogue`)} className="w-full border-2 border-black p-4 font-bold text-lg min-h-[100px] outline-none bg-[#fffef0] shadow-inner leading-snug" />
                     </div>

                     {/* CHALLENGE VS EXPLANATION */}
                     {selectedType === "challenge" ? (
                       <div className="space-y-1 animate-in zoom-in-95 duration-300">
                          <label className="text-[10px] font-black uppercase text-emerald-600 italic tracking-tight flex items-center gap-1">
                            <FileText size={12} /> Challenge Evidence (Source Data)
                          </label>
                          <textarea 
                            {...register(`scenes.${index}.evidenceText`)} 
                            className="w-full border-2 border-black p-3 text-[11px] font-bold bg-emerald-50 outline-none italic leading-relaxed" 
                            placeholder="Paste text/evidence for student to analyze here..."
                          />
                       </div>
                     ) : (
                       <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-blue-600 italic tracking-tight">Tooltip Explanation (Optional)</label>
                          <textarea 
                            {...register(`scenes.${index}.explanation`)} 
                            className="w-full border-2 border-black p-3 text-[11px] font-bold bg-blue-50 outline-none italic leading-relaxed" 
                          />
                       </div>
                     )}

                     <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 border-b-2 border-black pb-2">
                          <div className="bg-black text-yellow-400 p-1"><ChevronRight size={14} /></div>
                          <h4 className="font-black uppercase text-[11px] italic tracking-widest">Logic & Interactions</h4>
                        </div>
                        <ChoiceList sceneIndex={index} control={control} register={register} />
                     </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            type="button" 
            onClick={() => appendScene({ id: `sc_${Date.now()}`, characterName: "", backgroundClass: "#ffffff", dialogue: "", choices: [] })} 
            className="w-full py-10 border-4 border-dashed border-black font-black text-2xl hover:bg-yellow-400 transition-all uppercase italic bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            + Append New Panel
          </button>
        </div>
      </form>

      {uploadingField && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 text-[11px] font-black italic border-4 border-yellow-400 z-[9999] animate-pulse shadow-2xl">
          ASSET UPLOAD IN PROGRESS...
        </div>
      )}
    </div>
  );
}


function ChoiceList({ sceneIndex, control, register }: { sceneIndex: number, control: Control<MissionFormData>, register: UseFormRegister<MissionFormData> }) {
  const { fields, append, remove } = useFieldArray({ control, name: `scenes.${sceneIndex}.choices` as const });

  return (
    <div className="grid grid-cols-1 gap-3">
      {fields.map((choice, cIdx) => (
        <div key={choice.id} className="border-2 border-black p-3 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 group/choice">
          <div className="flex flex-wrap lg:flex-nowrap gap-3 items-end">
            <div className="flex-grow space-y-1">
              <label className="text-[8px] font-black text-gray-400 uppercase">Button Text</label>
              <input {...register(`scenes.${sceneIndex}.choices.${cIdx}.text`)} className="w-full p-2 text-xs font-black border-2 border-black outline-none italic bg-transparent focus:bg-yellow-50" />
            </div>
            <div className="w-28 space-y-1">
              <label className="text-[8px] font-black text-indigo-600 uppercase italic">Target ID</label>
              <input {...register(`scenes.${sceneIndex}.choices.${cIdx}.nextSceneId`)} className="w-full p-2 text-[10px] border-2 border-black font-bold bg-indigo-50 text-center outline-none" />
            </div>
            <div className="w-16 space-y-1">
              <label className="text-[8px] font-black text-green-600 uppercase">Points</label>
              <input type="number" {...register(`scenes.${sceneIndex}.choices.${cIdx}.scoreDelta`, { valueAsNumber: true })} className="w-full p-2 text-[10px] border-2 border-black font-black text-center outline-none" />
            </div>
            <div className="flex items-center gap-2 bg-slate-100 px-2 border-2 border-black h-[40px]">
               <div className="flex items-center gap-1">
                 <input type="checkbox" {...register(`scenes.${sceneIndex}.choices.${cIdx}.isCorrect`)} className="w-4 h-4 accent-black" id={`correct-${choice.id}`} />
                 <label htmlFor={`correct-${choice.id}`} className="text-[8px] font-black uppercase cursor-pointer">Correct?</label>
               </div>
               <div className="h-4 w-[1px] bg-black/20 mx-1" />
               <select {...register(`scenes.${sceneIndex}.choices.${cIdx}.feedbackStyle`)} className="text-[9px] font-black bg-transparent outline-none uppercase cursor-pointer">
                  <option value="none">No Pop</option>
                  <option value="pop">Modal</option>
                  <option value="subtle">Subtle</option>
               </select>
            </div>
            <button type="button" onClick={() => remove(cIdx)} className="bg-black text-white p-2.5 hover:bg-red-500 transition-colors border-2 border-black">
              <Trash2 size={16}/>
            </button>
          </div>
          <div className="relative">
            <label className="text-[8px] font-black uppercase absolute -top-1.5 left-2 bg-white px-1 text-gray-400">Feedback Content</label>
            <input {...register(`scenes.${sceneIndex}.choices.${cIdx}.feedback`)} placeholder="Feedback shown after selection..." className="w-full p-2 text-[10px] italic border-2 border-dotted border-black outline-none bg-slate-50 focus:bg-white" />
          </div>
        </div>
      ))}
      <button 
        type="button" 
        onClick={() => append({ id: `c_${Date.now()}`, text: "", nextSceneId: "", feedback: "", feedbackStyle: "none", scoreDelta: 0 })}
        className="w-full py-2 border-2 border-black border-dashed font-black text-[10px] hover:bg-black hover:text-white transition-all uppercase tracking-widest bg-white"
      >
        + Add New Interaction
      </button>
    </div>
  );
}