import { createFileRoute } from "@tanstack/react-router";
import { Car, Plane, Globe, Briefcase, Palmtree, GraduationCap, Clock4, PlaneTakeoff } from "lucide-react";

export const Route = createFileRoute("/scenarios")({
  head: () => ({
    meta: [
      { title: "Travel Scenarios & Airport Prayer Guide — Qasr Companion" },
      {
        name: "description",
        content:
          "Common travel scenarios — car trips, flights, business travel, studying abroad — plus how to pray in airports and on planes.",
      },
      { property: "og:title", content: "Travel Scenarios Library" },
      { property: "og:description", content: "How to handle prayer in real-world travel situations." },
    ],
  }),
  component: Scenarios,
});

const SCENARIOS = [
  { icon: Car, t: "Traveling by car", d: "Once you pass the threshold distance, shorten 4-rakʿah prayers. Combine pairs if stopping is hard." },
  { icon: Plane, t: "Domestic flights", d: "Short hops still count if the distance qualifies. Combine prayers around departure/arrival." },
  { icon: Globe, t: "International flights", d: "Track time zones carefully. Pray each prayer once its time has entered at your position; combine when needed." },
  { icon: Briefcase, t: "Business trips", d: "If you intend to stay beyond your madhab's limit, you become a resident and pray in full." },
  { icon: Palmtree, t: "Vacations", d: "A long, fixed-location holiday usually ends the concession once you exceed the stay limit." },
  { icon: GraduationCap, t: "Students abroad", d: "Most scholars consider a student settled for a term/year a resident — pray in full." },
  { icon: Clock4, t: "Long layovers", d: "Use clean quiet corners or prayer rooms; combine Dhuhr–Asr or Maghrib–Isha to fit tight connections." },
  { icon: PlaneTakeoff, t: "Praying in the air", d: "Pray seated facing your best estimate of Qibla if you cannot stand; make up wudu rulings apply." },
];

const AIRPORT = [
  "Find the prayer room (musalla) — most major airports have one; otherwise use a clean, quiet corner.",
  "Make wudu in the restroom; wiping over socks (masah) is allowed if you put them on in wudu.",
  "Combine Dhuhr–Asr or Maghrib–Isha to fit short layovers.",
  "On the plane, use a Qibla-finder app; if you cannot determine it, pray to your best estimate.",
  "If standing isn't possible, pray seated with head gestures for rukuʿ and sujud.",
];

export default function Scenarios() {
  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl">Travel Scenarios</h1>
      <p className="mt-2 text-muted-foreground">Practical guidance for the journeys you actually take.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SCENARIOS.map((s) => (
          <div key={s.t} className="rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-1">
            <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <s.icon className="h-5 w-5 text-primary" />
            </span>
            <h3 className="font-display text-base">{s.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <section className="mt-12 rounded-3xl bg-gradient-hero p-7 text-primary-foreground shadow-elegant">
        <h2 className="font-display text-2xl">Airport & Flight Guide</h2>
        <ol className="mt-5 space-y-3">
          {AIRPORT.map((a, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15 text-sm font-bold">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed opacity-95">{a}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
