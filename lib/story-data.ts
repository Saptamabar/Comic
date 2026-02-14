import { Mission, Scene } from "./types";

// --- MISSION 1: PROKLAMASI ---
const PROKLAMASI_SCENES: Record<string, Scene> = {
    // --- PROLOGUE: VACUUM OF POWER ---
    "prologue_1": {
        id: "prologue_1",
        backgroundClass: "bg-black",
        backgroundImage: "/assets/backgrounds/mushroom_cloud.webp",
        characterName: "Sejarah",
        characterImage: "",
        dialogue: "Agustus 1945. Perang Dunia II mencapai puncaknya. Bom atom meluluhlantakkan Hiroshima dan Nagasaki.",
        choices: [
            {
                id: "next_1",
                text: "LANJUT >>",
                nextSceneId: "prologue_2",
                feedback: "",
                feedbackStyle: "none",
                scoreDelta: 0
            }
        ]
    },
    "prologue_2": {
        id: "prologue_2",
        backgroundClass: "bg-gray-800",
        characterName: "Radio Jepang",
        dialogue: "15 Agustus 1945. Kaisar Hirohito mengumumkan menyerah tanpa syarat kepada Sekutu.",
        choices: [
            {
                id: "next_2",
                text: "LANJUT >>",
                nextSceneId: "prologue_3",
                feedback: "",
                feedbackStyle: "none",
                scoreDelta: 0
            }
        ]
    },
    "prologue_3": {
        id: "prologue_3",
        backgroundClass: "bg-red-900",
        characterName: "Wikana",
        characterImage: "/assets/characters/wikana.webp",
        dialogue: "Tapi kami mendengarnya! Sutan Sjahrir mendengar berita itu dari radio BBC. Terjadi 'Vacuum of Power'. Kekosongan kekuasaan!",
        choices: [
            {
                id: "start_game",
                text: "MASUK KE CERITA UTAMA >>",
                nextSceneId: "start",
                feedback: "Waktunya bertindak!",
                feedbackStyle: "pop",
                scoreDelta: 0
            }
        ]
    },

    // --- BABAK 1: KONFLIK AWAL ---
    "start": {
        id: "start",
        backgroundClass: "bg-pop-yellow",
        backgroundImage: "/assets/backgrounds/start_bg.webp",
        characterName: "Wikana (Pemuda)",
        characterImage: "/assets/characters/wikana.webp",
        dialogue: "Bung! Jepang sudah menyerah pada Sekutu! Terjadi kekosongan kekuasaan. Kita tidak boleh menunggu janji Jepang. Kita harus proklamasi SEKARANG!",
        audio: {
            bgm: "/assets/audio/bgm/tension.mp3",
            sfx: "/assets/audio/sfx/door_slam.mp3"
        },
        choices: [
            {
                id: "c1",
                text: "Sabar, Wikana. Kita harus rapatkan dulu dengan PPKI agar tidak terjadi pertumpahan darah.",
                nextSceneId: "conflict_youth",
                feedback: "ZAP! Para pemuda marah! Mereka menganggap PPKI adalah buatan Jepang.",
                scoreDelta: -10,
                isCorrect: false
            },
            {
                id: "c2",
                text: "Benar! Ini kesempatan emas. Tapi bagaimana cara meyakinkan Soekarno-Hatta?",
                nextSceneId: "kidnap_plan",
                feedback: "SIP! Semangat revolusioner menyala. Kita butuh tindakan drastis.",
                scoreDelta: 10,
                isCorrect: true
            }
        ]
    },
    "conflict_youth": {
        id: "conflict_youth",
        backgroundClass: "bg-pop-red",
        characterName: "Chairul Saleh",
        dialogue: "PPKI itu bentukan Jepang! Kemerdekaan harus dari kekuatan kita sendiri, bukan hadiah! Jika Bung tidak bertindak, kami yang akan bertindak!",
        choices: [
            {
                id: "c3",
                text: "Baiklah, tapi jangan gegabah.",
                nextSceneId: "kidnap_plan",
                feedback: "Situasi memanas. Pemuda memutuskan untuk 'mengamankan' Dwi Tunggal.",
                scoreDelta: 5,
                isCorrect: true
            },
            {
                id: "c4",
                text: "Saya tetap pada pendirian saya menunggu sidang PPKI.",
                nextSceneId: "fail_too_slow",
                feedback: "Belanda membonceng Sekutu dan kembali menguasai Indonesia sebelum proklamasi.",
                scoreDelta: -50,
                isCorrect: false
            }
        ]
    },

    // --- BABAK 2: RENGASDENGKLOK ---
    "kidnap_plan": {
        id: "kidnap_plan",
        backgroundClass: "bg-blue-900", // Malam hari
        characterName: "Narator",
        dialogue: "16 Agustus 1945, dini hari. Para pemuda membawa Soekarno dan Hatta ke Rengasdengklok agar terhindar dari pengaruh Jepang.",
        choices: [
            {
                id: "c5",
                text: "Menuju rumah Djiaw Kie Siong di Rengasdengklok",
                nextSceneId: "rengasdengklok_talk",
                feedback: "Perjalanan sunyi dan tegang...",
                scoreDelta: 0,
                isCorrect: true
            }
        ]
    },
    "rengasdengklok_talk": {
        id: "rengasdengklok_talk",
        backgroundClass: "bg-green-700", // Suasana desa
        characterName: "Soekarno",
        dialogue: "Kalian ini maunya apa? Membawa saya jauh-jauh ke sini. Jika saya ditekan, saya justru tidak mau bicara!",
        choices: [
            {
                id: "c6",
                text: "Ancam Soekarno dengan senjata!",
                nextSceneId: "fail_aggression",
                feedback: "Soekarno marah besar dan menolak bekerja sama. Perjuangan gagal.",
                scoreDelta: -30,
                isCorrect: false
            },
            {
                id: "c7",
                text: "Bung, ini demi rakyat. Jepang sudah kalah. Jika tidak sekarang, Belanda akan kembali.",
                nextSceneId: "maeda_house",
                feedback: "Hati Soekarno luluh setelah Ahmad Soebardjo datang menjemput dan menjamin proklamasi.",
                scoreDelta: 20,
                isCorrect: true
            }
        ]
    },

    // --- BABAK 3: PERUMUSAN NASKAH (RUMAH MAEDA) ---
    "maeda_house": {
        id: "maeda_house",
        backgroundClass: "bg-gray-800", // Interior malam
        characterName: "Ahmad Soebardjo",
        dialogue: "Kita aman di rumah Laksamana Maeda. Sekarang, mari kita susun naskahnya. Bung Karno yang menulis, Bung Hatta dan saya menyumbang ide.",
        choices: [
            {
                id: "c8",
                text: "Tulis: 'Kami bangsa Indonesia dengan ini menyatakan kemerdekaan Indonesia.'",
                nextSceneId: "drafting_sentence_2",
                feedback: "Kalimat pertama dari Bung Soebardjo. Tegas dan jelas!",
                scoreDelta: 10,
                isCorrect: true
            }
        ]
    },
    "drafting_sentence_2": {
        id: "drafting_sentence_2",
        backgroundClass: "bg-gray-800",
        characterName: "Moh. Hatta",
        dialogue: "Kita perlu kalimat mengenai pengalihan kekuasaan. Bagaimana bunyinya?",
        choices: [
            {
                id: "c9",
                text: "Tulis: 'Hal-hal yang mengenai pemindahan kekuasaan d.l.l, diselenggarakan dengan cara saksama dan dalam tempo yang sesingkat-singkatnya.'",
                nextSceneId: "signing_moment",
                feedback: "Sempurna! Kalimat pragmatis dari Bung Hatta.",
                scoreDelta: 20,
                isCorrect: true
            },
            {
                id: "c10",
                text: "Tulis: 'Jepang harus menyerahkan kekuasaan kepada kita detik ini juga atau perang!'",
                nextSceneId: "fail_diplomacy",
                feedback: "Terlalu provokatif! Tentara Jepang di luar bisa menyerbu masuk.",
                scoreDelta: -20,
                isCorrect: false
            }
        ]
    },

    // --- BABAK 4: PENANDATANGANAN ---
    "signing_moment": {
        id: "signing_moment",
        backgroundClass: "bg-gray-700",
        characterName: "Soekarno",
        dialogue: "Naskah sudah jadi. Siapa yang harus menandatangani ini? Apakah semua yang hadir di sini?",
        choices: [
            {
                id: "c11",
                text: "Semua yang hadir tanda tangan (seperti deklarasi Amerika).",
                nextSceneId: "conflict_signing",
                feedback: "Para pemuda menolak! Ada orang-orang pro-Jepang di ruangan ini.",
                scoreDelta: -5,
                isCorrect: false
            },
            {
                id: "c12",
                text: "Usul Sukarni: Cukup Bung Karno dan Bung Hatta saja, atas nama bangsa Indonesia.",
                nextSceneId: "proklamasi_day",
                feedback: "Ide brilian! Naskah menjadi simbol persatuan dwi-tunggal.",
                scoreDelta: 30,
                isCorrect: true
            }
        ]
    },

    // --- BABAK 5: PROKLAMASI ---
    "proklamasi_day": {
        id: "proklamasi_day",
        backgroundClass: "bg-pop-yellow",
        characterName: "17 Agustus 1945",
        dialogue: "Pukul 10.00 Pagi di Pegangsaan Timur 56. Bendera Merah Putih buatan Ibu Fatmawati siap dikibarkan. Mikrofon siap.",
        choices: [
            {
                id: "c13",
                text: "BACAKAN PROKLAMASI!",
                nextSceneId: "victory",
                feedback: "MERDEKA! Suara Bung Karno menggema ke seluruh nusantara!",
                scoreDelta: 50,
                isCorrect: true
            }
        ]
    },

    // --- ENDINGS ---
    "victory": {
        id: "victory",
        backgroundClass: "bg-red-600",
        characterName: "INDONESIA MERDEKA",
        dialogue: "Selamat! Kamu berhasil menavigasi sejarah. Indonesia kini telah merdeka dan berdaulat!",
        choices: [
            {
                id: "restart",
                text: "Mainkan Misi Lain",
                nextSceneId: "end", // Goes to menu
                feedback: "Sejarah tidak akan terlupakan.",
                scoreDelta: 0
            }
        ]
    },
    "fail_too_slow": {
        id: "fail_too_slow",
        backgroundClass: "bg-gray-600",
        characterName: "Game Over",
        dialogue: "Kamu terlalu lama menunggu. Sekutu tiba dan Belanda mengambil alih kekuasaan kembali.",
        choices: [{ id: "retry", text: "Coba Lagi", nextSceneId: "start", feedback: "Jangan ragu kali ini.", scoreDelta: 0 }]
    },
    "fail_aggression": {
        id: "fail_aggression",
        backgroundClass: "bg-gray-600",
        characterName: "Game Over",
        dialogue: "Kekerasan bukanlah jalan keluar. Soekarno menolak memimpin revolusi.",
        choices: [{ id: "retry", text: "Coba Lagi", nextSceneId: "start", feedback: "Gunakan diplomasi.", scoreDelta: 0 }]
    },
    "fail_diplomacy": {
        id: "fail_diplomacy",
        backgroundClass: "bg-gray-600",
        characterName: "Game Over",
        dialogue: "Naskah yang terlalu keras memicu konflik dengan Jepang sebelum waktunya.",
        choices: [{ id: "retry", text: "Coba Lagi", nextSceneId: "start", feedback: "Pilih kata-kata dengan bijak.", scoreDelta: 0 }]
    },
    "conflict_signing": {
        id: "conflict_signing",
        backgroundClass: "bg-gray-700",
        characterName: "Sukarni",
        dialogue: "Tidak! Kami tidak mau tanda tangan bersama orang-orang yang menjadi boneka Jepang! Lebih baik Bung Karno dan Bung Hatta saja!",
        choices: [
            {
                id: "c12_retry",
                text: "Setuju dengan Sukarni.",
                nextSceneId: "proklamasi_day",
                feedback: "Keputusan tepat.",
                scoreDelta: 10,
                isCorrect: true
            }
        ]
    }
};

