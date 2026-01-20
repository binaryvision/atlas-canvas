import { useSpaceOperations } from "@/hooks/use-locations";
import { motion } from "@/lib/motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useMemo } from "react";
import type { SpaceOperation } from "@shared/data";

interface SpaceViewProps {
  isActive: boolean;
  selectedOperationId: number | null;
  onOperationSelect: (id: number) => void;
  mapWidth: number;
  mapHeight: number;
  isMobile: boolean;
}

interface OrbitRingProps {
  operations: SpaceOperation[];
  radius: number;
  label: string;
  centerX: number;
  centerY: number;
  selectedId: number | null;
  onSelect: (id: number) => void;
  delay: number;
  isMobile: boolean;
  arcStart?: number;
  arcEnd?: number;
}

function OrbitRing({
  operations,
  radius,
  label,
  centerX,
  centerY,
  selectedId,
  onSelect,
  delay,
  isMobile,
  arcStart = 0,
  arcEnd = Math.PI * 2,
}: OrbitRingProps) {
  const ringRef = useRef<SVGGElement>(null);
  const labelRef = useRef<SVGTextElement>(null);

  useGSAP(() => {
    if (!ringRef.current) return;
    
    gsap.fromTo(
      ringRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: motion.duration.slow,
        ease: motion.ease.out,
        delay,
      }
    );
  }, [delay]);

  // For mobile, distribute pins only on the visible arc (right side)
  const arcRange = arcEnd - arcStart;
  const angleStep = arcRange / Math.max(operations.length + 1, 2);
  
  // Create arc path for partial circles on mobile
  const createArcPath = (cx: number, cy: number, r: number, start: number, end: number) => {
    const startX = cx + r * Math.cos(start);
    const startY = cy + r * Math.sin(start);
    const endX = cx + r * Math.cos(end);
    const endY = cy + r * Math.sin(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  return (
    <g ref={ringRef} opacity={0}>
      {/* Orbit path - full circle on desktop, arc on mobile */}
      {isMobile ? (
        <path
          d={createArcPath(centerX, centerY, radius, arcStart, arcEnd)}
          fill="none"
          stroke="rgba(91, 163, 220, 0.15)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      ) : (
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="rgba(91, 163, 220, 0.15)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
      )}
      
      {/* Orbit label - positioned at top of arc */}
      <text
        ref={labelRef}
        x={isMobile ? centerX + radius * Math.cos(-Math.PI * 0.35) : centerX + radius + 8}
        y={isMobile ? centerY + radius * Math.sin(-Math.PI * 0.35) - 8 : centerY}
        fill="rgba(91, 163, 220, 0.5)"
        fontSize={isMobile ? 9 : 10}
        fontFamily="var(--font-body)"
        textAnchor={isMobile ? "middle" : "start"}
        dominantBaseline="middle"
        className="uppercase tracking-widest"
      >
        {label}
      </text>

      {/* Operation pins */}
      {operations.map((op, index) => {
        const angle = arcStart + angleStep * (index + 1);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const isSelected = selectedId === op.id;

        return (
          <SpacePin
            key={op.id}
            x={x}
            y={y}
            operation={op}
            isSelected={isSelected}
            onClick={() => onSelect(op.id)}
            delay={delay + 0.1 + index * 0.05}
          />
        );
      })}
    </g>
  );
}

interface SpacePinProps {
  x: number;
  y: number;
  operation: SpaceOperation;
  isSelected: boolean;
  onClick: () => void;
  delay: number;
}

function SpacePin({ x, y, operation, isSelected, onClick, delay }: SpacePinProps) {
  const pinRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    if (!pinRef.current) return;
    
    gsap.fromTo(
      pinRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: motion.duration.base,
        ease: motion.ease.out,
        delay,
      }
    );
  }, [delay]);

  const size = 8;
  const categoryColors: Record<string, { fill: string; glow: string }> = {
    reconnaissance: { fill: "#5ba3dc", glow: "rgba(91, 163, 220, 0.6)" },
    communications: { fill: "#4ade80", glow: "rgba(74, 222, 128, 0.6)" },
    intelligence: { fill: "#f59e0b", glow: "rgba(245, 158, 11, 0.6)" },
    navigation: { fill: "#8b5cf6", glow: "rgba(139, 92, 246, 0.6)" },
    research: { fill: "#06b6d4", glow: "rgba(6, 182, 212, 0.6)" },
    defense: { fill: "#cc2b3c", glow: "rgba(204, 43, 60, 0.6)" },
  };

  const colors = categoryColors[operation.category] || categoryColors.reconnaissance;

  return (
    <g
      ref={pinRef}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={operation.name}
      className="cursor-pointer"
      style={{ pointerEvents: "all" }}
    >
      {/* Hit area */}
      <circle cx={x} cy={y} r={size * 3} fill="transparent" />
      
      {/* Glow */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={isSelected ? "rgba(255, 255, 255, 0.4)" : colors.glow}
        style={{ filter: "blur(4px)" }}
      />
      
      {/* Main pin */}
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={isSelected ? "#ffffff" : colors.fill}
        stroke={isSelected ? "#ffffff" : colors.fill}
        strokeWidth={2}
      />
      
      {/* Inner highlight */}
      <circle
        cx={x}
        cy={y}
        r={size * 0.4}
        fill={isSelected ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)"}
      />

      {/* Label on hover/select - positioned above the pin */}
      {isSelected && (
        <g>
          <rect
            x={x - (operation.name.length * 7 + 16) / 2}
            y={y - size - 28}
            width={operation.name.length * 7 + 16}
            height={20}
            rx={4}
            fill="rgba(20, 30, 45, 0.95)"
            stroke="rgba(91, 163, 220, 0.4)"
            strokeWidth={1}
          />
          <text
            x={x}
            y={y - size - 17}
            fill="#ffffff"
            fontSize={11}
            fontFamily="var(--font-body)"
            fontWeight={500}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {operation.name}
          </text>
        </g>
      )}
    </g>
  );
}

