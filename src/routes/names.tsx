import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ASMA_UL_HUSNA } from "@/lib/asma-ul-husna";
import { Search } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/names")({
  head: () => ({
    meta: [{ title: "99 Names of Allah - Asma-ul-Husna" }],
  }),
  component: NamesPage,
});

function NamesPage() {
  const [search, setSearch] = useState("");

  const filteredNames = ASMA_UL_HUSNA.filter(
    (n) =>
      n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
      n.en.toLowerCase().includes(search.toLowerCase()) ||
      n.name.includes(search)
  );

  return (
    <main className="flex-1 pattern-islamic pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-12 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl sm:text-5xl">
            Asma-ul-<span className="text-gradient-gold">Husna</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            "And to Allah belong the best names, so invoke Him by them." (Quran 7:180)
          </p>
        </motion.div>

        <div className="mx-auto mt-8 max-w-md relative">
          <input
            type="text"
            placeholder="Search names (e.g. Ar-Rahman, Merciful)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-card/60 px-5 py-3 pl-12 text-sm backdrop-blur focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredNames.map((name, i) => (
            <motion.div
              key={name.number}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className="group flex flex-col items-center justify-center rounded-3xl border border-border bg-card/80 p-6 text-center shadow-card backdrop-blur transition-colors hover:border-gold/50 hover:bg-card"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                {name.number}
              </div>
              <h2 className="mb-3 font-display text-3xl font-normal text-foreground group-hover:text-gold">
                {name.name}
              </h2>
              <h3 className="mb-1 font-semibold text-foreground">{name.transliteration}</h3>
              <p className="text-sm text-muted-foreground">{name.en}</p>
            </motion.div>
          ))}
        </div>
        
        {filteredNames.length === 0 && (
          <div className="mt-20 text-center text-muted-foreground">
            No names found matching "{search}".
          </div>
        )}
      </div>
    </main>
  );
}
