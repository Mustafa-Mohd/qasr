import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, ChevronLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/quran")({
  head: () => ({
    meta: [{ title: "Quran Reader - Qasr Companion" }],
  }),
  component: QuranPage,
});

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  translation?: string;
}

function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingSurah, setLoadingSurah] = useState(false);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then(res => res.json())
      .then(data => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const openSurah = async (surah: Surah) => {
    setActiveSurah(surah);
    setLoadingSurah(true);
    try {
      // Fetch Arabic
      const arRes = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/ar.quran-simple`);
      const arData = await arRes.json();
      
      // Fetch English
      const enRes = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/en.sahih`);
      const enData = await enRes.json();

      const combined: Ayah[] = arData.data.ayahs.map((ayah: any, index: number) => ({
        number: ayah.number,
        text: ayah.text,
        numberInSurah: ayah.numberInSurah,
        translation: enData.data.ayahs[index].text,
      }));

      setAyahs(combined);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSurah(false);
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
    s.number.toString() === search
  );

  return (
    <main className="flex-1 pattern-islamic pb-20">
      <AnimatePresence mode="wait">
        {!activeSurah ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            className="mx-auto max-w-5xl px-4 pt-12 sm:pt-20"
          >
            <div className="text-center mb-10">
              <span className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gradient-primary shadow-card">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </span>
              <h1 className="font-display text-4xl sm:text-5xl">
                The Noble <span className="text-gradient-primary">Qur'an</span>
              </h1>
            </div>

            <div className="mx-auto mb-10 max-w-md relative">
              <input
                type="text"
                placeholder="Search Surah (e.g. Al-Kahf, 18)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-border bg-card/60 px-5 py-3 pl-12 text-sm backdrop-blur focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredSurahs.map((surah, i) => (
                  <button
                    key={surah.number}
                    onClick={() => openSurah(surah)}
                    className="group flex items-center justify-between rounded-2xl border border-border bg-card/80 p-5 text-left shadow-sm backdrop-blur transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {surah.number}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{surah.englishName}</h3>
                        <p className="text-xs text-muted-foreground">{surah.englishNameTranslation}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl text-foreground">{surah.name.replace('سُورَةُ ', '')}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{surah.numberOfAyahs} Ayahs</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-4xl px-4 pt-8"
          >
            <button
              onClick={() => setActiveSurah(null)}
              className="mb-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Surahs
            </button>

            <div className="mb-12 text-center">
              <h1 className="font-display text-4xl text-foreground md:text-6xl mb-2">{activeSurah.name}</h1>
              <h2 className="text-xl text-muted-foreground">{activeSurah.englishName} ({activeSurah.englishNameTranslation})</h2>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {activeSurah.revelationType} • {activeSurah.numberOfAyahs} Ayahs
              </div>
            </div>

            {loadingSurah ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-10 bg-card/50 p-4 sm:p-8 rounded-3xl border border-border">
                {/* Bismillah for all except Surah At-Tawbah (9) */}
                {activeSurah.number !== 1 && activeSurah.number !== 9 && (
                  <div className="text-center font-display text-3xl md:text-4xl py-6 border-b border-border/50">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </div>
                )}
                
                {ayahs.map((ayah) => {
                  // The API includes Bismillah in the first ayah text for many surahs, we clean it up if it's there
                  let arabicText = ayah.text;
                  if (activeSurah.number !== 1 && ayah.numberInSurah === 1 && arabicText.startsWith("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ")) {
                    arabicText = arabicText.replace("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ", "");
                  }

                  return (
                    <div key={ayah.number} className="group border-b border-border/30 pb-10 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-6 mb-6">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/50 text-xs font-bold text-muted-foreground">
                          {ayah.numberInSurah}
                        </div>
                        <div className="text-right font-display text-3xl leading-[2.5] text-foreground md:text-4xl md:leading-[2.5]">
                          {arabicText}
                        </div>
                      </div>
                      <div className="pl-14 text-muted-foreground leading-relaxed">
                        {ayah.translation}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
