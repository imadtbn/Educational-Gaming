/**
 * Style: رحلة الحروف والأرقام — لوح نشاط دافئ مع اختيارات كبيرة ورد فعل مشجّع فوري.
 */
import { ArrowRight, RotateCcw, Volume2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export type LearningItem = {
  character: string;
  label: string;
  word: string;
  sound: string;
  hint: string;
};

function speak(text: string, lang: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.75;
  window.speechSynthesis.speak(utterance);
}

export default function LearningBoard({
  title,
  subtitle,
  items,
  language,
  accent = "teal",
}: {
  title: string;
  subtitle: string;
  items: LearningItem[];
  language: string;
  accent?: "teal" | "coral" | "purple";
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  const chooseItem = (index: number) => {
    setActiveIndex(index);
    speak(items[index].sound, language);
  };

  return (
    <section className={`learning-board board-${accent}`}>
      <div className="board-topline">
        <Link href="/" className="back-link"><ArrowRight size={17} /> كل المسارات</Link>
        <span className="board-progress">محطة {activeIndex + 1} من {items.length}</span>
      </div>
      <div className="board-map-ribbon" aria-hidden="true">
        <span>بداية المسار</span><i /><b>✦</b><i /><span>اكتشاف جديد</span>
      </div>
      <div className="board-grid">
        <div className="lesson-focus">
          <p className="lesson-overline">{subtitle}</p>
          <h1>{title}</h1>
          <div className="character-stage" aria-live="polite">
            <span className="stage-orbit orbit-one" aria-hidden="true" />
            <span className="stage-orbit orbit-two" aria-hidden="true" />
            <span className="lesson-character">{active.character}</span>
          </div>
          <p className="lesson-label">{active.label}</p>
          <p className="lesson-word">{active.word}</p>
          <button className="speak-button" onClick={() => speak(active.sound, language)} type="button">
            <Volume2 size={19} /> استمع إلى النطق
          </button>
          <p className="lesson-hint">{active.hint}</p>
        </div>

        <div className="choice-panel">
          <p className="choices-title">اختر بطاقة لتبدأ</p>
          <div className="character-choices" role="list">
            {items.map((item, index) => (
              <button
                type="button"
                role="listitem"
                key={`${item.character}-${item.label}`}
                className={activeIndex === index ? "choice-card is-selected" : "choice-card"}
                onClick={() => chooseItem(index)}
                aria-label={`اختيار ${item.label}`}
              >
                <span>{item.character}</span>
                <small>{item.label}</small>
              </button>
            ))}
          </div>
          <button className="reset-button" type="button" onClick={() => setActiveIndex(0)}>
            <RotateCcw size={15} /> ابدأ من جديد
          </button>
        </div>
      </div>
    </section>
  );
}
