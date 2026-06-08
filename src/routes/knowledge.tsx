import { createFileRoute } from "@tanstack/react-router";
import { Reference } from "@/components/Reference";
import { QURAN_REFS, HADITH_REFS, MADHAB_LIST } from "@/lib/madhab";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge Center — Qasr, Jamak & Travel Rulings | Qasr Companion" },
      {
        name: "description",
        content:
          "Learn what Qasr and Jamak are, the conditions of travel in Islam, common mistakes, madhab differences, and authentic references.",
      },
      { property: "og:title", content: "Qasr Companion Knowledge Center" },
      { property: "og:description", content: "Understand the fiqh of traveler's prayer." },
    ],
  }),
  component: Knowledge,
});

const ARTICLES = [
  {
    t: "What is Qasr Salah?",
    d: "Qasr means shortening the obligatory 4-rakʿah prayers (Dhuhr, Asr, Isha) to 2 rakʿah while traveling. It is a mercy and concession (rukhsah) from Allah, practiced by the Prophet ﷺ on every journey.",
  },
  {
    t: "What is Jamak?",
    d: "Jamak (jamʿ) is combining two prayers in one time slot — Dhuhr with Asr, and Maghrib with Isha — either advanced into the earlier time or delayed into the later time. It eases worship during travel and hardship.",
  },
  {
    t: "Conditions of travel",
    d: "A valid journey must reach the madhab's minimum distance, have a lawful purpose, involve actually leaving your city, and not exceed the stay limit that turns you back into a resident.",
  },
  {
    t: "Common mistakes",
    d: "Shortening Fajr or Maghrib, combining without travelling, continuing to shorten after settling beyond the stay limit, or starting Qasr before leaving the city limits.",
  },
  {
    t: "When does Qasr begin and end?",
    d: "Qasr begins once you leave the built-up limits of your town or city, and ends the moment you re-enter your home town or form the intention to reside beyond your madhab's stay limit.",
  },
  {
    t: "Qasr vs Sunnah prayers",
    d: "Only the four-rakʿah obligatory prayers are shortened. Fajr (2) and Maghrib (3) are never shortened. Most scholars say a traveler may drop the optional Sunnah of Dhuhr, Asr and Isha, but keep Fajr Sunnah and Witr.",
  },
  {
    t: "Praying behind a resident imam",
    d: "If a traveler prays behind a resident imam, they must complete the full four rakʿah and cannot shorten. Qasr applies only when the traveler prays alone or leads/follows other travelers.",
  },
];

export default function Knowledge() {
  return (
    <main className="mx-auto max-w-5xl flex-1 px-4 py-12">
      <h1 className="font-display text-3xl sm:text-4xl">Knowledge Center</h1>
      <p className="mt-2 text-muted-foreground">Understand the rulings behind the concessions of travel.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {ARTICLES.map((a) => (
          <article key={a.t} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl">{a.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.d}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-12 font-display text-2xl">Madhab differences explained</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-left">
              <th className="p-3 font-semibold">Madhab</th>
              <th className="p-3 font-semibold">Distance</th>
              <th className="p-3 font-semibold">Stay limit</th>
              <th className="p-3 font-semibold">Jamak</th>
            </tr>
          </thead>
          <tbody>
            {MADHAB_LIST.map((m) => (
              <tr key={m.id} className="border-b border-border/60 last:border-0">
                <td className="p-3 font-semibold">{m.name}</td>
                <td className="p-3 text-muted-foreground">{Math.round(m.distanceKm)} km</td>
                <td className="p-3 text-muted-foreground">{m.stayDays ? `${m.stayDays} days` : "Flexible"}</td>
                <td className="p-3 text-muted-foreground">{m.id === "hanafi" ? "Hajj only" : "Permitted"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 font-display text-2xl">Authentic references</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {QURAN_REFS.map((q) => (
          <Reference key={q.ref} item={q} kind="quran" />
        ))}
        {HADITH_REFS.map((h) => (
          <Reference key={h.ref} item={h} kind="hadith" />
        ))}
      </div>
    </main>
  );
}
