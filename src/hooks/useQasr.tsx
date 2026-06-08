import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Coords } from "@/lib/geo";
import { getCurrentPosition, reverseGeocode } from "@/lib/geo";
import { getHome, setHome as persistHome, getMadhab, setMadhab as persistMadhab } from "@/lib/storage";
import type { MadhabId } from "@/lib/madhab";
import { evaluate, type EligibilityResult } from "@/lib/eligibility";

interface QasrCtx {
  home: Coords | null;
  current: Coords | null;
  madhab: MadhabId;
  stayDays: number;
  loadingLocation: boolean;
  error: string | null;
  result: EligibilityResult | null;
  setMadhab: (m: MadhabId) => void;
  setStayDays: (d: number) => void;
  detectCurrent: () => Promise<void>;
  saveHomeFromCurrent: () => Promise<void>;
  clearHome: () => void;
  setHomeExplicitly: (c: Coords) => void;
  setCurrentExplicitly: (c: Coords) => void;
}

const Ctx = createContext<QasrCtx | null>(null);

export function QasrProvider({ children }: { children: ReactNode }) {
  const [home, setHomeState] = useState<Coords | null>(null);
  const [current, setCurrent] = useState<Coords | null>(null);
  const [madhab, setMadhabState] = useState<MadhabId>("shafii");
  const [stayDays, setStayDays] = useState(1);
  const [loadingLocation, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHomeState(getHome());
    setMadhabState(getMadhab());
  }, []);

  const detectCurrent = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = await getCurrentPosition();
      c.label = await reverseGeocode(c);
      setCurrent(c);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const saveHomeFromCurrent = async () => {
    setLoading(true);
    setError(null);
    try {
      const c = current ?? (await getCurrentPosition());
      if (!c.label) c.label = await reverseGeocode(c);
      persistHome(c);
      setHomeState(c);
      if (!current) setCurrent(c);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clearHome = () => {
    persistHome(null);
    setHomeState(null);
  };

  const setHomeExplicitly = (c: Coords) => {
    persistHome(c);
    setHomeState(c);
  };

  const setCurrentExplicitly = (c: Coords) => {
    setCurrent(c);
  };

  const setMadhab = (m: MadhabId) => {
    persistMadhab(m);
    setMadhabState(m);
  };

  const result = useMemo(
    () => (home && current ? evaluate(home, current, madhab, stayDays) : null),
    [home, current, madhab, stayDays]
  );

  return (
    <Ctx.Provider
      value={{
        home,
        current,
        madhab,
        stayDays,
        loadingLocation,
        error,
        result,
        setMadhab,
        setStayDays,
        detectCurrent,
        saveHomeFromCurrent,
        clearHome,
        setHomeExplicitly,
        setCurrentExplicitly,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useQasr() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQasr must be used within QasrProvider");
  return ctx;
}
