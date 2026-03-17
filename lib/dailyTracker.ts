import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";

/**
 * Update progres
 * @param type 
 * @param value
 */
export const updateDailyProgress = async (userId: string, type: "finish_one_comic" | "earn_100_xp", value: number) => {
  const today = new Date().toLocaleDateString('en-CA');
  const progressRef = doc(db, "users", userId, "daily_progress", today);
  const userRef = doc(db, "users", userId);

  try {
    const docSnap = await getDoc(progressRef);
    if (!docSnap.exists()) return;

    const missionData = docSnap.data().missions[type];
    if (missionData.completed) return; 

    const newProgress = missionData.current + value;
    const isNowCompleted = newProgress >= missionData.goal;

    await updateDoc(progressRef, {
      [`missions.${type}.current`]: increment(value),
      [`missions.${type}.completed`]: isNowCompleted
    });

    if (isNowCompleted) {
      await updateDoc(userRef, {
        xp: increment(missionData.reward)
      });
      console.log(`Daily Bonus: +${missionData.reward} XP gained!`);
    }
  } catch (error) {
    console.error("Error updating daily progress:", error);
  }
};