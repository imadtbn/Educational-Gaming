/**
 * Style: رحلة الحروف والأرقام — مخيم تحديات كخريطة ميدانية، بمحطات حيوانات وصوت وملصقات إنجاز.
 */
import { ArrowLeft, Check, Flag, Gamepad2, Leaf, PawPrint, RotateCcw, Star, Tractor, Volume2, Waves } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import AdSlot from "@/components/AdSlot";
import SiteLayout from "@/components/SiteLayout";
import { useProgress } from "@/contexts/ProgressContext";
import { playTone } from "@/lib/feedback";

const quizRounds = [
  { prompt: "3 + 2 = ?", dots: [3, 2], options: [4, 5, 6], answer: 5 },
  { prompt: "7 − 3 = ?", dots: [7, 3], options: [3, 4, 5], answer: 4 },
  { prompt: "4 + 4 = ?", dots: [4, 4], options: [6, 7, 8], answer: 8 },
];

const starRounds = [
  { target: 6, options: ["2 + 4", "1 + 4", "3 + 4"], answer: "2 + 4" },
  { target: 9, options: ["4 + 5", "3 + 5", "6 + 2"], answer: "4 + 5" },
  { target: 7, options: ["2 + 5", "3 + 3", "4 + 2"], answer: "2 + 5" },
];

type MatchLanguage = "ar" | "en";
type AnimalCategory = "wild" | "farm" | "sea";
type LanguageContent = { name: string; letter: string; names: string[]; letters: string[]; sentence: string };
type AnimalRound = { art: string; ar: LanguageContent; en: LanguageContent };

