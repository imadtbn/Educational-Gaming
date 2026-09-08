
/*
 * utils.js
 * نظام الصوت والنطق المركزي - أكاديمية المرح
 *
 * يحافظ على الواجهة الحالية:
 *   playTone(type)
 *   speakText(text, lang)
 *   saveProgress(key, data)
 *   getProgress(key)
 */

/* =========================================================
   AudioContext
   ========================================================= */

let audioContext = null;

function getAudioContext() {
    if (typeof window === "undefined") return null;

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioContext) {
        try {
            audioContext = new AudioContextClass();
        } catch (error) {
            console.warn("تعذر إنشاء AudioContext:", error);
            return null;
        }
    }

    return audioContext;
}

async function activateAudioContext() {
    const ctx = getAudioContext();

    if (!ctx) return null;

    try {
        if (ctx.state === "suspended") {
            await ctx.resume();
        }
    } catch (error) {
        console.warn("تعذر تفعيل AudioContext:", error);
    }

    return ctx;
}

/* =========================================================
   أصوات التأثير
   ========================================================= */

export function playTone(type) {
    const ctx = getAudioContext();

    if (!ctx) return;

    const play = () => {
        try {
            const now = ctx.currentTime;

            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();

            oscillator.connect(gain);
            gain.connect(ctx.destination);

            if (type === "tap") {
                oscillator.type = "sine";

                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.exponentialRampToValueAtTime(
                    880,
                    now + 0.1
                );

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(
                    0.01,
                    now + 0.1
                );

                oscillator.start(now);
                oscillator.stop(now + 0.1);

            } else if (type === "success") {
                oscillator.type = "triangle";

                oscillator.frequency.setValueAtTime(440, now);
                oscillator.frequency.setValueAtTime(554.37, now + 0.1);
                oscillator.frequency.setValueAtTime(659.25, now + 0.2);

                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(
                    0.1,
                    now + 0.3
                );
                gain.gain.exponentialRampToValueAtTime(
                    0.01,
                    now + 0.4
                );

                oscillator.start(now);
                oscillator.stop(now + 0.4);

            } else if (type === "error" || type === "retry") {
                oscillator.type = "square";

                oscillator.frequency.setValueAtTime(300, now);
                oscillator.frequency.exponentialRampToValueAtTime(
                    150,
                    now + 0.2
                );

                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(
                    0.01,
                    now + 0.2
                );

                oscillator.start(now);
                oscillator.stop(now + 0.2);
            }

            // تنظيف المرجع بعد انتهاء الصوت
            oscillator.addEventListener("ended", () => {
                try {
                    oscillator.disconnect();
                    gain.disconnect();
                } catch (_) {
                    // لا شيء
                }
            });

        } catch (error) {
            console.warn("تعذر تشغيل صوت التأثير:", error);
        }
    };

    /*
     * resume() مهم جدًا في الهاتف وبعض إصدارات Chrome/Safari
     * التي تبدأ AudioContext بحالة suspended.
     */
    if (ctx.state === "suspended") {
        ctx.resume()
            .then(play)
            .catch(() => {
                // قد يكون التشغيل مسموحًا فقط بعد تفاعل المستخدم
            });
    } else {
        play();
    }
}


/* =========================================================
   Speech Synthesis
   ========================================================= */

let availableVoices = [];
let voicesReady = false;
let speechRequestId = 0;

/**
 * تحميل أصوات الجهاز.
 *
 * بعض المتصفحات لا توفر الأصوات مباشرة عند تحميل الصفحة،
 * لذلك نستخدم voiceschanged بالإضافة إلى محاولة فورية.
 */
function loadVoices() {
    if (!("speechSynthesis" in window)) return;

    try {
        const voices = window.speechSynthesis.getVoices();

        if (voices && voices.length) {
            availableVoices = voices;
            voicesReady = true;
        }
    } catch (error) {
        console.warn("تعذر الحصول على أصوات الجهاز:", error);
    }
}

if (
    typeof window !== "undefined" &&
    "speechSynthesis" in window
) {
    loadVoices();

    window.speechSynthesis.addEventListener(
        "voiceschanged",
        () => {
            loadVoices();
        }
    );
}


/* =========================================================
   اختيار اللغة
   ========================================================= */

function normalizeLanguage(lang) {
    if (!lang) return "ar-SA";

    const value = String(lang).toLowerCase();

    if (value.startsWith("ar")) {
        return lang;
    }

    if (value.startsWith("en")) {
        return lang;
    }

    return lang;
}


/* =========================================================
   البحث عن أفضل صوت
   ========================================================= */

function findBestVoice(lang) {
    if (!availableVoices.length) return null;

    const normalized = normalizeLanguage(lang).toLowerCase();

    const baseLanguage = normalized.split("-")[0];

    /*
     * الأولوية:
     * 1. تطابق اللغة والمنطقة
     * 2. تطابق اللغة فقط
     * 3. صوت محلي للغة
     */

    let voice = availableVoices.find(
        v => v.lang && v.lang.toLowerCase() === normalized
    );

    if (voice) return voice;

    voice = availableVoices.find(
        v =>
            v.lang &&
            v.lang.toLowerCase().startsWith(baseLanguage + "-")
    );

    if (voice) return voice;

    voice = availableVoices.find(
        v =>
            v.lang &&
            v.lang.toLowerCase() === baseLanguage
    );

    if (voice) return voice;

    voice = availableVoices.find(
        v =>
            v.lang &&
            v.lang.toLowerCase().startsWith(baseLanguage)
    );

    if (voice) return voice;

    return null;
}


