/**
 * Style: رحلة الحروف والأرقام — مخيم تحديات على خريطة ورقية، بجولات قصيرة وملصقات إنجاز ملوّنة.
 */
import { ArrowLeft, Check, Flag, Gamepad2, PawPrint, RotateCcw, Sparkles, Star, Volume2 } from "lucide-react";
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

const animalMatchRounds = [
  { art: "match-lion", ar: { name: "أسد", letter: "أ", names: ["أسد", "فيل", "أرنب"], letters: ["أ", "ف", "ب"] }, en: { name: "Lion", letter: "L", names: ["Lion", "Elephant", "Rabbit"], letters: ["L", "E", "R"] } },
  { art: "match-elephant", ar: { name: "فيل", letter: "ف", names: ["ببغاء", "فيل", "أسد"], letters: ["ب", "ف", "أ"] }, en: { name: "Elephant", letter: "E", names: ["Parrot", "Elephant", "Lion"], letters: ["P", "E", "L"] } },
  { art: "match-rabbit", ar: { name: "أرنب", letter: "أ", names: ["أرنب", "فيل", "ببغاء"], letters: ["ف", "ب", "أ"] }, en: { name: "Rabbit", letter: "R", names: ["Rabbit", "Elephant", "Parrot"], letters: ["L", "P", "R"] } },
  { art: "match-parrot", ar: { name: "ببغاء", letter: "ب", names: ["أسد", "ببغاء", "أرنب"], letters: ["أ", "ف", "ب"] }, en: { name: "Parrot", letter: "P", names: ["Lion", "Parrot", "Rabbit"], letters: ["L", "R", "P"] } },
];

type MatchLanguage = "ar" | "en";

const matchCopy = {
  ar: { initial: "انظر إلى الحيوان، ثم اختر اسمه الصحيح.", matched: "مطابقة رائعة! الآن اختر الحرف الذي يبدأ به الاسم.", retryName: "حاول ثانية؛ انظر إلى الحيوان وتذكر اسمه.", retryLetter: "حرف قريب، لكن استمع إلى بداية الاسم مرة أخرى.", next: "حيوان جديد في انتظارك. اختر اسمه الصحيح.", questionName: "ما اسم هذا الحيوان؟", questionLetter: "أحسنت. أي حرف يبدأ به الاسم؟", routeImage: "صورة", routeLetter: "حرف", finishedTitle: "يا صديق الحيوانات!", finishedText: "أكملت كل بطاقات المطابقة وتعرفت إلى الحروف الأولى للأسماء.", reset: "العب من جديد", badgeTitle: "صديق الحروف", badgeMessage: "طابقت الحيوانات بأسمائها وحروفها الأولى، وحصلت على ثلاث نجوم." },
  en: { initial: "Look at the animal, then choose its name.", matched: "Great match! Now choose the first letter.", retryName: "Try again. Look at the animal and say its name.", retryLetter: "Almost. Listen to the first sound again.", next: "A new animal is waiting. Choose its name.", questionName: "What is this animal called?", questionLetter: "Great! Which letter does the name start with?", routeImage: "Picture", routeLetter: "Letter", finishedTitle: "Wonderful animal friend!", finishedText: "You matched every animal with its English name and first letter.", reset: "Play again", badgeTitle: "English Animal Ace", badgeMessage: "You matched animals with English names and first letters, earning three stars." },
} as const;

function speakMatch(text: string, language: MatchLanguage) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "en" ? "en-US" : "ar-SA";
  utterance.rate = 0.72;
  window.speechSynthesis.speak(utterance);
}

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