const animalGroups: Record<AnimalCategory, { label: string; englishLabel: string; image: string; rounds: AnimalRound[] }> = {
  wild: {
    label: "البرية", englishLabel: "Wild", image: "/manus-storage/academy-animals-explorer_6ca043a3.png",
    rounds: [
      { art: "match-lion", ar: { name: "أسد", letter: "أ", names: ["أسد", "فيل", "أرنب"], letters: ["أ", "ف", "ب"], sentence: "الأسد قوي ويعيش في البرية." }, en: { name: "Lion", letter: "L", names: ["Lion", "Elephant", "Rabbit"], letters: ["L", "E", "R"], sentence: "The lion is strong." } },
      { art: "match-elephant", ar: { name: "فيل", letter: "ف", names: ["ببغاء", "فيل", "أسد"], letters: ["ب", "ف", "أ"], sentence: "الفيل كبير وله خرطوم طويل." }, en: { name: "Elephant", letter: "E", names: ["Parrot", "Elephant", "Lion"], letters: ["P", "E", "L"], sentence: "The elephant has a long trunk." } },
      { art: "match-rabbit", ar: { name: "أرنب", letter: "أ", names: ["أرنب", "فيل", "ببغاء"], letters: ["ف", "ب", "أ"], sentence: "الأرنب سريع ويحب الجزر." }, en: { name: "Rabbit", letter: "R", names: ["Rabbit", "Elephant", "Parrot"], letters: ["L", "P", "R"], sentence: "The rabbit likes carrots." } },
      { art: "match-parrot", ar: { name: "ببغاء", letter: "ب", names: ["أسد", "ببغاء", "أرنب"], letters: ["أ", "ف", "ب"], sentence: "الببغاء طائر ملوّن يحب الكلام." }, en: { name: "Parrot", letter: "P", names: ["Lion", "Parrot", "Rabbit"], letters: ["L", "R", "P"], sentence: "The parrot is a colorful bird." } },
    ],
  },
  farm: {
    label: "المزرعة", englishLabel: "Farm", image: "/manus-storage/academy-farm-animal-match_06c0b96f.png",
    rounds: [
      { art: "match-cow", ar: { name: "بقرة", letter: "ب", names: ["بقرة", "حصان", "خروف"], letters: ["ب", "ح", "خ"], sentence: "البقرة تعطينا الحليب." }, en: { name: "Cow", letter: "C", names: ["Cow", "Horse", "Sheep"], letters: ["C", "H", "S"], sentence: "The cow gives us milk." } },
      { art: "match-sheep", ar: { name: "خروف", letter: "خ", names: ["كتكوت", "خروف", "بقرة"], letters: ["ك", "خ", "ب"], sentence: "الخروف له صوف ناعم." }, en: { name: "Sheep", letter: "S", names: ["Chick", "Sheep", "Cow"], letters: ["C", "S", "H"], sentence: "The sheep has soft wool." } },
      { art: "match-chick", ar: { name: "كتكوت", letter: "ك", names: ["حصان", "كتكوت", "خروف"], letters: ["ح", "ك", "خ"], sentence: "الكتكوت صغير ولونه أصفر." }, en: { name: "Chick", letter: "C", names: ["Horse", "Chick", "Cow"], letters: ["H", "C", "S"], sentence: "The chick is small and yellow." } },
      { art: "match-horse", ar: { name: "حصان", letter: "ح", names: ["بقرة", "حصان", "كتكوت"], letters: ["ب", "ح", "ك"], sentence: "الحصان يجري بسرعة." }, en: { name: "Horse", letter: "H", names: ["Cow", "Horse", "Chick"], letters: ["C", "H", "S"], sentence: "The horse runs fast." } },
    ],
  },
  sea: {
    label: "البحر", englishLabel: "Sea", image: "/manus-storage/academy-sea-animal-match_340514da.png",
    rounds: [
      { art: "match-dolphin", ar: { name: "دلفين", letter: "د", names: ["دلفين", "سمكة", "سلحفاة"], letters: ["د", "س", "ص"], sentence: "الدلفين يسبح ويقفز في الماء." }, en: { name: "Dolphin", letter: "D", names: ["Dolphin", "Fish", "Turtle"], letters: ["D", "F", "T"], sentence: "The dolphin swims and jumps." } },
      { art: "match-turtle", ar: { name: "سلحفاة", letter: "س", names: ["أخطبوط", "سلحفاة", "دلفين"], letters: ["أ", "س", "د"], sentence: "للسلحفاة صدفة قوية." }, en: { name: "Turtle", letter: "T", names: ["Octopus", "Turtle", "Dolphin"], letters: ["O", "T", "D"], sentence: "The turtle has a hard shell." } },
      { art: "match-fish", ar: { name: "سمكة", letter: "س", names: ["سمكة", "دلفين", "أخطبوط"], letters: ["د", "س", "أ"], sentence: "السمكة تسبح بين الشعاب المرجانية." }, en: { name: "Fish", letter: "F", names: ["Fish", "Turtle", "Octopus"], letters: ["F", "T", "O"], sentence: "The fish swims in the sea." } },
      { art: "match-octopus", ar: { name: "أخطبوط", letter: "أ", names: ["سلحفاة", "أخطبوط", "سمكة"], letters: ["س", "أ", "د"], sentence: "للأخطبوط ثماني أذرع." }, en: { name: "Octopus", letter: "O", names: ["Dolphin", "Octopus", "Fish"], letters: ["D", "O", "F"], sentence: "The octopus has eight arms." } },
    ],
  },
};

const matchCopy = {
  ar: { initial: "انظر إلى الحيوان، ثم اختر اسمه الصحيح.", matched: "مطابقة رائعة! الآن اختر الحرف الذي يبدأ به الاسم.", retryName: "حاول ثانية؛ انظر إلى الحيوان وتذكر اسمه.", retryLetter: "حرف قريب، لكن استمع إلى بداية الاسم مرة أخرى.", next: "حيوان جديد في انتظارك. اختر اسمه الصحيح.", questionName: "ما اسم هذا الحيوان؟", questionLetter: "أحسنت. أي حرف يبدأ به الاسم؟", routeImage: "صورة", routeLetter: "حرف", finishedTitle: "يا صديق الحيوانات!", finishedText: "أنهيت محطة الحيوانات وجمعت ثلاث نجوم جديدة.", reset: "العب من جديد", badgeTitle: "صديق الحروف", badgeMessage: "طابقت الحيوانات بأسمائها وحروفها الأولى، وحصلت على ثلاث نجوم.", sentenceTitle: "جملة اليوم" },
  en: { initial: "Look at the animal, then choose its name.", matched: "Great match! Now choose the first letter.", retryName: "Try again. Look at the animal and say its name.", retryLetter: "Almost. Listen to the first sound again.", next: "A new animal is waiting. Choose its name.", questionName: "What is this animal called?", questionLetter: "Great! Which letter does the name start with?", routeImage: "Picture", routeLetter: "Letter", finishedTitle: "Wonderful animal friend!", finishedText: "You completed this animal station and earned three new stars.", reset: "Play again", badgeTitle: "English Animal Ace", badgeMessage: "You matched animals with English names and first letters, earning three stars.", sentenceTitle: "Sentence of the day" },
} as const;

