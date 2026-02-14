export interface ArchiveEntry {
    id: string;
    title: string;
    content: string;
    image?: string; // Optional path to image
    unlockCondition: string; // Scene ID that unlocks this
}

export const ARCHIVE_DATA: ArchiveEntry[] = [
    {
        id: "soekarno",
        title: "Ir. Soekarno",
        content: "The proclamation of Indonesian independence was read by Soekarno, accompanied by Mohammad Hatta. Born in Surabaya, he was a prominent leader of Indonesia's nationalist movement during the Dutch colonial period.",
        unlockCondition: "start", // Unlocked from beginning or early
        image: "/assets/characters/soekarno.webp"
    },
    {
        id: "hatta",
        title: "Mohammad Hatta",
        content: "Served as Indonesia's first vice president. He was a key figure in the struggle for independence and is often called the 'Proclamator' alongside Soekarno.",
        unlockCondition: "maeda_house",
        image: "/assets/characters/hatta.webp"
    },
    {
        id: "wikana",
        title: "Wikana",
        content: "A youth leader (pemuda) who played a central role in the Rengasdengklok incident. He pressed Soekarno and Hatta to declare independence immediately.",
        unlockCondition: "conflict_youth",
        image: "/assets/characters/wikana.webp"
    },
    {
        id: "rengasdengklok",
        title: "Rengasdengklok Incident",
        content: "On August 16, 1945, youth leaders kidnapped Soekarno and Hatta to Rengasdengklok, Karawang. Their goal was to distance the leaders from Japanese influence and urge an immediate proclamation.",
        unlockCondition: "rengasdengklok_talk"
    },
    {
        id: "naskah_proklamasi",
        title: "Naskah Proklamasi",
        content: "The text was drafted in the house of Rear Admiral Maeda. Soekarno wrote it, while Hatta and Ahmad Soebardjo contributed ideas. It was typed by Sayuti Melik.",
        unlockCondition: "signing_moment"
    }
];
