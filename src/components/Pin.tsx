import { useRef, useEffect } from "react";
import gsap from "gsap";
import { motion } from "@/lib/motion";

interface PinProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

export function Pin({ category, isSelected, onClick }: PinProps) {
  const isNature = category === "nature";
  const color = isNature ? "hsl(var(--accent))" : "hsl(var(--primary))";
  
  const pulseRef = useRef<SVGCircleElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  // Pulse animation - infinite loop
  useEffect(() => {
    if (!pulseRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.to(pulseRef.current, {
        attr: { r: isSelected ? 18 : 12 },
        opacity: 0.2,
        duration: motion.duration.pulse,
        repeat: -1,
        yoyo: true,
        ease: motion.ease.pulse
      });
    });

    return () => ctx.revert();
  }, [isSelected]);

  // Core pin entrance animation
  useEffect(() => {
    if (!coreRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.from(coreRef.current, {
        scale: 0,
        transformOrigin: "center center",
        duration: motion.duration.base,
        ease: motion.ease.elasticOut
      });
    });

    return () => ctx.revert();
  }, []);

  // Hover effect
  const handleMouseEnter = () => {
    if (coreRef.current) {
      gsap.to(coreRef.current, {
        scale: 1.5,
        duration: motion.duration.fast,
        ease: motion.ease.softOut
      });
    }
  };

  const handleMouseLeave = () => {
    if (coreRef.current) {
      gsap.to(coreRef.current, {
        scale: 1,
        duration: motion.duration.fast,
        ease: motion.ease.softOut
      });
    }
  };

  return (
    <g
      ref={groupRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: "pointer" }}
    >
      {/* Pulse effect */}
      <circle
        ref={pulseRef}
        r={isSelected ? 12 : 8}
        fill={color}
        opacity={0.5}
      />
      
      {/* Core pin */}
      <circle
        ref={coreRef}
        r={4}
        fill={color}
        stroke="hsl(var(--background))"
        strokeWidth={1}
        style={{ transformOrigin: "center center" }}
      />
      
    </g>
  );
}
