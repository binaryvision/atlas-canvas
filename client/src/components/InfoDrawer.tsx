import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Tag } from "lucide-react";
import { useLocation } from "@/hooks/use-locations";

interface InfoDrawerProps {
  locationId: number | null;
  onClose: () => void;
}

export function InfoDrawer({ locationId, onClose }: InfoDrawerProps) {
  const { data: location, isLoading } = useLocation(locationId);

  return (
    <AnimatePresence>
      {locationId && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-card/95 backdrop-blur-xl border-l border-white/5 shadow-2xl flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-black/20 hover:bg-white/10 text-white/60 hover:text-white transition-colors z-20"
          >
            <X size={20} />
          </button>

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-pulse flex flex-col gap-4 items-center">
                <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <p className="text-muted-foreground font-display text-lg">Locating...</p>
              </div>
            </div>
          ) : location ? (
            <>
              {/* Hero Image */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card z-10" />
                {location.imageUrl ? (
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10 }}
                    src={location.imageUrl}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center text-white/10">
                    <MapPin size={64} />
                  </div>
                )}
                
                <div className="absolute bottom-6 left-8 z-20">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-widest uppercase mb-3 border border-primary/20">
                      <Tag size={10} />
                      {location.category}
                    </span>
                    <h2 className="text-4xl font-display font-bold text-white leading-tight">
                      {location.name}
                    </h2>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-8 mb-8 text-sm text-muted-foreground font-mono">
                    <div className="flex flex-col gap-1">
                      <span className="uppercase text-[10px] tracking-widest opacity-50">Latitude</span>
                      <span className="text-foreground">{location.latitude.toFixed(4)}° N</span>
                    </div>
                    <div className="w-px h-8 bg-white/5" />
                    <div className="flex flex-col gap-1">
                      <span className="uppercase text-[10px] tracking-widest opacity-50">Longitude</span>
                      <span className="text-foreground">{location.longitude.toFixed(4)}° E</span>
                    </div>
                  </div>

                  <div className="prose prose-invert prose-lg">
                    <p className="text-muted-foreground leading-relaxed font-light text-lg">
                      {location.description}
                    </p>
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5">
                    <button className="w-full py-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 text-foreground transition-all duration-300 font-display text-lg tracking-wide group">
                      <span className="group-hover:text-primary transition-colors">Explore Gallery</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Location not found.</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
