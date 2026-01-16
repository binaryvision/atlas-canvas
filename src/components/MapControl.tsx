import { useLocations } from "@/hooks/use-locations";
import { motion } from "@/lib/motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, ChevronUp, Compass, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import Supercluster from "supercluster";
import { Pin } from "./Pin";

gsap.registerPlugin(useGSAP);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapControlProps {
  onLocationSelect: (locationId: number | null) => void;
  selectedLocationId: number | null;
  resetViewToken?: number;
}

export function MapControl({
  onLocationSelect,
  selectedLocationId,
  resetViewToken,
}: MapControlProps) {
  const locations = useLocations();
  const locationsById = useMemo(
    () => new Map(locations.map((loc) => [loc.id, loc])),
    [locations]
  );
  const defaultPosition = useRef({ x: 0, y: 20, zoom: 1.2 });
  const positionRef = useRef({ ...defaultPosition.current });
  const [position, setPosition] = useState({
    coordinates: [positionRef.current.x, positionRef.current.y] as [
      number,
      number
    ],
    zoom: positionRef.current.zoom,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const clusterIndex = useMemo(() => {
    const index = new Supercluster<{
      locationId: number;
      category: string;
    }>({
      radius: 60,
      maxZoom: 6,
    });
    index.load(
      locations.map((loc) => ({
        type: "Feature",
        properties: {
          locationId: loc.id,
          category: loc.category,
        },
        geometry: {
          type: "Point",
          coordinates: [loc.longitude, loc.latitude],
        },
      }))
    );
    return index;
  }, [locations]);

  const clusters = useMemo(() => {
    const bounds: [number, number, number, number] = [-180, -85, 180, 85];
    return clusterIndex.getClusters(bounds, Math.round(position.zoom));
  }, [clusterIndex, position.zoom]);

  const showRawPins = position.zoom >= 5.5;
  const [activeRegionId, setActiveRegionId] = useState<string>("world");
  const [isRegionsOpen, setIsRegionsOpen] = useState(true);
  const isMobileRef = useRef(false);

  const regions = useMemo(
    () => [
      {
        id: "world",
        label: "World",
        coordinates: [defaultPosition.current.x, defaultPosition.current.y] as [
          number,
          number
        ],
        zoom: defaultPosition.current.zoom,
        bounds: [-180, -85, 180, 85] as [number, number, number, number],
      },
      {
        id: "north-america",
        label: "N. America",
        coordinates: [-100, 40],
        zoom: 2.4,
        bounds: [-170, 5, -50, 80],
      },
      {
        id: "south-america",
        label: "S. America",
        coordinates: [-60, -15],
        zoom: 2.5,
        bounds: [-90, -60, -25, 15],
      },
      {
        id: "europe",
        label: "Europe",
        coordinates: [10, 52],
        zoom: 2.7,
        bounds: [-25, 35, 40, 72],
      },
      {
        id: "africa",
        label: "Africa",
        coordinates: [20, 5],
        zoom: 2.4,
        bounds: [-20, -35, 55, 35],
      },
      {
        id: "middle-east",
        label: "Middle East",
        coordinates: [45, 25],
        zoom: 3,
        bounds: [30, 10, 60, 40],
      },
      {
        id: "asia",
        label: "Asia",
        coordinates: [95, 35],
        zoom: 2.6,
        bounds: [40, 5, 150, 75],
      },
      {
        id: "oceania",
        label: "Oceania",
        coordinates: [135, -25],
        zoom: 2.6,
        bounds: [100, -50, 180, 0],
      },
    ],
    [defaultPosition]
  );

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
    animatePosition({
      coordinates: [defaultPosition.current.x, defaultPosition.current.y],
      zoom: defaultPosition.current.zoom,
    });
  }, [resetViewToken]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      isMobileRef.current = mq.matches;
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const animatePosition = (next: {
    coordinates: [number, number];
    zoom: number;
  }) => {
    gsap.killTweensOf(positionRef.current);
    gsap.to(positionRef.current, {
      x: next.coordinates[0],
      y: next.coordinates[1],
      zoom: next.zoom,
      duration: motion.duration.zoom,
      ease: motion.ease.inOut,
      onUpdate: () => {
        setPosition({
          coordinates: [positionRef.current.x, positionRef.current.y],
          zoom: positionRef.current.zoom,
        });
      },
    });
  };

  const handleZoomIn = () => {
    if (positionRef.current.zoom >= 6) return;
    animatePosition({
      coordinates: [positionRef.current.x, positionRef.current.y],
      zoom: positionRef.current.zoom * 1.5,
    });
  };

  const handleZoomOut = () => {
    if (positionRef.current.zoom <= 1) return;
    animatePosition({
      coordinates: [positionRef.current.x, positionRef.current.y],
      zoom: positionRef.current.zoom / 1.5,
    });
  };

  const resolveRegionId = (coordinates: [number, number], zoom: number) => {
    if (zoom <= 1.3) return "world";
    const [lng, lat] = coordinates;
    const match = regions.find((region) => {
      if (region.id === "world") return false;
      const [minLng, minLat, maxLng, maxLat] = region.bounds;
      return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
    });
    return match ? match.id : "world";
  };

  const handleMoveEnd = (position: {
    coordinates: [number, number];
    zoom: number;
  }) => {
    gsap.killTweensOf(positionRef.current);
    positionRef.current = {
      x: position.coordinates[0],
      y: position.coordinates[1],
      zoom: position.zoom,
    };
    setPosition(position);
    setActiveRegionId(resolveRegionId(position.coordinates, position.zoom));
  };

  const handleMarkerClick = (id: number, coordinates: [number, number]) => {
    onLocationSelect(id);
    const nextZoom = Math.min(6, Math.max(positionRef.current.zoom, 3));
    animatePosition({
      coordinates,
      zoom: nextZoom,
    });
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
    setActiveRegionId(region.id);
    animatePosition({
      coordinates: region.coordinates,
      zoom: Math.min(6, region.zoom),
    });
    if (isMobileRef.current) {
      setIsRegionsOpen(false);
    }
  };

  const regionMenu = (
    <div className="bg-card/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl shadow-black/40 w-full sm:w-auto">
      <div className="flex flex-col-reverse sm:flex-col">
        <button
          onClick={() => setIsRegionsOpen((open) => !open)}
          className="w-full flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/40 px-2 pt-2 sm:pb-2"
          aria-expanded={isRegionsOpen}
          aria-label="Toggle regions menu"
        >
          Regions
          {isRegionsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div
          className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${
            isRegionsOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() =>
                handleRegionSelect({
                  id: region.id,
                  coordinates: region.coordinates,
                  zoom: region.zoom,
                })
              }
              className={`px-3 py-2 rounded-xl text-xs uppercase tracking-[0.25em] transition-colors border ${
                activeRegionId === region.id
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {region.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const zoomControls = (
    <div className="bg-card/80 backdrop-blur-md border border-white/5 rounded-full p-2 flex flex-col gap-2 shadow-2xl shadow-black/50">
      <button
        onClick={handleZoomIn}
        aria-label="Zoom in"
        className="p-3 hover:bg-white/5 rounded-full text-foreground/80 hover:text-primary transition-colors"
      >
        <Plus size={20} />
      </button>
      <div className="h-px w-full bg-white/5" />
      <button
        onClick={handleZoomOut}
        aria-label="Zoom out"
        className="p-3 hover:bg-white/5 rounded-full text-foreground/80 hover:text-primary transition-colors"
      >
        <Minus size={20} />
      </button>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#050508] overflow-hidden"
    >
      <div ref={mapRef} className="w-full h-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140 }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            maxZoom={6}
            minZoom={1}
            translateExtent={[
              [0, 0],
              [800, 600],
            ]}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#0b0b10"
                    stroke="rgba(255, 255, 255, 0.18)"
                    strokeWidth={0.6}
                    style={{
                      default: { outline: "none", opacity: 0.85 },
                      hover: { outline: "none", opacity: 1 },
                      pressed: { outline: "none", opacity: 1 },
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
                    <g transform={`scale(${1 / position.zoom})`}>
                      <Pin
                        category={loc.category}
                        isSelected={selectedLocationId === loc.id}
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
                    return (
                      <Marker
                        key={`cluster-${cluster.properties.cluster_id}`}
                        coordinates={[lng, lat]}
                      >
                        <g
                          transform={`scale(${1 / position.zoom})`}
                          onClick={() =>
                            handleClusterClick(cluster.properties.cluster_id, [
                              lng,
                              lat,
                            ])
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <circle
                            r={size}
                            fill="rgba(91, 255, 190, 0.15)"
                            stroke="rgba(91, 255, 190, 0.6)"
                            strokeWidth={1}
                          />
                          <circle
                            r={size * 0.6}
                            fill="rgba(91, 255, 190, 0.2)"
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
                      <g transform={`scale(${1 / position.zoom})`}>
                        <Pin
                          category={loc.category}
                          isSelected={selectedLocationId === loc.id}
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

      <div className="absolute top-24 left-6 z-30 hidden sm:block">
        {regionMenu}
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col gap-4 hidden sm:flex">
        {zoomControls}
      </div>

      <div className="absolute bottom-6 left-4 right-4 z-30 flex items-end justify-end gap-3 sm:hidden">
        <div className="w-full">{regionMenu}</div>
        {zoomControls}
      </div>

      <div className="absolute top-8 right-8 text-white/10 pointer-events-none">
        <Compass size={64} strokeWidth={1} />
      </div>

      <div className="absolute bottom-8 left-8 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-display text-white/5 font-bold tracking-tighter">
          ATLAS
        </h1>
      </div>
    </div>
  );
}
