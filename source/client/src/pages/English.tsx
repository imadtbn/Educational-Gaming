/**
 * Style: رحلة الحروف والأرقام — درس إنجليزي بلون مرجاني وكتل صوتية واضحة.
 */
import AdSlot from "@/components/AdSlot";
import LearningBoard, { type LearningItem } from "@/components/LearningBoard";
import SiteLayout from "@/components/SiteLayout";

const letters: LearningItem[] = [
  { character: "A", label: "Letter A", word: "Apple", sound: "A… Apple", hint: "Say: Apple. Can you picture a red apple?" },
  { character: "B", label: "Letter B", word: "Ball", sound: "B… Ball", hint: "Say: Ball. Bounce it high and low." },
  { character: "C", label: "Letter C", word: "Cat", sound: "C… Cat", hint: "Say: Cat. What sound does a cat make?" },
  { character: "D", label: "Letter D", word: "Dog", sound: "D… Dog", hint: "Say: Dog. A friendly dog likes to play." },
  { character: "E", label: "Letter E", word: "Elephant", sound: "E… Elephant", hint: "Say: Elephant. It has a long trunk." },
  { character: "F", label: "Letter F", word: "Fish", sound: "F… Fish", hint: "Say: Fish. Imagine it swimming fast." },
];

export default function English() {
  return (
    <SiteLayout>
      <div className="lesson-page page-english">
        <LearningBoard title="English Time" subtitle="Listen, repeat, and remember" items={letters} language="en-US" accent="coral" />
        <div className="page-bottom-grid">
          <div className="tip-card coral-tip"><span>✦</span><p><strong>Little tip:</strong> Listen once, then say the word with a big smile.</p></div>
          <AdSlot label="مساحة إعلانية — أسفل الدرس" />
        </div>
      </div>
    </SiteLayout>
  );
}
