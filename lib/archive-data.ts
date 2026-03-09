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
        image: "/assets/characters/soekarno.png"
    },
    {
        id: "hatta",
        title: "Mohammad Hatta",
        content: "Served as Indonesia's first vice president. He was a key figure in the struggle for independence and is often called the 'Proclamator' alongside Soekarno.",
        unlockCondition: "maeda_house",
        image: "/assets/characters/hatta.png"
    },
    {
        id: "wikana",
        title: "Wikana",
        content: "A youth leader (pemuda) who played a central role in the Rengasdengklok incident. He pressed Soekarno and Hatta to declare independence immediately.",
        unlockCondition: "conflict_youth",
        image: "/assets/characters/wikana.png"
    },
    {
        id: "rengasdengklok",
        title: "Peristiwa Rengasdengklok",
        content: "Pada 16 Agustus 1945, pemuda menculik Soekarno dan Hatta ke Rengasdengklok, Karawang. Tujuannya adalah menjauhkan mereka dari pengaruh Jepang dan mendesak proklamasi segera.",
        unlockCondition: "rengasdengklok_phase_1"
    },
    {
        id: "rahasia_diplomasi",
        title: "[RAHASIA] Sukses Diplomasi",
        content: "Anda berhasil meyakinkan Bung Karno murni dengan adu ideologi rasional tanpa memicu kekerasan fisik maupun intervensi Ahmad Soebardjo. Bukti bahwa kata-kata sekuat ujung pedang.",
        unlockCondition: "rengasdengklok_resolution_success"
    },
    {
        id: "naskah_proklamasi",
        title: "Naskah Proklamasi",
        content: "Teks dirumuskan di rumah Laksamana Maeda. Soekarno menulisnya, disumbang ide oleh Hatta dan Ahmad Soebardjo. Diketik oleh Sayuti Melik.",
        unlockCondition: "signing_moment"
    }
];
