interface LayerVisibilityControlProps {
  showOperations: boolean;
  showExercises: boolean;
  onShowOperationsChange: (visible: boolean) => void;
  onShowExercisesChange: (visible: boolean) => void;
}

const OPERATION_COLOR = "#cc2b3c";
const OPERATION_STROKE = "#e05a68";
const EXERCISE_COLOR = "#0ea5e9";
const EXERCISE_STROKE = "#38bdf8";

export function LayerVisibilityControl({
  showOperations,
  showExercises,
  onShowOperationsChange,
  onShowExercisesChange,
}: LayerVisibilityControlProps) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">
        Map layers
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onShowOperationsChange(!showOperations)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
            transition-all duration-200 border
            ${showOperations
              ? "bg-primary/30 text-white border-primary/50"
              : "bg-[#141e2d]/60 text-white/50 border-primary/20 hover:bg-[#1c2a3d]/80 hover:border-primary/30"
            }
          `}
          aria-pressed={showOperations}
          aria-label={showOperations ? "Hide Operations on map" : "Show Operations on map"}
        >
          <svg width={14} height={14} viewBox="-12 -12 24 24" className="shrink-0" aria-hidden>
            <circle
              r={10}
              fill={showOperations ? OPERATION_COLOR : "currentColor"}
              stroke={showOperations ? OPERATION_STROKE : "currentColor"}
              strokeWidth={2}
            />
          </svg>
          Operations
        </button>
        <button
          type="button"
          onClick={() => onShowExercisesChange(!showExercises)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
            transition-all duration-200 border
            ${showExercises
              ? "bg-primary/30 text-white border-primary/50"
              : "bg-[#141e2d]/60 text-white/50 border-primary/20 hover:bg-[#1c2a3d]/80 hover:border-primary/30"
            }
          `}
          aria-pressed={showExercises}
          aria-label={showExercises ? "Hide Exercises on map" : "Show Exercises on map"}
        >
          <svg width={14} height={14} viewBox="-12 -12 24 24" className="shrink-0" aria-hidden>
            <polygon
              points="0,-10 -8.66,5 8.66,5"
              fill={showExercises ? EXERCISE_COLOR : "currentColor"}
              stroke={showExercises ? EXERCISE_STROKE : "currentColor"}
              strokeWidth={2}
            />
          </svg>
          Exercises
        </button>
      </div>
    </div>
  );
}
