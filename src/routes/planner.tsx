import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Map, MapPin, Loader2, Navigation, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { LocationSearchInput } from "@/components/MapLocationPicker";
import { planTrip, type RouteData, type PrayerStop } from "@/lib/routing";
import type { Coords } from "@/lib/geo";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [{ title: "Trip Planner - Qasr Companion" }],
  }),
  component: PlannerPage,
});

// Custom icons
const mosqueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function PlannerPage() {
  const [start, setStart] = useState<Coords | null>(null);
  const [end, setEnd] = useState<Coords | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [route, setRoute] = useState<RouteData | null>(null);
  const [stops, setStops] = useState<PrayerStop[]>([]);

  const handlePlanTrip = async () => {
    if (!start || !end) return;
    setLoading(true);
    setError(null);
    try {
      const { route: r, stops: s } = await planTrip(start, end);
      setRoute(r);
      setStops(s);
    } catch (e: any) {
      setError(e.message || "Failed to plan trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 pb-20">
      <div className="mx-auto max-w-5xl px-4 pt-12 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
            <Map className="h-6 w-6 text-gold-foreground" />
          </span>
          <h1 className="font-display text-4xl sm:text-5xl">
            Trip <span className="text-gradient-gold">Planner</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Plan your road trip and find nearby mosques for prayer times along your route.
          </p>
        </motion.div>

        <div className="mt-14 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-elegant sm:p-7">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">Origin</label>
                <LocationSearchInput placeholder="Search starting location..." onSelect={setStart} />
                {start?.label && <p className="mt-1 text-xs text-primary truncate">Selected: {start.label}</p>}
              </div>
              <div className="flex-1 w-full">
                <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">Destination</label>
                <LocationSearchInput placeholder="Search destination..." onSelect={setEnd} />
                {end?.label && <p className="mt-1 text-xs text-gold truncate">Selected: {end.label}</p>}
              </div>
              <div className="w-full sm:w-auto">
                <button
                  onClick={handlePlanTrip}
                  disabled={loading || !start || !end}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 shadow-elegant h-[42px]"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                  Plan Trip
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-sm text-destructive font-medium">{error}</p>
            )}
          </div>

          {route && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"
            >
              <div className="h-[400px] lg:h-[600px] w-full overflow-hidden rounded-3xl border border-border shadow-inner relative z-0">
                <MapContainer
                  bounds={[
                    [start!.lat, start!.lng],
                    [end!.lat, end!.lng],
                  ]}
                  zoom={10}
                  style={{ height: "100%", width: "100%", zIndex: 0 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <Polyline positions={route.geometry} pathOptions={{ color: "hsl(var(--primary))", weight: 4 }} />
                  
                  {stops.map((stop, i) => (
                    stop.mosques.map((m, j) => (
                      <Marker key={`${i}-${j}`} position={[m.lat, m.lng]} icon={mosqueIcon}>
                        <Popup>
                          <div className="font-semibold text-sm">{m.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">Found for {stop.prayerName} prayer</div>
                        </Popup>
                      </Marker>
                    ))
                  ))}
                </MapContainer>
              </div>

              <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-elegant backdrop-blur">
                <h3 className="font-display text-xl mb-4">Itinerary</h3>
                <div className="space-y-6">
                  <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-border last:before:h-0">
                    <div className="absolute left-0.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary" />
                    <p className="font-semibold text-sm">Departure</p>
                    <p className="text-xs text-muted-foreground">{start?.label}</p>
                  </div>

                  {stops.map((stop, i) => (
                    <div key={i} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-border last:before:h-0">
                      <div className="absolute left-0.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-violet-500" />
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {stop.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="font-semibold text-sm">{stop.prayerName} Prayer Time</p>
                      
                      {stop.mosques.length > 0 ? (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs font-medium text-primary">Suggested Mosques nearby:</p>
                          {stop.mosques.slice(0, 3).map((m, j) => (
                            <div key={j} className="rounded-lg bg-secondary/50 p-2 text-xs">
                              {m.name}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">No mosques found nearby on this segment.</p>
                      )}
                    </div>
                  ))}

                  <div className="relative pl-6">
                    <div className="absolute left-0.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-gold" />
                    <p className="font-semibold text-sm">Arrival</p>
                    <p className="text-xs text-muted-foreground">{end?.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Est. Trip Time: {Math.round(route.durationSec / 60)} mins
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