function speak(text: string, language: MatchLanguage) {
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
  const answer = (value: number) => { if (value === round.answer) { setSolved(true); setMessage("صحيح! نجمة الطريق أصبحت لك."); playTone("success"); } else { setMessage("فكّر بهدوء، واستخدم النقاط لتساعدك."); playTone("retry"); } };
  const next = () => { if (index === quizRounds.length - 1) { setFinished(true); completeActivity({ activityId: "quiz-trail", stars: 2, badge: "math-explorer", title: "بطل الحساب", message: "أنهيت اختبار الطريق وجمعت نجمتين جديدتين." }); return; } setIndex((value) => value + 1); setSolved(false); setMessage("اختر الإجابة ثم اجمع نجمة لهذه المحطة."); };
  const reset = () => { setIndex(0); setSolved(false); setFinished(false); setMessage("اختر الإجابة ثم اجمع نجمة لهذه المحطة."); };
  return <article className="game-panel quiz-trail-panel"><div className="game-heading"><span className="game-icon coral"><Flag size={20} /></span><div><p>اختبار قصير</p><h2>طريق النجوم</h2></div><span className="round-chip">{finished ? "مكتمل" : `${index + 1} / ${quizRounds.length}`}</span></div>{finished ? <div className="game-finish"><div className="finish-star"><Star size={32} fill="currentColor" /></div><h3>رحلة رائعة!</h3><p>لقد اجتزت اختبار الطريق. يمكنك لعبه مجددًا في أي وقت.</p><button type="button" className="soft-action" onClick={reset}><RotateCcw size={16} /> العب مرة أخرى</button></div> : <><div className="game-question"><p>عدّ النقاط ثم أجب</p><div className="game-dots"><span>{"●".repeat(round.dots[0])}</span><b>{round.prompt.includes("−") ? "−" : "+"}</b><span>{"●".repeat(round.dots[1])}</span></div><strong>{round.prompt}</strong></div><p className={solved ? "game-message is-solved" : "game-message"}>{solved && <Check size={16} />}{message}</p><div className="game-options">{round.options.map((option) => <button key={option} type="button" className={solved && option === round.answer ? "is-right" : ""} onClick={() => answer(option)} disabled={solved}>{option}</button>)}</div><button type="button" className="next-game-step" disabled={!solved} onClick={next}>المحطة التالية <ArrowLeft size={16} /></button></>}</article>;
}

