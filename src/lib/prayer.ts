import { CalculationMethod, Coordinates, PrayerTimes, Qibla, SunnahTimes } from "adhan";
import type { Coords } from "./geo";

export interface PrayerEntry {
  name: string;
  time: Date;
  combinable: "dhuhr-asr" | "maghrib-isha" | null;
  shortenable: boolean;
}

export function getPrayerTimes(c: Coords, date = new Date()): PrayerEntry[] {
  const coords = new Coordinates(c.lat, c.lng);
  const params = CalculationMethod.MuslimWorldLeague();
  const pt = new PrayerTimes(coords, date, params);
  return [
    { name: "Fajr", time: pt.fajr, combinable: null, shortenable: false },
    { name: "Dhuhr", time: pt.dhuhr, combinable: "dhuhr-asr", shortenable: true },
    { name: "Asr", time: pt.asr, combinable: "dhuhr-asr", shortenable: true },
    { name: "Maghrib", time: pt.maghrib, combinable: "maghrib-isha", shortenable: false },
    { name: "Isha", time: pt.isha, combinable: "maghrib-isha", shortenable: true },
  ];
}

export function nextPrayer(entries: PrayerEntry[], now = new Date()) {
  const upcoming = entries.find((e) => e.time.getTime() > now.getTime());
  if (upcoming) return upcoming;
  // next day's Fajr
  return { ...entries[0], name: "Fajr (tomorrow)" };
}

export function qiblaDirection(c: Coords): number {
  return Qibla(new Coordinates(c.lat, c.lng));
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function countdown(target: Date, now = new Date()): string {
  let ms = target.getTime() - now.getTime();
  if (ms < 0) ms += 24 * 3600 * 1000;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

export function hijriDate(date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-TN-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  }
}

export { SunnahTimes };
