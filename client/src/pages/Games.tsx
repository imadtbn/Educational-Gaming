/**
 * Style: رحلة الحروف والأرقام — مخيم تحديات على خريطة ورقية، بجولات قصيرة وملصقات إنجاز ملوّنة.
 */
import { ArrowLeft, Check, Flag, Gamepad2, RotateCcw, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import AdSlot from "@/components/AdSlot";
import SiteLayout from "@/components/SiteLayout";
import { useProgress } from "@/contexts/ProgressContext";
import { playTone } from "@/lib/feedback";

const quizRounds = [
  { prompt: "٣ + ٢ = ؟", dots: [3, 2], options: [4, 5, 6], answer: 5 },
  { prompt: "٧ − ٣ = ؟", dots: [7, 3], options: [3, 4, 5], answer: 4 },
  { prompt: "٤ + ٤ = ؟", dots: [4, 4], options: [6, 7, 8], answer: 8 },
];

const starRounds = [
  { target: 6, options: ["٢ + ٤", "١ + ٤", "٣ + ٤"], answer: "٢ + ٤" },
  { target: 9, options: ["٤ + ٥", "٣ + ٥", "٦ + ٢"], answer: "٤ + ٥" },
  { target: 7, options: ["٢ + ٥", "٣ + ٣", "٤ + ٢"], answer: "٢ + ٥" },
];

function QuizTrail() {
  const { completeActivity } = useProgress();
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("اختر الإجابة ثم اجمع نجمة لهذه المحطة.");
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const round = quizRounds[index];

  const answer = (value: number) => {
    if (value === round.answer) {
      setSolved(true);
      setMessage("صحيح! نجمة الطريق أصبحت لك.");
      playTone("success");
    } else {
      setMessage("فكّر بهدوء، واستخدم النقاط لتساعدك.");
      playTone("retry");
    }
  };

  const next = () => {
    if (index === quizRounds.length - 1) {
      setFinished(true);
      completeActivity({ activityId: "quiz-trail", stars: 2, badge: "math-explorer", title: "بطل الحساب", message: "أنهيت اختبار الطريق وجمعت نجمتين جديدتين." });
      return;
    }
    setIndex((value) => value + 1);
    setSolved(false);
    setMessage("اختر الإجابة ثم اجمع نجمة لهذه المحطة.");
  };

  const reset = () => { setIndex(0); setSolved(false); setFinished(false); setMessage("اختر الإجابة ثم اجمع نجمة لهذه المحطة."); };

  return (
    <article className="game-panel quiz-trail-panel">
      <div className="game-heading"><span className="game-icon coral"><Flag size={20} /></span><div><p>اختبار قصير</p><h2>طريق النجوم</h2></div><span className="round-chip">{finished ? "مكتمل" : `${index + 1} / ${quizRounds.length}`}</span></div>
      {finished ? (
        <div className="game-finish"><div className="finish-star"><Star size={32} fill="currentColor" /></div><h3>رحلة رائعة!</h3><p>لقد اجتزت اختبار الطريق. يمكنك لعبه مجددًا في أي وقت.</p><button type="button" className="soft-action" onClick={reset}><RotateCcw size={16} /> العب مرة أخرى</button></div>
      ) : (
        <>
          <div className="game-question"><p>عدّ النقاط ثم أجب</p><div className="game-dots"><span>{"●".repeat(round.dots[0])}</span><b>{round.prompt.includes("−") ? "−" : "+"}</b><span>{"●".repeat(round.dots[1])}</span></div><strong>{round.prompt}</strong></div>
          <p className={solved ? "game-message is-solved" : "game-message"}>{solved && <Check size={16} />}{message}</p>
          <div className="game-options">{round.options.map((option) => <button key={option} type="button" className={solved && option === round.answer ? "is-right" : ""} onClick={() => answer(option)} disabled={solved}>{option}</button>)}</div>
          <button type="button" className="next-game-step" disabled={!solved} onClick={next}>المحطة التالية <ArrowLeft size={16} /></button>
        </>
      )}
    </article>
  );
}

function StarCatch() {
  const { completeActivity } = useProgress();
  const [index, setIndex] = useState(0);
  const [caught, setCaught] = useState(0);
  const [message, setMessage] = useState("اختر العملية التي تصطاد النجمة الصحيحة.");
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const round = starRounds[index];

  const answer = (value: string) => {
    if (value === round.answer) {
      setSolved(true); setCaught((value) => value + 1); setMessage("أمسكت النجمة! أحسنت."); playTone("success");
    } else { setMessage("هذه العملية لا تصل إلى النجمة، جرّب طريقًا آخر."); playTone("retry"); }
  };
  const next = () => {
    if (index === starRounds.length - 1) {
      setFinished(true);
      completeActivity({ activityId: "star-catch", stars: 2, title: "جامع النجوم", message: "أكملت لعبة اصطياد النجوم وأضافت الرحلة نجمتين." });
      return;
    }
    setIndex((value) => value + 1); setSolved(false); setMessage("اختر العملية التي تصطاد النجمة الصحيحة.");
  };
  const reset = () => { setIndex(0); setCaught(0); setSolved(false); setFinished(false); setMessage("اختر العملية التي تصطاد النجمة الصحيحة."); };

  return (
    <article className="game-panel star-catch-panel">
      <div className="game-heading"><span className="game-icon teal"><Gamepad2 size={20} /></span><div><p>لعبة سريعة</p><h2>اصطياد النجوم</h2></div><span className="round-chip">{caught} نجوم</span></div>
      {finished ? (
        <div className="game-finish"><div className="finish-star teal-star"><Star size={32} fill="currentColor" /></div><h3>يا لك من صياد ماهر!</h3><p>أمسكت كل نجوم اللعبة. عُد لاحقًا وحاول مرة أخرى.</p><button type="button" className="soft-action" onClick={reset}><RotateCcw size={16} /> لعبة جديدة</button></div>
      ) : (
        <>
          <div className="catch-stage"><span className="catch-cloud">☁</span><div className="target-star"><Star size={55} fill="currentColor" /><b>{round.target}</b></div><span className="catch-cloud second">☁</span></div>
          <p className={solved ? "game-message is-solved" : "game-message"}>{solved && <Check size={16} />}{message}</p>
          <div className="operation-options">{round.options.map((option) => <button key={option} type="button" className={solved && option === round.answer ? "is-right" : ""} onClick={() => answer(option)} disabled={solved}>{option}</button>)}</div>
          <button type="button" className="next-game-step" disabled={!solved} onClick={next}>تابع الصيد <ArrowLeft size={16} /></button>
        </>
      )}
    </article>
  );
}

export default function Games() {
  return (
    <SiteLayout>
      <div className="games-page">
        <section className="games-hero">
          <div><Link href="/" className="back-link">← كل المسارات</Link><p className="eyebrow"><span>✦</span> مخيم التحديات</p><h1>حان وقت اللعب…<br /><em>والتفكير أيضًا.</em></h1><p>اختر لعبة قصيرة، حلّ التحدي، ثم شاهد نجومك وشاراتك تكبر مع كل محاولة ناجحة.</p></div>
          <div className="games-map-art" aria-hidden="true"><span className="map-star one">✦</span><span className="map-star two">✧</span><div className="map-path"><i /><i /><i /><i /></div><div className="map-tent">⌂</div><div className="map-flag">⚑</div></div>
        </section>
        <section className="games-grid" aria-label="الاختبارات والألعاب"><QuizTrail /><StarCatch /></section>
        <div className="games-ad"><AdSlot label="مساحة إعلانية — بين محطات اللعب" /></div>
      </div>
    </SiteLayout>
  );
}
