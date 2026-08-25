/**
 * Style: رحلة الحروف والأرقام — عنوان تحريري ووسم بسيط يحاكي نقاط خريطة الاستكشاف.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow"><span>✦</span>{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
}
