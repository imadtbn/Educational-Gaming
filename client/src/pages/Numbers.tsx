/**
 * Style: رحلة الحروف والأرقام — حديقة عدّ مرنة تكافئ المحاولة بحركة ونص داعم.
 */
import { Check, RefreshCw, Sparkles, Volume2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import AdSlot from "@/components/AdSlot";
import SiteLayout from "@/components/SiteLayout";
import { useProgress } from "@/contexts/ProgressContext";
import { playTone } from "@/lib/feedback";

const latinDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const digitWords = ["واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة", "عشرة"];
const questions = [
  { first: 2, second: 1, answer: 3, text: "2 + 1 = ?" },
  { first: 3, second: 2, answer: 5, text: "3 + 2 = ?" },
  { first: 4, second: 1, answer: 5, text: "4 + 1 = ?" },
  { first: 5, second: 3, answer: 8, text: "5 + 3 = ?" },
];

export default function Numbers() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [message, setMessage] = useState("اختر الإجابة التي تراها صحيحة.");
  const [correct, setCorrect] = useState(false);
  const [solvedQuestions, setSolvedQuestions] = useState<number[]>([]);
  const [selectedDigit, setSelectedDigit] = useState<number | null>(null);
  const { completeActivity } = useProgress();
  const question = questions[questionIndex];
  const options = [question.answer - 1, question.answer, question.answer + 1];

  const answer = (value: number) => {
    if (value === question.answer) {
      setCorrect(true);
      setMessage("أحسنت! إجابة رائعة ✦");
      playTone("success");
      setSolvedQuestions((current) => {
        if (current.includes(questionIndex)) return current;
        const next = [...current, questionIndex];
        if (next.length >= 3) completeActivity({ activityId: "number-garden", stars: 2, badge: "number-ninja", title: "صديق الأرقام", message: "حللت ثلاث مسائل في حديقة الأرقام وحصلت على نجمتين." });
        return next;
      });
    } else {
      setCorrect(false);
      setMessage("محاولة جميلة، عدّ الأشكال مرة أخرى.");
      playTone("retry");
    }
  };

  const next = () => {
    setQuestionIndex((index) => (index + 1) % questions.length);
    setCorrect(false);
    setMessage("اختر الإجابة التي تراها صحيحة.");
  };

  const speakDigit = (value: number) => {
    setSelectedDigit(value);
    playTone("tap");
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(digitWords[value - 1]);
    utterance.lang = "ar-SA";
    utterance.rate = 0.75;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <SiteLayout>
      <div className="numbers-page">
        <section className="numbers-intro">
          <div className="numbers-copy">
            <Link href="/" className="back-link">← كل المسارات</Link>
            <p className="eyebrow"><span>✦</span> حديقة الأرقام</p>
            <h1>الأرقام تحب<br /><em>من يعدّها.</em></h1>
            <p>اضغط على الرقم اللاتيني لتسمع نطقه، ثم انتقل إلى تحدي الحساب الصغير.</p><span className="number-progress-chip">{solvedQuestions.length} / 3 مسائل مكتملة</span>
            <div className="inner-route number-route" aria-label="مسار حديقة الأرقام"><span>بوابة الأرقام</span><i /><b>✦</b><i /><span>تحدي الحساب</span></div>
          </div>
          <img src="/manus-storage/academy-math-garden_f058a485.png" alt="حديقة تعليم الأرقام والحساب" />
        </section>

        <section className="number-chips" aria-label="بطاقات الأرقام اللاتينية">
          {latinDigits.map((digit, index) => <button type="button" key={digit} aria-label={`الرقم ${digit}، انقر لسماع النطق`} className={selectedDigit === index + 1 ? "is-picked" : ""} onClick={() => speakDigit(index + 1)}><strong>{digit}</strong><small>{digitWords[index]}</small><Volume2 size={13} /></button>)}
        </section>

        <section className="math-quiz">
          <div className="quiz-label"><Sparkles size={18} /> تحدّي الحساب الصغير <span>محطة 02 · اجمع النجمة</span></div>
          <div className="quiz-main">
            <div className="question-display">
              <p>عدّ النقاط أولًا</p>
              <div className="count-row"><span>{"●".repeat(question.first)}</span><b>+</b><span>{"●".repeat(question.second)}</span></div>
              <h2>{question.text}</h2>
            </div>
            <div className="answer-zone">
              <p className={correct ? "quiz-message is-correct" : "quiz-message"}>{correct && <Check size={18} />}{message}</p>{correct && <div className="answer-burst" aria-hidden="true"><i>✦</i><i>★</i><i>✧</i></div>}
              <div className="answer-options">
                {options.map((option) => <button type="button" key={option} onClick={() => answer(option)}>{option}</button>)}
              </div>
              <button className="next-question" type="button" onClick={next}><RefreshCw size={16} /> سؤال آخر</button>
            </div>
          </div>
        </section>
        <div className="number-page-ad"><AdSlot label="مساحة إعلانية — أسفل تحدي الحساب" /></div>
      </div>
    </SiteLayout>
  );
}
