import type { Coords } from "./geo";
import type { MadhabId } from "./madhab";

const KEYS = {
  home: "qasr.home",
  madhab: "qasr.madhab",
  favorites: "qasr.favorites",
  theme: "qasr.theme",
};

export function getHome(): Coords | null {
  try {
    const v = localStorage.getItem(KEYS.home);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}
export function setHome(c: Coords | null) {
  if (c) localStorage.setItem(KEYS.home, JSON.stringify(c));
  else localStorage.removeItem(KEYS.home);
}

export function getMadhab(): MadhabId {
  return (localStorage.getItem(KEYS.madhab) as MadhabId) || "shafii";
}
export function setMadhab(m: MadhabId) {
  localStorage.setItem(KEYS.madhab, m);
}

export interface FavLocation extends Coords {
  id: string;
}
export function getFavorites(): FavLocation[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.favorites) || "[]");
  } catch {
    return [];
  }
}
export function setFavorites(f: FavLocation[]) {
  localStorage.setItem(KEYS.favorites, JSON.stringify(f));
}
