import { useLocations } from "@/hooks/use-locations";
import { motion } from "@/lib/motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Pin } from "./Pin";
import { RegionMenu } from "./map/RegionMenu";
import { SpaceView } from "./map/SpaceView";
import { ZoomControls } from "./map/ZoomControls";
import { getMercatorBounds } from "./map/geo";
import { useClusters } from "./map/useClusters";
import { useMapPosition } from "./map/useMapPosition";
import { useMapSize } from "./map/useMapSize";

gsap.registerPlugin(useGSAP);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

interface MapControlProps {
  onLocationSelect: (locationId: number | null) => void;
  selectedLocationId: number | null;
  onSpaceOperationSelect?: (operationId: number | null) => void;
  selectedSpaceOperationId?: number | null;
  resetViewToken?: number;
}

type Region = {
  id: string;
  label: string;
  coordinates: [number, number];
  zoom: number;
  bounds: [number, number, number, number];
};

export function MapControl({
  onLocationSelect,
  selectedLocationId,
  onSpaceOperationSelect,
  selectedSpaceOperationId,
  resetViewToken,
}: MapControlProps) {
  const locations = useLocations();
  const locationsById = useMemo(
    () => new Map(locations.map((loc) => [loc.id, loc])),
    [locations]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapSize = useMapSize(containerRef);
  const mapWidth = mapSize.width || 800;
  const mapHeight = mapSize.height || 450;
  
  // Calculate minimum zoom to ensure the full map fits in the viewport
  // The base projection scale is 140, which at zoom 1 fits well in ~800px width
  // For narrower viewports, we need to allow zooming out further
  const minZoom = useMemo(() => {
    // Mercator projection at scale 140 shows roughly 360 degrees of longitude
    // across ~800px. We need to calculate how much zoom is needed to fit
    // the full world width in the current viewport.
    const baseWidth = 800;
    const calculatedMin = Math.min(1, mapWidth / baseWidth);
    // Ensure we don't go below a reasonable minimum
    return Math.max(0.3, calculatedMin);
  }, [mapWidth]);

  const defaultPosition = useMemo(
    () => ({
      coordinates: [0, 20] as [number, number],
      // Scale default zoom proportionally to viewport width
      // Base: 1.2 zoom at 800px width
      zoom: Math.max(minZoom, (mapWidth / 800) * 1.2),
    }),
    [minZoom, mapWidth]
  );
  const {
    position,
    positionRef,
    animatePosition,
    updatePosition,
    resetPosition,
    isAnimating,
  } = useMapPosition(defaultPosition);

  // Live position tracks the current view during user interaction (for clustering/sizing)
  // This is separate from `position` which is the controlled state for ZoomableGroup
  const [livePosition, setLivePosition] = useState(position);

  const bounds = useMemo(
    () =>
      getMercatorBounds({
        width: mapWidth,
        height: mapHeight,
        center: livePosition.coordinates,
        scale: 140 * livePosition.zoom,
      }),
    [mapHeight, mapWidth, livePosition.coordinates, livePosition.zoom]
  );

  const normalizedBounds = useMemo(() => {
    const [minLng, minLat, maxLng, maxLat] = bounds;
    const isValid =
      Number.isFinite(minLng) &&
      Number.isFinite(minLat) &&
      Number.isFinite(maxLng) &&
      Number.isFinite(maxLat) &&
      minLng <= maxLng &&
      minLat <= maxLat;
    return isValid
      ? bounds
      : ([-180, -85, 180, 85] as [number, number, number, number]);
  }, [bounds]);

  const { clusterIndex, clusters } = useClusters(
    locations,
    livePosition.zoom,
    normalizedBounds
  );

  const showRawPins = livePosition.zoom >= 5.5;

  // Sync livePosition when position changes (from programmatic animations)
  useEffect(() => {
    setLivePosition(position);
  }, [position]);
  const [activeRegionId, setActiveRegionId] = useState<string>("world");
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [pendingSelectionId, setPendingSelectionId] = useState<number | null>(
    null
  );

  const regions = useMemo<Region[]>(
    () => [
      {
        id: "world",
        label: "World",
        coordinates: defaultPosition.coordinates,
        zoom: defaultPosition.zoom,
        bounds: [-180, -85, 180, 85] as [number, number, number, number],
      },
      {
        id: "space",
        label: "Space",
        coordinates: [0, 0] as [number, number],
        zoom: 1,
        bounds: [-180, -85, 180, 85] as [number, number, number, number],
      },
      {
        id: "north-america",
        label: "N. America",
        coordinates: [-100, 40] as [number, number],
        zoom: 2.4,
        bounds: [-170, 5, -50, 80] as [number, number, number, number],
      },
      {
        id: "south-america",
        label: "S. America",
        coordinates: [-60, -15] as [number, number],
        zoom: 2.5,
        bounds: [-90, -60, -25, 15] as [number, number, number, number],
      },
      {
        id: "europe",
        label: "Europe",
        coordinates: [10, 52] as [number, number],
        zoom: 2.7,
        bounds: [-25, 35, 40, 72] as [number, number, number, number],
      },
      {
        id: "africa",
        label: "Africa",
        coordinates: [20, 5] as [number, number],
        zoom: 2.4,
        bounds: [-20, -35, 55, 35] as [number, number, number, number],
      },
      {
        id: "middle-east",
        label: "Middle East",
        coordinates: [45, 25] as [number, number],
        zoom: 3,
        bounds: [30, 10, 60, 40] as [number, number, number, number],
      },
      {
        id: "asia",
        label: "Asia",
        coordinates: [95, 35] as [number, number],
        zoom: 2.6,
        bounds: [40, 5, 150, 75] as [number, number, number, number],
      },
      {
        id: "oceania",
        label: "Oceania",
        coordinates: [135, -25] as [number, number],
        zoom: 2.6,
        bounds: [100, -50, 180, 0] as [number, number, number, number],
      },
    ],
    [defaultPosition]
  );

  const isSpaceView = activeRegionId === "space";

  useGSAP(
    () => {
      if (mapRef.current) {
        gsap.from(mapRef.current, {
          opacity: 0,
          duration: motion.duration.slow,
          ease: motion.ease.out,
        });
      }
    },
    { scope: containerRef }
  );

  useEffect(() => {
    if (resetViewToken === undefined) return;
    resetPosition();
  }, [resetPosition, resetViewToken]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      setIsMobile(mq.matches);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const effectiveSelectedId = pendingSelectionId ?? selectedLocationId;

  useEffect(() => {
    if (
      selectedLocationId !== null &&
      selectedLocationId === pendingSelectionId
    ) {
      setPendingSelectionId(null);
      return;
    }

    if (selectedLocationId === null && !isAnimating && pendingSelectionId) {
      setPendingSelectionId(null);
    }
  }, [isAnimating, pendingSelectionId, selectedLocationId]);

  const handleZoomIn = () => {
    if (positionRef.current.zoom >= 6) return;
    animatePosition({
      coordinates: [positionRef.current.x, positionRef.current.y],
      zoom: positionRef.current.zoom * 1.5,
    });
  };

  const handleZoomOut = () => {
    if (positionRef.current.zoom <= minZoom) return;
    animatePosition({
      coordinates: [positionRef.current.x, positionRef.current.y],
      zoom: Math.max(minZoom, positionRef.current.zoom / 1.5),
    });
  };

  const resolveRegionId = (coordinates: [number, number], zoom: number) => {
    // Don't auto-resolve to space - it should only be selected explicitly
    if (activeRegionId === "space") return "space";
    if (zoom <= 1.3) return "world";
    const [lng, lat] = coordinates;
    const match = regions.find((region) => {
      // Skip world and space from auto-detection
      if (region.id === "world" || region.id === "space") return false;
      const [minLng, minLat, maxLng, maxLat] = region.bounds;
      return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
    });
    return match ? match.id : "world";
  };

  const handleMove = (movePosition: {
    x: number;
    y: number;
    zoom: number;
  }) => {
    // Update livePosition for clustering/sizing without affecting ZoomableGroup controlled state
    setLivePosition({
      coordinates: [movePosition.x, movePosition.y],
      zoom: movePosition.zoom,
    });
  };

  const handleMoveEnd = (position: {
    coordinates: [number, number];
    zoom: number;
  }) => {
    updatePosition(position);
    setActiveRegionId(resolveRegionId(position.coordinates, position.zoom));
  };

  const handleMarkerClick = (id: number, coordinates: [number, number]) => {
    setPendingSelectionId(id);
    const nextZoom = Math.min(6, Math.max(positionRef.current.zoom, 3));
    animatePosition(
      {
        coordinates,
        zoom: nextZoom,
      },
      {
        onComplete: () => {
          onLocationSelect(id);
          setPendingSelectionId(null);
        },
      }
    );
  };

  const handleClusterClick = (
    clusterId: number,
    coordinates: [number, number]
  ) => {
    const nextZoom = Math.min(
      clusterIndex.getClusterExpansionZoom(clusterId),
      6
    );
    animatePosition({
      coordinates,
      zoom: nextZoom,
    });
  };

  const handleRegionSelect = (region: {
    id: string;
    coordinates: [number, number];
    zoom: number;
  }) => {
    // Clear any selections when switching regions
    if (region.id === "space") {
      onLocationSelect(null);
    } else if (activeRegionId === "space") {
      onSpaceOperationSelect?.(null);
    }
    
    setActiveRegionId(region.id);
    
    if (region.id !== "space") {
      animatePosition({
        coordinates: region.coordinates,
        zoom: Math.min(6, region.zoom),
      });
    }
    
    if (isMobile) {
      setIsRegionsOpen(false);
    }
  };

  const handleSpaceOperationClick = (operationId: number) => {
    onSpaceOperationSelect?.(operationId);
  };

  const regionMenu = (
    <RegionMenu
      regions={regions}
      activeRegionId={activeRegionId}
      isOpen={isRegionsOpen}
      isMobile={isMobile}
      onToggle={() => setIsRegionsOpen((open) => !open)}
      onSelect={handleRegionSelect}
    />
  );

  const zoomControls = (
    <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden transition-colors duration-700 ${
        isSpaceView ? 'bg-[#050a10]' : 'bg-[#0a121e]'
      }`}
    >
      <div className={`absolute inset-0 map-ocean-glow pointer-events-none transition-opacity duration-700 ${isSpaceView ? 'opacity-0' : 'opacity-100'}`} />
      <div className={`absolute inset-0 map-atmosphere pointer-events-none transition-opacity duration-700 ${isSpaceView ? 'opacity-0' : 'opacity-100'}`} />
      <div className={`absolute inset-0 map-vignette pointer-events-none transition-opacity duration-700 ${isSpaceView ? 'opacity-30' : 'opacity-100'}`} />
      <div className={`absolute inset-0 map-noise pointer-events-none transition-opacity duration-700 ${isSpaceView ? 'opacity-5' : 'opacity-15'}`} />

      {/* Earth Map View */}
      <div 
        ref={mapRef} 
        className={`w-full h-full transition-all duration-700 ease-out ${
          isSpaceView ? 'opacity-0 scale-[0.3] blur-md pointer-events-none' : 'opacity-100 scale-100 blur-0'
        }`}
        style={{
          transformOrigin: isMobile ? 'left center' : 'center center',
        }}
      >
        <ComposableMap
          width={mapWidth}
          height={mapHeight}
          projection="geoMercator"
          projectionConfig={{ scale: 140 }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMove={handleMove}
            onMoveEnd={handleMoveEnd}
            maxZoom={10}
            minZoom={minZoom}
            translateExtent={[
              [-mapWidth * (1 - minZoom), -mapHeight * (1 - minZoom)],
              [mapWidth * (2 - minZoom), mapHeight * (2 - minZoom)],
            ]}
          >
            <Graticule
              stroke="rgba(91, 127, 163, 0.25)"
              strokeWidth={0.5}
              vectorEffect="non-scaling-stroke"
            />

            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                   vectorEffect="non-scaling-stroke"
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#141e2d"
                    stroke="rgba(91, 127, 163, 0.5)"
                    strokeWidth={0.8}
                    tabIndex={-1}
                    onMouseEnter={() => {
                      const name =
                        geo.properties?.NAME ||
                        geo.properties?.name ||
                        geo.properties?.ADMIN ||
                        null;
                      setHoveredRegion(name);
                    }}
                    onMouseLeave={() => setHoveredRegion(null)}
                    style={{
                      default: { outline: "none", opacity: 1 },
                      hover: {
                        outline: "none",
                        opacity: 1,
                        fill: "#1c2a3d",
                        stroke: "rgba(91, 163, 220, 0.7)",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
            {showRawPins
              ? locations.map((loc) => (
                  <Marker
                    key={loc.id}
                    coordinates={[loc.longitude, loc.latitude]}
                  >
                    <g transform={`scale(${1 / livePosition.zoom})`}>
                      <Pin
                        category={loc.category}
                        isSelected={effectiveSelectedId === loc.id}
                        title={loc.name}
                        onClick={() =>
                          handleMarkerClick(loc.id, [
                            loc.longitude,
                            loc.latitude,
                          ])
                        }
                      />
                    </g>
                  </Marker>
                ))
              : clusters.map((cluster) => {
                  const [lng, lat] = cluster.geometry.coordinates as [
                    number,
                    number
                  ];
                  const isCluster =
                    "cluster" in cluster.properties &&
                    cluster.properties.cluster;

                  if (isCluster) {
                    const count = cluster.properties.point_count as number;
                    const size = 18 + Math.min(16, Math.log(count) * 8);
                    const clusterId = cluster.properties.cluster_id;
                    if (clusterId === undefined) return null;
                    return (
                      <Marker
                        key={`cluster-${clusterId}`}
                        coordinates={[lng, lat]}
                      >
                        <g
                          transform={`scale(${1 / livePosition.zoom})`}
                          onClick={() =>
                            handleClusterClick(clusterId, [lng, lat])
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleClusterClick(clusterId, [lng, lat]);
                            }
                          }}
                          role="button"
                          aria-label={`Cluster of ${count} locations`}
                          className="cursor-pointer"
                        >
                          <circle
                            r={size}
                            fill="rgba(91, 163, 220, 0.25)"
                            stroke="rgba(91, 163, 220, 0.8)"
                            strokeWidth={1.5}
                          />
                          <circle
                            r={size * 0.6}
                            fill="rgba(91, 163, 220, 0.35)"
                          />
                          <text
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill="white"
                            fontSize={12}
                            fontWeight={600}
                          >
                            {count}
                          </text>
                        </g>
                      </Marker>
                    );
                  }

                  const locationId = (
                    cluster.properties as { locationId: number }
                  ).locationId;
                  const loc = locationsById.get(locationId);
                  if (!loc) return null;

                  return (
                    <Marker
                      key={loc.id}
                      coordinates={[loc.longitude, loc.latitude]}
                    >
                      <g transform={`scale(${1 / livePosition.zoom})`}>
                        <Pin
                          category={loc.category}
                          isSelected={effectiveSelectedId === loc.id}
                          title={loc.name}
                          onClick={() =>
                            handleMarkerClick(loc.id, [
                              loc.longitude,
                              loc.latitude,
                            ])
                          }
                        />
                      </g>
                    </Marker>
                  );
                })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Space View */}
      <div 
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          isSpaceView ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
        }`}
      >
        <svg width={mapWidth} height={mapHeight} className="w-full h-full">
          <SpaceView
            isActive={isSpaceView}
            selectedOperationId={selectedSpaceOperationId ?? null}
            onOperationSelect={handleSpaceOperationClick}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
            isMobile={isMobile}
          />
        </svg>
        {/* Edge gradient overlay for space view */}
        <div className="absolute inset-0 space-edge-gradient pointer-events-none" />
      </div>

      {hoveredRegion && !isSpaceView ? (
        <div className="absolute top-6 left-6 z-30 hidden sm:block pointer-events-none">
          <div className="rounded-full bg-[#141e2d]/90 border border-primary/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/90 font-medium">
            {hoveredRegion}
          </div>
        </div>
      ) : null}

      <div className="absolute top-24 left-6 z-30 hidden sm:block">
        {regionMenu}
      </div>

      {!isSpaceView && (
        <div className="absolute bottom-8 right-8 hidden sm:flex sm:flex-col sm:gap-4">
          {zoomControls}
        </div>
      )}

      {/* Close button for space view */}
      {isSpaceView && (
        <button
          onClick={() => handleRegionSelect(regions[0])} // regions[0] is "World"
          className="absolute bottom-8 right-8 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-[#141e2d]/90 border border-primary/40 text-white/90 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#1c2a3d] hover:border-primary/60 transition-colors"
          aria-label="Exit space view"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className="hidden sm:inline">Exit Space View</span>
          <span className="sm:hidden">Exit</span>
        </button>
      )}

      <div className="absolute bottom-6 left-4 right-4 z-30 flex items-end justify-end gap-3 sm:hidden">
        <div className="w-full">{regionMenu}</div>
        {!isSpaceView && zoomControls}
      </div>
    </div>
  );
}
