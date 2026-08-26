/*
 * محمّل موحّد لخدمات القياس والإعلانات.
 * ضع هنا المعرفات المفقودة قبل التفعيل الفعلي:
 * - Google Tag Manager: GTM-XXXXXXX
 * - Google Analytics 4: G-XXXXXXXXXX
 * - Microsoft Clarity: xxxxxxxx
 *
 * عند إدخال GTM مضبوط لـ GA4 وClarity، يصبح هو المسار الوحيد لهما؛
 * لذلك لا يُحمَّل gtag.js مباشرةً مع GTM.
 */
(() => {
  "use strict";

  const config = Object.freeze({
    googleTagManagerId: "GTM-XXXXXXX", // ضع هنا معرّف حاوية Google Tag Manager.
    googleAnalyticsId: "G-XXXXXXXXXX", // ضع هنا معرّف GA4 عند عدم إدارته عبر GTM.
    adsenseClient: "ca-pub-5656416032906373",
    clarityProjectId: "xxxxxxxx", // ضع هنا معرّف مشروع Microsoft Clarity.
  });

  const configured = (value) => Boolean(value && !/x{4,}/i.test(value));

  const addExternalScript = (id, source, attributes = {}) => {
    if (document.getElementById(id) || document.querySelector(`script[src="${source}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = id;
      script.src = source;
      script.async = true;
      Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.appendChild(script);
    });
  };

  const initialiseGtm = () => {
    if (!configured(config.googleTagManagerId)) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    addExternalScript("academy-gtm", `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.googleTagManagerId)}`).catch(() => undefined);
  };

  const initialiseGa4 = () => {
    if (configured(config.googleTagManagerId) || !configured(config.googleAnalyticsId)) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", config.googleAnalyticsId, { anonymize_ip: true });
    addExternalScript("academy-ga4", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.googleAnalyticsId)}`).catch(() => undefined);
  };

  const initialiseClarity = () => {
    if (!configured(config.clarityProjectId) || window.clarity) return;
    window.clarity = window.clarity || function clarity() { (window.clarity.q = window.clarity.q || []).push(arguments); };
    addExternalScript("academy-clarity", `https://www.clarity.ms/tag/${encodeURIComponent(config.clarityProjectId)}`).catch(() => undefined);
  };

  const initialiseAds = () => {
    if (!configured(config.adsenseClient) || !document.querySelector("ins.adsbygoogle")) return;
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.requestNonPersonalizedAds = 1;
    addExternalScript(
      "academy-adsense",
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsenseClient)}`,
      { crossorigin: "anonymous" },
    ).then(() => {
      const units = document.querySelectorAll("ins.adsbygoogle:not([data-academy-ad-initialized])");
      units.forEach((unit) => {
        unit.setAttribute("data-academy-ad-initialized", "true");
        try {
          window.adsbygoogle.push({});
        } catch {
          unit.removeAttribute("data-academy-ad-initialized");
        }
      });
    }).catch(() => undefined);
  };

  const run = () => {
    initialiseGtm();
    initialiseGa4();
    initialiseClarity();
    initialiseAds();
  };

  document.addEventListener("DOMContentLoaded", run, { once: true });
  window.addEventListener("load", run, { once: true });
  new MutationObserver(() => initialiseAds()).observe(document.documentElement, { childList: true, subtree: true });
})();
