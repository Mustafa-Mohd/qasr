export interface Coords {
  lat: number;
  lng: number;
  label?: string;
}

export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function getCurrentPosition(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation is not supported by this device."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(new Error(err.message || "Unable to get your location.")),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });
}

export async function reverseGeocode(c: Coords): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${c.lat}&lon=${c.lng}&zoom=10`,
      { headers: { Accept: "application/json" } }
    );
    const data = await res.json();
    const a = data.address ?? {};
    const city = a.city || a.town || a.village || a.county || a.state_district;
    const parts = [city, a.state, a.country].filter(Boolean);
    return parts.length ? parts.join(", ") : data.display_name ?? "Unknown location";
  } catch {
    return `${c.lat.toFixed(3)}, ${c.lng.toFixed(3)}`;
  }
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}
