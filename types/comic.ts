export interface Mission {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    startSceneId: string;
    createdAt?: any;
}

export interface Scene {
    id: string;
    missionId: string;
    characterName: string;
    characterImage: string;
    backgroundImage: string;
    backgroundClass: string;
    dialogue: string;
    audio?: {
        bgm?: string;
        sfx?: string;
    };
}

export interface Choice {
    id: string;
    sceneId: string;
    text: string;
    nextSceneId: string;
    scoreDelta: number;
    isCorrect: boolean;
    feedback?: string;
}