/* =========================================================
   انتظار تحميل الأصوات
   ========================================================= */

function waitForVoices(timeout = 1500) {
    return new Promise(resolve => {
        if (!("speechSynthesis" in window)) {
            resolve([]);
            return;
        }

        loadVoices();

        if (voicesReady && availableVoices.length) {
            resolve(availableVoices);
            return;
        }

        let finished = false;

        const finish = () => {
            if (finished) return;

            finished = true;

            try {
                window.speechSynthesis.removeEventListener(
                    "voiceschanged",
                    finish
                );
            } catch (_) {
                // لا شيء
            }

            loadVoices();
            resolve(availableVoices);
        };

        try {
            window.speechSynthesis.addEventListener(
                "voiceschanged",
                finish,
                { once: true }
            );
        } catch (_) {
            // المتصفح قد لا يدعم once
        }

        setTimeout(finish, timeout);
    });
}


/* =========================================================
   النطق الرئيسي
   ========================================================= */

export function speakText(text, lang = "ar-SA") {
    if (typeof window === "undefined") return;

    if (!("speechSynthesis" in window)) {
        console.warn(
            "هذا المتصفح لا يدعم Speech Synthesis."
        );
        return;
    }

    if (
        text === null ||
        text === undefined ||
        String(text).trim() === ""
    ) {
        return;
    }

    const currentRequest = ++speechRequestId;
    const speech = window.speechSynthesis;
    const language = normalizeLanguage(lang);

    /*
     * إيقاف أي نطق سابق.
     */
    try {
        speech.cancel();
    } catch (error) {
        console.warn("تعذر إيقاف النطق السابق:", error);
    }

    /*
     * انتظار الأصوات مهم خصوصًا في Chrome وSafari
     * على الهاتف والكمبيوتر.
     */
    waitForVoices().then(() => {

        /*
         * إذا طلب المستخدم نطق كلمة جديدة أثناء الانتظار،
         * نتجاهل الطلب القديم.
         */
        if (currentRequest !== speechRequestId) {
            return;
        }

        const speak = () => {
            if (currentRequest !== speechRequestId) {
                return;
            }

            try {
                const utterance =
                    new SpeechSynthesisUtterance(String(text));

                utterance.lang = language;

                /*
                 * إعدادات مناسبة للأطفال.
                 */
                utterance.rate = 0.8;
                utterance.pitch = 1;
                utterance.volume = 1;

                /*
                 * اختيار صوت حقيقي من أصوات الجهاز.
                 */
                const voice = findBestVoice(language);

                if (voice) {
                    utterance.voice = voice;
                }

                /*
                 * عند انتهاء النطق.
                 */
                utterance.onend = () => {
                    // لا شيء مطلوب حاليًا
                };

                /*
                 * معالجة أخطاء SpeechSynthesis.
                 */
                utterance.onerror = event => {
                    console.warn(
                        "خطأ في النطق:",
                        event?.error || "unknown"
                    );
                };

                /*
                 * بعض إصدارات Chrome قد تبقى في حالة speaking
                 * بعد cancel() مباشرة، لذلك ننتظر دورة event loop.
                 */
                setTimeout(() => {
                    if (currentRequest !== speechRequestId) {
                        return;
                    }

                    try {
                        speech.speak(utterance);
                    } catch (error) {
                        console.warn(
                            "تعذر تشغيل النطق:",
                            error
                        );
                    }
                }, 50);

            } catch (error) {
                console.warn(
                    "تعذر إنشاء SpeechSynthesisUtterance:",
                    error
                );
            }
        };

        /*
         * معالجة حالة Chrome التي يتوقف فيها المحرك
         * بعد فترات طويلة من الاستخدام.
         */
        try {
            if (speech.paused) {
                speech.resume();
            }
        } catch (_) {
            // لا شيء
        }

        speak();
    });
}


/* =========================================================
   تهيئة الصوت بعد أول تفاعل للمستخدم
   ========================================================= */

/*
 * مهم للهواتف:
 * AudioContext غالبًا لا يسمح بالتشغيل التلقائي قبل
 * click / touch / pointerdown.
 *
 * لذلك نقوم بتفعيله عند أول تفاعل فقط.
 */
if (typeof window !== "undefined") {
    const unlockAudio = () => {
        activateAudioContext();

        /*
         * تحميل الأصوات أيضًا بعد تفاعل المستخدم.
         */
        loadVoices();

        document.removeEventListener(
            "pointerdown",
            unlockAudio
        );

        document.removeEventListener(
            "touchstart",
            unlockAudio
        );

        document.removeEventListener(
            "keydown",
            unlockAudio
        );
    };

    document.addEventListener(
        "pointerdown",
        unlockAudio,
        { passive: true }
    );

    document.addEventListener(
        "touchstart",
        unlockAudio,
        { passive: true }
    );

    document.addEventListener(
        "keydown",
        unlockAudio,
        { passive: true }
    );
}


/* =========================================================
   حفظ التقدم
   ========================================================= */

export function saveProgress(key, data) {
    try {
        localStorage.setItem(
            key,
            JSON.stringify(data)
        );
    } catch (error) {
        console.warn(
            "تعذر حفظ التقدم:",
            error
        );
    }
}


/* =========================================================
   استرجاع التقدم
   ========================================================= */

export function getProgress(key) {
    try {
        const data = localStorage.getItem(key);

        return data
            ? JSON.parse(data)
            : null;

    } catch (error) {
        console.warn(
            "تعذر قراءة التقدم:",
            error
        );

        return null;
    }
}

