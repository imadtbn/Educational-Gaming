/**
 * Style: رحلة الحروف والأرقام — لوح أثر قلم ورقي يفضّل التشجيع والاحتفال بالمحاولة على قياس دقة الخط.
 */
import { Check, Eraser, PenLine, RefreshCw, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import AdSlot from "@/components/AdSlot";
import SiteLayout from "@/components/SiteLayout";
import { useProgress } from "@/contexts/ProgressContext";
import { playTone } from "@/lib/feedback";

const tracks = [
  { symbol: "أ", label: "حرف الألف", voice: "ألف", locale: "ar-SA", type: "حرف عربي", color: "teal" },
  { symbol: "ب", label: "حرف الباء", voice: "باء", locale: "ar-SA", type: "حرف عربي", color: "coral" },
  { symbol: "S", label: "Letter S", voice: "S", locale: "en-US", type: "English letter", color: "purple" },
  { symbol: "3", label: "الرقم 3", voice: "ثلاثة", locale: "ar-SA", type: "رقم لاتيني", color: "gold" },
  { symbol: "7", label: "الرقم 7", voice: "سبعة", locale: "ar-SA", type: "رقم لاتيني", color: "teal" },
];

export default function Writing() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [hasInk, setHasInk] = useState(false);
  const [complete, setComplete] = useState(false);
  const { completeActivity } = useProgress();
  const track = tracks[trackIndex];

  const speak = () => { if (!("speechSynthesis" in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(track.voice); utterance.lang = track.locale; utterance.rate = 0.7; window.speechSynthesis.speak(utterance); playTone("tap"); };
  const drawGuide = () => { const canvas = canvasRef.current; if (!canvas) return; const context = canvas.getContext("2d"); if (!context) return; context.clearRect(0, 0, canvas.width, canvas.height); context.fillStyle = "#fffdf5"; context.fillRect(0, 0, canvas.width, canvas.height); context.strokeStyle = "#dccb9c"; context.lineWidth = 2; context.setLineDash([10, 10]); [105, 230, 355].forEach((y) => { context.beginPath(); context.moveTo(42, y); context.lineTo(canvas.width - 42, y); context.stroke(); }); context.setLineDash([]); context.fillStyle = "rgba(17,127,134,.13)"; context.textAlign = "center"; context.textBaseline = "middle"; context.font = "bold 210px Baloo Bhaijaan 2, Cairo, sans-serif"; context.fillText(track.symbol, canvas.width / 2, 218); };
  useEffect(() => { drawGuide(); setHasInk(false); setComplete(false); }, [trackIndex]);
  const point = (event: React.PointerEvent<HTMLCanvasElement>) => { const canvas = canvasRef.current!; const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * (canvas.width / rect.width), y: (event.clientY - rect.top) * (canvas.height / rect.height) }; };
  const start = (event: React.PointerEvent<HTMLCanvasElement>) => { const context = canvasRef.current?.getContext("2d"); if (!context) return; event.currentTarget.setPointerCapture(event.pointerId); const p = point(event); context.beginPath(); context.moveTo(p.x, p.y); setDrawing(true); setHasInk(true); };
  const move = (event: React.PointerEvent<HTMLCanvasElement>) => { if (!drawing) return; const context = canvasRef.current?.getContext("2d"); if (!context) return; const p = point(event); context.strokeStyle = "#117f86"; context.lineWidth = 15; context.lineCap = "round"; context.lineJoin = "round"; context.lineTo(p.x, p.y); context.stroke(); };
  const clear = () => { drawGuide(); setHasInk(false); setComplete(false); playTone("tap"); };
  const celebrate = () => { if (!hasInk) return; setComplete(true); playTone("success"); completeActivity({ activityId: `writing-${track.symbol}`, stars: 1, badge: "writing-trail", title: "أثر قلم رائع", message: `أكملت تدريب كتابة ${track.label} وأضفت نجمة إلى رحلتك.` }); };
  const next = () => { setTrackIndex((value) => (value + 1) % tracks.length); playTone("tap"); };

  return <SiteLayout><div className="writing-page"><section className="writing-hero"><div><Link href="/" className="back-link">← كل المسارات</Link><p className="eyebrow"><span>✦</span> لوح أثر القلم</p><h1>اكتب، جرّب…<br /><em>واترك أثرك.</em></h1><p>اتبع الدليل الشفاف بالقلم أو الإصبع. هنا لا توجد إجابة خاطئة؛ كل محاولة تقرّبك من شكل الحرف والرقم.</p><div className="inner-route writing-route"><span>استمع</span><i /><b>✎</b><i /><span>اكتب واحتفل</span></div></div><div className="writing-hero-art" aria-hidden="true"><span>✎</span><i>✦</i><i>✧</i></div></section><section className="writing-station"><aside className="track-picker" aria-label="اختيار تدريب الكتابة"><p>اختر أثر اليوم</p>{tracks.map((item, index) => <button type="button" key={item.symbol} className={index === trackIndex ? `is-active ${item.color}` : ""} onClick={() => setTrackIndex(index)}><b>{item.symbol}</b><span>{item.label}</span></button>)}</aside><div className="writing-board"><div className="board-station-label"><span>⚑</span> محطة 03 · أثر القلم <i>✦</i></div><div className="board-topline"><div><span>{track.type}</span><h2>{track.label}</h2></div><button type="button" className="board-sound" onClick={speak}><Volume2 size={18} /> استمع للنطق</button></div><div className="canvas-frame"><canvas ref={canvasRef} width="900" height="460" onPointerDown={start} onPointerMove={move} onPointerUp={() => setDrawing(false)} onPointerLeave={() => setDrawing(false)} aria-label={`مساحة كتابة ${track.label}`} />{complete && <div className="ink-celebration" aria-hidden="true"><i>✦</i><i>★</i><i>✧</i><strong>أحسنت!</strong></div>}</div><div className="writing-actions"><button type="button" onClick={clear}><Eraser size={17} /> امسح وحاول</button><button type="button" className="finish-writing" onClick={celebrate} disabled={!hasInk}><Check size={17} /> أنهيت التدريب</button><button type="button" onClick={next}><RefreshCw size={17} /> أثر جديد</button></div><div className="board-route-stamp" aria-hidden="true"><span>استمع</span><i /><b>✎</b><i /><span>نجمة</span></div></div></section><div className="writing-ad"><AdSlot label="مساحة إعلانية — بين آثار القلم" /></div></div></SiteLayout>;
}
