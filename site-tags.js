/*
 * محمّل موحّد لخدمات القياس والإعلانات.
 * وضع GA4 هو GTM، لذلك لا يُحمَّل gtag.js مباشرةً كي لا تتكرر page_view.
 * ضع هنا المعرّف المفقود قبل التفعيل الفعلي:
 * - Microsoft Clarity: xxxxxxxx
 *
 * عند إدخال GTM مضبوط لـ GA4 وClarity، يصبح هو المسار الوحيد لهما؛
 * لذلك لا يُحمَّل gtag.js مباشرةً مع GTM.
 */
(() => {
  "use strict";

  const config = Object.freeze({
    googleTagManagerId: "GTM-T6WMH24Z",
    googleAnalyticsId: "G-B1G7WFGDBR",
    ga4Mode: "gtm", // يبقى GA4 داخل حاوية GTM؛ غيّره إلى direct فقط عند إزالة GA4 من GTM.
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
    if (window.__academyGtmStarted) return;
    window.__academyGtmStarted = true;
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js", academyGa4Id: config.googleAnalyticsId });
    addExternalScript("academy-gtm", `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.googleTagManagerId)}`).catch(() => undefined);
  };

  const initialiseGa4 = () => {
    if (config.ga4Mode !== "direct" || configured(config.googleTagManagerId) || !configured(config.googleAnalyticsId)) return;
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
