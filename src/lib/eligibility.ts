import { MADHABS, type MadhabId } from "./madhab";
import { haversineKm, type Coords } from "./geo";

export type TravelStatus = "resident" | "traveler" | "returning";

export interface EligibilityResult {
  distanceKm: number;
  required: number;
  remaining: number;
  isTraveler: boolean;
  status: TravelStatus;
  qasr: boolean;
  jamak: boolean;
  progress: number;
}

export function evaluate(
  home: Coords,
  current: Coords,
  madhab: MadhabId,
  stayDays: number
): EligibilityResult {
  const rule = MADHABS[madhab];
  const distanceKm = haversineKm(home, current);
  const required = rule.distanceKm;
  const remaining = Math.max(0, required - distanceKm);
  const farEnough = distanceKm >= required;
  const withinStay = rule.stayDays === null ? true : stayDays < rule.stayDays;
  const isTraveler = farEnough && withinStay;

  const status: TravelStatus = !farEnough ? "resident" : "traveler";

  const qasr = isTraveler;
  const jamak = isTraveler && madhab !== "hanafi";

  return {
    distanceKm,
    required,
    remaining,
    isTraveler,
    status,
    qasr,
    jamak,
    progress: Math.min(1, distanceKm / required),
  };
}
