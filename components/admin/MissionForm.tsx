"use client";

import React, { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Mission } from "@/types/comic";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function MissionForm({ mission, onClose }: { mission: Mission | null, onClose: () => void }) {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string>(mission?.thumbnail || "");
    const [statusMsg, setStatusMsg] = useState<{type: 'error' | 'success', text: string} | null>(null);

    const [formData, setFormData] = useState({
        slug: mission?.id || "",
        title: mission?.title || "",
        description: mission?.description || "",
        startSceneId: mission?.startSceneId || ""
    });

    
    const handleFileUpload = async (file: File) => {
        try {
    
            const signRes = await fetch("/api/sign-cloudinary", { method: "POST" });
            const { signature, timestamp } = await signRes.json();

            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
            uploadData.append("timestamp", timestamp.toString());
            uploadData.append("signature", signature);
            
            uploadData.append("folder", "revolusi45/agents"); 

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: uploadData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error.message);

            return data.secure_url;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan Intel";
            throw new Error(errorMessage);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fileInput = (e.currentTarget.elements.namedItem("thumbnailFile") as HTMLInputElement).files?.[0];
        
        setLoading(true);
        setStatusMsg(null);

        try {
            let imageUrl = mission?.thumbnail || "";

            if (fileInput) {
                setStatusMsg({ type: 'success', text: "UPLOADING THUMBNAIL..." });
                imageUrl = await handleFileUpload(fileInput);
            }

            const dataToSave = {
                title: formData.title,
                description: formData.description,
                thumbnail: imageUrl,
                startSceneId: formData.startSceneId,
                updatedAt: serverTimestamp(),
            };

            if (mission) {
                await updateDoc(doc(db, "missions", mission.id), dataToSave);
            } else {
                const finalSlug = formData.slug.toLowerCase().replace(/\s+/g, '-');
                await setDoc(doc(db, "missions", finalSlug), {
                    ...dataToSave,
                    createdAt: serverTimestamp()
                });
            }

            setStatusMsg({ type: 'success', text: "DATA SECURED!" });
            setTimeout(onClose, 1500);
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: `ERROR: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !loading && onClose()} />
            
            <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="relative bg-white border-8 border-black p-8 w-full max-w-2xl shadow-[15px_15px_0_#ff4733] my-auto"
            >
                <h2 className="text-4xl font-bangers mb-6 border-b-4 border-black pb-2 text-center text-black">
                    {mission ? "UPDATE MISSION" : "NEW MISSION BRIEF"}
                </h2>

                <AnimatePresence>
                    {statusMsg && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className={`p-3 mb-4 border-4 border-black font-bold text-center text-xs uppercase ${statusMsg.type === 'error' ? 'bg-pop-red text-white' : 'bg-green-400 text-black'}`}>
                            {statusMsg.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 font-bold text-black text-[10px] uppercase">
                    <div className="col-span-2 flex flex-col items-center gap-4 p-4 border-4 border-dashed border-black bg-gray-50">
                        <div className="relative w-48 h-28 border-4 border-black shadow-[4px_4px_0_#000] bg-gray-200">
                            {preview ? (
                                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">NO IMAGE</div>
                            )}
                        </div>
                        <input 
                            name="thumbnailFile"
                            type="file" 
                            accept="image/*" 
                            className="text-[10px]"
                            onChange={(e) => e.target.files?.[0] && setPreview(URL.createObjectURL(e.target.files[0]))}
                        />
                    </div>

                    {!mission && (
                        <div className="col-span-2">
                            <label>Mission ID (Slug)</label>
                            <input required className="w-full border-4 border-black p-2 mt-1 focus:bg-yellow-50 outline-none" 
                                value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
                        </div>
                    )}
                    
                    <div className="col-span-2 text-black">
                        <label>Title</label>
                        <input required className="w-full border-4 border-black p-2 mt-1 focus:bg-yellow-50 outline-none" 
                            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>

                    <div className="col-span-2 text-black">
                        <label>Description</label>
                        <textarea required className="w-full border-4 border-black p-2 mt-1 h-20 focus:bg-yellow-50 outline-none" 
                            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>

                    <div className="col-span-2 text-black">
                        <label>Start Scene ID</label>
                        <input required className="w-full border-4 border-black p-2 mt-1 focus:bg-yellow-50 outline-none" 
                            placeholder="e.g: scene_1"
                            value={formData.startSceneId} onChange={(e) => setFormData({...formData, startSceneId: e.target.value})} />
                    </div>

                    <div className="col-span-2 flex gap-4 mt-4">
                        <button type="button" onClick={onClose} disabled={loading} className="flex-1 border-4 border-black py-3 font-bangers text-xl">ABORT</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-black text-white py-3 font-bangers text-xl shadow-[5px_5px_0_#666] active:translate-y-1 transition-all">
                            {loading ? "SAVING..." : "SAVE MISSION"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}