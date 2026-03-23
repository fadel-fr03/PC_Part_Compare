export default function FilterSidebar({
  categories = [],
  cat,
  setCat,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  clearFilters,
}) {
  return (
    <aside className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 h-fit">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-white font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          type="button"
          className="text-xs text-white/70 hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-xs text-white/60">Category</label>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white outline-none focus:ring-white/25"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-white/60">Min Price</label>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white outline-none focus:ring-white/25"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Max Price</label>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="9999"
            className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white outline-none focus:ring-white/25"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Sort By</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white outline-none focus:ring-white/25"
          >
            <option value="newest" className="bg-slate-900">
              Newest
            </option>
            <option value="oldest" className="bg-slate-900">
              Oldest
            </option>
            <option value="price_asc" className="bg-slate-900">
              Price: Low to High
            </option>
            <option value="price_desc" className="bg-slate-900">
              Price: High to Low
            </option>
            <option value="rating_asc" className="bg-slate-900">
              Rating: Low to High
            </option>
            <option value="rating_desc" className="bg-slate-900">
              Rating: High to Low
            </option>
            <option value="name_asc" className="bg-slate-900">
              Name: A to Z
            </option>
            <option value="name_desc" className="bg-slate-900">
              Name: Z to A
            </option>
          </select>
        </div>
      </div>
    </aside>
  );
}