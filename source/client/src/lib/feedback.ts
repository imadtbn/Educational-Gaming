/**
 * Style: رحلة الحروف والأرقام — أصوات قصيرة وناعمة للتأكيد والتشجيع دون إزعاج أو موسيقى مستمرة.
 */
export type FeedbackTone = "tap" | "success" | "retry";

const sequences: Record<FeedbackTone, number[]> = {
  tap: [440],
  success: [523.25, 659.25, 783.99],
  retry: [330, 392],
};

export function playTone(kind: FeedbackTone) {
  if (typeof window === "undefined" || !("AudioContext" in window)) return;
  try {
    const context = new window.AudioContext();
    const start = context.currentTime;
    sequences[kind].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = kind === "success" ? "sine" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, start + index * 0.1);
      gain.gain.setValueAtTime(0.0001, start + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.09, start + index * 0.1 + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.1 + 0.17);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + index * 0.1);
      oscillator.stop(start + index * 0.1 + 0.19);
    });
    window.setTimeout(() => context.close(), 700);
  } catch {
    // صوت المتصفح إضافة اختيارية؛ لا ينبغي أن يوقف التعلم إذا كان غير متاح.
  }
}
