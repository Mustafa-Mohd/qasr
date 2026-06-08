import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Compass, Navigation } from "lucide-react";

export function QiblaCompass({ qiblaBearing }: { qiblaBearing: number | null }) {
  const [heading, setHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if we need explicit permission (iOS 13+)
  useEffect(() => {
    if (typeof (window as any).DeviceOrientationEvent !== "undefined" && typeof (window as any).DeviceOrientationEvent.requestPermission !== "function") {
      setPermissionGranted(true);
    } else if (typeof (window as any).DeviceOrientationEvent === "undefined") {
      setError("Device orientation not supported on this device.");
    }
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let newHeading = null;
    
    // iOS compass heading
    if ((event as any).webkitCompassHeading) {
      newHeading = (event as any).webkitCompassHeading;
    } 
    // Standard absolute orientation (Android)
    else if (event.alpha !== null && event.absolute) {
      newHeading = 360 - event.alpha;
    }
    // Fallback for some Android browsers
    else if (event.alpha !== null) {
      newHeading = 360 - event.alpha;
    }
    
    if (newHeading !== null) {
      setHeading(newHeading);
    }
  }, []);

  useEffect(() => {
    if (permissionGranted) {
      // Prefer absolute for accurate compass on Android
      window.addEventListener("deviceorientationabsolute", handleOrientation as any, true);
      window.addEventListener("deviceorientation", handleOrientation as any, true);
      
      return () => {
        window.removeEventListener("deviceorientationabsolute", handleOrientation as any, true);
        window.removeEventListener("deviceorientation", handleOrientation as any, true);
      };
    }
  }, [permissionGranted, handleOrientation]);

  const requestPermission = async () => {
    try {
      if (typeof (window as any).DeviceOrientationEvent.requestPermission === "function") {
        const permissionState = await (window as any).DeviceOrientationEvent.requestPermission();
        if (permissionState === "granted") {
          setPermissionGranted(true);
        } else {
          setError("Permission denied. Cannot show compass.");
        }
      } else {
        setPermissionGranted(true);
      }
    } catch (e) {
      setError("Failed to request permission. You may need to use HTTPS.");
    }
  };

  if (qiblaBearing === null) return null;

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="mb-6 flex flex-col items-center text-center">
        <h3 className="font-display text-xl">Qibla Finder</h3>
        <p className="text-sm text-muted-foreground">
          Bearing: {Math.round(qiblaBearing)}° from North
        </p>
      </div>

      {!permissionGranted ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary/50 shadow-inner">
            <Compass className="h-10 w-10 text-muted-foreground opacity-50" />
          </div>
          <button
            onClick={requestPermission}
            className="rounded-xl bg-gradient-gold px-6 py-2.5 font-semibold text-gold-foreground shadow-gold transition-opacity hover:opacity-90"
          >
            Start Compass
          </button>
          {error && <p className="mt-2 text-xs text-destructive max-w-[250px] text-center">{error}</p>}
        </div>
      ) : (
        <div 
          className="relative flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-card to-secondary/30 shadow-[inset_0_4px_12px_rgba(0,0,0,0.1),_0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_4px_12px_rgba(255,255,255,0.05),_0_8px_32px_rgba(0,0,0,0.3)]"
          style={{ perspective: "800px" }}
        >
          {/* Compass rose */}
          <motion.div 
            className="relative flex h-52 w-52 items-center justify-center rounded-full border border-border bg-card shadow-elegant"
            animate={{ 
              rotateX: 15, 
              rotateZ: heading ? -heading : 0 
            }}
            transition={{ type: "spring", damping: 40, stiffness: 120, restDelta: 0.001 }}
          >
            {/* North Indicator */}
            <div className="absolute top-2 flex flex-col items-center text-xs font-bold text-destructive">
              N
              <div className="mt-1 h-2 w-0.5 bg-destructive"></div>
            </div>
            
            {/* East Indicator */}
            <div className="absolute right-3 text-xs font-semibold text-muted-foreground">E</div>
            
            {/* South Indicator */}
            <div className="absolute bottom-3 text-xs font-semibold text-muted-foreground">S</div>
            
            {/* West Indicator */}
            <div className="absolute left-3 text-xs font-semibold text-muted-foreground">W</div>

            {/* Dial lines */}
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="absolute h-full w-[1px] bg-border/60"
                style={{ transform: `rotate(${i * 30}deg)` }}
              />
            ))}

            {/* Qibla Indicator - Rotated relative to North */}
            <div 
              className="absolute h-full w-full"
              style={{ transform: `rotate(${qiblaBearing}deg)` }}
            >
              <div className="absolute top-0 left-1/2 -ml-3 flex flex-col items-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                <div className="flex h-6 w-6 items-center justify-center rounded-[4px] border-2 border-gold bg-[#111111] shadow-lg">
                   {/* Mini Kaaba representation */}
                   <div className="h-[4px] w-full bg-gold" />
                </div>
                <div className="mt-1 h-24 w-1 bg-gradient-to-b from-gold via-gold/50 to-transparent"></div>
              </div>
            </div>
            
            {/* Center dot */}
            <div className="absolute h-4 w-4 rounded-full bg-gradient-gold shadow-md"></div>
          </motion.div>
          
          {/* Device pointer (always points up relative to the phone) */}
          <div className="pointer-events-none absolute -top-3 flex flex-col items-center drop-shadow-md">
            <Navigation className="h-6 w-6 fill-primary text-primary" style={{ transform: "rotate(0deg)" }} />
          </div>
          
          {heading === null && !error && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm">
              <p className="text-sm font-medium animate-pulse text-muted-foreground">Calibrating...</p>
            </div>
          )}
        </div>
      )}
      
      <p className="mt-6 text-center text-xs text-muted-foreground max-w-[250px]">
        Hold your device flat. The golden indicator points toward the Qibla.
      </p>
    </div>
  );
}
