/**
 * Style: رحلة الحروف والأرقام — درس عربي داخل لوح استكشاف تركوازي دافئ.
 */
import AdSlot from "@/components/AdSlot";
import LearningBoard, { type LearningItem } from "@/components/LearningBoard";
import SiteLayout from "@/components/SiteLayout";

const letters: LearningItem[] = [
  { character: "أ", label: "حرف الألف", word: "أرنب", sound: "أ… أَرنب", hint: "قل: أَرنب. هل ترى الأرنب يقفز؟" },
  { character: "ب", label: "حرف الباء", word: "بطة", sound: "ب… بَطَّة", hint: "قل: بَطَّة. صوت الباء يبدأ من الشفتين." },
  { character: "ت", label: "حرف التاء", word: "تفاحة", sound: "ت… تُفّاحة", hint: "قل: تُفّاحة. تخيل لونها الأحمر الجميل." },
  { character: "ث", label: "حرف الثاء", word: "ثعلب", sound: "ث… ثَعلب", hint: "قل: ثَعلب. هل تعرف أين يعيش؟" },
  { character: "ج", label: "حرف الجيم", word: "جمل", sound: "ج… جَمَل", hint: "قل: جَمَل. له سنام عالٍ على ظهره." },
  { character: "ح", label: "حرف الحاء", word: "حصان", sound: "ح… حِصان", hint: "قل: حِصان. هل تستطيع تقليد صوته؟" },
];

export default function Arabic() {
  return (
    <SiteLayout>
      <div className="lesson-page page-arabic">
        <LearningBoard title="الحروف العربية" subtitle="اسمع الحرف، وانطق الكلمة" items={letters} language="ar-SA" accent="teal" />
        <div className="page-bottom-grid">
          <div className="tip-card"><span>✦</span><p><strong>نصيحة للصغير:</strong> استمع إلى الحرف مرة، ثم كرره بصوتك بهدوء.</p></div>
          <AdSlot label="مساحة إعلانية — أسفل الدرس" />
        </div>
      </div>
    </SiteLayout>
  );
}
