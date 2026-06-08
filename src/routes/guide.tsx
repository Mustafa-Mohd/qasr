import { createFileRoute } from "@tanstack/react-router";
import { Minimize2, Combine, ListChecks } from "lucide-react";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Step-by-step Qasr & Jamak Prayer Guide — Qasr Companion" },
      {
        name: "description",
        content:
          "Learn step by step how to pray Qasr (shortened) and Jamak (combined) prayers during travel, with examples.",
      },
      { property: "og:title", content: "Qasr & Jamak Prayer Guide" },
      { property: "og:description", content: "How to shorten and combine your prayers while traveling." },
    ],
  }),
  component: Guide,
});

const QASR = [
  "Make the intention (niyyah) to pray as a traveler before starting.",
  "Dhuhr, Asr and Isha — each 4-rakʿah prayer is prayed as 2 rakʿah.",
  "Fajr (2) and Maghrib (3) are never shortened — pray them as usual.",
  "Pray as you normally would, simply ending after the second rakʿah with tashahhud and salam.",
];

const JAMAK = [
  "Jamʿ Taqdim (advance): pray Asr right after Dhuhr in Dhuhr's time (or Isha after Maghrib).",
  "Jamʿ Taʾkhir (delay): delay Dhuhr into Asr's time and pray both together (or Maghrib into Isha).",
  "Make intention to combine, pray the first prayer, then immediately pray the second.",
  "When combining and traveling, you usually also shorten the 4-rakʿah prayers to 2.",
];

const EXAMPLES = [
  { t: "Road trip departing at noon", d: "Combine Dhuhr + Asr (each 2 rakʿah) before setting off, or delay both to Asr time." },
  { t: "Afternoon flight", d: "If you'll be airborne at Maghrib/Isha, combine them — pray Maghrib (3) then Isha (2)." },
  { t: "Arriving late at night", d: "Delay Maghrib to Isha time and combine them on arrival." },
];

export default function Guide() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl">Prayer Guide for Travelers</h1>
      <p className="mt-2 text-muted-foreground">
        Clear, step-by-step instructions for praying Qasr and Jamak on your journey.
      </p>

      <Section icon={Minimize2} title="How to pray Qasr (shortened)" steps={QASR} accent="gold" />
      <Section icon={Combine} title="How to pray Jamak (combined)" steps={JAMAK} accent="primary" />

      <h2 className="mt-12 flex items-center gap-2 font-display text-2xl">
        <ListChecks className="h-5 w-5 text-gold" /> Prayer examples during travel
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {EXAMPLES.map((e) => (
          <div key={e.t} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-lg">{e.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{e.d}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

function Section({
  icon: Icon,
  title,
  steps,
  accent,
}: {
  icon: typeof Minimize2;
  title: string;
  steps: string[];
  accent: "gold" | "primary";
}) {
  return (
    <section className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-3 font-display text-2xl">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            accent === "gold" ? "bg-gradient-gold shadow-gold" : "bg-gradient-primary"
          }`}
        >
          <Icon className={`h-5 w-5 ${accent === "gold" ? "text-gold-foreground" : "text-primary-foreground"}`} />
        </span>
        {title}
      </h2>
      <ol className="mt-5 space-y-3">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                accent === "gold" ? "bg-gold/15 text-gold-foreground" : "bg-primary/10 text-primary"
              }`}
            >
              {i + 1}
            </span>
            <p className="pt-0.5 text-sm leading-relaxed text-card-foreground">{s}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
