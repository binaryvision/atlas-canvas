import { InfoDrawer } from "@/components/InfoDrawer";
import { MapControl } from "@/components/MapControl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [resetViewToken, setResetViewToken] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(
        ".header-overlay",
        {
          y: -100,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.5
      );

      tl.from(
        ".footer-overlay",
        {
          y: 100,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.8
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen bg-background overflow-hidden flex"
    >
      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <MapControl
          onLocationSelect={setSelectedLocationId}
          selectedLocationId={selectedLocationId}
          resetViewToken={resetViewToken}
        />
      </div>

      {/* Info Drawer - Overlays on small screens, pushes content or overlays on large */}
      <InfoDrawer
        locationId={selectedLocationId}
        onClose={() => {
          setSelectedLocationId(null);
          setResetViewToken((token) => token + 1);
        }}
      />

      {/* Header Overlay */}
      <div className="header-overlay absolute top-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-start z-40 opacity-0">
        <div className="pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1 pl-1">
              Interactive
            </span>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              World Explorer
            </h1>
          </div>
        </div>

        <div className="pointer-events-auto">
          <button className="px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 text-xs uppercase tracking-widest text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">
            Menu
          </button>
        </div>
      </div>

      {/* Footer Status Overlay */}
      <div className="footer-overlay absolute bottom-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-end z-30 opacity-0">
        <div className="text-[10px] text-white/20 font-mono">
          COORD: {selectedLocationId ? "LOCKED" : "SCANNING"} <br />
          SYS: ONLINE
        </div>
      </div>
    </div>
  );
}
