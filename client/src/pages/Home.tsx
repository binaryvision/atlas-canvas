import { useState } from "react";
import { MapControl } from "@/components/MapControl";
import { InfoDrawer } from "@/components/InfoDrawer";
import { motion } from "framer-motion";

export default function Home() {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  return (
    <div className="relative w-screen h-screen bg-background overflow-hidden flex">
      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <MapControl 
          onLocationSelect={setSelectedLocationId}
          selectedLocationId={selectedLocationId}
        />
      </div>

      {/* Info Drawer - Overlays on small screens, pushes content or overlays on large */}
      <InfoDrawer 
        locationId={selectedLocationId} 
        onClose={() => setSelectedLocationId(null)} 
      />
      
      {/* Header Overlay */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-start z-40"
      >
        <div className="pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1 pl-1">Interactive</span>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">World Explorer</h1>
          </div>
        </div>
        
        <div className="pointer-events-auto">
          <button className="px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 text-xs uppercase tracking-widest text-muted-foreground hover:bg-white/10 hover:text-white transition-colors">
            Menu
          </button>
        </div>
      </motion.div>

      {/* Footer Status Overlay */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none flex justify-between items-end z-30"
      >
        <div className="text-[10px] text-white/20 font-mono">
          COORD: {selectedLocationId ? "LOCKED" : "SCANNING"} <br/>
          SYS: ONLINE
        </div>
      </motion.div>
    </div>
  );
}
