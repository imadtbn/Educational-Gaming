/**
 * Style: رحلة الحروف والأرقام — دفتر بطاقات استكشاف ورقي، بألسنة فئات ونطق عربي وإنجليزي مستقل.
 */
import { Apple, Check, Palette, PawPrint, Sparkles, Tractor, Volume2, Wrench } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import AdSlot from "@/components/AdSlot";
import SiteLayout from "@/components/SiteLayout";
import { useProgress } from "@/contexts/ProgressContext";
import { playTone } from "@/lib/feedback";

type CardItem = { id: string; ar: string; en: string; art: string; image?: string; color?: string };
type CardGroup = { id: "animals" | "fruits" | "colors" | "tools"; label: string; hint: string; icon: typeof PawPrint; items: CardItem[] };

const groups: CardGroup[] = [
  { id: "animals", label: "الحيوانات", hint: "قل الاسم، ثم استمع إليه بلغتين.", icon: PawPrint, items: [
    { id: "lion", ar: "أسد", en: "Lion", art: "portrait-lion", image: "/manus-storage/academy-animals-explorer_6ca043a3.png" },
    { id: "elephant", ar: "فيل", en: "Elephant", art: "portrait-elephant", image: "/manus-storage/academy-animals-explorer_6ca043a3.png" },
    { id: "rabbit", ar: "أرنب", en: "Rabbit", art: "portrait-rabbit", image: "/manus-storage/academy-animals-explorer_6ca043a3.png" },
    { id: "parrot", ar: "ببغاء", en: "Parrot", art: "portrait-parrot", image: "/manus-storage/academy-animals-explorer_6ca043a3.png" },
  ] },
  { id: "fruits", label: "الفواكه", hint: "اكتشف ثمرة اليوم وكرر اسمها بوضوح.", icon: Apple, items: [
    { id: "apple", ar: "تفاحة", en: "Apple", art: "fruit-apple", image: "/manus-storage/academy-fruit-cards_a3d92f75.png" },
    { id: "banana", ar: "موز", en: "Banana", art: "fruit-banana", image: "/manus-storage/academy-fruit-cards_a3d92f75.png" },
    { id: "orange", ar: "برتقال", en: "Orange", art: "fruit-orange", image: "/manus-storage/academy-fruit-cards_a3d92f75.png" },
    { id: "grapes", ar: "عنب", en: "Grapes", art: "fruit-grapes", image: "/manus-storage/academy-fruit-cards_a3d92f75.png" },
  ] },
  { id: "colors", label: "الألوان", hint: "انظر إلى اللون، ثم استمع إلى اسمه.", icon: Palette, items: [
    { id: "red", ar: "أحمر", en: "Red", art: "color-red", color: "#d75d4d" },
    { id: "blue", ar: "أزرق", en: "Blue", art: "color-blue", color: "#3e8da1" },
    { id: "yellow", ar: "أصفر", en: "Yellow", art: "color-yellow", color: "#efbf3e" },
    { id: "green", ar: "أخضر", en: "Green", art: "color-green", color: "#5e9c73" },
  ] },
  { id: "tools", label: "أدوات يومية", hint: "أدوات نراها ونستخدمها كل يوم.", icon: Wrench, items: [
    { id: "pencil", ar: "قلم", en: "Pencil", art: "tool-pencil", image: "/manus-storage/academy-everyday-tools-cards_d62e6ef5.png" },
    { id: "book", ar: "كتاب", en: "Book", art: "tool-book", image: "/manus-storage/academy-everyday-tools-cards_d62e6ef5.png" },
    { id: "spoon", ar: "ملعقة", en: "Spoon", art: "tool-spoon", image: "/manus-storage/academy-everyday-tools-cards_d62e6ef5.png" },
    { id: "key", ar: "مفتاح", en: "Key", art: "tool-key", image: "/manus-storage/academy-everyday-tools-cards_d62e6ef5.png" },
  ] },
];