// --- MISSION 2: PERTEMPURAN SURABAYA ---
const SURABAYA_SCENES: Record<string, Scene> = {
    "start": {
        id: "start",
        backgroundClass: "bg-gray-900", // Dark gritty war theme
        characterName: "Bung Tomo",
        characterImage: "", // Needs asset
        dialogue: "10 November 1945. Inggris mengeluarkan ultimatum: 'Serahkan senjata atau kami gempur Surabaya!' Apa yang harus kita lakukan, Saudara-saudara?!",
        choices: [
            {
                id: "s1",
                text: "Menyerah demi keselamatan warga.",
                nextSceneId: "fail_surrender",
                feedback: "Inggris masuk tanpa perlawanan. Semangat kemerdekaan padam.",
                scoreDelta: -100,
                feedbackStyle: "subtle"
            },
            {
                id: "s2",
                text: "Jawab dengan Pidato di Radio: MERDEKA ATAU MATI!",
                nextSceneId: "speech_radio",
                feedback: "ALLAHU AKBAR! MERDEKA! Kota Surabaya membara!",
                scoreDelta: 50,
                feedbackStyle: "pop"
            }
        ]
    },
    "speech_radio": {
        id: "speech_radio",
        backgroundClass: "bg-pop-red",
        characterName: "Radio Pemberontakan",
        dialogue: "Suaramu membakar semangat arek-arek Suroboyo! Namun tank Stuart Inggris mulai bergerak masuk kota.",
        choices: [
            {
                id: "s3",
                text: "Perintahkan serangan gerilya kota.",
                nextSceneId: "guinea_victory",
                feedback: "Pertempuran sengit terjadi di setiap sudut kota.",
                scoreDelta: 20
            }
        ]
    },
    "guinea_victory": {
        id: "guinea_victory",
        backgroundClass: "bg-pop-red",
        characterName: "Pertahanan Kota",
        dialogue: "Brigadir Mallaby tewas! Inggris marah besar, tapi dunia melihat bahwa Indonesia berdaulat dan siap mati demi kemerdekaan!",
        choices: [
            {
                id: "finish",
                text: "Kenang Pahlawan",
                nextSceneId: "end",
                feedback: "Hari Pahlawan lahir dari darah dan keringat.",
                scoreDelta: 50
            }
        ]
    },
    "fail_surrender": {
        id: "fail_surrender",
        backgroundClass: "bg-gray-600",
        characterName: "Kekalahan",
        dialogue: "Surabaya jatuh tanpa perlawanan. Sejarah mencatat kita sebagai pengecut.",
        choices: [{ id: "retry", text: "Ulangi Sejarah", nextSceneId: "start", feedback: "Jangan takut!", scoreDelta: 0 }]
    }
};


export const MISSIONS: Mission[] = [
    {
        id: "proklamasi",
        title: "PROKLAMASI '45",
        description: "Navigasi detik-detik menegangkan menuju kemerdekaan Indonesia. Dari Rengasdengklok hingga Pegangsaan Timur.",
        thumbnail: "/assets/missions/proklamasi_thumb.webp", // Placeholder
        startSceneId: "prologue_1",
        scenes: PROKLAMASI_SCENES
    },
    {
        id: "surabaya",
        title: "SURABAYA MEMBARA",
        description: "10 November 1945. Inggris mengancam. Bung Tomo berteriak. Pertahankan harga diri bangsa!",
        thumbnail: "/assets/missions/surabaya_thumb.webp", // Placeholder
        startSceneId: "start",
        scenes: SURABAYA_SCENES
    }
];

// Fallback for types or legacy support (points to first mission)
export const STORY_DATA = PROKLAMASI_SCENES;