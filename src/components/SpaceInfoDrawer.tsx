import { useSpaceOperation } from "@/hooks/use-locations";
import { motion } from "@/lib/motion";
import gsap from "gsap";
import { Satellite, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { OperationModal } from "./OperationModal";

interface SpaceInfoDrawerProps {
  operationId: number | null;
  onClose: () => void;
}

export function SpaceInfoDrawer({ operationId, onClose }: SpaceInfoDrawerProps) {
  const [displayedOperationId, setDisplayedOperationId] = useState<number | null>(
    operationId
  );
  const [isOpen, setIsOpen] = useState(Boolean(operationId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSourceRect, setModalSourceRect] = useState<DOMRect | null>(null);
  const operation = useSpaceOperation(displayedOperationId);

  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenOperation = useCallback(() => {
    if (panelRef.current) {
      setModalSourceRect(panelRef.current.getBoundingClientRect());
    }
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
      if (operationId) {
        if (!isOpen) {
          setIsOpen(true);
          animatePanelIn();
        }

        if (!displayedOperationId) {
          setDisplayedOperationId(operationId);
          return;
        }

        if (operationId !== displayedOperationId) {
          animateContentOut(() => setDisplayedOperationId(operationId));
        }
      } else if (displayedOperationId) {
        animateContentOut(() => {
          animatePanelOut(() => {
            setDisplayedOperationId(null);
            setIsOpen(false);
          });
        });
      }
    }, panelRef);

    return () => ctx.revert();
  }, [operationId, displayedOperationId, isOpen]);

  useEffect(() => {
    if (!operation || !contentRef.current) return;
    const ctx = gsap.context(() => {
      animateContentIn();
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.08 },
          { scale: 1, duration: motion.duration.kenBurns, ease: "power2.out" }
        );
      }
    }, contentRef);

    return () => ctx.revert();
  }, [operation]);

  useEffect(() => {
    if (!orbitRef.current || !isOpen) return;
    const ctx = gsap.context(() => {
      gsap.to(orbitRef.current, {
        rotation: 360,
        repeat: -1,
        duration: 20,
        ease: "none",
      });
    }, orbitRef);

    return () => ctx.revert();
  }, [isOpen]);

  const categoryColors: Record<string, string> = {
    reconnaissance: "text-blue-400",
    communications: "text-green-400",
    intelligence: "text-amber-400",
    navigation: "text-violet-400",
    research: "text-cyan-400",
    defense: "text-red-400",
  };

  const categoryColor = operation ? categoryColors[operation.category] || "text-primary" : "text-primary";

  return (
    <div
      ref={panelRef}
      className={`fixed inset-4 sm:top-1/2 sm:-translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-[480px] sm:left-auto sm:right-6 sm:top-24 sm:bottom-auto sm:w-[360px] sm:translate-y-0 transition-opacity ${
        isOpen
          ? "pointer-events-auto opacity-100 translate-x-0"
          : "pointer-events-none opacity-0 translate-x-8"
      }`}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#141e2d] via-[#111a28] to-[#0e1621] border border-primary/30 shadow-2xl" />
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-80 pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary font-medium">
            <Satellite size={14} />
            Space Operations
          </div>
          <button
            onClick={onClose}
            aria-label="Close info panel"
            className="p-2 rounded-full bg-white/10 hover:bg-accent/20 text-white/80 hover:text-white transition-colors border border-white/10 hover:border-accent/40"
          >
            <X size={18} />
          </button>
        </div>

        {!operation ? (
          <div className="flex-1 flex items-center justify-center text-white/60 text-sm">
            Select a satellite to view details.
          </div>
        ) : (
          <div ref={contentRef} className="flex flex-col gap-6">
            <div className="flex gap-2 items-center justify-between">
              <div>
                <p className={`text-[10px] uppercase tracking-[0.3em] font-semibold mb-2 ${categoryColor}`}>
                  {operation.category}
                </p>
                <h2 className="text-3xl font-display font-semibold text-white leading-tight">
                  {operation.name}
                </h2>
              </div>
              <OrbitIndicator orbitRef={orbitRef} />
            </div>

            <div className="relative h-40 overflow-hidden rounded-2xl border border-primary/30">
              {operation.imageUrl ? (
                <img
                  ref={imageRef}
                  src={operation.imageUrl}
                  alt={operation.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary/40">
                  <Satellite size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1621] via-transparent to-transparent" />
            </div>

            <p className="text-sm text-white/75 leading-relaxed">
              {operation.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2">
                <div className="uppercase tracking-[0.3em] text-[10px] text-primary/80 mb-1">
                  Orbit Type
                </div>
                <div className="text-white font-mono">
                  {operation.orbitType}
                </div>
              </div>
              <div className="rounded-xl border border-primary/25 bg-primary/10 px-3 py-2">
                <div className="uppercase tracking-[0.3em] text-[10px] text-primary/80 mb-1">
                  Altitude
                </div>
                <div className="text-white font-mono">
                  {operation.altitude}
                </div>
              </div>
            </div>

            {operation.expandedContent ? (
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

      {/* Operation Modal */}
      {operation?.expandedContent && (
        <OperationModal
          location={{
            id: operation.id,
            name: operation.name,
            description: operation.description,
            latitude: 0,
            longitude: 0,
            category: operation.category,
            imageUrl: operation.imageUrl,
            expandedContent: operation.expandedContent,
          }}
          content={operation.expandedContent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          sourceRect={modalSourceRect}
        />
      )}
    </div>
  );
}

function OrbitIndicator({ orbitRef }: { orbitRef: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="relative size-20 min-w-20 min-h-20">
      {/* Outer orbit ring */}
      <div className="absolute inset-0 rounded-full border border-primary/30" />
      {/* Middle orbit ring */}
      <div className="absolute inset-3 rounded-full border border-primary/25" />
      {/* Inner orbit ring */}
      <div className="absolute inset-[18px] rounded-full border border-primary/20" />
      {/* Rotating satellite indicator */}
      <div ref={orbitRef} className="absolute inset-0 origin-center">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        </div>
      </div>
      {/* Earth center */}
      <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
    </div>
  );
}
