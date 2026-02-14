"use client";

import { GameProvider, useGame } from "@/context/GameContext";
import { StartScreen } from "@/components/game/StartScreen";
import { GameContainer } from "@/components/game/GameContainer";
import { EndScreen } from "@/components/game/EndScreen";

function SejarahKuApp() {
  const { gameStatus } = useGame();

  if (gameStatus === "playing") return <GameContainer />;
  if (gameStatus === "ended") return <EndScreen />;
  return <StartScreen />;
}

export default function Home() {
  return (
    <GameProvider>
      <SejarahKuApp />
    </GameProvider>
  );
}
