"use client";

import { LandingPage } from "@/components/landing/LandingPage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleStartGame = (missionId?: string) => {
    if (user) {
      if (missionId) {
        router.push(`/game/story/${missionId}/game`);
      } else {
        router.push('/dashboard/story');
      }
    } else {
      router.push('/auth/user');
    }
  };

  return <LandingPage onStartGame={handleStartGame} />;
}
