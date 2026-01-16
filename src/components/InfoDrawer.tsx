import { useLocation } from "@/hooks/use-locations";
import { motion } from "@/lib/motion";
import gsap from "gsap";
import { MapPin, Radar, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface InfoDrawerProps {
  locationId: number | null;
  onClose: () => void;
}

export function InfoDrawer({ locationId, onClose }: InfoDrawerProps) {
  const [displayedLocationId, setDisplayedLocationId] = useState<number | null>(
    locationId
  );
  const [isOpen, setIsOpen] = useState(Boolean(locationId));
  const location = useLocation(displayedLocationId);

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);

  const animatePanelIn = () => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { x: 80, opacity: 0, scale: 0.98 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: motion.duration.slow,
        ease: motion.ease.out,
      }
    );
  };

  const animatePanelOut = (onComplete?: () => void) => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      x: 80,
      opacity: 0,
      scale: 0.98,
      duration: motion.duration.base,
      ease: motion.ease.in,
      onComplete,
    });
  };

  const animateContentOut = (onComplete?: () => void) => {
    if (!contentRef.current) return onComplete?.();
    gsap.to(contentRef.current, {
      y: 10,
      opacity: 0,
      duration: motion.duration.fast,
      ease: motion.ease.softIn,
      onComplete,
    });
  };

  const animateContentIn = () => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { y: 10, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: motion.duration.base,
        ease: motion.ease.softOut,
      }
    );
  };

  useEffect(() => {
    if (!panelRef.current) return;
    const ctx = gsap.context(() => {
      if (locationId) {
        if (!isOpen) {
          setIsOpen(true);
          animatePanelIn();
        }

        if (!displayedLocationId) {
          setDisplayedLocationId(locationId);
          return;
        }

        if (locationId !== displayedLocationId) {
          animateContentOut(() => setDisplayedLocationId(locationId));
        }
      } else if (displayedLocationId) {
        animateContentOut(() => {
          animatePanelOut(() => {
            setDisplayedLocationId(null);
            setIsOpen(false);
          });
        });
      }
    }, panelRef);

    return () => ctx.revert();
  }, [locationId, displayedLocationId, isOpen]);

  useEffect(() => {
    if (!location || !contentRef.current) return;
    const ctx = gsap.context(() => {
      animateContentIn();
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.08 },
          { scale: 1, duration: motion.duration.kenBurns, ease: "none" }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, [location]);

  useEffect(() => {
    if (!radarRef.current || !isOpen) return;
    const ctx = gsap.context(() => {
      gsap.to(radarRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 10,
        ease: "none",
      });
    }, radarRef);

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <div
      ref={panelRef}
      className={`fixed left-4 right-4 top-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-[480px] sm:left-auto sm:right-6 sm:top-24 sm:bottom-6 sm:w-[360px] sm:translate-y-0 transition-opacity ${
        isOpen
          ? "pointer-events-auto opacity-100 translate-x-0"
          : "pointer-events-none opacity-0 translate-x-8"
      }`}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0d0d16] via-[#0b0b14] to-[#0a0a12] border border-white/10 shadow-2xl" />
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-70 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
            <Radar size={14} />
            Field Brief
          </div>
          <button
            onClick={onClose}
            aria-label="Close info panel"
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {!location ? (
          <div className="flex-1 flex items-center justify-center text-white/50 text-sm">
            Select a pin to begin exploring.
          </div>
        ) : (
          <div ref={contentRef} className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary/70 mb-2">
                  {location.category}
                </p>
                <h2 className="text-3xl font-display font-semibold text-white leading-tight">
                  {location.name}
                </h2>
              </div>

              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute inset-3 rounded-full border border-white/10" />
                <div className="absolute inset-[18px] rounded-full border border-white/10" />
                <div ref={radarRef} className="absolute inset-0 origin-center">
                  <div className="absolute left-1/2 top-1/2 h-1/2 w-px -translate-x-1/2 bg-primary/70 shadow-[0_0_12px_rgba(91,255,190,0.7)]" />
                </div>
                <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_rgba(91,255,190,0.8)]" />
              </div>
            </div>

            <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10">
              {location.imageUrl ? (
                <img
                  ref={imageRef}
                  src={location.imageUrl}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                  <MapPin size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-transparent to-transparent" />
            </div>

            <p className="text-sm text-white/60 leading-relaxed">
              {location.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs text-white/60">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="uppercase tracking-[0.3em] text-[10px] text-white/40 mb-1">
                  Latitude
                </div>
                <div className="text-white/80 font-mono">
                  {location.latitude.toFixed(4)}° N
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <div className="uppercase tracking-[0.3em] text-[10px] text-white/40 mb-1">
                  Longitude
                </div>
                <div className="text-white/80 font-mono">
                  {location.longitude.toFixed(4)}° E
                </div>
              </div>
            </div>

            <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm uppercase tracking-[0.3em] text-white/70 hover:bg-white/10 hover:text-white transition-colors">
              Open Operation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
