import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PartCard from "../components/PartCard";
import CompareBar from "../components/CompareBar";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import { API_ENDPOINTS } from "../config/api";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [debouncedQ, setDebouncedQ] = useState(searchParams.get("q") || "");
  const [cat, setCat] = useState(searchParams.get("cat") || "All");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const firstLoadRef = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
    }, 400);

    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    const params = {};

    if (q.trim()) params.q = q.trim();
    if (cat !== "All") params.cat = cat;
    if (minPrice) params.min = minPrice;
    if (maxPrice) params.max = maxPrice;
    if (sort !== "newest") params.sort = sort;

    setSearchParams(params, { replace: true });
  }, [q, cat, minPrice, maxPrice, sort, setSearchParams]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchParts = async () => {
      try {
        setError("");

        if (firstLoadRef.current) setLoading(true);
        else setFetching(true);

        let url = API_ENDPOINTS.parts.list;
        const params = new URLSearchParams();

        if (cat !== "All") params.append("category", cat);
        if (debouncedQ.trim()) params.append("search", debouncedQ.trim());
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (sort !== "newest") params.append("sort", sort);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch parts");
        }

        const normalized = (data.data || []).map((p) => ({
          ...p,
          id: p._id,
          brand: p.manufacturer,
          ratingAvg: p.averageRating,
          summary: Object.values(p.specifications || {})
            .slice(0, 3)
            .join(" • "),
        }));

        setParts(normalized);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (firstLoadRef.current) {
          setLoading(false);
          firstLoadRef.current = false;
        }
        setFetching(false);
      }
    };

    fetchParts();
    return () => controller.abort();
  }, [debouncedQ, cat, minPrice, maxPrice, sort]);

  const categories = useMemo(
    () => [
      "All",
      "CPU",
      "GPU",
      "RAM",
      "Motherboard",
      "Storage",
      "PSU",
      "Case",
      "Cooling",
    ],
    []
  );

  const sortOptions = useMemo(
    () => [
      { value: "newest", label: "Newest" },
      { value: "price_asc", label: "Price: Low to High" },
      { value: "price_desc", label: "Price: High to Low" },
      { value: "rating_desc", label: "Rating: High to Low" },
      { value: "rating_asc", label: "Rating: Low to High" },
      { value: "name_asc", label: "Name: A to Z" },
      { value: "name_desc", label: "Name: Z to A" },
    ],
    []
  );

  function clearFilters() {
    setQ("");
    setDebouncedQ("");
    setCat("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  }

  function removeFilter(type) {
    if (type === "search") {
      setQ("");
      setDebouncedQ("");
    }
    if (type === "category") setCat("All");
    if (type === "minPrice") setMinPrice("");
    if (type === "maxPrice") setMaxPrice("");
    if (type === "sort") setSort("newest");
  }

  return (
    <>
      <section className="relative px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 md:p-8 shadow-[0_0_50px_rgba(30,41,59,0.35)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.12),transparent_30%)]" />
            <div className="absolute -top-10 right-10 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-10 left-10 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                  Compariq Catalog
                </div>

                <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                  Find your next
                  <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
                    perfect PC part.
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
                  Browse components, filter by category and price, and narrow down
                  the best options for your build with a cleaner and smarter search
                  experience.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                    ⚙️ Hardware-focused
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                    💡 Smart filters
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75">
                    🚀 Compare-ready
                  </span>
                </div>
              </div>

              <div className="relative rounded-[26px] border border-white/10 bg-slate-950/35 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white/85">
                  Search the catalog
                </p>
                <p className="mt-1 text-xs text-white/50">
                  Look up parts by name or manufacturer
                </p>

                <div className="mt-4">
                  <SearchBar value={q} onChange={setQ} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xl font-bold text-white">{parts.length}</p>
                    <p className="mt-1 text-xs text-white/50">Results</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xl font-bold text-cyan-300">{cat}</p>
                    <p className="mt-1 text-xs text-white/50">Category</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-xl font-bold text-fuchsia-300">
                      {sort === "newest" ? "Default" : "Sorted"}
                    </p>
                    <p className="mt-1 text-xs text-white/50">Mode</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)] items-start">
            <div className="w-full self-start">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_40px_rgba(15,23,42,0.3)]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Filters</h2>
                    <p className="text-xs text-white/50">
                      Refine your hardware search
                    </p>
                  </div>

                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-cyan-400/15 to-fuchsia-500/15 ring-1 ring-white/10" />
                </div>

                <FilterSidebar
                  categories={categories}
                  selectedCategory={cat}
                  onCategoryChange={setCat}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onMinPriceChange={setMinPrice}
                  onMaxPriceChange={setMaxPrice}
                  sort={sort}
                  sortOptions={sortOptions}
                  onSortChange={setSort}
                  onClear={clearFilters}
                />
              </div>
            </div>

            <div className="min-w-0">
              {fetching && !loading && (
                <div className="mb-4 animate-fade-in rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-200 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
                  ✨ Updating results...
                </div>
              )}

              {!loading && !error && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {q && (
                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300 flex items-center gap-2">
                      Search: {q}
                      <button
                        type="button"
                        onClick={() => removeFilter("search")}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {cat !== "All" && (
                    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300 flex items-center gap-2">
                      {cat}
                      <button
                        type="button"
                        onClick={() => removeFilter("category")}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {minPrice && (
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-300 flex items-center gap-2">
                      Min: {minPrice}
                      <button
                        type="button"
                        onClick={() => removeFilter("minPrice")}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {maxPrice && (
                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-sm text-yellow-300 flex items-center gap-2">
                      Max: {maxPrice}
                      <button
                        type="button"
                        onClick={() => removeFilter("maxPrice")}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </span>
                  )}

                  {sort !== "newest" && (
                    <span className="rounded-full bg-pink-500/20 px-3 py-1 text-sm text-pink-300 flex items-center gap-2">
                      Sort: {sort}
                      <button
                        type="button"
                        onClick={() => removeFilter("sort")}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-[28px] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="mb-4 flex justify-between">
                        <div className="h-6 w-20 rounded-full bg-white/10" />
                        <div className="h-8 w-20 rounded-xl bg-white/10" />
                      </div>

                      <div className="h-44 rounded-[22px] bg-white/10" />

                      <div className="mt-4 space-y-3">
                        <div className="h-5 w-3/4 rounded bg-white/10" />
                        <div className="h-4 w-1/2 rounded bg-white/10" />
                        <div className="h-10 w-full rounded-2xl bg-white/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-10 text-center text-red-200">
                  {error}
                </div>
              ) : parts.length === 0 ? (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-10 text-center shadow-[0_0_35px_rgba(15,23,42,0.25)]">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 text-2xl ring-1 ring-white/10">
                    🔍
                  </div>

                  <h3 className="text-2xl font-bold text-white">
                    No parts found
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">
                    Try changing your search, category, price range, or sorting
                    options.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-[1.01] hover:opacity-95"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xl font-bold text-white">
                        Showing {parts.length} result
                        {parts.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-white/50">
                        Explore, compare, and choose the best fit for your build.
                      </p>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/50">
                      PC Components
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {parts.map((p) => (
                      <PartCard key={p._id} part={p} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <CompareBar />
    </>
  );
}

