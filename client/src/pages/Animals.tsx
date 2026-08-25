/**
 * Style: رحلة الحروف والأرقام — بطاقات حيوانات قصصية مع نطق لغوي وتفاصيل ورقية دافئة.
 */
import { Volume2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import AdSlot from "@/components/AdSlot";
import SiteLayout from "@/components/SiteLayout";

const animals = [
  { art: "portrait-lion", ar: "أسد", en: "Lion", color: "animal-gold", sound: "أسد. Lion" },
  { art: "portrait-elephant", ar: "فيل", en: "Elephant", color: "animal-teal", sound: "فيل. Elephant" },
  { art: "portrait-rabbit", ar: "أرنب", en: "Rabbit", color: "animal-coral", sound: "أرنب. Rabbit" },
  { art: "portrait-parrot", ar: "ببغاء", en: "Parrot", color: "animal-purple", sound: "ببغاء. Parrot" },
];

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ar-SA";
  utterance.rate = 0.72;
  window.speechSynthesis.speak(utterance);
}

export default function Animals() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <SiteLayout>
      <div className="animal-page">
        <div className="animal-hero">
          <div>
            <Link href="/" className="back-link">← كل المسارات</Link>
            <p className="eyebrow"><span>✦</span> محطة الاستكشاف</p>
            <h1>قل الاسم…<br /><em>ثم استمع إليه.</em></h1>
            <p>اضغط على أي حيوان لتسمع اسمه بالعربية والإنجليزية، ثم حاول تكراره بنفسك.</p>
          </div>
          <img src="/manus-storage/academy-animals-explorer_6ca043a3.png" alt="حيوانات لطيفة في جزيرة استكشاف" />
        </div>

        <section className="animal-grid" aria-label="بطاقات أسماء الحيوانات">
          {animals.map((animal, index) => (
            <button
              type="button"
              className={`animal-card ${animal.color} ${selected === index ? "is-active" : ""}`}
              key={animal.ar}
              onClick={() => { setSelected(index); speak(animal.sound); }}
            >
              <span className={`animal-portrait ${animal.art}`} aria-hidden="true" />
              <span className="animal-labels"><strong>{animal.ar}</strong><small>{animal.en}</small></span>
              <span className="animal-sound"><Volume2 size={17} /></span>
            </button>
          ))}
        </section>
        <div className="animal-page-ad"><AdSlot label="مساحة إعلانية — بين بطاقات الحيوانات" /></div>
      </div>
    </SiteLayout>
  );
}
