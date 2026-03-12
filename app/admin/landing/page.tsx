"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, Loader2, Layout } from "lucide-react";

export default function LandingCmsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const [formData, setFormData] = useState({
    hero: {
      title: "Where history becomes an adventure.",
      subTitle: "NUSAQUEST",
      description: "Experience Indonesian history through interactive stories where your choices shape the outcome.",
      buttonText: "Mulai Misimu",
      secondaryButtonText: "Kumpulkan Badge"
    },
    problem: {
      title: "Why History Feels Boring",
      cards: [
        { title: "Too Much Text", description: "Traditional history books feel heavy and difficult to enjoy." },
        { title: "Passive Learning", description: "Students only read and memorize without interaction." },
        { title: "No Emotional Connection", description: "Historical events feel distant and hard to relate to." }
      ]
    },
    solution: {
      title: "A New Way to Experience History",
      cards: [
        { title: "Interactive Storytelling", description: "Experience history like a visual novel where you choose the path." },
        { title: "Branching Decisions", description: "Your choices influence how historical events unfold." },
        { title: "Gamified Learning", description: "Unlock badges and achievements while exploring history." }
      ]
    },
    howItWorks: {
      title: "Start Your Journey in 3 Steps",
      steps: [
        { title: "Choose a Story", description: "Example: Proclamation of Independence, Youth Pledge, Majapahit Era" },
        { title: "Make Your Decisions", description: "Users choose dialogue or actions that shape the story." },
        { title: "Unlock Achievements", description: "Collect badges and explore different story outcomes." }
      ]
    },
    stories: {
      title: "Explore Indonesian History",
      modules: [
        { title: "Proklamasi & Revolusi 1945", subtitle: "Diculik untuk Merdeka", description: "Kamu adalah seorang pemuda pejuang yang harus meyakinkan Bung Karno dan Bung Hatta di tengah ketegangan antara Golongan Tua dan Muda. Akankah kamu berhasil membawa mereka ke Rengasdengklok tepat waktu sebelum tentara Jepang menyadari rencanamu?", goal: "Mengamankan teks Proklamasi dari pengaruh asing.", characters: "Soekarno, Hatta, Wikana", bgColor: "bg-pop-red" },
        { title: "Pertahanan Kedaulatan", subtitle: "Garis Depan Tanpa Takut", description: "Menghadapi Sekutu dengan persenjataan terbatas. Sebagai asisten strategi Jenderal Sudirman, kamu harus memutuskan kapan waktu yang tepat untuk melancarkan serangan 'Supit Urang'. Satu keputusan salah, benteng pertahanan kita akan runtuh!", goal: "Memukul mundur pasukan Sekutu dari tanah Jawa Tengah.", characters: "Kolonel Sudirman, Isdiman", bgColor: "bg-pop-blue" },
        { title: "Orde Lama - KAA", subtitle: "Panggung Dunia di Asia Afrika", description: "Menjadi bagian dari panitia konferensi internasional pertama di Indonesia. Kamu harus menyeimbangkan diplomasi antar negara-private Asia-Afrika yang baru merdeka di tengah tarikan Perang Dingin. Bisakah kamu menjaga marwah Indonesia di mata dunia?", goal: "Menghasilkan Dasasila Bandung yang legendaris.", characters: "Ali Sastroamidjojo, Nehru, Zhou Enlai", bgColor: "bg-pop-yellow" },
        { title: "Orde Baru ke Reformasi (1998)", subtitle: "Mei yang Mengubah Segalanya", description: "Di tengah hiruk-pikuk tuntutan perubahan di Jakarta, kamu berperan sebagai jurnalis kampus yang harus mendokumentasikan kebenaran. Pilihanmu: tetap diam demi keamanan atau menyebarkan semangat perubahan melalui selebaran rahasia?", goal: "Mengawal transisi demokrasi menuju Indonesia baru.", characters: "Mahasiswa, Tokoh Reformasi", bgColor: "bg-green-500" }
      ]
    },
    gamification: {
      title: "Learn. Play. Achieve.",
      cards: [
        { title: "Historical Badges", description: "Unlock achievements as you complete stories." },
        { title: "Progress Tracking", description: "See how far you've explored Indonesian history." },
        { title: "Leaderboard", description: "Compete with friends and other learners." }
      ]
    },
    emotional: {
      title: "Discover the Stories That Built Indonesia",
      paragraph: "Through Histoplay, history is no longer just something you read.\n\nIt becomes a journey where you experience the struggles, decisions, and courage that shaped the nation."
    },
    finalCta: {
      title: "Ready to Play Through History?",
      subTitle: "Start your first interactive story and explore Indonesian history in a whole new way.",
      primaryButton: "Start Your First Story",
      secondaryButton: "Create Free Account"
    }
  });

  const tabs = [
    { id: "hero", label: "Hero" },
    { id: "problem", label: "Problems" },
    { id: "solution", label: "Solutions" },
    { id: "howItWorks", label: "How It Works" },
    { id: "stories", label: "Story Preview" },
    { id: "gamification", label: "Gamification" },
    { id: "emotional", label: "Emotional" },
    { id: "finalCta", label: "Final CTA" },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "web_settings", "homepage");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData((prev) => ({
            ...prev,
            ...data
          }));
        }
      } catch (err) {
        console.error("Failed to load landing page settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      const docRef = doc(db, "web_settings", "homepage");
      await setDoc(docRef, formData, { merge: true });
      alert("POW! Landing page content saved successfully!");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("BOOM! Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleHeroChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const handleSectionChange = (section: keyof typeof formData, field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleArrayChange = (section: keyof typeof formData, arrayField: string, index: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const newArray = [...prev[section][arrayField]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: { ...prev[section], [arrayField]: newArray } };
    });
  };

  const currentTabStyle = "bg-pop-red text-white border-b-0 translate-y-[2px] z-10 shadow-none";
  const inactiveTabStyle = "bg-white text-black hover:bg-gray-100 shadow-[2px_-2px_0_#000]";

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="font-bangers flex items-center gap-2 text-4xl animate-bounce uppercase border-4 border-black p-4 bg-pop-yellow shadow-pop">
          <Loader2 className="animate-spin" size={32} /> LOADING CMS...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bangers uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-pop-yellow flex items-center gap-4">
          <span className="bg-black text-white p-2 border-2 border-pop-yellow transform -rotate-2 inline-block">
            <Layout className="inline-block" size={32} />
          </span>
          Landing Page CMS
        </h1>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-pop-blue text-white font-bangers text-2xl uppercase border-4 border-black px-6 py-2 shadow-pop hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          {saving ? "SAVING..." : "SAVE ALL CHANGES"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1 mb-0 border-b-4 border-black relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-bangers text-2xl px-6 py-3 border-4 border-black border-b-[4px] border-b-black transition-transform rounded-t-lg ${activeTab === tab.id ? currentTabStyle : inactiveTabStyle
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border-4 border-t-0 border-black p-8 shadow-pop min-h-[500px]">
        {/* HERO SECTION */}
        {activeTab === "hero" && (
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-left-4">
            <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Hero Section Configuration</h2>

            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Title (H1)</label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={(e) => handleHeroChange("title", e.target.value)}
                className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow"
              />
            </div>

            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">SubTitle / Top Badge</label>
              <input
                type="text"
                value={formData.hero.subTitle}
                onChange={(e) => handleHeroChange("subTitle", e.target.value)}
                className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow"
              />
            </div>

            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Description Box Text</label>
              <textarea
                value={formData.hero.description}
                onChange={(e) => handleHeroChange("description", e.target.value)}
                rows={3}
                className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-comic font-bold text-lg text-black">Primary Button (Play)</label>
                <input
                  type="text"
                  value={formData.hero.buttonText}
                  onChange={(e) => handleHeroChange("buttonText", e.target.value)}
                  className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow"
                />
              </div>
              <div className="space-y-2">
                <label className="font-comic font-bold text-lg text-black">Secondary Button</label>
                <input
                  type="text"
                  value={formData.hero.secondaryButtonText}
                  onChange={(e) => handleHeroChange("secondaryButtonText", e.target.value)}
                  className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow"
                />
              </div>
            </div>
          </div>
        )}

        {/* PROBLEM SECTION */}
        {activeTab === "problem" && (
          <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-left-4">
            <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Problem Section Configuration</h2>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Section Title</label>
              <input type="text" value={formData.problem.title} onChange={(e) => handleSectionChange("problem", "title", e.target.value)} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
            <div className="space-y-4">
              <h3 className="font-bangers text-2xl">Problem Cards</h3>
              {formData.problem.cards.map((card, idx) => (
                <div key={idx} className="border-4 border-black p-4 bg-gray-50 flex flex-col gap-4">
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Card {idx + 1} Title</label>
                    <input type="text" value={card.title} onChange={(e) => handleArrayChange("problem", "cards", idx, "title", e.target.value)} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Description</label>
                    <textarea value={card.description} onChange={(e) => handleArrayChange("problem", "cards", idx, "description", e.target.value)} rows={2} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOLUTION SECTION */}
        {activeTab === "solution" && (
          <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-left-4">
            <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Solution Section Configuration</h2>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Section Title</label>
              <input type="text" value={formData.solution.title} onChange={(e) => handleSectionChange("solution", "title", e.target.value)} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
            <div className="space-y-4">
              <h3 className="font-bangers text-2xl">Solution Cards</h3>
              {formData.solution.cards.map((card, idx) => (
                <div key={idx} className="border-4 border-black p-4 bg-gray-50 flex flex-col gap-4">
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Card {idx + 1} Title</label>
                    <input type="text" value={card.title} onChange={(e) => handleArrayChange("solution", "cards", idx, "title", e.target.value)} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Description</label>
                    <textarea value={card.description} onChange={(e) => handleArrayChange("solution", "cards", idx, "description", e.target.value)} rows={2} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOW IT WORKS SECTION */}
        {activeTab === "howItWorks" && (
          <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-left-4">
            <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">How It Works Configuration</h2>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Section Title</label>
              <input type="text" value={formData.howItWorks.title} onChange={(e) => handleSectionChange("howItWorks", "title", e.target.value)} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
            <div className="space-y-4">
              <h3 className="font-bangers text-2xl">Steps</h3>
              {formData.howItWorks.steps.map((step, idx) => (
                <div key={idx} className="border-4 border-black p-4 bg-gray-50 flex flex-col gap-4">
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Step {idx + 1} Title</label>
                    <input type="text" value={step.title} onChange={(e) => handleArrayChange("howItWorks", "steps", idx, "title", e.target.value)} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Description</label>
                    <textarea value={step.description} onChange={(e) => handleArrayChange("howItWorks", "steps", idx, "description", e.target.value)} rows={2} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STORIES PREVIEW SECTION */}
        {activeTab === "stories" && (
          <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-left-4">
            <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Story Preview Configuration</h2>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Section Title</label>
              <input type="text" value={formData.stories.title} onChange={(e) => handleSectionChange("stories", "title", e.target.value)} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
            <div className="space-y-4">
              <h3 className="font-bangers text-2xl">Story Modules</h3>
              {formData.stories.modules.map((mod, idx) => (
                <div key={idx} className="border-4 border-black p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <h4 className="font-bangers text-xl">Module {idx + 1}</h4>
                  </div>
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Title</label>
                    <input type="text" value={mod.title} onChange={(e) => handleArrayChange("stories", "modules", idx, "title", e.target.value)} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Subtitle / Quote</label>
                    <input type="text" value={mod.subtitle} onChange={(e) => handleArrayChange("stories", "modules", idx, "subtitle", e.target.value)} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                  <div className="col-span-full">
                    <label className="font-comic font-bold text-sm text-black">Description</label>
                    <textarea value={mod.description} onChange={(e) => handleArrayChange("stories", "modules", idx, "description", e.target.value)} rows={3} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Goal</label>
                    <input type="text" value={mod.goal} onChange={(e) => handleArrayChange("stories", "modules", idx, "goal", e.target.value)} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Characters</label>
                    <input type="text" value={mod.characters} onChange={(e) => handleArrayChange("stories", "modules", idx, "characters", e.target.value)} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAMIFICATION SECTION */}
        {activeTab === "gamification" && (
          <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-left-4">
            <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Gamification Configuration</h2>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Section Title</label>
              <input type="text" value={formData.gamification.title} onChange={(e) => handleSectionChange("gamification", "title", e.target.value)} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
            <div className="space-y-4">
              <h3 className="font-bangers text-2xl">Features</h3>
              {formData.gamification.cards.map((card, idx) => (
                <div key={idx} className="border-4 border-black p-4 bg-gray-50 flex flex-col gap-4">
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Card {idx + 1} Title</label>
                    <input type="text" value={card.title} onChange={(e) => handleArrayChange("gamification", "cards", idx, "title", e.target.value)} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                  <div>
                    <label className="font-comic font-bold text-sm text-black">Description</label>
                    <textarea value={card.description} onChange={(e) => handleArrayChange("gamification", "cards", idx, "description", e.target.value)} rows={2} className="w-full border-2 border-black p-2 font-comic text-black focus:outline-none focus:ring-2 focus:ring-pop-yellow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EMOTIONAL SECTION */}
        {activeTab === "emotional" && (
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-left-4">
            <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Emotional Section Configuration</h2>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Title</label>
              <textarea value={formData.emotional.title} onChange={(e) => handleSectionChange("emotional", "title", e.target.value)} rows={2} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Paragraph Hook</label>
              <textarea value={formData.emotional.paragraph} onChange={(e) => handleSectionChange("emotional", "paragraph", e.target.value)} rows={4} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
          </div>
        )}

        {/* FINAL CTA SECTION */}
        {activeTab === "finalCta" && (
          <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-left-4">
            <h2 className="font-bangers text-3xl mb-4 border-b-4 border-black inline-block">Final CTA Configuration</h2>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Title</label>
              <input type="text" value={formData.finalCta.title} onChange={(e) => handleSectionChange("finalCta", "title", e.target.value)} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
            <div className="space-y-2">
              <label className="font-comic font-bold text-lg text-black">Description</label>
              <textarea value={formData.finalCta.subTitle} onChange={(e) => handleSectionChange("finalCta", "subTitle", e.target.value)} rows={2} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-comic font-bold text-lg text-black">Primary Button</label>
                <input type="text" value={formData.finalCta.primaryButton} onChange={(e) => handleSectionChange("finalCta", "primaryButton", e.target.value)} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
              </div>
              <div className="space-y-2">
                <label className="font-comic font-bold text-lg text-black">Secondary Button</label>
                <input type="text" value={formData.finalCta.secondaryButton} onChange={(e) => handleSectionChange("finalCta", "secondaryButton", e.target.value)} className="w-full border-4 border-black p-3 font-comic text-lg text-black focus:outline-none focus:ring-4 focus:ring-pop-yellow" />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
