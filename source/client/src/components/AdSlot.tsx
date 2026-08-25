/**
 * Style: رحلة الحروف والأرقام — مساحة إعلانية هادئة وواضحة لا تنافس نشاط الطفل.
 */
import { Megaphone } from "lucide-react";

export default function AdSlot({ label = "مساحة إعلانية" }: { label?: string }) {
  return (
    <aside className="ad-slot" aria-label={label}>
      <div className="ad-dots" aria-hidden="true">•••</div>
      <Megaphone size={17} strokeWidth={1.8} aria-hidden="true" />
      <span>{label}</span>
      <small>مكان مخصص لعرض إعلان مناسب للعائلة</small>
    </aside>
  );
}
