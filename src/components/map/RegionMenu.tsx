import { ChevronDown, ChevronUp } from "lucide-react";

type Region = {
  id: string;
  label: string;
  coordinates: [number, number];
  zoom: number;
};

interface RegionMenuProps {
  regions: Region[];
  activeRegionId: string;
  isOpen: boolean;
  isMobile: boolean;
  onToggle: () => void;
  onSelect: (region: Region) => void;
}

export function RegionMenu({
  regions,
  activeRegionId,
  isOpen,
  isMobile,
  onToggle,
  onSelect,
}: RegionMenuProps) {
  return (
    <div className="bg-[#141e2d]/95 backdrop-blur-md border border-primary/30 rounded-2xl p-3 shadow-2xl shadow-black/50 w-full sm:w-auto">
      <div className={isMobile ? "flex flex-col-reverse" : "flex flex-col"}>
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-primary font-medium px-2`}
          aria-expanded={isOpen}
          aria-label="Toggle regions menu"
        >
          Regions
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
          }`}
          
          {...{ inert: !isOpen ? 'true' : undefined }}
        >
          <div className={`flex flex-col gap-2 ${isMobile ? "pb-2" : "pt-4"}`}>
          {regions.map((region) => (
            <button
              key={region.id}
              onClick={() => onSelect(region)}
              className={`px-3 py-2 rounded-xl text-xs uppercase tracking-[0.25em] transition-colors border font-medium ${
                activeRegionId === region.id
                  ? "bg-primary/25 border-primary/60 text-white"
                  : "bg-white/5 border-primary/20 text-white/70 hover:text-white hover:bg-primary/15 hover:border-primary/40"
              }`}
            >
              {region.label}
            </button>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