function speak(text: string, lang: "ar" | "en") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "ar" ? "ar-SA" : "en-US";
  utterance.rate = 0.72;
  window.speechSynthesis.speak(utterance);
}

export default function Animals() {
  const [active, setActive] = useState<CardGroup["id"]>("animals");
  const [visited, setVisited] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const { completeActivity } = useProgress();
  const group = groups.find((item) => item.id === active)!;

  const hearCard = (card: CardItem, language: "ar" | "en") => {
    const key = `${active}-${card.id}`;
    setSelected(`${key}-${language}`);
    speak(language === "ar" ? card.ar : card.en, language);
    playTone("tap");
    setVisited((current) => {
      if (current.includes(key)) return current;
      const next = [...current, key];
      const completed = group.items.every((item) => next.includes(`${active}-${item.id}`));
      if (completed) {
        const animalBadge = active === "animals" ? "animal-scout" : active === "fruits" ? "card-collector" : undefined;
        completeActivity({ activityId: `cards-${active}`, stars: 2, badge: animalBadge, title: active === "fruits" ? "جامع البطاقات" : `مستكشف ${group.label}`, message: `اكتشفت جميع بطاقات ${group.label} وحصلت على نجمتين.` });
        playTone("success");
      }
      return next;
    });
  };

  const discovered = group.items.filter((card) => visited.includes(`${active}-${card.id}`)).length;
  return <SiteLayout><div className="concept-page"><section className="concept-hero"><div><Link href="/" className="back-link">← كل المسارات</Link><p className="eyebrow"><span>✦</span> دفتر الاستكشاف</p><h1>بطاقات صغيرة…<br /><em>وكلمات كبيرة.</em></h1><p>اختر فئة، ثم استمع إلى كل بطاقة بالعربية والإنجليزية ورددها بصوتك.</p><span className="concept-discovery">{discovered} / {group.items.length} بطاقات مكتشفة</span><div className="inner-route"><span>اختر الفئة</span><i /><b>✦</b><i /><span>اسمع وردد</span></div></div><div className="concept-hero-art" aria-hidden="true"><span>✦</span><i>☷</i><i>✧</i></div></section><section className="concept-station"><div className="concept-tabs" role="tablist" aria-label="فئات البطاقات التعليمية">{groups.map((item) => { const Icon = item.icon; return <button type="button" key={item.id} role="tab" aria-selected={active === item.id} className={active === item.id ? "is-active" : ""} onClick={() => { setActive(item.id); playTone("tap"); }}><Icon size={16} />{item.label}</button>; })}</div><div className="concept-board-heading"><div><p>محطة بطاقات</p><h2>{group.label}</h2><span>{group.hint}</span></div><div className="concept-ticket"><Tractor size={16} /> اسمع · ردد · اكتشف</div></div><section className="concept-grid" aria-label={`بطاقات ${group.label}`}>{group.items.map((card) => { const key = `${active}-${card.id}`; const viewed = visited.includes(key); return <article className={`concept-card ${viewed ? "is-visited" : ""}`} key={card.id}><div className={`concept-visual ${card.art}`} style={card.color ? { background: card.color } : { backgroundImage: `url(${card.image})` }}><span className="concept-star">✦</span>{card.color && <i className="color-splash" />}</div><div className="concept-labels"><strong>{card.ar}</strong><small>{card.en}</small></div><div className="concept-audio"><button type="button" className={selected === `${key}-ar` ? "is-speaking" : ""} onClick={() => hearCard(card, "ar")}><Volume2 size={14} /> العربية</button><button type="button" className={selected === `${key}-en` ? "is-speaking" : ""} onClick={() => hearCard(card, "en")}><Volume2 size={14} /> English</button></div>{viewed && <span className="concept-check"><Check size={14} /></span>}</article>; })}</section></section><div className="concept-page-ad"><AdSlot label="مساحة إعلانية — بين بطاقات الاستكشاف" /></div></div></SiteLayout>;
}
