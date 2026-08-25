/**
 * Style: رحلة الحروف والأرقام — تذكرة تثبيت صغيرة ودافئة تدعو العائلة لحفظ الأكاديمية على الجهاز.
 */
import { Download, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !import.meta.env.PROD) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const capturePrompt = (event: Event) => { event.preventDefault(); setDeferredPrompt(event as InstallPromptEvent); };
    const installed = () => setDeferredPrompt(null);
    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", installed);
    return () => { window.removeEventListener("beforeinstallprompt", capturePrompt); window.removeEventListener("appinstalled", installed); };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (!deferredPrompt || dismissed) return null;
  return <aside className="pwa-install-prompt" aria-label="تثبيت أكاديمية المرح"><button type="button" className="pwa-close" aria-label="إخفاء تذكرة التثبيت" onClick={() => setDismissed(true)}><X size={14} /></button><Sparkles size={19} /><div><strong>خذ الأكاديمية معك</strong><span>ثبّت الرحلة على جهازك للتعلّم بسرعة.</span></div><button type="button" className="pwa-install-button" onClick={install}><Download size={15} /> ثبّت</button></aside>;
}
