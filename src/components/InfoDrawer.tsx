import { useLocation } from "@/hooks/use-locations";
import { motion } from "@/lib/motion";
import { FocusTrap } from "focus-trap-react";
import gsap from "gsap";
import { MapPin, Radar as RadarIcon, X } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { OperationModal } from "./OperationModal";

interface InfoDrawerProps {
  locationId: number | null;
  onClose: () => void;
}

export interface InfoDrawerHandle {
  focus: () => void;
  storeTriggerElement: () => void;
}

export const InfoDrawer = forwardRef<InfoDrawerHandle, InfoDrawerProps>(
  function InfoDrawer({ locationId, onClose }, ref) {
    const [displayedLocationId, setDisplayedLocationId] = useState<
      number | null
    >(locationId);
    const [isOpen, setIsOpen] = useState(Boolean(locationId));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation(displayedLocationId);

    const panelRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const radarRef = useRef<HTMLDivElement>(null);
    const openButtonRef = useRef<HTMLButtonElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Track the element that was focused before the drawer opened (the pin)
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);

    // Store the element that triggered the drawer open (called immediately on selection)
    const storeTriggerElement = useCallback(() => {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
    }, []);

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      focus: () => {
        // Focus the close button as the first interactive element
        closeButtonRef.current?.focus();
      },
      storeTriggerElement,
    }));

    const handleOpenOperation = useCallback(() => {
      setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
      setIsModalOpen(false);
    }, []);

    // Set initial hidden state before first paint to prevent flash
    useLayoutEffect(() => {
      if (panelRef.current && !locationId) {
        gsap.set(panelRef.current, { x: 80, opacity: 0, scale: 0.98 });
      }
    }, []);

    const animatePanelIn = () => {
      if (!panelRef.current) return;
      // Kill any existing animations on the panel first
      gsap.killTweensOf(panelRef.current);
      gsap.fromTo(
        panelRef.current,
        { x: 80, opacity: 0, scale: 0.98 },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: motion.duration.slow,
          ease: motion.ease.out,
        },
      );
    };

    const animatePanelOut = (onComplete?: () => void) => {
      if (!panelRef.current) return;
      // Kill any existing animations on the panel first
      gsap.killTweensOf(panelRef.current);
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
        },
      );
    };

    // Track if we're in the middle of closing to prevent cleanup from reverting animations
    const isClosingRef = useRef(false);

    useEffect(() => {
      if (!panelRef.current) return;

      // Don't create a context that will revert our closing animation
      if (isClosingRef.current) return;

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
        isClosingRef.current = true;
        animateContentOut(() => {
          animatePanelOut(() => {
            setDisplayedLocationId(null);
            setIsOpen(false);
            isClosingRef.current = false;
          });
        });
      }
    }, [locationId, displayedLocationId, isOpen]);

    useEffect(() => {
      if (!location || !contentRef.current) return;
      const ctx = gsap.context(() => {
        animateContentIn();
        if (imageRef.current) {
          gsap.fromTo(
            imageRef.current,
            { scale: 1.08 },
            {
              scale: 1,
              duration: motion.duration.kenBurns,
              ease: "power2.out",
            },
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
      <FocusTrap
        active={isOpen}
        focusTrapOptions={{
          escapeDeactivates: false,
          clickOutsideDeactivates: true,
          allowOutsideClick: true,
          returnFocusOnDeactivate: false,
          onDeactivate: () => {
            // Restore focus to the element that opened the drawer (the pin)
            setTimeout(() => {
              previouslyFocusedRef.current?.focus();
              previouslyFocusedRef.current = null;
            }, 0);
          },
        }}
      >
        <div
          className={`fixed inset-0 z-50 ${
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <button
            type="button"
            aria-label="Close info panel"
            onClick={onClose}
            className={`absolute inset-0 bg-[#0b111a]/55 backdrop-blur-[2px] transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={
              location ? `Details for ${location.name}` : "Operation Details"
            }
            className="fixed inset-4 w-[calc(100%-2rem)] max-w-[480px] sm:left-auto sm:right-6 sm:top-24 sm:bottom-auto sm:w-[360px]"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                onClose();
              }
            }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#141e2d] via-[#111a28] to-[#0e1621] border border-primary/30 shadow-2xl" />
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-80 pointer-events-none" />

            <div className="md:max-h-[80dvh] overflow-y-auto relative z-10 h-full flex flex-col gap-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary font-medium">
                  <RadarIcon size={14} />
                  Operation Details
                </div>
                <button
                  ref={closeButtonRef}
                  onClick={onClose}
                  aria-label="Close info panel"
                  className="p-2 rounded-full bg-white/10 hover:bg-accent/20 text-white/80 hover:text-white transition-colors border border-white/10 hover:border-accent/40"
                >
                  <X size={18} />
                </button>
              </div>

              {!location ? (
                <div className="flex-1 flex items-center justify-center text-white/60 text-sm">
                  Select a pin to begin exploring.
                </div>
              ) : (
                <div ref={contentRef} className="flex flex-col gap-6">
                  <div className="flex gap-2 items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-semibold mb-2">
                        {location.category}
                      </p>
                      <h2 className="text-3xl font-display font-semibold text-white leading-tight">
                        {location.name}
                      </h2>
                    </div>
                    <Radar radarRef={radarRef} />
                  </div>

                  <div className="relative h-40 overflow-hidden rounded-2xl border border-primary/30">
                    {location.imageUrl ? (
                      <img
                        ref={imageRef}
                        src={location.imageUrl}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/40">
                        <MapPin size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e1621] via-transparent to-transparent" />
                  </div>

                  <p className="text-sm text-white/75 leading-relaxed">
                    {location.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2">
                      <div className="uppercase tracking-[0.3em] text-[10px] text-primary/80 mb-1">
                        Latitude
                      </div>
                      <div className="text-white font-mono">
                        {location.latitude.toFixed(4)}° N
                      </div>
                    </div>
                    <div className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2">
                      <div className="uppercase tracking-[0.3em] text-[10px] text-primary/80 mb-1">
                        Longitude
                      </div>
                      <div className="text-white font-mono">
                        {location.longitude.toFixed(4)}° E
                      </div>
                    </div>
                  </div>

                  {location.expandedContent ? (
                    <button
                      ref={openButtonRef}
                      onClick={handleOpenOperation}
                      className="w-full rounded-xl border border-accent/40 bg-accent/15 py-3 text-sm uppercase tracking-[0.3em] text-white font-medium hover:bg-accent/25 hover:border-accent/60 transition-colors"
                    >
                      Open Operation
                    </button>
                  ) : (
                    <button className="w-full rounded-xl border border-primary/40 bg-primary/15 py-3 text-sm uppercase tracking-[0.3em] text-white font-medium hover:bg-primary/25 hover:border-primary/60 transition-colors">
                      Open Operation
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Operation Modal */}
          {location?.expandedContent && (
            <OperationModal
              location={location}
              content={location.expandedContent}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
            />
          )}
        </div>
      </FocusTrap>
    );
  },
);

function Radar({ radarRef }: { radarRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="relative size-20 min-w-20 min-h-20">
      <div className="absolute inset-0 rounded-full border border-primary/40" />
      <div className="absolute inset-3 rounded-full border border-primary/30" />
      <div className="absolute inset-[18px] rounded-full border border-primary/25" />
      <div ref={radarRef} className="absolute inset-0 origin-center">
        <div className="absolute left-1/2 top-1/2 h-1/2 w-px -translate-x-1/2 bg-accent shadow-[0_0_12px_rgba(204,43,60,0.8)]" />
      </div>
      <div className="absolute left-1/2 top-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_rgba(204,43,60,0.9)]" />
    </div>
  );
}
