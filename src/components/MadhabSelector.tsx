import { MADHAB_LIST } from "@/lib/madhab";
import { useQasr } from "@/hooks/useQasr";

export function MadhabSelector() {
  const { madhab, setMadhab } = useQasr();
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {MADHAB_LIST.map((m) => {
        const active = m.id === madhab;
        return (
          <button
            key={m.id}
            onClick={() => setMadhab(m.id)}
            className={`group flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
              active
                ? "border-primary bg-gradient-primary text-primary-foreground shadow-card"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <span className="font-arabic text-xl leading-none">{m.arabic}</span>
            <span className="text-sm font-semibold">{m.name}</span>
          </button>
        );
      })}
    </div>
  );
}
