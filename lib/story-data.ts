import { Mission, Scene } from "./types";

// --- MISSION 1: PROKLAMASI ---
const PROKLAMASI_SCENES: Record<string, Scene> = {
    // --- PROLOGUE: VACUUM OF POWER ---
    "prologue_1": {
        id: "prologue_1",
        backgroundClass: "bg-black",
        backgroundImage: "/assets/backgrounds/mushroom_cloud.png",
        characterName: "Sejarah",
        characterImage: "/assets/characters/sejarah.png",
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
        characterImage: "/assets/characters/radio_jepang.png",
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
        characterImage: "/assets/characters/wikana.png",
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
        backgroundImage: "/assets/backgrounds/start_bg.png",
        characterName: "Wikana (Pemuda)",
        characterImage: "/assets/characters/wikana.png",
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
        characterImage: "/assets/characters/chairul.png",
        dialogue: "PPKI itu bentukan Jepang! Kemerdekaan harus dari kekuatan kita sendiri, bukan hadiah! Jika Bung tidak bertindak, kami yang akan bertindak!",
        explanation: "Secara historis, golongan muda radikal sangat anti-fasis. Menunggu PPKI sidang dianggap menyerahkan nasib kemerdekaan sebagai sekadar 'hadiah' dari Jepang, yang akan ditolak oleh Sekutu pemenang perang.",
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
                text: "Menyusup masuk ke rumah Tiau Kie Song di Rengasdengklok",
                nextSceneId: "rengasdengklok_phase_1",
                feedback: "Perjalanan sunyi dan tegang...",
                scoreDelta: 0,
                isCorrect: true
            }
        ]
    },
    "rengasdengklok_phase_1": {
        id: "rengasdengklok_phase_1",
        backgroundClass: "bg-green-700", // Suasana desa
        characterName: "Soekarno",
        dialogue: "Kalian ini maunya apa?! Membawa saya dan keluarga jauh-jauh ke tempat panas ini. Jika saya ditekan dan ditodong, saya justru pantang bicara!",
        choices: [
            {
                id: "c6",
                text: "[Marah] Jangan keras kepala, Bung! Rakyat sudah siap mati di Jakarta. Kemerdekaan harus direbut!",
                nextSceneId: "rengasdengklok_phase_2_emotional",
                feedback: "Soekarno malah semakin keras! Kematon rasionalitasmu menurun.",
                scoreDelta: -10,
                isCorrect: false
            },
            {
                id: "c7",
                text: "[Rasional] Maafkan kelancangan kami, Bung. Kami harus mengamankan Anda dari intrik Jepang yang ingin memanfaatkan vacuum of power.",
                nextSceneId: "rengasdengklok_phase_2_rational",
                feedback: "Nada bicaramu menenangkan Soekarno. Ia bersedia mendengarkan.",
                scoreDelta: 15,
                isCorrect: true
            }
        ]
    },
    "rengasdengklok_phase_2_emotional": {
        id: "rengasdengklok_phase_2_emotional",
        backgroundClass: "bg-red-800",
        characterName: "Soekarno",
        dialogue: "Kalau kalian sudah siap mati, kenapa tidak kalian sendiri yang proklamasi? Kenapa harus menyeret-nyeret saya? Saya ketua PPKI, saya tidak bisa bertindak di luar wewenang komite!",
        explanation: "Soekarno memiliki pendirian teguh dan karisma besar. Mendesaknya dengan kemarahan justru membuatnya meradang. Beliau menghitung risiko pertumpahan darah secara sangat rasional.",
        choices: [
            {
                id: "c6_fail",
                text: "[Sentuh Senjata] Jangan salahkan pemuda jika pisau kami bicara, Bung!",
                nextSceneId: "fail_aggression",
                feedback: "Kamu mengancam nyawa Proklamator. Sejarah hancur.",
                scoreDelta: -30,
                feedbackStyle: "subtle",
                isCorrect: false
            },
            {
                id: "c6_calm",
                text: "[Tenangkan Diri] Kemerdekaan via PPKI adalah kemerdekaan hadiah Jepang, Bung! Kita harus menyatakan merdeka atas nama bangsa sendiri!",
                nextSceneId: "rengasdengklok_resolution_saved",
                feedback: "Argumen yang valid, tapi Soekarno sudah terlanjur keki.",
                scoreDelta: 5,
                isCorrect: true
            }
        ]
    },
    "rengasdengklok_phase_2_rational": {
        id: "rengasdengklok_phase_2_rational",
        backgroundClass: "bg-green-800",
        characterName: "Soekarno",
        dialogue: "Saya dijanjikan kemerdekaan oleh Marsekal Terauchi tanggal 24 Agustus melalui PPKI. Saya tidak berhak mengumumkan proklamasi sendirian tanpa sidang PPKI.",
        choices: [
            {
                id: "c7_idealist",
                text: "Jepang sudah menyerah, Bung. PPKI otomatis bubar. Kemerdekaan kita adalah HAM, bukan hadiah Tokyo!",
                nextSceneId: "rengasdengklok_resolution_success",
                feedback: "SKAKMAT! Argumenmu brilian dan tidak terbantahkan!",
                scoreDelta: 25,
                feedbackStyle: "pop",
                isCorrect: true
            },
            {
                id: "c7_doubt",
                text: "Bagaimana jika kita adakan sidang PPKI di sini, sekarang juga?",
                nextSceneId: "rengasdengklok_resolution_saved",
                feedback: "Ide yang buruk. Anggota PPKI tertinggal di Jakarta.",
                scoreDelta: -5,
                isCorrect: false
            }
        ]
    },
    "rengasdengklok_resolution_success": {
        id: "rengasdengklok_resolution_success",
        backgroundClass: "bg-blue-800",
        characterName: "Narator",
        dialogue: "Soekarno terdiam. Ia menatap Hatta. Keduanya menyadari bahwa pemuda benar—sekarang atau tidak sama sekali. Mereka bersepakat sebelum siapapun menyusul.",
        choices: [
            {
                id: "c8_success",
                text: "Bawa Dwi-Tunggal kembali ke Jakarta!",
                nextSceneId: "maeda_house",
                feedback: "Anda membuka Archive Rahasia Rengasdengklok!",
                scoreDelta: 50,
                isCorrect: true
            }
        ]
    },
    "rengasdengklok_resolution_saved": {
        id: "rengasdengklok_resolution_saved",
        backgroundClass: "bg-gray-800",
        characterName: "Ahmad Soebardjo",
        characterImage: "/assets/characters/soebardjo.png",
        dialogue: "(Berkeringat dan terengah-engah mengetuk pintu) Berhenti! Jangan berdebat lagi. Saya menjamin dengan nyawa saya, Proklamasi akan dibacakan besok pagi!",
        explanation: "Bung Karno sangat enggan beraksi sebelum teryakini. Jika Anda terus ragu, Proklamasi gagal dirancang di Rengasdengklok. Untungnya, Ahmad Soebardjo datang dari Jakarta menyelamatkan situasi dengan taruhan nyawanya.",
        choices: [
            {
                id: "c8_saved",
                text: "Baguslah. Mari kita bawa pulang beliau ke Jakarta.",
                nextSceneId: "maeda_house",
                feedback: "Situasi terselamatkan oleh Bung Soebardjo.",
                scoreDelta: 0,
                feedbackStyle: "subtle",
                isCorrect: true
            }
        ]
    },

    // --- BABAK 3: PERUMUSAN NASKAH (RUMAH MAEDA) ---
    "maeda_house": {
        id: "maeda_house",
        backgroundClass: "bg-gray-800", // Interior malam
        backgroundImage: "/assets/backgrounds/maeda_house.png",
        characterName: "Ahmad Soebardjo",
        characterImage: "/assets/characters/soebardjo.png",
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
        characterImage: "/assets/characters/bendera.png",
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
        explanation: "Garis waktu (timeline) sangat krusial! Pada kenyataannya, Sekutu (AFNEI) yang diboncengi sekutu Belanda (NICA) tiba di Jakarta akhir September. Jika proklamasi terhambat, Indonesia berisiko disahkan kembali sebagai koloni Belanda.",
        choices: [{ id: "retry", text: "Coba Lagi", nextSceneId: "start", feedback: "Jangan ragu kali ini.", scoreDelta: 0 }]
    },
    "fail_aggression": {
        id: "fail_aggression",
        backgroundClass: "bg-gray-600",
        characterName: "Game Over",
        dialogue: "Kekerasan bukanlah jalan keluar. Soekarno menolak memimpin revolusi.",
        explanation: "Golongan pemuda (PETA/Barisan Pelopor) secara historis memang bersenjata saat menjemput Dwi-Tunggal. Namun, intimidasi fisik kepada Soekarno bisa membuat kemerdekaan kehilangan pemimpin terkuat pencatu persolidan bangsa.",
        choices: [{ id: "retry", text: "Coba Lagi", nextSceneId: "start", feedback: "Gunakan diplomasi.", scoreDelta: 0 }]
    },
    "fail_diplomacy": {
        id: "fail_diplomacy",
        backgroundClass: "bg-gray-600",
        characterName: "Game Over",
        dialogue: "Naskah yang terlalu keras memicu konflik dengan Jepang sebelum waktunya.",
        explanation: "Sikap Laksamana Maeda memang mendukung diam-diam karena simpati, tetapi memprovokasi militer Jepang secara frontal malam itu akan berbuah penyerangan sebelum fajar dan proklamasi batal eksis.",
        choices: [{ id: "retry", text: "Coba Lagi", nextSceneId: "start", feedback: "Pilih kata-kata dengan bijak.", scoreDelta: 0 }]
    },
    "conflict_signing": {
        id: "conflict_signing",
        backgroundClass: "bg-gray-700",
        characterName: "Sukarni",
        dialogue: "Tidak! Kami tidak mau tanda tangan bersama orang-orang yang menjadi boneka Jepang! Lebih baik Bung Karno dan Bung Hatta saja!",
        explanation: "Para aktivis tua di PPKI dianggap pemuda terlalu tunduk pada skenario kekaisaran Jepang. Karena itu, pemuda Sukarni mengambil jalan tengah brilian: Naskah hanya diteken Soekarno-Hatta atas nama 'Bangsa Indonesia'.",
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
        characterImage: "/assets/characters/bung_tomo.png",
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
        explanation: "Jenderal Mansergh mengancam akan menghancurkan Surabaya dari darat, laut, dan udara. Menyerah memang terasa sangat logis untuk menekan korban jiwa, tetapi perjuangan Heroik 10 November-lah yang di mata Internasional membuktikan Indonesia benar-benar berdaulat.",
        choices: [{ id: "retry", text: "Ulangi Sejarah", nextSceneId: "start", feedback: "Jangan takut!", scoreDelta: 0 }]
    }
};


export const MISSIONS: Mission[] = [
    {
        id: "proklamasi",
        title: "PROKLAMASI '45",
        description: "Navigasi detik-detik menegangkan menuju kemerdekaan Indonesia. Dari Rengasdengklok hingga Pegangsaan Timur.",
        thumbnail: "/assets/missions/proklamasi_thumb.png", // Placeholder
        startSceneId: "prologue_1",
        scenes: PROKLAMASI_SCENES
    },
    {
        id: "surabaya",
        title: "SURABAYA MEMBARA",
        description: "10 November 1945. Inggris mengancam. Bung Tomo berteriak. Pertahankan harga diri bangsa!",
        thumbnail: "/assets/missions/surabaya_thumb.png", // Placeholder
        startSceneId: "start",
        scenes: SURABAYA_SCENES
    }
];

// Fallback for types or legacy support (points to first mission)
export const STORY_DATA = PROKLAMASI_SCENES;