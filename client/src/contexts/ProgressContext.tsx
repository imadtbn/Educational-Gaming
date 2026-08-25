/**
 * Style: رحلة الحروف والأرقام — تقدّم طفولي آمن ومحلي يظهر كنجوم وملصقات رحلة لا كلوحة نقاط جافة.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BadgeId = "first-steps" | "animal-scout" | "animal-wordsmith" | "animal-english-ace" | "number-ninja" | "math-explorer" | "math-reviser" | "writing-trail" | "card-collector";
export type SavedArtwork = { id: string; symbol: string; label: string; createdAt: number; image: string };

export const BADGES: Record<BadgeId, { title: string; icon: string; color: string }> = {
  "first-steps": { title: "بداية مضيئة", icon: "✦", color: "gold" },
  "animal-scout": { title: "مستكشف الحيوانات", icon: "◉", color: "coral" },
  "animal-wordsmith": { title: "صديق الحروف", icon: "أ", color: "purple" },
  "animal-english-ace": { title: "English Animal Ace", icon: "A", color: "teal" },
  "writing-trail": { title: "أثر قلم رائع", icon: "✎", color: "gold" },
  "card-collector": { title: "جامع البطاقات", icon: "▣", color: "coral" },
  "number-ninja": { title: "صديق الأرقام", icon: "١", color: "teal" },
  "math-explorer": { title: "بطل الحساب", icon: "＋", color: "purple" },
  "math-reviser": { title: "مراجع الحساب", icon: "★", color: "gold" },
};

type ProgressState = { stars: number; completedActivities: string[]; badges: BadgeId[]; artworks: SavedArtwork[] };
type CelebrationState = { title: string; message: string; badge?: BadgeId } | null;
type AwardInput = { activityId: string; stars: number; title: string; message: string; badge?: BadgeId };

type ProgressContextValue = {
  progress: ProgressState;
  celebration: CelebrationState;
  completeActivity: (award: AwardInput) => boolean;
  saveArtwork: (artwork: Omit<SavedArtwork, "id" | "createdAt">) => void;
  deleteArtwork: (id: string) => void;
  closeCelebration: () => void;
  resetProgress: () => void;
};

const STORAGE_KEY = "academy-marh-progress-v1";
const emptyProgress: ProgressState = { stars: 0, completedActivities: [], badges: [], artworks: [] };
const ProgressContext = createContext<ProgressContextValue | null>(null);

function readProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyProgress;
    const parsed = JSON.parse(stored) as ProgressState;
    return {
      stars: Number.isFinite(parsed.stars) ? parsed.stars : 0,
      completedActivities: Array.isArray(parsed.completedActivities) ? parsed.completedActivities : [],
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      artworks: Array.isArray(parsed.artworks) ? parsed.artworks.filter((item): item is SavedArtwork => typeof item?.id === "string" && typeof item?.image === "string" && typeof item?.label === "string").slice(0, 8) : [],
    };
  } catch {
    return emptyProgress;
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(readProgress);
  const [celebration, setCelebration] = useState<CelebrationState>(null);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* يبقى التطبيق قابلاً للاستخدام حتى إن امتلأت مساحة التخزين المحلية. */ }
  }, [progress]);

  const completeActivity = useCallback((award: AwardInput) => {
    if (progress.completedActivities.includes(award.activityId)) return false;
    const newBadge = award.badge && !progress.badges.includes(award.badge) ? award.badge : undefined;
    setProgress((current) => ({
      ...current,
      stars: current.stars + award.stars,
      completedActivities: [...current.completedActivities, award.activityId],
      badges: newBadge ? [...current.badges, newBadge] : current.badges,
    }));
    setCelebration({ title: award.title, message: award.message, badge: newBadge });
    return true;
  }, [progress.badges, progress.completedActivities]);

  const value = useMemo(() => ({
    progress,
    celebration,
    completeActivity,
    saveArtwork: (artwork: Omit<SavedArtwork, "id" | "createdAt">) => setProgress((current) => ({ ...current, artworks: [{ ...artwork, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now() }, ...current.artworks].slice(0, 8) })),
    deleteArtwork: (id: string) => setProgress((current) => ({ ...current, artworks: current.artworks.filter((artwork) => artwork.id !== id) })),
    closeCelebration: () => setCelebration(null),
    resetProgress: () => setProgress(emptyProgress),
  }), [celebration, completeActivity, progress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress يجب استخدامه داخل ProgressProvider");
  return context;
}
