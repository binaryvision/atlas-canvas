import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useState, useMemo } from "react";
import { useLocations } from "@/hooks/use-locations";
import { Pin } from "./Pin";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Compass } from "lucide-react";

// Use a simplified world topology
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapControlProps {
  onLocationSelect: (locationId: number) => void;
  selectedLocationId: number | null;
}

export function MapControl({ onLocationSelect, selectedLocationId }: MapControlProps) {
  const { data: locations = [] } = useLocations();
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1.2 });

  // Handle zoom in/out manually
  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  };

  const handleMarkerClick = (id: number, coordinates: [number, number]) => {
    onLocationSelect(id);
    setPosition({
      coordinates,
      zoom: 2.5, // Auto zoom to the pin
    });
  };

  return (
    <div className="relative w-full h-full bg-[#050508] overflow-hidden">
      {/* Aesthetic grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", 
          backgroundSize: "40px 40px" 
        }} 
      />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className="w-full h-full"
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 140 }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
            maxZoom={5}
            minZoom={1}
            translateExtent={[[0, 0], [800, 600]]} // Keep map roughly in view
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#15151a"
                    stroke="#2a2a30"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none", transition: "all 250ms" },
                      hover: { fill: "#1f1f25", outline: "none", stroke: "#3f3f4a" },
                      pressed: { fill: "#1f1f25", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {locations.map((loc) => (
              <Marker 
                key={loc.id} 
                coordinates={[loc.longitude, loc.latitude]}
              >
                <Pin 
                  category={loc.category}
                  isSelected={selectedLocationId === loc.id}
                  onClick={() => handleMarkerClick(loc.id, [loc.longitude, loc.latitude])}
                />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </motion.div>

      {/* Custom Map Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-4">
        <div className="bg-card/80 backdrop-blur-md border border-white/5 rounded-full p-2 flex flex-col gap-2 shadow-2xl shadow-black/50">
          <button 
            onClick={handleZoomIn}
            className="p-3 hover:bg-white/5 rounded-full text-foreground/80 hover:text-primary transition-colors"
          >
            <Plus size={20} />
          </button>
          <div className="h-px w-full bg-white/5" />
          <button 
            onClick={handleZoomOut}
            className="p-3 hover:bg-white/5 rounded-full text-foreground/80 hover:text-primary transition-colors"
          >
            <Minus size={20} />
          </button>
        </div>
      </div>

      {/* Decorative Compass */}
      <div className="absolute top-8 right-8 text-white/10 pointer-events-none">
        <Compass size={64} strokeWidth={1} />
      </div>
      
      {/* Title Watermark */}
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-display text-white/5 font-bold tracking-tighter">
          ATLAS
        </h1>
      </div>
    </div>
  );
}
