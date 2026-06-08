import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Plane, Combine, Minimize2, MapPin } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { EligibilityChecker } from "@/components/EligibilityChecker";
import { PrayerPanel } from "@/components/PrayerPanel";
import { Reference } from "@/components/Reference";
import { QURAN_REFS, HADITH_REFS } from "@/lib/madhab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qasr Companion — Can I Pray Qasr & Jamak While Traveling?" },
      {
        name: "description",
        content:
          "Detect your location, save your home, pick your madhab, and instantly know if you qualify to shorten and combine prayers as a traveler.",
      },
      { property: "og:title", content: "Qasr Companion" },
      {
        property: "og:description",
        content: "Your modern travel prayer companion for Qasr & Jamak rulings.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="A traveler walking a winding road toward a mosque at dusk"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/70 px-3 py-1 text-xs font-semibold text-gold-foreground backdrop-blur">
              <MapPin className="h-3.5 w-3.5 text-gold" /> Travel prayer companion
            </span>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
              Can I pray <span className="text-gradient-gold">Qasr</span> right now?
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Qasr Companion checks your location, distance from home, length of stay and madhab to
              instantly tell you whether you may shorten and combine your prayers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#checker"
                className="rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-elegant"
              >
                Check eligibility
              </a>
              <Link
                to="/guide"
                className="rounded-xl border border-border bg-card/70 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-card"
              >
                Prayer guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="checker" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <EligibilityChecker />
          <PrayerPanel />
        </div>
      </section>

      <section className="border-y border-border bg-secondary/30 pattern-islamic">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-3">
          {[
            { icon: Plane, title: "Smart travel detection", text: "Auto-detect when you cross into traveler status." },
            { icon: Minimize2, title: "Qasr made clear", text: "Know exactly which prayers shorten to 2 rakʿah." },
            { icon: Combine, title: "Jamak guidance", text: "See which prayers can be combined by madhab." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
                <f.icon className="h-5 w-5 text-gold-foreground" />
              </span>
              <h3 className="font-display text-lg">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl">From the Qur'an & Sunnah</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The concession to shorten and combine prayers is established in revelation.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {QURAN_REFS.map((q) => (
            <Reference key={q.ref} item={q} kind="quran" />
          ))}
          {HADITH_REFS.slice(0, 1).map((h) => (
            <Reference key={h.ref} item={h} kind="hadith" />
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Qasr Companion · Rulings are simplified for guidance — consult a qualified scholar for your situation.
      </footer>
    </main>
  );
}