export function SpaceView({
  isActive,
  selectedOperationId,
  onOperationSelect,
  mapWidth,
  mapHeight,
  isMobile,
}: SpaceViewProps) {
  const containerRef = useRef<SVGGElement>(null);
  const spaceOperations = useSpaceOperations();

  // Padding from viewport edges
  const padding = isMobile ? 40 : 60;
  
  // On mobile, Earth is positioned off the left edge
  // On desktop, Earth is centered with padding considered
  const centerX = isMobile 
    ? -mapWidth * 0.15  // Earth mostly off-screen to the left
    : mapWidth / 2;
  const centerY = mapHeight / 2;
  
  // Calculate max available radius based on viewport and padding
  const maxAvailableRadius = isMobile
    ? mapWidth - padding - 20  // Account for pins extending beyond ring
    : Math.min(mapWidth, mapHeight) / 2 - padding - 20;
  
  // Base radius for Earth - smaller on mobile since it's partially hidden
  const earthRadius = isMobile 
    ? mapHeight * 0.25
    : Math.min(mapWidth, mapHeight) * 0.12;
  
  // Calculate ring radii to fit within available space
  const ringSpacing = isMobile
    ? (maxAvailableRadius - earthRadius) / 5.5
    : (maxAvailableRadius - earthRadius * 1.2) / 5.5;

  // Group operations by orbit type
  const operationsByOrbit = useMemo(() => {
    const groups: Record<string, SpaceOperation[]> = {
      LEO: [],
      MEO: [],
      GEO: [],
      HEO: [],
      Lunar: [],
      "Deep Space": [],
    };
    
    spaceOperations.forEach((op) => {
      if (groups[op.orbitType]) {
        groups[op.orbitType].push(op);
      }
    });
    
    return groups;
  }, [spaceOperations]);

  // Define orbit rings with their radii - scaled to fit with padding
  const orbitRings = useMemo(() => {
    const baseOffset = earthRadius * 1.2;
    return [
      { type: "LEO", label: "LEO", radius: baseOffset + ringSpacing * 1, operations: operationsByOrbit.LEO },
      { type: "MEO", label: "MEO", radius: baseOffset + ringSpacing * 2, operations: operationsByOrbit.MEO },
      { type: "GEO", label: "GEO", radius: baseOffset + ringSpacing * 3, operations: operationsByOrbit.GEO },
      { type: "HEO", label: "HEO", radius: baseOffset + ringSpacing * 4, operations: operationsByOrbit.HEO },
      { type: "Lunar", label: "LUNAR", radius: baseOffset + ringSpacing * 5, operations: operationsByOrbit.Lunar },
    ].filter(ring => ring.operations.length > 0);
  }, [earthRadius, ringSpacing, operationsByOrbit]);

  // On mobile, only show the right half of the orbits (visible arc)
  // Arc from -80deg to +80deg (roughly the visible portion)
  const arcStart = isMobile ? -Math.PI * 0.45 : 0;
  const arcEnd = isMobile ? Math.PI * 0.45 : Math.PI * 2;

  useGSAP(() => {
    if (!containerRef.current || !isActive) return;
    
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: motion.duration.base,
        ease: motion.ease.out,
      }
    );
  }, [isActive]);

  // Generate stable stars (memoized to prevent re-render flicker)
  const stars = useMemo(() => {
    const seed = 12345;
    const seededRandom = (i: number) => {
      const x = Math.sin(seed + i * 9999) * 10000;
      return x - Math.floor(x);
    };
    
    return Array.from({ length: 80 }).map((_, i) => ({
      x: seededRandom(i * 3) * mapWidth,
      y: seededRandom(i * 3 + 1) * mapHeight,
      size: seededRandom(i * 3 + 2) * 1.5 + 0.5,
      opacity: seededRandom(i * 3 + 3) * 0.4 + 0.1,
    }));
  }, [mapWidth, mapHeight]);

  if (!isActive) return null;

  return (
    <g ref={containerRef}>
      {/* Defs for gradients */}
      <defs>
        <radialGradient id="earthGradient" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#2d5a87" />
          <stop offset="50%" stopColor="#1a3a5c" />
          <stop offset="100%" stopColor="#0e2240" />
        </radialGradient>
        <radialGradient id="earthGlow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(91, 163, 220, 0.4)" />
          <stop offset="70%" stopColor="rgba(91, 163, 220, 0.1)" />
          <stop offset="100%" stopColor="rgba(91, 163, 220, 0)" />
        </radialGradient>
        {/* Vignette gradient for edges */}
        <radialGradient id="spaceVignette" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(10, 18, 30, 0)" />
          <stop offset="60%" stopColor="rgba(10, 18, 30, 0)" />
          <stop offset="85%" stopColor="rgba(10, 18, 30, 0.4)" />
          <stop offset="100%" stopColor="rgba(10, 18, 30, 0.9)" />
        </radialGradient>
      </defs>

      {/* Stars background effect - rendered first (behind everything) */}
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={star.x}
          cy={star.y}
          r={star.size}
          fill={`rgba(255, 255, 255, ${star.opacity})`}
        />
      ))}
      
      {/* Earth glow */}
      <circle
        cx={centerX}
        cy={centerY}
        r={earthRadius * 1.8}
        fill="url(#earthGlow)"
      />
      
      {/* Earth */}
      <circle
        cx={centerX}
        cy={centerY}
        r={earthRadius}
        fill="url(#earthGradient)"
        stroke="rgba(91, 163, 220, 0.4)"
        strokeWidth={1.5}
      />
      
      {/* Earth atmosphere rim */}
      <circle
        cx={centerX}
        cy={centerY}
        r={earthRadius + 3}
        fill="none"
        stroke="rgba(91, 163, 220, 0.2)"
        strokeWidth={6}
        style={{ filter: "blur(3px)" }}
      />
      
      {/* Earth label - only on desktop */}
      {!isMobile && (
        <text
          x={centerX}
          y={centerY + earthRadius + 24}
          fill="rgba(255, 255, 255, 0.5)"
          fontSize={10}
          fontFamily="var(--font-body)"
          textAnchor="middle"
          className="uppercase tracking-widest"
        >
          Earth
        </text>
      )}

      {/* Orbit rings with operations */}
      {orbitRings.map((ring, index) => (
        <OrbitRing
          key={ring.type}
          operations={ring.operations}
          radius={ring.radius}
          label={ring.label}
          centerX={centerX}
          centerY={centerY}
          selectedId={selectedOperationId}
          onSelect={onOperationSelect}
          delay={0.1 + index * 0.1}
          isMobile={isMobile}
          arcStart={arcStart}
          arcEnd={arcEnd}
        />
      ))}

      {/* Edge vignette overlay */}
      <rect
        x={0}
        y={0}
        width={mapWidth}
        height={mapHeight}
        fill="url(#spaceVignette)"
        pointerEvents="none"
      />
    </g>
  );
}
