interface PinProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
  onFocus?: () => void;
  title: string;
  variant: "operation" | "exercise";
}

const OPERATION_COLOR = "#cc2b3c";
const OPERATION_STROKE = "#e05a68";
const OPERATION_GLOW = "rgba(204, 43, 60, 0.4)";
const EXERCISE_COLOR = "#0ea5e9";
const EXERCISE_STROKE = "#38bdf8";
const EXERCISE_GLOW = "rgba(14, 165, 233, 0.4)";

export function Pin({
  isSelected,
  onClick,
  onFocus,
  title,
  category,
  variant,
}: PinProps) {
  const size = 10;
  const selectedText = isSelected ? ", currently selected" : "";
  const ariaLabel = `${title}${selectedText}. Press Enter to view details.`;

  const fill = isSelected
    ? "#ffffff"
    : variant === "operation"
      ? OPERATION_COLOR
      : EXERCISE_COLOR;
  const stroke = isSelected
    ? "#ffffff"
    : variant === "operation"
      ? OPERATION_STROKE
      : EXERCISE_STROKE;
  const glow = isSelected
    ? "rgba(255, 255, 255, 0.3)"
    : variant === "operation"
      ? OPERATION_GLOW
      : EXERCISE_GLOW;

  // Triangle pointing up: same visual scale as circle (size ≈ half-height)
  const trianglePoints = `0,${-size} ${-size * 0.866},${size * 0.5} ${size * 0.866},${size * 0.5}`;

  return (
    <g
      onClick={onClick}
      onFocus={onFocus}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      className="cursor-pointer focus:outline-none pin-focusable"
      style={{ pointerEvents: "all" }}
    >
      {/* SVG title element for native tooltip on hover */}
      <title>{title} ({category})</title>
      {/* Larger invisible hit area for touch devices */}
      <circle r={size * 2.5} fill="transparent" />
      {/* Focus ring - visible only when focused via keyboard */}
      <circle
        r={size + 6}
        fill="none"
        stroke="rgba(91, 163, 220, 0.9)"
        strokeWidth={2}
        strokeDasharray="4 2"
        className="pin-focus-ring"
      />
      {variant === "operation" ? (
        <>
          {/* Glow effect */}
          <circle
            r={size}
            fill={glow}
            style={{
              filter: isSelected ? "blur(6px)" : "blur(4px)",
            }}
          />
          {/* Main pin circle */}
          <circle
            r={size}
            fill={fill}
            stroke={stroke}
            strokeWidth={2}
          />
          {/* Inner highlight */}
          <circle
            r={size * 0.4}
            fill={
              isSelected
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(255, 255, 255, 0.3)"
            }
          />
        </>
      ) : (
        <>
          {/* Glow effect (triangle) */}
          <polygon
            points={trianglePoints}
            fill={glow}
            style={{
              filter: isSelected ? "blur(6px)" : "blur(4px)",
            }}
          />
          {/* Main pin triangle */}
          <polygon
            points={trianglePoints}
            fill={fill}
            stroke={stroke}
            strokeWidth={2}
          />
          {/* Inner highlight */}
          <polygon
            points={`0,${-size * 0.5} ${-size * 0.25},${size * 0.15} ${size * 0.25},${size * 0.15}`}
            fill={
              isSelected
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(255, 255, 255, 0.3)"
            }
          />
        </>
      )}
    </g>
  );
}
