export default function FilterSidebar({
  categories = [],
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  sort,
  sortOptions = [],
  onSortChange,
  onClear,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sticky top-24">
      <h2 className="text-xl font-semibold text-white mb-5">Filters</h2>

      <div className="mb-5">
        <label className="block text-sm text-slate-300 mb-2">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm text-slate-300 mb-2">Price Range</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="Min"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="Max"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-slate-300 mb-2">Sort By</label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onClear}
        className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold py-2.5 transition"
      >
        Clear Filters
      </button>
    </div>
  );
}