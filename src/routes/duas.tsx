import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { DAILY_DUAS } from "@/lib/duas";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/duas")({
  head: () => ({
    meta: [{ title: "Daily Duas - Qasr Companion" }],
  }),
  component: DuasPage,
});

function DuasPage() {
  const categories = Array.from(new Set(DAILY_DUAS.map((d) => d.category)));

  return (
    <main className="flex-1 pattern-islamic pb-20">
      <div className="mx-auto max-w-4xl px-4 pt-12 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gradient-primary shadow-card">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </span>
          <h1 className="font-display text-4xl sm:text-5xl">
            Daily <span className="text-gradient-primary">Duas</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            A collection of authentic supplications from the Qur'an and Sunnah for your daily life and travels.
          </p>
        </motion.div>

        <div className="mt-14 space-y-12">
          {categories.map((category, catIndex) => {
            const categoryDuas = DAILY_DUAS.filter((d) => d.category === category);
            return (
              <div key={category}>
                <h2 className="mb-6 border-b border-border pb-2 font-display text-2xl text-foreground">
                  {category}
                </h2>
                <div className="grid gap-6">
                  {categoryDuas.map((dua, i) => (
                    <motion.div
                      key={dua.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min((catIndex * 0.1) + (i * 0.05), 0.5) }}
                      className="rounded-3xl border border-border bg-card/80 p-6 shadow-elegant backdrop-blur sm:p-8"
                    >
                      <h3 className="mb-4 font-semibold text-primary">{dua.title}</h3>
                      <div className="mb-6 text-right font-display text-3xl leading-relaxed text-foreground md:text-4xl">
                        {dua.arabic}
                      </div>
                      <div className="mb-3 rounded-xl bg-secondary/50 p-4 font-medium text-foreground">
                        {dua.transliteration}
                      </div>
                      <p className="text-muted-foreground">{dua.translation}</p>
                      <div className="mt-6 border-t border-border/50 pt-4 text-xs text-muted-foreground/60">
                        {dua.reference}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
