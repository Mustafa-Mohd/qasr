import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [{ title: "Hijri Calendar & Events - Qasr Companion" }],
  }),
  component: CalendarPage,
});

// Hardcoded dates for significant events (approximate Gregorian dates for 2024-2025)
// In a real app, this would be fetched from an API or calculated accurately
const ISLAMIC_EVENTS = [
  { name: "Ramadan Begins", date: "2025-03-01", description: "The month of fasting begins." },
  { name: "Eid al-Fitr", date: "2025-03-31", description: "Festival of Breaking the Fast." },
  { name: "Day of Arafah", date: "2025-06-06", description: "The holiest day of the Islamic year." },
  { name: "Eid al-Adha", date: "2025-06-07", description: "Festival of Sacrifice." },
  { name: "Islamic New Year", date: "2025-06-27", description: "First day of Muharram." },
  { name: "Ashura", date: "2025-07-06", description: "10th day of Muharram." },
];

function CalendarPage() {
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");

  useEffect(() => {
    const today = new Date();
    // Use Intl API to format to Hijri calendar natively!
    try {
      const hijriFormatter = new Intl.DateTimeFormat("en-US-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setHijriDate(hijriFormatter.format(today));
    } catch (e) {
      setHijriDate("Islamic Calendar Not Supported in Browser");
    }

    const gregFormatter = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setGregorianDate(gregFormatter.format(today));
  }, []);

  const today = new Date();

  return (
    <main className="flex-1 pattern-islamic pb-20">
      <div className="mx-auto max-w-4xl px-4 pt-12 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gradient-primary shadow-card">
            <CalendarIcon className="h-6 w-6 text-primary-foreground" />
          </span>
          <h1 className="font-display text-4xl sm:text-5xl">
            Islamic <span className="text-gradient-primary">Calendar</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Current Hijri date and upcoming significant events.
          </p>
        </motion.div>

        <div className="mt-12 flex flex-col items-center">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-border bg-card/80 p-8 text-center shadow-elegant backdrop-blur-xl">
            <div className="mb-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Today
            </div>
            <div className="font-display text-4xl text-foreground text-gold">
              {hijriDate}
            </div>
            <div className="mt-4 border-t border-border/50 pt-4 text-muted-foreground">
              {gregorianDate}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="mb-8 font-display text-3xl text-foreground text-center">Upcoming Events</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {ISLAMIC_EVENTS.map((event, i) => {
              const eventDate = new Date(event.date);
              const diffTime = eventDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isPast = diffDays < 0;

              return (
                <motion.div
                  key={event.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-3xl border p-6 transition-all ${
                    isPast
                      ? "border-border/50 bg-secondary/20 opacity-60"
                      : "border-border bg-card/80 shadow-card backdrop-blur hover:border-primary/50"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-xl text-foreground">{event.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                    {!isPast && (
                      <div className="flex flex-col items-center rounded-xl bg-secondary/50 p-3 text-center">
                        <span className="font-display text-2xl text-primary">{diffDays}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Days</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Clock className="h-4 w-4 text-gold" />
                    {new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(eventDate)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
