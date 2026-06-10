import type { Coords } from './geo';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export interface RouteData {
  geometry: [number, number][]; // [lat, lng]
  durationSec: number;
  distanceMeters: number;
}

export async function getRoute(start: Coords, end: Coords): Promise<RouteData> {
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`
  );
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes.length) {
    throw new Error('Could not find route');
  }
  const route = data.routes[0];
  // Convert [lon, lat] to [lat, lon] for Leaflet
  const geometry = route.geometry.coordinates.map((c: number[]) => [c[1], c[0]] as [number, number]);
  return {
    geometry,
    durationSec: route.duration,
    distanceMeters: route.distance,
  };
}

export interface PrayerStop {
  prayerName: string;
  time: Date;
  estimatedCoords: Coords;
  mosques: Mosque[];
}

export interface Mosque {
  id: number;
  lat: number;
  lng: number;
  name: string;
}

function interpolateCoords(geometry: [number, number][], fraction: number): Coords {
  if (fraction <= 0) return { lat: geometry[0][0], lng: geometry[0][1] };
  if (fraction >= 1) return { lat: geometry[geometry.length - 1][0], lng: geometry[geometry.length - 1][1] };
  
  const exactIndex = fraction * (geometry.length - 1);
  const i = Math.floor(exactIndex);
  const rem = exactIndex - i;
  
  const p1 = geometry[i];
  const p2 = geometry[i + 1] || p1;
  
  return {
    lat: p1[0] + (p2[0] - p1[0]) * rem,
    lng: p1[1] + (p2[1] - p1[1]) * rem,
  };
}

export async function getNearbyMosques(lat: number, lng: number, radius = 5000): Promise<Mosque[]> {
  const query = `
    [out:json];
    node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});
    out 5;
  `;
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
  });
  const data = await res.json();
  return data.elements.map((e: any) => ({
    id: e.id,
    lat: e.lat,
    lng: e.lon,
    name: e.tags?.name || 'Unnamed Mosque',
  }));
}

export async function planTrip(
  start: Coords,
  end: Coords,
  departureTime: Date = new Date()
): Promise<{ route: RouteData; stops: PrayerStop[] }> {
  const route = await getRoute(start, end);
  const arrivalTime = new Date(departureTime.getTime() + route.durationSec * 1000);
  
  const params = CalculationMethod.MuslimWorldLeague();
  const pt = new PrayerTimes(new Coordinates(start.lat, start.lng), departureTime, params);
  
  const prayers = [
    { name: 'Fajr', time: pt.fajr },
    { name: 'Dhuhr', time: pt.dhuhr },
    { name: 'Asr', time: pt.asr },
    { name: 'Maghrib', time: pt.maghrib },
    { name: 'Isha', time: pt.isha },
  ];
  
  const stops: PrayerStop[] = [];
  
  for (const p of prayers) {
    if (p.time > departureTime && p.time < arrivalTime) {
      const fraction = (p.time.getTime() - departureTime.getTime()) / (route.durationSec * 1000);
      const estimatedCoords = interpolateCoords(route.geometry, fraction);
      
      let mosques: Mosque[] = [];
      try {
        mosques = await getNearbyMosques(estimatedCoords.lat, estimatedCoords.lng, 10000); // 10km radius
      } catch (e) {
        console.error('Failed to get mosques', e);
      }
      
      stops.push({
        prayerName: p.name,
        time: p.time,
        estimatedCoords,
        mosques,
      });
    }
  }
  
  return { route, stops };
}
