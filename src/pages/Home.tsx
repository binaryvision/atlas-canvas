import { InfoDrawer } from "@/components/InfoDrawer";
import { SpaceInfoDrawer } from "@/components/SpaceInfoDrawer";
import { MapControl } from "@/components/MapControl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

export default function Home() {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [selectedSpaceOperationId, setSelectedSpaceOperationId] = useState<number | null>(
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
          onSpaceOperationSelect={setSelectedSpaceOperationId}
          selectedSpaceOperationId={selectedSpaceOperationId}
          resetViewToken={resetViewToken}
        />
      </div>

      {/* Info Drawer - For ground operations */}
      <InfoDrawer
        locationId={selectedLocationId}
        onClose={() => {
          setSelectedLocationId(null);
        }}
      />

      {/* Space Info Drawer - For space operations */}
      <SpaceInfoDrawer
        operationId={selectedSpaceOperationId}
        onClose={() => {
          setSelectedSpaceOperationId(null);
        }}
      />

    </div>
  );
}
