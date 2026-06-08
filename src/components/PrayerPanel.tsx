import { useEffect, useMemo, useState } from "react";
import { Clock, Compass, CalendarDays, Combine, Minimize2, Navigation, Loader2 } from "lucide-react";
import { useQasr } from "@/hooks/useQasr";
import {
  getPrayerTimes,
  nextPrayer,
  qiblaDirection,
  formatTime,
  countdown,
  hijriDate,
} from "@/lib/prayer";
import { QiblaCompass } from "./QiblaCompass";

export function PrayerPanel() {
  const { current, result, detectCurrent, loadingLocation } = useQasr();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const times = useMemo(() => (current ? getPrayerTimes(current) : null), [current]);
  const next = times ? nextPrayer(times, now) : null;
  const qibla = current ? qiblaDirection(current) : null;

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-card">
        <p>Detect your location to view prayer times, Qibla direction and the Hijri date.</p>
        <button
          onClick={detectCurrent}
          disabled={loadingLocation}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
          Detect Location
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant">
        <div className="mb-1 flex items-center gap-2 text-xs opacity-80">
          <Clock className="h-3.5 w-3.5" /> Next prayer
        </div>
        <p className="font-display text-2xl">{next?.name}</p>
        <p className="text-sm opacity-90">{next && formatTime(next.time)}</p>
        <p className="mt-2 font-mono text-lg tabular-nums">{next && countdown(next.time, now)}</p>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm shadow-card">
        <CalendarDays className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Today is</span>
        <span className="font-semibold">{hijriDate(now)} AH</span>
      </div>

      <QiblaCompass qiblaBearing={qibla} />
    </div>
  );
}