function AnimalMatch() {
  const { completeActivity } = useProgress();
  const [index, setIndex] = useState(0);
  const [language, setLanguage] = useState<MatchLanguage>("ar");
  const [nameMatched, setNameMatched] = useState(false);
  const [message, setMessage] = useState<string>(matchCopy.ar.initial);
  const [finished, setFinished] = useState(false);
  const round = animalMatchRounds[index];
  const content = round[language];
  const copy = matchCopy[language];

  const changeLanguage = (nextLanguage: MatchLanguage) => {
    setLanguage(nextLanguage);
    setIndex(0);
    setNameMatched(false);
    setFinished(false);
    setMessage(matchCopy[nextLanguage].initial);
    playTone("tap");
  };

  const pronounce = (text: string) => { speakMatch(text, language); playTone("tap"); };

  const chooseName = (value: string) => {
    pronounce(value);
    if (value === content.name) {
      setNameMatched(true);
      setMessage(copy.matched);
      playTone("success");
    } else {
      setMessage(copy.retryName);
      playTone("retry");
    }
  };

  const chooseLetter = (value: string) => {
    pronounce(value);
    if (value !== content.letter) {
      setMessage(copy.retryLetter);
      playTone("retry");
      return;
    }
    playTone("success");
    if (index === animalMatchRounds.length - 1) {
      setFinished(true);
      completeActivity({ activityId: `animal-name-match-${language}`, stars: 3, badge: language === "en" ? "animal-english-ace" : "animal-wordsmith", title: copy.badgeTitle, message: copy.badgeMessage });
      return;
    }
    setIndex((value) => value + 1);
    setNameMatched(false);
    setMessage(copy.next);
  };

  const reset = () => { setIndex(0); setNameMatched(false); setFinished(false); setMessage(copy.initial); };

  return (
    <article className="game-panel animal-match-panel">
      <div className="game-heading"><span className="game-icon purple"><PawPrint size={20} /></span><div><p>لعبة لغة وصورة</p><h2>بطاقات الحيوان</h2></div><span className="round-chip">{language === "en" ? "EN" : "عربي"} · {finished ? "✓" : `${index + 1} / ${animalMatchRounds.length}`}</span></div>
      <div className="language-switch" role="tablist" aria-label="اختيار لغة لعبة المطابقة"><button type="button" role="tab" aria-selected={language === "ar"} className={language === "ar" ? "is-active" : ""} onClick={() => changeLanguage("ar")}>العربية</button><button type="button" role="tab" aria-selected={language === "en"} className={language === "en" ? "is-active" : ""} onClick={() => changeLanguage("en")}>English</button></div>
      {finished ? (
        <div className={`game-finish animal-finish ${language === "en" ? "english-finish" : ""}`}><div className="finish-star purple-star"><PawPrint size={31} /></div><h3>{copy.finishedTitle}</h3><p>{copy.finishedText}</p><button type="button" className="soft-action" onClick={reset}><RotateCcw size={16} /> {copy.reset}</button></div>
      ) : (
        <div className="match-playfield">
          <div className={`match-animal-art ${round.art}`} aria-label={`رسم ${content.name}`}><button type="button" className="match-speak-card" onClick={() => pronounce(content.name)} aria-label={`استمع إلى نطق ${content.name}`}><Volume2 size={19} /></button><span className="match-star">✦</span><div className="match-number">{index + 1}</div></div>
          <div className="match-choices" dir={language === "en" ? "ltr" : "rtl"}>
            <p className="match-instruction">{nameMatched ? copy.questionLetter : copy.questionName}</p>
            <p className={nameMatched ? "game-message is-solved" : "game-message"}>{nameMatched && <Check size={16} />}{message}</p>
            {!nameMatched ? (
              <div className={`match-name-options ${language === "en" ? "english-options" : ""}`}>{content.names.map((name) => <button key={name} type="button" onClick={() => chooseName(name)}>{name}<Volume2 size={13} /></button>)}</div>
            ) : (
              <div className="match-letter-options">{content.letters.map((letter) => <button key={letter} type="button" onClick={() => chooseLetter(letter)}>{letter}<Volume2 size={11} /></button>)}</div>
            )}
            <p className="match-voice-hint"><Volume2 size={14} /> {language === "en" ? "Tap a name or letter to hear it." : "اضغط الاسم أو الحرف للاستماع إلى نطقه."}</p>
            <div className="match-route" aria-hidden="true"><span>{copy.routeImage}</span><i /><b>{nameMatched ? "✦" : "○"}</b><i /><span>{copy.routeLetter}</span></div>
          </div>
        </div>
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
        <section className="games-grid" aria-label="الاختبارات والألعاب"><QuizTrail /><StarCatch /><AnimalMatch /></section>
        <div className="games-ad"><AdSlot label="مساحة إعلانية — بين محطات اللعب" /></div>
      </div>
    </SiteLayout>
  );
}
