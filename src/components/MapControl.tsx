import { useLocations, useSpaceOperations } from "@/hooks/use-locations";
import { motion } from "@/lib/motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLocation } from "wouter";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Satellite } from "lucide-react";
import { Pin } from "./Pin";
import { RegionMenu } from "./map/RegionMenu";
import { CategoryFilter } from "./map/CategoryFilter";
import { LayerVisibilityControl } from "./map/LayerVisibilityControl";
import { SearchBar, type SearchBarHandle } from "./map/SearchBar";
import { SpaceOverlay } from "./map/SpaceView";
import { ZoomControls } from "./map/ZoomControls";
import { getMercatorBounds } from "./map/geo";
import { useClusters } from "./map/useClusters";
import { useMapPosition } from "./map/useMapPosition";
import { useMapSize } from "./map/useMapSize";

gsap.registerPlugin(useGSAP);

// Land-only topology: continents/coastlines with no country borders
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json";

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
  const [activeRegionId, setActiveRegionId] = useState<string>("world");
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pendingSelectionId, setPendingSelectionId] = useState<number | null>(
    null
  );
  const [isSpaceOverlayOpen, setIsSpaceOverlayOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const expectedSearchRef = useRef<string | null>(null);
  const searchBarRef = useRef<SearchBarHandle>(null);

  // Get unique categories from locations (needed early for URL parsing)
  const categories = useMemo(() => {
    const uniqueCategories = new Set(locations.map((loc) => loc.category));
    return Array.from(uniqueCategories).sort();
  }, [locations]);

  // Parse search query and category from URL
  const getSearchFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("search") || "";
  };

  const getCategoryFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    return category && categories.includes(category) ? category : null;
  };

  const [searchQuery, setSearchQuery] = useState(() => getSearchFromUrl());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    // Initialize from URL after categories are available
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const uniqueCategories = new Set(locations.map((loc) => loc.category));
    const validCategories = Array.from(uniqueCategories);
    return category && validCategories.includes(category) ? category : null;
  });

  const [showOperations, setShowOperations] = useState(true);
  const [showExercises, setShowExercises] = useState(true);

  // Update URL when search query or category changes
  useEffect(() => {
    const newSearchValue = searchQuery.trim();
    const currentUrlSearch = getSearchFromUrl();
    const currentUrlCategory = getCategoryFromUrl();

    // Only update if values actually differ from URL
    if (currentUrlSearch === newSearchValue && currentUrlCategory === selectedCategory) {
      expectedSearchRef.current = null;
      return;
    }

    // Mark what we expect the URL to be
    expectedSearchRef.current = newSearchValue;

    const url = new URL(window.location.href);
    if (newSearchValue) {
      url.searchParams.set("search", newSearchValue);
    } else {
      url.searchParams.delete("search");
    }

    if (selectedCategory) {
      url.searchParams.set("category", selectedCategory);
    } else {
      url.searchParams.delete("category");
    }

    const newUrl = url.pathname + (url.search ? url.search : "");
    setLocation(newUrl, { replace: true });
  }, [searchQuery, selectedCategory, setLocation, categories]);

  // Sync search query and category when URL changes externally (e.g., browser back/forward)
  // Only sync if the URL change wasn't expected (i.e., we didn't cause it)
  useEffect(() => {
    const urlSearch = getSearchFromUrl();
    const urlCategory = getCategoryFromUrl();

    // If this is the search value we just set, ignore it
    if (expectedSearchRef.current !== null && urlSearch === expectedSearchRef.current) {
      expectedSearchRef.current = null;
      // Still sync category if it changed
      if (urlCategory !== selectedCategory) {
        setSelectedCategory(urlCategory);
      }
      return;
    }

    // If URL changed to something unexpected, sync it
    if (urlSearch !== searchQuery) {
      expectedSearchRef.current = null;
      setSearchQuery(urlSearch);
    }

    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [location, searchQuery, selectedCategory]);

  // Filter locations based on layer visibility, category, and search query
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    // Apply layer type visibility (Operations / Exercises)
    filtered = filtered.filter(
      (loc) =>
        (loc.locationType === "operation" && showOperations) ||
        (loc.locationType === "exercise" && showExercises)
    );

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((loc) => loc.category === selectedCategory);
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((loc) => {
        const nameMatch = loc.name.toLowerCase().includes(query);
        const descMatch = loc.description.toLowerCase().includes(query);
        const categoryMatch = loc.category.toLowerCase().includes(query);
        return nameMatch || descMatch || categoryMatch;
      });
    }

    return filtered;
  }, [locations, showOperations, showExercises, searchQuery, selectedCategory]);

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
    filteredLocations,
    livePosition.zoom,
    normalizedBounds
  );

  const showRawPins = livePosition.zoom >= 5.5;

  // Sort locations by reading order (top-to-bottom, left-to-right) for keyboard navigation
  const sortedLocations = useMemo(() => {
    return [...filteredLocations].sort((a, b) => {
      // Group by latitude bands (~10 degrees)
      const latBandA = Math.floor(a.latitude / 10);
      const latBandB = Math.floor(b.latitude / 10);
      if (latBandB !== latBandA) return latBandB - latBandA; // Top to bottom
      return a.longitude - b.longitude; // Left to right within band
    });
  }, [filteredLocations]);

  // Sync livePosition when position changes (from programmatic animations)
  useEffect(() => {
    setLivePosition(position);
  }, [position]);

  // Global keyboard shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Cmd/Ctrl + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (!isSpaceOverlayOpen) {
          searchBarRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpaceOverlayOpen]);

  const spaceOperations = useSpaceOperations();

  // Calculate bounds for filtered locations and zoom to fit when search or filter changes
  useEffect(() => {
    // If search and filter are both cleared, reset to default view
    if (!searchQuery.trim() && !selectedCategory) {
      resetPosition();
      return;
    }

    if (filteredLocations.length === 0) return;

    // Calculate bounding box for filtered locations
    const lngs = filteredLocations.map((loc) => loc.longitude);
    const lats = filteredLocations.map((loc) => loc.latitude);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    // Add padding (10% on each side)
    const lngPadding = (maxLng - minLng) * 0.1;
    const latPadding = (maxLat - minLat) * 0.1;

    const paddedMinLng = minLng - lngPadding;
    const paddedMaxLng = maxLng + lngPadding;
    const paddedMinLat = Math.max(-85, minLat - latPadding);
    const paddedMaxLat = Math.min(85, maxLat + latPadding);

    // Calculate center
    const centerLng = (paddedMinLng + paddedMaxLng) / 2;
    const centerLat = (paddedMinLat + paddedMaxLat) / 2;

    // Calculate required zoom level to fit the bounds
    const lngRange = paddedMaxLng - paddedMinLng;
    const latRange = paddedMaxLat - paddedMinLat;

    // Estimate zoom based on the larger dimension
    const lngZoom = (360 / lngRange) * (mapWidth / 800);
    const latZoom = (170 / latRange) * (mapHeight / 450);
    const estimatedZoom = Math.min(lngZoom, latZoom, 6); // Cap at zoom 6

    // Use a reasonable zoom level
    const targetZoom = Math.max(minZoom, Math.min(estimatedZoom, 4));

    // Animate to the new position
    animatePosition({
      coordinates: [centerLng, centerLat],
      zoom: targetZoom,
    });
  }, [searchQuery, selectedCategory, filteredLocations, mapWidth, mapHeight, minZoom, animatePosition, resetPosition]);

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
      {
        id: "space",
        label: "Space",
        coordinates: [0, 20] as [number, number],
        zoom: 1,
        bounds: [200, 200, 200, 200] as [number, number, number, number], // non-geographic, never matches
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
    if (zoom <= 1.3) return "world";
    const [lng, lat] = coordinates;
    const match = regions.find((region) => {
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
    if (region.id === "space") {
      setActiveRegionId("space");
      onLocationSelect(null);
      if (!isSpaceOverlayOpen) setIsSpaceOverlayOpen(true);
      if (isMobile) setIsRegionsOpen(false);
      return;
    }
    if (isSpaceOverlayOpen) {
      onSpaceOperationSelect?.(null);
      setIsSpaceOverlayOpen(false);
    }
    setActiveRegionId(region.id);
    animatePosition({
      coordinates: region.coordinates,
      zoom: Math.min(6, region.zoom),
    });

    if (isMobile) {
      setIsRegionsOpen(false);
    }
  };

  const handleSpaceOperationClick = (operationId: number) => {
    onSpaceOperationSelect?.(operationId);
  };

  const handleToggleSpaceOverlay = () => {
    if (isSpaceOverlayOpen) {
      onSpaceOperationSelect?.(null);
      setActiveRegionId(
        resolveRegionId(
          [positionRef.current.x, positionRef.current.y],
          positionRef.current.zoom
        )
      );
    } else {
      onLocationSelect(null);
    }
    setIsSpaceOverlayOpen(!isSpaceOverlayOpen);
  };

  // Center map on focused element (for keyboard navigation consistency with click behavior)
  const handlePinFocus = (coordinates: [number, number]) => {
    animatePosition({
      coordinates,
      zoom: positionRef.current.zoom,
    });
  };

  const spaceRegion = regions.find((r) => r.id === "space");

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

  const spaceButton = spaceRegion ? (
    <div className="bg-[#141e2d]/95 backdrop-blur-md border border-primary/30 rounded-2xl p-3 shadow-2xl shadow-black/50 w-full sm:w-auto">
      <button
        onClick={() => handleRegionSelect(spaceRegion)}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs uppercase tracking-[0.25em] transition-colors border font-medium ${
          activeRegionId === spaceRegion.id
            ? "bg-primary/25 border-primary/60 text-white"
            : "bg-white/5 border-primary/20 text-white/70 hover:text-white hover:bg-primary/15 hover:border-primary/40"
        }`}
      >
        <Satellite size={14} className="shrink-0" aria-hidden />
        <span className="flex items-center gap-0.5">
          {spaceRegion.label}
        </span>
      </button>
    </div>
  ) : null;

  const zoomControls = (
    <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
  );

  // Count visible items for screen reader announcement
  const visibleItemCount = showRawPins ? sortedLocations.length : clusters.length;
  const itemType = showRawPins ? "locations" : "location clusters";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-[#0a121e]"
      role="application"
      aria-label={`Interactive world map with ${visibleItemCount} ${itemType}. Use Tab to navigate between locations, Enter to select.`}
    >
      <div className="absolute inset-0 map-ocean-glow pointer-events-none" />
      <div className="absolute inset-0 map-atmosphere pointer-events-none" />
      <div className="absolute inset-0 map-vignette pointer-events-none" />
      <div className="absolute inset-0 map-noise pointer-events-none" />

      {/* Earth Map View */}
      <div
        ref={mapRef}
        className={`w-full h-full transition-all duration-500 ease-out ${isSpaceOverlayOpen ? 'blur-sm saturate-50' : 'blur-0 saturate-100'
          }`}
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
            maxZoom={15}
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
                    style={{ default: { outline: "none", opacity: 1 } }}
                  />
                ))
              }
            </Geographies>
            {showRawPins
              ? sortedLocations.map((loc) => (
                <Marker
                  key={loc.id}
                  coordinates={[loc.longitude, loc.latitude]}
                >
                  <g transform={`scale(${1 / livePosition.zoom})`}>
                    <Pin
                      variant={loc.locationType}
                      category={loc.category}
                      isSelected={effectiveSelectedId === loc.id}
                      title={loc.name}
                      onClick={() =>
                        handleMarkerClick(loc.id, [
                          loc.longitude,
                          loc.latitude,
                        ])
                      }
                      onFocus={() =>
                        handlePinFocus([loc.longitude, loc.latitude])
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
                        onFocus={() => handlePinFocus([lng, lat])}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleClusterClick(clusterId, [lng, lat]);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Cluster of ${count} locations. Press Enter to zoom in and view individual locations.`}
                        className="cursor-pointer focus:outline-none cluster-focusable"
                        style={{ pointerEvents: "all" }}
                      >
                        <title>{`${count} locations - press Enter to zoom`}</title>
                        {/* Focus ring - visible only on keyboard focus */}
                        <circle
                          r={size + 6}
                          fill="none"
                          stroke="rgba(91, 163, 220, 0.9)"
                          strokeWidth={2}
                          strokeDasharray="4 2"
                          className="cluster-focus-ring"
                        />
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
                        variant={loc.locationType}
                        category={loc.category}
                        isSelected={effectiveSelectedId === loc.id}
                        title={loc.name}
                        onClick={() =>
                          handleMarkerClick(loc.id, [
                            loc.longitude,
                            loc.latitude,
                          ])
                        }
                        onFocus={() =>
                          handlePinFocus([loc.longitude, loc.latitude])
                        }
                      />
                    </g>
                  </Marker>
                );
              })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Space Overlay */}
      <SpaceOverlay
        isActive={isSpaceOverlayOpen}
        selectedOperationId={selectedSpaceOperationId ?? null}
        onOperationSelect={handleSpaceOperationClick}
        onClose={handleToggleSpaceOverlay}
        mapWidth={mapWidth}
        mapHeight={mapHeight}
        isMobile={isMobile}
      />

      {/* Search Bar */}
      {!isSpaceOverlayOpen && (

        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 w-[clamp(300px,_calc(100vw_-_2rem),_694px)]">
          <SearchBar
            ref={searchBarRef}
            value={searchQuery}
            onChange={setSearchQuery}
            resultsCount={(searchQuery.trim() || selectedCategory) ? filteredLocations.length : undefined}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      )}

      <div className={`absolute top-24 left-6 z-30 hidden sm:flex sm:flex-col sm:gap-2 transition-opacity duration-300 ${isSpaceOverlayOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {regionMenu}
        {spaceButton}
        <LayerVisibilityControl
          showOperations={showOperations}
          showExercises={showExercises}
          onShowOperationsChange={setShowOperations}
          onShowExercisesChange={setShowExercises}
        />
      </div>

      <div className={`absolute bottom-8 right-8 hidden sm:flex sm:flex-col sm:gap-4 transition-opacity duration-300 ${isSpaceOverlayOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {zoomControls}
      </div>

      <div className={`absolute bottom-6 left-4 right-4 z-30 flex items-end justify-end gap-3 sm:hidden transition-opacity duration-300 ${isSpaceOverlayOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="w-full flex flex-col gap-2">
          {regionMenu}
          {spaceButton}
          <LayerVisibilityControl
            showOperations={showOperations}
            showExercises={showExercises}
            onShowOperationsChange={setShowOperations}
            onShowExercisesChange={setShowExercises}
          />
        </div>
        {zoomControls}
      </div>
    </div>
  );
}
