/**
 * Style: رحلة الحروف والأرقام — صفحة مسار متعرّج تشبه خريطة كتاب أطفال مصوّر.
 */
import { ArrowLeft, Calculator, Languages, PawPrint, Volume2 } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SiteLayout from "@/components/SiteLayout";
import AdSlot from "@/components/AdSlot";
import SectionHeading from "@/components/SectionHeading";

const lessons = [
  {
    number: "01",
    icon: Languages,
    title: "الحروف العربية",
    text: "استمع إلى الحرف، شاهد شكله، وتعرّف إلى كلمة تبدأ به.",
    href: "/arabic",
    tone: "teal",
    tag: "أ، ب، ت…",
  },
  {
    number: "02",
    icon: Volume2,
    title: "English Time",
    text: "بطاقات إنجليزية مشرقة تساعدك على نطق الحروف والكلمات بثقة.",
    href: "/english",
    tone: "coral",
    tag: "A, B, C…",
  },
  {
    number: "03",
    icon: PawPrint,
    title: "عالم الحيوانات",
    text: "اكتشف أسماء حيوانات لطيفة بالعربية والإنجليزية مع النطق.",
    href: "/animals",
    tone: "purple",
    tag: "أسد، فيل…",
  },
  {
    number: "04",
    icon: Calculator,
    title: "الأرقام والحساب",
    text: "جرّب عدّ الأشكال وحلّ مسائل قصيرة بطريقة ممتعة.",
    href: "/numbers",
    tone: "yellow",
    tag: "١، ٢، ٣…",
  },
];

export default function Home() {
  return (
    <SiteLayout>
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span>✦</span> تعلّم، العب، واكتشف</p>
            <h1>كل حرف هو بداية <em>مغامرة</em> جديدة.</h1>
            <p className="hero-text">من أول «أ» إلى أول مسألة حسابية، نصنع مساحة آمنة ومشرقة يتعلّم فيها الأطفال بالاستماع والاختيار والتجربة.</p>
            <div className="hero-actions">
              <Button asChild className="journey-cta">
                <Link href="/arabic">ابدأ رحلة اليوم <ArrowLeft size={18} /></Link>
              </Button>
              <a className="quiet-link" href="#paths">شاهد المسارات <span>↓</span></a>
            </div>
            <div className="hero-signals" aria-label="مزايا الموقع">
              <span>لأعمار 4–14</span><i />
              <span>أنشطة قصيرة</span><i />
              <span>تعلم بصوت وصورة</span>
            </div>
          </div>
          <div className="hero-art-wrap">
            <img src="/manus-storage/academy-hero-learning-journey_7024bc2d.png" alt="رحلة تعلم مصورة فيها حيوانات وحروف وأرقام" className="hero-art" />
            <div className="hero-sticker sticker-one">أ</div>
            <div className="hero-sticker sticker-two">1</div>
            <div className="hero-star" aria-hidden="true">✦</div>
          </div>
        </div>
      </section>

      <div className="hero-curve" aria-hidden="true" />

      <section className="paths-section" id="paths">
        <div className="paths-intro">
          <SectionHeading
            eyebrow="خريطة التعلّم"
            title="اختر محطتك التالية"
            description="دروس قصيرة وواضحة، يختار الطفل ما يثير فضوله ثم يعود في أي وقت ليكمل الرحلة."
          />
          <div className="today-compass">
            <span className="compass-needle">✦</span>
            <div><strong>مسار اليوم</strong><small>ابدأ بحرف جديد</small></div>
          </div>
        </div>

        <div className="learning-path">
          <svg className="journey-trail" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true">
            <path d="M1125 174 C1045 31 923 30 842 164 S647 284 554 153 S355 21 280 163 S91 273 42 128" />
          </svg>
          <span className="trail-note trail-start">ابدأ هنا <b>✦</b></span>
          <span className="trail-note trail-end"><b>✦</b> كنز جديد</span>
          {lessons.map((lesson, index) => {
            const Icon = lesson.icon;
            return (
              <article className={`path-stop stop-${lesson.tone}`} key={lesson.href}>
                <span className="stop-number">{lesson.number}</span>
                <div className="stop-icon"><Icon size={25} strokeWidth={2.1} /></div>
                <p className="stop-tag">{lesson.tag}</p>
                <h3>{lesson.title}</h3>
                <p>{lesson.text}</p>
                <Link href={lesson.href} className="stop-link">ادخل المحطة <ArrowLeft size={16} /></Link>
                {index < lessons.length - 1 && <span className="path-connector" aria-hidden="true" />}
              </article>
            );
          })}
        </div>
      </section>

      <section className="feature-split">
        <div className="feature-image animal-image">
          <img src="/manus-storage/academy-animals-explorer_6ca043a3.png" alt="حيوانات لطيفة في رحلة استكشاف" />
          <span className="image-note">قل الاسم… ثم استمع إليه</span>
        </div>
        <div className="feature-copy">
          <p className="eyebrow"><span>✦</span> لأن التعلم يحتاج إلى حكاية</p>
          <h2>لا تحفظ فقط…<br />اكتشف وجرّب.</h2>
          <p>نحوّل الحرف والكلمة والرقم إلى لحظة مرئية وصوتية. كل صفحة تعطي الطفل فرصة بسيطة للتفاعل قبل الانتقال إلى المحطة التالية.</p>
          <Link href="/animals" className="text-cta">استكشف عالم الحيوانات <ArrowLeft size={17} /></Link>
        </div>
      </section>

      <section className="ad-row-wrap"><AdSlot label="مساحة إعلانية — بانر عائلي" /></section>

      <section className="math-callout">
        <div className="math-copy">
          <span className="math-badge">محطة الأرقام</span>
          <h2>عدّ، فكّر، ثم أجب.</h2>
          <p>تمارين حسابية صغيرة تتغير مع كل محاولة لتشجّع التفكير بهدوء.</p>
          <Link href="/numbers" className="journey-cta inline-cta">إلى محطة الحساب <ArrowLeft size={18} /></Link>
        </div>
        <img src="/manus-storage/academy-math-garden_f058a485.png" alt="حديقة أرقام وأدوات عد مصورة" className="math-art" />
      </section>
    </SiteLayout>
  );
}
