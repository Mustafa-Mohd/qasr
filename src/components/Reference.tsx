import type { QuranRef } from "@/lib/madhab";
import { BookOpen } from "lucide-react";

export function Reference({ item, kind }: { item: QuranRef; kind: "quran" | "hadith" }) {
  return (
    <figure className="rounded-2xl border border-border bg-card p-5 shadow-card">
      {item.arabic && (
        <p className="mb-3 text-right font-arabic text-xl leading-loose text-primary">{item.arabic}</p>
      )}
      <blockquote className="text-sm leading-relaxed text-card-foreground">“{item.text}”</blockquote>
      <figcaption className="mt-3 flex items-center gap-2 text-xs font-semibold text-gold-foreground">
        <BookOpen className="h-3.5 w-3.5 text-gold" />
        <span className="uppercase tracking-wide text-muted-foreground">
          {kind === "quran" ? "Qur'an" : "Hadith"} · {item.ref}
        </span>
      </figcaption>
    </figure>
  );
}
