"use client";

import React, { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase"; 
import { collection, onSnapshot, doc, setDoc, query, orderBy } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

    const [statusMsg, setStatusMsg] = useState<{type: 'error' | 'success', text: string} | null>(null);

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("name", "asc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const userData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as UserData[];
            setUsers(userData);
        });
        return () => unsub();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatusMsg(null);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                newUser.email, 
                newUser.password
            );
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: new Date().toISOString()
            });

            setStatusMsg({ type: 'success', text: "AGENT DEPLOYED SUCCESSFULLY!" });
            
            
            setTimeout(() => {
                setIsModalOpen(false);
                setNewUser({ name: "", email: "", password: "", role: "user" });
                setStatusMsg(null);
            }, 1500);

        } catch (err: unknown) {
        const error = err as { code?: string; message: string };
        console.error("Error creating user:", error);
        let message = "AN UNKNOWN ERROR OCCURRED.";
        if (error.code === 'auth/email-already-in-use') {
            message = "EMAIL ALREADY REGISTERED IN THE SYSTEM!";
        } else if (error.code === 'auth/invalid-email') {
            message = "INVALID EMAIL FORMAT!";
        } else if (error.code === 'auth/weak-password') {
            message = "PASSWORD IS TOO WEAK (MIN. 6 CHARS)!";
        } else if (error.code === 'auth/network-request-failed') {
            message = "NETWORK ERROR. CHECK YOUR CONNECTION!";
        } else {
            
            message = error.message.toUpperCase();
        }

        setStatusMsg({ type: 'error', text: message });
    } finally {
        setLoading(false);
    }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 bg-white min-h-screen font-comic">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-5xl font-bangers text-black drop-shadow-[3px_3px_0_#ff4733] uppercase">
                        Command Center: User Management
                    </h1>
                    <p className="text-gray-500 font-bold tracking-widest">AUTHORIZED PERSONNEL ONLY</p>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder="Search Agents..." 
                        className="border-4 border-black p-2 flex-grow md:w-64 shadow-[4px_4px_0_#000] outline-none focus:bg-yellow-50"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-pop-blue text-white font-bangers text-xl px-6 py-2 border-4 border-black shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none transition-all"
                    >
                        + NEW AGENT
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border-4 border-black shadow-[8px_8px_0_#000] overflow-hidden bg-white">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-black text-white font-bangers text-2xl">
                        <tr>
                            <th className="p-4 border-b-4 border-black">NAME</th>
                            <th className="p-4 border-b-4 border-black">EMAIL</th>
                            <th className="p-4 border-b-4 border-black">ROLE</th>
                        </tr>
                    </thead>
                    <tbody className="font-bold text-lg">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b-2 border-black hover:bg-gray-50">
                                <td className="p-4 uppercase">{user.name}</td>
                                <td className="p-4 text-gray-600 font-mono">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000] text-sm ${user.role === 'admin' ? 'bg-pop-red text-white' : 'bg-pop-yellow text-black'}`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => !loading && setIsModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
                            className="relative bg-white border-8 border-black p-8 w-full max-w-md shadow-[12px_12px_0_#ff4733]"
                        >
                            <h2 className="text-4xl font-bangers mb-6 text-center border-b-4 border-black pb-2 uppercase">Create Agent</h2>
                            
                            {/* Notifikasi Alert */}
                            <AnimatePresence>
                                {statusMsg && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-3 mb-4 border-4 border-black font-bold text-center uppercase text-sm ${
                                            statusMsg.type === 'error' ? 'bg-pop-red text-white' : 'bg-green-400 text-black'
                                        }`}
                                    >
                                        {statusMsg.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleAddUser} className="space-y-4">
                                <div>
                                    <label className="block font-bold mb-1 uppercase text-sm italic">Name</label>
                                    <input required type="text" value={newUser.name} className="w-full border-4 border-black p-2 outline-none focus:bg-yellow-50" 
                                        onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1 uppercase text-sm italic">Email</label>
                                    <input required type="email" value={newUser.email} className="w-full border-4 border-black p-2 outline-none focus:bg-yellow-50" 
                                        onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1 uppercase text-sm italic">Password</label>
                                    <input required type="password" value={newUser.password} placeholder="Min. 6 characters" className="w-full border-4 border-black p-2 outline-none focus:bg-yellow-50" 
                                        onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block font-bold mb-1 uppercase text-sm italic">Role</label>
                                    <select value={newUser.role} className="w-full border-4 border-black p-2 outline-none font-bold"
                                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                                        <option value="user">USER (AGENT)</option>
                                        <option value="admin">ADMIN (COMMANDER)</option>
                                    </select>
                                </div>
                                
                                <button 
                                    disabled={loading}
                                    type="submit" 
                                    className={`w-full bg-black text-white font-bangers text-2xl py-4 mt-4 shadow-[4px_4px_0_#aaa] transition-all
                                    ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pop-red active:scale-95'}`}
                                >
                                    {loading ? "INITIALIZING..." : "CONFIRM IDENTITY!"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}