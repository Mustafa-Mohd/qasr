import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { Compass, MapPin, Loader2, Navigation } from "lucide-react";
import { getCurrentPosition, type Coords, calculateDistanceAndBearing } from "@/lib/geo";

export const Route = createFileRoute("/qibla")({
  head: () => ({
    meta: [{ title: "Qibla Map - Qasr Companion" }],
  }),
  component: QiblaPage,
});

const MAKKAH: Coords = { lat: 21.4225, lng: 39.8262 };

const makkahIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapFitter({ userLoc }: { userLoc: Coords | null }) {
  const map = useMap();
  useEffect(() => {
    if (userLoc) {
      const bounds = L.latLngBounds(
        [userLoc.lat, userLoc.lng],
        [MAKKAH.lat, MAKKAH.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [userLoc, map]);
  return null;
}

function QiblaPage() {
  const [userLoc, setUserLoc] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qiblaInfo, setQiblaInfo] = useState<{ distance: number, bearing: number } | null>(null);

  const detectLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const pos = await getCurrentPosition();
      setUserLoc(pos);
      const info = calculateDistanceAndBearing(pos, MAKKAH);
      setQiblaInfo({ distance: info.distance, bearing: info.bearing });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to auto-detect on mount
    detectLocation();
  }, []);

  return (
    <main className="flex-1 flex flex-col pattern-islamic pb-20">
      <div className="mx-auto w-full max-w-6xl px-4 pt-12 sm:pt-20 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="mb-4 flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
            <Compass className="h-6 w-6 text-gold-foreground" />
          </span>
          <h1 className="font-display text-4xl sm:text-5xl">
            Qibla <span className="text-gradient-gold">Finder</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Find the exact direction to the Kaaba from your current location anywhere in the world.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-center text-sm text-destructive max-w-2xl mx-auto w-full">
            {error}
            <button onClick={detectLocation} className="ml-4 font-semibold underline">Try Again</button>
          </div>
        )}

        {qiblaInfo && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto w-full">
            <div className="rounded-2xl border border-border bg-card/80 p-6 text-center shadow-sm backdrop-blur">
              <p className="text-sm font-medium text-muted-foreground mb-1">Qibla Direction</p>
              <div className="font-display text-4xl text-gold">{qiblaInfo.bearing.toFixed(1)}°</div>
              <p className="text-xs text-muted-foreground mt-2">from North</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-6 text-center shadow-sm backdrop-blur">
              <p className="text-sm font-medium text-muted-foreground mb-1">Distance to Kaaba</p>
              <div className="font-display text-4xl text-foreground">{Math.round(qiblaInfo.distance).toLocaleString()} <span className="text-xl text-muted-foreground">km</span></div>
            </div>
          </div>
        )}

        <div className="relative flex-1 min-h-[400px] w-full rounded-3xl border-4 border-border/50 shadow-elegant overflow-hidden bg-card z-0">
          {!userLoc && loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-gold mb-4" />
              <p className="font-medium">Locating you...</p>
            </div>
          )}
          
          {!userLoc && !loading && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
               <button onClick={detectLocation} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg hover:opacity-90">
                 <Navigation className="h-5 w-5" /> Enable Location
               </button>
             </div>
          )}

          <MapContainer 
            center={userLoc ? [userLoc.lat, userLoc.lng] : [21.4225, 39.8262]} 
            zoom={3} 
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            <Marker position={[MAKKAH.lat, MAKKAH.lng]} icon={makkahIcon}>
              <Popup>
                <div className="font-bold">The Kaaba 🕋</div>
                <div className="text-xs text-muted-foreground">Makkah, Saudi Arabia</div>
              </Popup>
            </Marker>

            {userLoc && (
              <>
                <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                  <Popup>
                    <div className="font-bold flex items-center gap-1"><MapPin className="h-3 w-3"/> You are here</div>
                  </Popup>
                </Marker>
                <Polyline 
                  positions={[[userLoc.lat, userLoc.lng], [MAKKAH.lat, MAKKAH.lng]]} 
                  pathOptions={{ color: "hsl(var(--gold))", weight: 4, dashArray: "10 10", opacity: 0.8 }} 
                />
                <MapFitter userLoc={userLoc} />
              </>
            )}
          </MapContainer>
        </div>
        
      </div>
    </main>
  );
}
