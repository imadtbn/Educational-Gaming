/**
 * Style: رحلة الحروف والأرقام — مسار استكشاف عضوي، تركواز دافئ وبهجة كتاب أطفال مصوّر.
 */
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useProgress } from "@/contexts/ProgressContext";

const logoUrl = "/manus-storage/academy-compass-logo_56b65985.png";

const navigation = [
  { href: "/", label: "الرئيسية" },
  { href: "/arabic", label: "الحروف العربية" },
  { href: "/english", label: "English" },
  { href: "/animals", label: "عالم الحيوانات" },
  { href: "/numbers", label: "الأرقام والحساب" },
  { href: "/writing", label: "اكتب وتعلّم" },
  { href: "/games", label: "اختبارات وألعاب" },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { progress } = useProgress();

  return (
    <div className="site-shell" dir="rtl">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="أكاديمية المرح - الصفحة الرئيسية">
            <img src={logoUrl} className="brand-mark" alt="رمز بوصلة أكاديمية المرح" />
            <span className="brand-name">
              <small>أكاديمية</small><strong>المرح</strong>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="التنقل الرئيسي">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={location === item.href ? "nav-link is-active" : "nav-link"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-progress" aria-label={`تقدم الرحلة: ${progress.stars} نجوم و${progress.badges.length} شارات`}>
            <span className="progress-star">★</span>
            <div><strong>{progress.stars}</strong><small>نجوم الرحلة</small></div>
          </div>

          <div className="header-status" aria-label="رسالة تشجيع">
            <span className="status-star">✦</span>
            <span>رحلة اليوم تبدأ هنا</span>
          </div>

          <button
            className="menu-trigger"
            type="button"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        {open && (
          <nav className="mobile-nav" aria-label="التنقل عبر الهاتف">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={location === item.href ? "mobile-nav-link is-active" : "mobile-nav-link"}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src={logoUrl} alt="" className="footer-mark" />
          <div>
            <p className="footer-title">أكاديمية المرح</p>
            <p>خطوة صغيرة كل يوم، واكتشاف كبير كل مرة.</p>
          </div>
        </div>
        <p className="footer-note">محتوى تعليمي مبسّط للأطفال حتى 14 سنة.</p>
      </footer>
    </div>
  );
}
