import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

export const finishMission = async (userId: string, missionId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const progressRef = doc(db, "users", userId, "completedMissions", missionId);

    await setDoc(progressRef, {
      completedAt: serverTimestamp(),
      xpGained: 50
    });

    await updateDoc(userRef, {
      xp: increment(50),
      lastUpdated: serverTimestamp()
    });

    return true;
  } catch (err) {
    console.error("Gagal update progress:", err);
    return false;
  }
};