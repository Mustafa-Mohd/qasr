import { motion } from "framer-motion";
import {
  MapPin,
  Home,
  Navigation,
  Loader2,
  Check,
  X,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useQasr } from "@/hooks/useQasr";
import { MADHABS } from "@/lib/madhab";
import { formatDistance } from "@/lib/geo";
import { MadhabSelector } from "./MadhabSelector";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-4 ${
        ok ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10"
      }`}
    >
      <span className="font-display text-lg">{label}</span>
      <span
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
          ok ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
        }`}
      >
        {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
        {ok ? "Allowed" : "Not allowed"}
      </span>
    </div>
  );
}

export function EligibilityChecker() {
  const {
    home,
    current,
    madhab,
    stayDays,
    setStayDays,
    loadingLocation,
    error,
    result,
    detectCurrent,
    saveHomeFromCurrent,
    clearHome,
  } = useQasr();
  const rule = MADHABS[madhab];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-elegant sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
          <Navigation className="h-5 w-5 text-gold-foreground" />
        </span>
        <div>
          <h2 className="font-display text-xl">Qasr Eligibility Checker</h2>
          <p className="text-sm text-muted-foreground">Can you pray Qasr & Jamak right now?</p>
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2 text-sm font-semibold text-muted-foreground">Select your madhab</p>
        <MadhabSelector />
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-secondary/40 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <Home className="h-4 w-4 text-primary" /> Home location
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {home?.label ?? (home ? `${home.lat.toFixed(2)}, ${home.lng.toFixed(2)}` : "Not set yet")}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={saveHomeFromCurrent}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              {home ? "Update home" : "Set as home"}
            </button>
            {home && (
              <button
                onClick={clearHome}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"
              >
                <RotateCcw className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/40 p-4">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-gold" /> Current location
          </div>
          <p className="truncate text-sm text-muted-foreground">
            {current?.label ??
              (current ? `${current.lat.toFixed(2)}, ${current.lng.toFixed(2)}` : "Tap detect")}
          </p>
          <button
            onClick={detectCurrent}
            disabled={loadingLocation}
            className="mt-3 flex items-center gap-1.5 rounded-lg bg-gradient-gold px-3 py-1.5 text-xs font-semibold text-gold-foreground hover:opacity-90 disabled:opacity-60"
          >
            {loadingLocation ? <Loader2 className="h-3 w-3 animate-spin" /> : <Navigation className="h-3 w-3" />}
            Detect my location
          </button>
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-semibold">Intended stay: {stayDays} day{stayDays > 1 ? "s" : ""}</span>
          <span className="text-muted-foreground">{rule.stayDays ? `limit ${rule.stayDays}d` : "flexible"}</span>
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={stayDays}
          onChange={(e) => setStayDays(Number(e.target.value))}
          className="w-full accent-[oklch(0.52_0.11_162)]"
        />
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {!result && (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Set your home location and detect your current location to see your ruling.
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Distance" value={formatDistance(result.distanceKm)} />
            <Stat label="Required" value={formatDistance(result.required)} />
            <Stat
              label="Remaining"
              value={result.remaining > 0 ? formatDistance(result.remaining) : "Reached"}
            />
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all"
              style={{ width: `${result.progress * 100}%` }}
            />
          </div>

          <div
            className={`rounded-2xl p-4 text-center font-display text-lg ${
              result.isTraveler
                ? "bg-gradient-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {result.isTraveler ? "You are a Traveler (Musafir) ✈️" : "You are a Resident (Muqim) 🏠"}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatusPill ok={result.qasr} label="Qasr" />
            <StatusPill ok={result.jamak} label="Jamak" />
          </div>

          <div className="rounded-2xl border border-gold/30 bg-gold/5 p-4">
            <p className="mb-1 text-sm font-semibold text-gold-foreground">
              {rule.name} ruling
            </p>
            <p className="text-sm text-muted-foreground">{rule.summary}</p>
            <p className="mt-2 text-sm text-muted-foreground">{rule.jamakNote}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Distance threshold: {rule.distanceNote}. {rule.stayNote}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3 text-center">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