function StarCatch() {
  const { completeActivity } = useProgress();
  const [index, setIndex] = useState(0); const [caught, setCaught] = useState(0); const [message, setMessage] = useState("اختر العملية التي تصطاد النجمة الصحيحة."); const [solved, setSolved] = useState(false); const [finished, setFinished] = useState(false); const round = starRounds[index];
  const answer = (value: string) => { if (value === round.answer) { setSolved(true); setCaught((value) => value + 1); setMessage("أمسكت النجمة! أحسنت."); playTone("success"); } else { setMessage("هذه العملية لا تصل إلى النجمة، جرّب طريقًا آخر."); playTone("retry"); } };
  const next = () => { if (index === starRounds.length - 1) { setFinished(true); completeActivity({ activityId: "star-catch", stars: 2, title: "جامع النجوم", message: "أكملت لعبة اصطياد النجوم وأضافت الرحلة نجمتين." }); return; } setIndex((value) => value + 1); setSolved(false); setMessage("اختر العملية التي تصطاد النجمة الصحيحة."); };
  const reset = () => { setIndex(0); setCaught(0); setSolved(false); setFinished(false); setMessage("اختر العملية التي تصطاد النجمة الصحيحة."); };
  return <article className="game-panel star-catch-panel"><div className="game-heading"><span className="game-icon teal"><Gamepad2 size={20} /></span><div><p>لعبة سريعة</p><h2>اصطياد النجوم</h2></div><span className="round-chip">{caught} نجوم</span></div>{finished ? <div className="game-finish"><div className="finish-star teal-star"><Star size={32} fill="currentColor" /></div><h3>يا لك من صياد ماهر!</h3><p>أمسكت كل نجوم اللعبة. عُد لاحقًا وحاول مرة أخرى.</p><button type="button" className="soft-action" onClick={reset}><RotateCcw size={16} /> لعبة جديدة</button></div> : <><div className="catch-stage"><span className="catch-cloud">☁</span><div className="target-star"><Star size={55} fill="currentColor" /><b>{round.target}</b></div><span className="catch-cloud second">☁</span></div><p className={solved ? "game-message is-solved" : "game-message"}>{solved && <Check size={16} />}{message}</p><div className="operation-options">{round.options.map((option) => <button key={option} type="button" className={solved && option === round.answer ? "is-right" : ""} onClick={() => answer(option)} disabled={solved}>{option}</button>)}</div><button type="button" className="next-game-step" disabled={!solved} onClick={next}>تابع الصيد <ArrowLeft size={16} /></button></>}</article>;
}

