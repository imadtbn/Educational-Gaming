/**
 * Style: رحلة الحروف والأرقام — دفتر حكايات ورقي يقود الطفل صفحةً صفحة داخل مسار لطيف ومصوّر.
 */
import { CheckCircle2, ChevronLeft, ChevronRight, Languages, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import AdSlot from "@/components/AdSlot";
import SiteLayout from "@/components/SiteLayout";
import { useProgress } from "@/contexts/ProgressContext";
import { playTone } from "@/lib/feedback";

type StoryLanguage = "ar" | "en";
type Story = {
  id: string;
  icon: string;
  palette: "sun" | "farm" | "sea";
  art?: string;
  ar: { title: string; subtitle: string; scenes: string[]; question: string; answers: string[]; correct: number; answerNote: string };
  en: { title: string; subtitle: string; scenes: string[]; question: string; answers: string[]; correct: number; answerNote: string };
};

const stories: Story[] = [
  {
    id: "rainbow-lion", icon: "🦁", palette: "sun", art: "/manus-storage/academy-story-lion-rainbow_ba6c7993.png",
    ar: {
      title: "لامي وقوس الألوان", subtitle: "حكاية صغيرة عن الألوان والطبيعة", scenes: [
        "استيقظ لامي الأسد الصغير بعد المطر. رأى قوسَ قزحٍ يلمع فوق الحديقة.",
        "قال لامي: أريد أن أتعلم لونًا جديدًا كل يوم. ساعدته العصفورة على عدّ ألوان القوس.",
        "عندما ظهر اللون الأخضر، ابتسم لامي وقال: الطبيعة صديقة جميلة!",
      ], question: "ماذا رأى لامي فوق الحديقة؟", answers: ["قوس قزح", "قطار", "قمر"], correct: 0, answerNote: "أحسنت! رأى لامي قوس قزح بعد المطر."
    },
    en: {
      title: "Lami and the Rainbow", subtitle: "A little story about colors and nature", scenes: [
        "Lami the little lion woke up after the rain. A rainbow shone above the garden.",
        "“I want to learn a new color every day,” said Lami. A bird helped him count the rainbow colors.",
        "When green appeared, Lami smiled. “Nature is a beautiful friend!”",
      ], question: "What did Lami see above the garden?", answers: ["A rainbow", "A train", "The moon"], correct: 0, answerNote: "Great job! Lami saw a rainbow after the rain."
    },
  },
  {
    id: "farm-friend", icon: "🐥", palette: "farm", art: "/manus-storage/academy-story-farm-friend_910d81e5.png",
    ar: {
      title: "صديق في المزرعة", subtitle: "حكاية قصيرة عن المساعدة واللطف", scenes: [
        "في الصباح، بحثت الكتكوتة لولو عن حبات القمح قرب الحظيرة.",
        "وجدت لولو عصفورًا صغيرًا لا يعرف أين يجد طعامه، فدعته ليأكل معها.",
        "قال العصفور: شكرًا يا لولو. مشاركة الطعام تجعل يومنا أجمل!",
      ], question: "ماذا فعلت لولو مع العصفور؟", answers: ["شاركت طعامها", "اختبأت منه", "أغلقت الحظيرة"], correct: 0, answerNote: "رائع! لولو شاركت طعامها مع صديقها."
    },
    en: {
      title: "A Friend at the Farm", subtitle: "A short story about kindness and helping", scenes: [
        "In the morning, Lulu the chick looked for wheat near the barn.",
        "Lulu found a little bird that did not know where to find food, so she invited him to eat with her.",
        "“Thank you, Lulu,” said the bird. “Sharing food makes our day brighter!”",
      ], question: "What did Lulu do for the bird?", answers: ["She shared her food", "She hid from him", "She closed the barn"], correct: 0, answerNote: "Wonderful! Lulu shared her food with her friend."
    },
  },
  {
    id: "sea-drop", icon: "🐢", palette: "sea", art: "/manus-storage/academy-story-sea-drop_7691ff37.png",
    ar: {
      title: "السلحفاة وقطرة البحر", subtitle: "حكاية هادئة عن الشجاعة", scenes: [
        "رأت السلحفاة تالا قطرة ماء تلمع على صخرة بعيدة عن البحر.",
        "دفعتها تالا برفق حتى عادت القطرة إلى الموج. كانت صغيرة، لكن عملها مهم.",
        "صفّقت الأسماك وقالت: كل خطوة لطيفة تصنع فرقًا كبيرًا!",
      ], question: "إلى أين أعادت تالا قطرة الماء؟", answers: ["إلى البحر", "إلى الشجرة", "إلى السحابة"], correct: 0, answerNote: "أحسنت! أعادت تالا القطرة إلى البحر."
    },
    en: {
      title: "Tala and the Sea Drop", subtitle: "A calm story about courage", scenes: [
        "Tala the turtle saw a water drop shining on a rock far from the sea.",
        "Tala gently pushed the drop until it returned to the waves. She was small, but her action mattered.",
        "The fish clapped and said, “Every kind step can make a big difference!”",
      ], question: "Where did Tala return the water drop?", answers: ["To the sea", "To a tree", "To a cloud"], correct: 0, answerNote: "Well done! Tala returned the drop to the sea."
    },
  },
];

function speak(text: string, language: StoryLanguage) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "ar" ? "ar-SA" : "en-US";
  utterance.rate = 0.86;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

export default function Stories() {
  const [storyId, setStoryId] = useState(stories[0].id);
  const [language, setLanguage] = useState<StoryLanguage>("ar");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const { completeActivity } = useProgress();
  const story = useMemo(() => stories.find((item) => item.id === storyId) ?? stories[0], [storyId]);
  const content = story[language];
  const isLastScene = sceneIndex === content.scenes.length - 1;
  const isCorrect = answer === content.correct;

  function chooseStory(nextId: string) {
    setStoryId(nextId); setSceneIndex(0); setAnswer(null); playTone("tap");
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  function chooseLanguage(nextLanguage: StoryLanguage) {
    setLanguage(nextLanguage); setSceneIndex(0); setAnswer(null); playTone("tap");
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }

  function chooseAnswer(index: number) {
    if (!isLastScene || answer !== null) return;
    setAnswer(index);
    if (index === content.correct) {
      playTone("success");
      completeActivity({ activityId: `story-${story.id}`, stars: 3, title: language === "ar" ? "قارئ الحكايات" : "Story Explorer", message: language === "ar" ? "أكملت القصة وأجبت إجابة صحيحة." : "You finished the story and answered correctly.", badge: "story-explorer" });
    } else playTone("retry");
  }

  return (
    <SiteLayout>
      <section className="stories-page">
        <div className={`stories-hero stories-${story.palette}`}>
          <div className="stories-hero-copy">
            <p className="eyebrow"><span>✦</span>{language === "ar" ? "محطة الحكايات" : "Story Station"}</p>
            <h1>{language === "ar" ? <>اقرأ، اسمع، ثم <em>اكتشف.</em></> : <>Read, listen, then <em>discover.</em></>}</h1>
            <p>{language === "ar" ? "قصص قصيرة بصوت واضح وأسئلة لطيفة تساعد الطفل على الفهم والتعبير." : "Short stories with clear read-aloud audio and gentle questions for curious minds."}</p>
            <Link href="/" className="back-link">{language === "ar" ? "← كل المسارات" : "← All learning paths"}</Link>
          </div>
          <div className="story-hero-art" aria-hidden="true">
            {story.art ? <img src={story.art} alt="" /> : <div className="story-emoji-art"><span>{story.icon}</span><i>✦</i><b>⌁</b></div>}
          </div>
        </div>

        <div className="stories-journey-spine" aria-hidden="true"><span className="spine-start">✦</span><i /><span className="spine-ticket">⌁</span><i /><span className="spine-reader">◌</span><i /><span className="spine-rest">✦</span></div>
        <div className="story-route-label"><i>✦</i>{language === "ar" ? "اختر تذكرة حكاية ثم اتبع الصفحات" : "Choose a story ticket and follow the pages"}<i>✦</i></div>
        <div className="story-ticket-list" aria-label={language === "ar" ? "اختيار القصة" : "Story selection"}>
          {stories.map((item, index) => (
            <button key={item.id} type="button" className={item.id === story.id ? "story-ticket is-active" : "story-ticket"} onClick={() => chooseStory(item.id)}>
              <span className={`ticket-icon ${item.palette}`}>{item.art ? <img src={item.art} alt="" /> : item.icon}</span><span><small>{language === "ar" ? `حكاية ${index + 1}` : `Story ${index + 1}`}</small><strong>{item[language].title}</strong><em>{language === "ar" ? "تذكرة اكتشاف" : "Discovery ticket"}</em></span><b>{item.id === story.id ? "✦" : String(index + 1).padStart(2, "0")}</b>
            </button>
          ))}
        </div>

        <section className="story-reader-board" aria-live="polite">
          <div className="reader-topline">
            <div className="language-toggle" aria-label={language === "ar" ? "اختيار اللغة" : "Choose language"}>
              <Languages size={15} />
              <button type="button" className={language === "ar" ? "is-active" : ""} onClick={() => chooseLanguage("ar")}>العربية</button>
              <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => chooseLanguage("en")}>English</button>
            </div>
            <span className="story-page-count">{language === "ar" ? `صفحة ${sceneIndex + 1} من ${content.scenes.length}` : `Page ${sceneIndex + 1} of ${content.scenes.length}`}</span>
          </div>

          <div className="reader-grid">
            <aside className="story-page-markers" aria-label={language === "ar" ? "صفحات القصة" : "Story pages"}>
              {content.scenes.map((_, index) => <button key={index} type="button" className={sceneIndex === index ? "is-current" : ""} onClick={() => { setSceneIndex(index); setAnswer(null); playTone("tap"); }} aria-label={`${language === "ar" ? "الصفحة" : "Page"} ${index + 1}`}>{index + 1}</button>)}
            </aside>
            <article className={`story-paper ${language === "en" ? "is-english" : ""}`}>
              <span className="story-spark one">✦</span><span className="story-spark two">✦</span>
              <div className="story-compass-stamp" aria-hidden="true"><i>✦</i><span>{sceneIndex + 1}</span><b>⌁</b></div>
              <div className="story-field-note" aria-hidden="true"><i>◌</i><span>{language === "ar" ? "أثر الحكاية" : "Story trail"}</span></div>
              <p className="story-caption">{content.subtitle}</p>
              <h2>{content.title}</h2>
              <p className="story-scene">{content.scenes[sceneIndex]}</p>
              <div className="story-audio-actions">
                <button type="button" className="speak-button" onClick={() => { playTone("tap"); speak(content.scenes[sceneIndex], language); }}><Volume2 size={16} />{language === "ar" ? "استمع لهذه الصفحة" : "Listen to this page"}</button>
                <button type="button" className="story-read-all" onClick={() => { playTone("tap"); speak(content.scenes.join(" "), language); }}><Sparkles size={15} />{language === "ar" ? "اقرأ القصة كاملة" : "Read the whole story"}</button>
              </div>
            </article>
          </div>

          <div className="reader-controls">
            <button type="button" className="story-nav-button" disabled={sceneIndex === 0} onClick={() => { setSceneIndex((value) => value - 1); setAnswer(null); playTone("tap"); }}><ChevronRight size={18} />{language === "ar" ? "الصفحة السابقة" : "Previous page"}</button>
            <div className="scene-dots">{content.scenes.map((_, index) => <i key={index} className={sceneIndex === index ? "is-active" : ""} />)}</div>
            <button type="button" className="story-nav-button is-next" disabled={isLastScene} onClick={() => { setSceneIndex((value) => value + 1); setAnswer(null); playTone("tap"); }}>{language === "ar" ? "الصفحة التالية" : "Next page"}<ChevronLeft size={18} /></button>
          </div>

          {isLastScene && <section className="story-question">
            <div><p className="eyebrow"><span>✦</span>{language === "ar" ? "سؤال الحكاية" : "Story question"}</p><h3>{content.question}</h3></div>
            <div className="story-answer-options">
              {content.answers.map((item, index) => <button key={item} type="button" className={answer === index ? (index === content.correct ? "is-correct" : "is-wrong") : ""} onClick={() => chooseAnswer(index)} disabled={answer !== null}>{item}</button>)}
            </div>
            {answer !== null && <p className={isCorrect ? "story-answer-message is-correct" : "story-answer-message"}>{isCorrect ? <CheckCircle2 size={17} /> : <RotateCcw size={17} />}{isCorrect ? content.answerNote : language === "ar" ? "حاول مرة أخرى في القصة التالية." : "Try again in the next story."}</p>}
          </section>}
        </section>
        <div className="stories-ad"><AdSlot label={language === "ar" ? "استراحة صغيرة بين الحكايات" : "A small story break"} /></div>
      </section>
    </SiteLayout>
  );
}
