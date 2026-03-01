export type Choice = {
    id: string;
    text: string;
    nextSceneId: string;
    feedback: string;
    feedbackStyle?: "pop" | "subtle" | "none"; // Defaults to "pop" if undefined
    scoreDelta?: number;
    isCorrect?: boolean;
};

export type Scene = {
    id: string;
    backgroundClass: string; // Tailwind class fallback
    backgroundImage?: string; // Path to asset (e.g., "/assets/backgrounds/scene1.jpg")
    characterImage?: string; // Path to asset (e.g., "/assets/characters/wikana.png")
    characterName: string;
    dialogue: string;
    audio?: {
        bgm?: string; // Path to background music
        sfx?: string; // Path to sound effect on scene start
    };
    explanation?: string; // Penjelasan historis mengapa suatu pilihan berakhir salah/kritis
    choices: Choice[];
};

export type GameState = {
    currentSceneId: string;
    score: number;
    history: string[]; // List of visited scene IDs
    showFeedback: boolean;
    lastFeedback: string | null;
};

export type Mission = {
    id: string;
    title: string;
    description: string;
    thumbnail: string; // Path to image used in selector
    startSceneId: string;
    scenes: Record<string, Scene>;
};
