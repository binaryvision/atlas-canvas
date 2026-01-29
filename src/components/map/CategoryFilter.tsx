interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelectCategory(isSelected ? null : category)}
            className={`
              px-3 py-2 rounded-lg text-xs font-medium text-left
              whitespace-nowrap text-left leading-tight
              transition-all duration-200
              ${isSelected
                ? "bg-primary/30 text-white border border-primary/50"
                : "bg-[#141e2d]/60 text-white/70 border border-primary/20 hover:bg-[#1c2a3d]/80 hover:border-primary/30"
              }
            `}
            aria-pressed={isSelected}
            aria-label={`Filter by ${category}`}
          >
            {category}
          </button>
        );
      })}
      {selectedCategory && (
        <button
          onClick={() => onSelectCategory(null)}
          className="px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Clear filter"
        >
          Clear
        </button>
      )}
    </div>
  );
}
