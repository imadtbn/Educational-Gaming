/**
 * Style: رحلة الحروف والأرقام — إنجازات تظهر كملصق نجمي قصير ومبهج، لا كتنبيه تقني عادي.
 */
import { X } from "lucide-react";
import { useEffect } from "react";
import { BADGES, useProgress } from "@/contexts/ProgressContext";

export default function CelebrationToast() {
  const { celebration, closeCelebration } = useProgress();

  useEffect(() => {
    if (!celebration) return;
    const timer = window.setTimeout(closeCelebration, 5000);
    return () => window.clearTimeout(timer);
  }, [celebration, closeCelebration]);

  if (!celebration) return null;
  const badge = celebration.badge ? BADGES[celebration.badge] : null;

  return (
    <aside className="celebration-toast" role="status" aria-live="polite">
      <div className="celebration-sparkles" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
      <button className="celebration-close" type="button" onClick={closeCelebration} aria-label="إغلاق رسالة الإنجاز"><X size={15} /></button>
      <div className={`celebration-badge ${badge?.color ?? "gold"}`}>{badge?.icon ?? "★"}</div>
      <div>
        <p className="celebration-kicker">إنجاز جديد</p>
        <strong>{celebration.title}</strong>
        <p>{celebration.message}</p>
      </div>
    </aside>
  );
}
