import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Target, Fingerprint } from "lucide-react";

export const Route = createFileRoute("/tasbih")({
  head: () => ({
    meta: [{ title: "Digital Tasbih - Qasr Companion" }],
  }),
  component: TasbihPage,
});

const DHIKR_PHRASES = [
  { arabic: "سُبْحَانَ ٱللَّٰهِ", transliteration: "Subhanallah", meaning: "Glory be to Allah" },
  { arabic: "ٱلْحَمْدُ لِلَّٰهِ", transliteration: "Alhamdulillah", meaning: "Praise be to Allah" },
  { arabic: "ٱللَّٰهُ أَكْبَرُ", transliteration: "Allahu Akbar", meaning: "Allah is the Greatest" },
  { arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", transliteration: "La ilaha illallah", meaning: "There is no deity but Allah" },
];

function TasbihPage() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<number | null>(33);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const currentPhrase = DHIKR_PHRASES[phraseIndex];

  const handleTap = useCallback(() => {
    // Vibrate if supported
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
    
    setCount(prev => {
      const next = prev + 1;
      if (target !== null && next === target) {
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([30, 50, 30]); // Double vibration on hitting target
        }
      }
      return next;
    });
  }, [target]);

  const reset = () => {
    if (window.confirm("Are you sure you want to reset the counter?")) {
      setCount(0);
    }
  };

  const cyclePhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % DHIKR_PHRASES.length);
    setCount(0);
  };

  // Allow spacebar to tap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTap]);

  const progress = target ? Math.min((count / target) * 100, 100) : 0;
  const isComplete = target !== null && count >= target;

  return (
    <main className="flex-1 flex flex-col items-center justify-center pattern-islamic px-4 py-12">
      <div className="w-full max-w-md">
        
        <div className="mb-8 text-center cursor-pointer select-none" onClick={cyclePhrase} title="Click to change Dhikr">
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-2"
            >
              <h2 className="font-display text-4xl text-gold md:text-5xl">{currentPhrase.arabic}</h2>
              <p className="text-xl font-medium text-foreground">{currentPhrase.transliteration}</p>
              <p className="text-sm text-muted-foreground">{currentPhrase.meaning}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-2 text-xs text-muted-foreground/60 flex items-center justify-center gap-1">
            <RotateCcw className="h-3 w-3" /> Tap to change phrase
          </div>
        </div>

        <div className="relative rounded-[3rem] border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
          
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={reset}
              className="flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>

            <select
              value={target || ""}
              onChange={(e) => setTarget(e.target.value ? Number(e.target.value) : null)}
              className="rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium outline-none focus:border-primary"
            >
              <option value="33">Target: 33</option>
              <option value="99">Target: 99</option>
              <option value="100">Target: 100</option>
              <option value="1000">Target: 1000</option>
              <option value="">No Target</option>
            </select>
          </div>

          <div className="mb-8 text-center">
            <div className="font-display text-8xl tabular-nums tracking-tighter text-foreground">
              {count}
            </div>
            {target && (
              <div className="mt-2 text-sm font-medium text-muted-foreground">
                of {target}
              </div>
            )}
          </div>

          {target && (
            <div className="mb-8 h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className={`h-full rounded-full transition-all duration-300 ${
                  isComplete ? "bg-success" : "bg-gradient-gold"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            onClick={handleTap}
            className={`group relative mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 outline-none transition-all active:scale-95 sm:h-40 sm:w-40 ${
              isComplete
                ? "border-success bg-success/10 text-success shadow-[0_0_40px_rgba(var(--success),0.3)]"
                : "border-gold bg-gold/10 text-gold shadow-[0_0_40px_rgba(212,175,55,0.2)]"
            }`}
          >
            <Fingerprint className="h-16 w-16 opacity-50 transition-opacity group-hover:opacity-100" />
          </button>
          
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Tap the button or press Spacebar
          </p>

        </div>
      </div>
    </main>
  );
}