function AnimalMatch() {
  const { completeActivity } = useProgress();
  const [language, setLanguage] = useState<MatchLanguage>("ar");
  const [category, setCategory] = useState<AnimalCategory>("wild");
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<"name" | "letter" | "sentence">("name");
  const [message, setMessage] = useState<string>(matchCopy.ar.initial);
  const [finished, setFinished] = useState(false);
  const group = animalGroups[category]; const round = group.rounds[index]; const content = round[language]; const copy = matchCopy[language];
  const resetStation = (nextLanguage = language, nextCategory = category) => { setLanguage(nextLanguage); setCategory(nextCategory); setIndex(0); setStage("name"); setFinished(false); setMessage(matchCopy[nextLanguage].initial); };
  const pronounce = (text: string) => { speak(text, language); playTone("tap"); };
  const chooseName = (value: string) => { pronounce(value); if (value === content.name) { setStage("letter"); setMessage(copy.matched); playTone("success"); } else { setMessage(copy.retryName); playTone("retry"); } };
  const chooseLetter = (value: string) => { pronounce(value); if (value !== content.letter) { setMessage(copy.retryLetter); playTone("retry"); return; } setStage("sentence"); setMessage(copy.matched); playTone("success"); };
  const nextAnimal = () => { if (index === group.rounds.length - 1) { setFinished(true); completeActivity({ activityId: `animal-name-match-${language}-${category}`, stars: 3, badge: language === "en" ? "animal-english-ace" : "animal-wordsmith", title: copy.badgeTitle, message: copy.badgeMessage }); return; } setIndex((value) => value + 1); setStage("name"); setMessage(copy.next); };
  return <article className="game-panel animal-match-panel"><div className="game-heading"><span className="game-icon purple"><PawPrint size={20} /></span><div><p>لعبة لغة وصورة</p><h2>بطاقات الحيوان</h2></div><span className="round-chip">{group.label} · {language === "en" ? "EN" : "عربي"} · {finished ? "✓" : `${index + 1} / ${group.rounds.length}`}</span></div><div className="match-switches"><div className="category-switch" role="tablist" aria-label="اختيار فئة الحيوانات"><button type="button" className={category === "wild" ? "is-active" : ""} onClick={() => resetStation(language, "wild")}><Leaf size={13} /> البرية</button><button type="button" className={category === "farm" ? "is-active" : ""} onClick={() => resetStation(language, "farm")}><Tractor size={13} /> المزرعة</button><button type="button" className={category === "sea" ? "is-active" : ""} onClick={() => resetStation(language, "sea")}><Waves size={13} /> البحر</button></div><div className="language-switch" role="tablist" aria-label="اختيار لغة لعبة المطابقة"><button type="button" className={language === "ar" ? "is-active" : ""} onClick={() => resetStation("ar", category)}>العربية</button><button type="button" className={language === "en" ? "is-active" : ""} onClick={() => resetStation("en", category)}>English</button></div></div>{finished ? <div className={`game-finish animal-finish ${language === "en" ? "english-finish" : ""}`}><div className="finish-star purple-star"><PawPrint size={31} /></div><h3>{copy.finishedTitle}</h3><p>{copy.finishedText}</p><button type="button" className="soft-action" onClick={() => resetStation()}><RotateCcw size={16} /> {copy.reset}</button></div> : <div className={`match-playfield stage-${stage}`}><div className={`match-animal-art ${round.art}`} style={{ backgroundImage: `url(${group.image})` }} aria-label={`رسم ${content.name}`}><button type="button" className="match-speak-card" onClick={() => pronounce(content.name)} aria-label={`استمع إلى نطق ${content.name}`}><Volume2 size={19} /></button><span className="match-star">✦</span><div className="match-number">{index + 1}</div></div><div className="match-choices" dir={language === "en" ? "ltr" : "rtl"}><p className="match-instruction">{stage === "name" ? copy.questionName : stage === "letter" ? copy.questionLetter : copy.sentenceTitle}</p><p className={stage !== "name" ? "game-message is-solved" : "game-message"}>{stage !== "name" && <Check size={16} />}{message}</p>{stage === "name" ? <div className={`match-name-options ${language === "en" ? "english-options" : ""}`}>{content.names.map((name) => <button key={name} type="button" onClick={() => chooseName(name)}>{name}<Volume2 size={13} /></button>)}</div> : stage === "letter" ? <div className="match-letter-options">{content.letters.map((letter) => <button key={letter} type="button" onClick={() => chooseLetter(letter)}>{letter}<Volume2 size={11} /></button>)}</div> : <div className="match-sentence-card"><div className="sentence-stars" aria-hidden="true"><i>✦</i><i>✧</i><i>✦</i></div><p>{content.sentence}</p><button type="button" className="sentence-speak" onClick={() => pronounce(content.sentence)}><Volume2 size={16} /> {language === "en" ? "Listen" : "استمع"}</button><button type="button" className="next-animal" onClick={nextAnimal}>{language === "en" ? "Next animal" : "الحيوان التالي"}<ArrowLeft size={15} /></button></div>}<p className="match-voice-hint"><Volume2 size={14} /> {language === "en" ? "Tap a name or letter to hear it." : "اضغط الاسم أو الحرف للاستماع إلى نطقه."}</p><div className="match-route" aria-hidden="true"><span>{copy.routeImage}</span><i /><b>{stage === "name" ? "○" : stage === "letter" ? "✦" : "★"}</b><i /><span>{copy.routeLetter}</span></div></div></div>}</article>;
}

export default function Games() {
  return <SiteLayout><div className="games-page"><section className="games-hero"><div><Link href="/" className="back-link">← كل المسارات</Link><p className="eyebrow"><span>✦</span> مخيم التحديات</p><h1>حان وقت اللعب…<br /><em>والتفكير أيضًا.</em></h1><p>اختر لعبة قصيرة، حلّ التحدي، ثم شاهد نجومك وشاراتك تكبر مع كل محاولة ناجحة.</p></div><div className="games-map-art" aria-hidden="true"><span className="map-star one">✦</span><span className="map-star two">✧</span><div className="map-path"><i /><i /><i /><i /></div><div className="map-tent">⌂</div><div className="map-flag">⚑</div></div></section><section className="games-grid" aria-label="الاختبارات والألعاب"><QuizTrail /><StarCatch /><AnimalMatch /></section><div className="games-ad"><AdSlot label="مساحة إعلانية — بين محطات اللعب" /></div></div></SiteLayout>;
}
