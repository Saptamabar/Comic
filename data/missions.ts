export const fullPathData = [
  {
    eraId: "1945",
    label: "Era Kemerdekaan",
    color: "bg-[#ef4444]",
    characterImg: "/assets/characters/era45.png",
    charPosition: "right",
    missions: [
      { id: "proklamasi", title: "Proklamasi 45", unlocked: true, completed: true },
      { id: "pertahanan", title: "Garis Depan", unlocked: true, completed: true },
      { id: "surabaya", title: "Arek Suroboyo", unlocked: true, completed: false },
      { id: "amambarawa", title: "Palagan Ambarawa", unlocked: false, completed: false },
    ],
  },
  {
    eraId: "orde",
    label: "Orde Lama & Baru",
    color: "bg-[#ef4444]",
    characterImg: "/assets/characters/orderbaru.png",
    charPosition: "left",
    missions: [
      { id: "kaa", title: "Asia Afrika", unlocked: false, completed: false },
      { id: "g30s", title: "Malam Kelam", unlocked: false, completed: false },
      { id: "pembangunan", title: "Era Repelita", unlocked: false, completed: false },
    ],
  },
  {
    eraId: "modern",
    label: "Reformasi & Modern",
    color: "bg-[#ef4444]",
    characterImg: "/assets/characters/reformasi.png",
    charPosition: "right",
    missions: [
      { id: "reformasi", title: "Mei 1998", unlocked: false, completed: false },
      { id: "digital", title: "Era Digital", unlocked: false, completed: false },
    ],
  },
];