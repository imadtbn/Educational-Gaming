/**
 * Style: رحلة الحروف والأرقام — بطاقات حيوانات قصصية مع نطق لغوي وتفاصيل ورقية دافئة.
 */
import { Volume2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import AdSlot from "@/components/AdSlot";
import SiteLayout from "@/components/SiteLayout";
import { useProgress } from "@/contexts/ProgressContext";
import { playTone } from "@/lib/feedback";

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
  const [visited, setVisited] = useState<number[]>([]);
  const { completeActivity } = useProgress();

  const visitAnimal = (index: number, sound: string) => {
    setSelected(index);
    speak(sound);
    playTone("tap");
    setVisited((current) => {
      if (current.includes(index)) return current;
      const next = [...current, index];
      if (next.length === animals.length) {
        completeActivity({ activityId: "animal-explorer", stars: 2, badge: "animal-scout", title: "مستكشف الحيوانات", message: "زرت كل الحيوانات وتعلمت أسماءها. أضفنا نجمتين إلى رحلتك." });
        playTone("success");
      }
      return next;
    });
  };
  return (
    <SiteLayout>
      <div className="animal-page">
        <div className="animal-hero">
          <div>
            <Link href="/" className="back-link">← كل المسارات</Link>
            <p className="eyebrow"><span>✦</span> محطة الاستكشاف</p>
            <h1>قل الاسم…<br /><em>ثم استمع إليه.</em></h1>
            <p>اضغط على أي حيوان لتسمع اسمه بالعربية والإنجليزية، ثم حاول تكراره بنفسك.</p><span className="animal-discovery">{visited.length} / {animals.length} حيوانات مكتشفة</span>
            <div className="inner-route" aria-label="مسار الاستكشاف"><span>المخيم</span><i /><b>✦</b><i /><span>الحيوان التالي</span></div>
          </div>
          <img src="/manus-storage/academy-animals-explorer_6ca043a3.png" alt="حيوانات لطيفة في جزيرة استكشاف" />
        </div>

        <section className="animal-grid" aria-label="بطاقات أسماء الحيوانات">
          <span className="animal-route-marker marker-one" aria-hidden="true">✦</span><span className="animal-route-marker marker-two" aria-hidden="true">⌁</span>
          {animals.map((animal, index) => (
            <button
              type="button"
              className={`animal-card ${animal.color} ${selected === index ? "is-active" : ""} ${visited.includes(index) ? "is-visited" : ""}`}
              key={animal.ar}
              onClick={() => visitAnimal(index, animal.sound)}
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
