import { motion } from "framer-motion";

interface PinProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

export function Pin({ category, isSelected, onClick }: PinProps) {
  const isNature = category === "nature";
  const color = isNature ? "hsl(var(--accent))" : "hsl(var(--primary))";

  return (
    <g
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {/* Pulse effect */}
      <motion.circle
        r={isSelected ? 12 : 8}
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: [0.2, 0.5, 0.2], 
          scale: [1, 1.5, 1] 
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Core pin */}
      <motion.circle
        r={4}
        fill={color}
        stroke="hsl(var(--background))"
        strokeWidth={1}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      
      {/* Floating line for aesthetic */}
      <motion.line
        x1={0} y1={0} x2={0} y2={-20}
        stroke={color}
        strokeWidth={0.5}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Label circle at top of line */}
      <motion.circle
        cx={0} cy={-20} r={2}
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: isSelected ? 1 : 0 }}
        transition={{ delay: 0.2 }}
      />
    </g>
  );
}
