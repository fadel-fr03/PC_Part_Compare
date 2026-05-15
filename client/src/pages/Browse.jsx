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

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
    }, 400);

    return () => clearTimeout(timer);
  }, [q]);

  // sync filters to URL
  useEffect(() => {
    const params = {};

    if (q.trim()) params.q = q.trim();
    if (cat !== "All") params.cat = cat;
    if (minPrice) params.min = minPrice;
    if (maxPrice) params.max = maxPrice;
    if (sort !== "newest") params.sort = sort;

    setSearchParams(params, { replace: true });
  }, [q, cat, minPrice, maxPrice, sort, setSearchParams]);

  // fetch parts from backend
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
      <section className="p-6">
        <div className="mb-6">
          <SearchBar value={q} onChange={setQ} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
          <div className="w-full self-start">
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

          <div className="min-w-0">
            {fetching && !loading && (
              <div className="mb-4 text-sm text-cyan-300">
                Updating results...
              </div>
            )}

            {!loading && !error && (
              <div className="mb-4 flex flex-wrap gap-2">
                {q && (
                  <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
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
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
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
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
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
                  <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
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
                  <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
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
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
                Loading parts...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-200">
                {error}
              </div>
            ) : parts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
                No parts found.
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-slate-400">
                  Showing{" "}
                  <span className="text-white font-semibold">{parts.length}</span>{" "}
                  result{parts.length !== 1 ? "s" : ""}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                  {parts.map((p) => (
                    <PartCard key={p._id} part={p} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <CompareBar />
    </>
  );
}

