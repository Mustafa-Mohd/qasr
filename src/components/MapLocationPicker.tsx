import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQasr } from "@/hooks/useQasr";
import { Search, MapPin, Home, Navigation, Loader2 } from "lucide-react";
import type { Coords } from "@/lib/geo";

// Fix for default Leaflet markers not loading correctly in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const homeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const currentIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapUpdater({ home, current, initialCenter }: { home: Coords | null, current: Coords | null, initialCenter: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    if (home && current) {
      const bounds = L.latLngBounds(
        [home.lat, home.lng],
        [current.lat, current.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (home) {
      map.setView([home.lat, home.lng], 13);
    } else if (current) {
      map.setView([current.lat, current.lng], 13);
    } else {
      map.setView(initialCenter, 5);
    }
  }, [home, current, initialCenter, map]);

  return null;
}

const formatPhotonResult = (properties: any) => {
  const parts = [
    properties.name,
    properties.city || properties.town || properties.village,
    properties.state,
    properties.country
  ].filter(Boolean);
  return Array.from(new Set(parts)).join(", ");
};

function LocationSearchInput({ placeholder, onSelect }: { placeholder: string, onSelect: (c: Coords) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=6`);
        const data = await res.json();
        setSearchResults(data.features || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const selectResult = (result: any) => {
    const [lon, lat] = result.geometry.coordinates;
    onSelect({
      lat,
      lng: lon,
      label: formatPhotonResult(result.properties)
    });
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="relative flex-1">
      <form onSubmit={handleSearch} className="flex relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2.5 pl-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
          disabled={isSearching || !searchQuery.trim()}
        >
          {isSearching ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Search'}
        </button>
      </form>
      {searchResults.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
          {searchResults.map((res, i) => (
            <button
              key={i}
              className="w-full border-b border-border/50 px-4 py-3 text-left text-sm hover:bg-secondary/50 last:border-0"
              onClick={() => selectResult(res)}
            >
              {formatPhotonResult(res.properties)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MapLocationPicker({ mode }: { mode: 'self' | 'other' }) {
  const { home, current, setHomeExplicitly, setCurrentExplicitly, detectCurrent, loadingLocation } = useQasr();
  const [initialCenter, setInitialCenter] = useState<[number, number]>([21.4225, 39.8262]);

  useEffect(() => {
    if (!home && !current) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            setInitialCenter([data.latitude, data.longitude]);
          }
        })
        .catch(() => {});
    }
  }, [home, current]);

  const polylinePositions: [number, number][] = 
    (home && current) ? [[home.lat, home.lng], [current.lat, current.lng]] : [];

  const defaultCenter: [number, number] = home ? [home.lat, home.lng] : current ? [current.lat, current.lng] : initialCenter;

  return (
    <div className="flex flex-col gap-4">
      {mode === 'self' ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <LocationSearchInput placeholder="Search for your home location..." onSelect={setHomeExplicitly} />
          <button
            onClick={detectCurrent}
            disabled={loadingLocation}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground hover:opacity-90 disabled:opacity-60 whitespace-nowrap shadow-gold"
          >
            {loadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            Detect Current
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <LocationSearchInput placeholder="Search their Home location..." onSelect={setHomeExplicitly} />
          <LocationSearchInput placeholder="Search their Destination..." onSelect={setCurrentExplicitly} />
        </div>
      )}

      <div className="h-[300px] w-full overflow-hidden rounded-2xl border border-border shadow-inner sm:h-[400px] relative z-0">
        <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%", zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater home={home} current={current} initialCenter={initialCenter} />
          
          {home && (
            <Marker position={[home.lat, home.lng]} icon={homeIcon}>
              <Popup>
                <div className="font-semibold text-sm flex items-center gap-1">
                  <Home className="h-3 w-3 text-primary"/> Home Location
                </div>
                <div className="text-xs text-muted-foreground mt-1 max-w-[200px]">{home.label || "Home"}</div>
              </Popup>
            </Marker>
          )}

          {current && (
            <Marker position={[current.lat, current.lng]} icon={currentIcon}>
              <Popup>
                <div className="font-semibold text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-gold"/> Current Location
                </div>
                <div className="text-xs text-muted-foreground mt-1 max-w-[200px]">{current.label || "Current"}</div>
              </Popup>
            </Marker>
          )}

          {home && current && (
            <Polyline positions={polylinePositions} pathOptions={{ color: "hsl(var(--primary))", weight: 3, dashArray: "8 8" }} />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
