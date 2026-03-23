import { useEffect, useMemo, useState } from "react";
import PartCard from "../components/PartCard";
import CompareBar from "../components/CompareBar";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import { API_ENDPOINTS } from "../config/api";

export default function Browse() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await fetch(API_ENDPOINTS.parts.list);
        const data = await res.json();

        console.log("BROWSE API RESPONSE:", data);

        const partsArray = Array.isArray(data?.data) ? data.data : [];

        const normalized = partsArray.map((p) => ({
          id: p._id,
          _id: p._id,
          name: p.name,
          brand: p.manufacturer,
          manufacturer: p.manufacturer,
          category: p.category,
          price: Number(p.price) || 0,
          ratingAvg: p.averageRating,
          averageRating: p.averageRating,
          imageUrl: p.imageUrl,
          specifications: p.specifications || {},
          summary: Object.values(p.specifications || {})
            .slice(0, 3)
            .join(" • "),
        }));

        console.log("NORMALIZED PARTS:", normalized);

        setParts(normalized);
      } catch (err) {
        console.error("Failed to load parts:", err);
        setParts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const s = new Set(parts.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [parts]);

  const filtered = useMemo(() => {
    let result = [...parts];

    if (cat !== "All") {
      result = result.filter((p) => p.category === cat);
    }

    if (q.trim()) {
      const query = q.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.manufacturer?.toLowerCase().includes(query)
      );
    }

    if (minPrice !== "" && !isNaN(minPrice)) {
      result = result.filter((p) => Number(p.price ?? 0) >= Number(minPrice));
    }

    if (maxPrice !== "" && !isNaN(maxPrice)) {
      result = result.filter((p) => Number(p.price ?? 0) <= Number(maxPrice));
    }

    switch (sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating_asc":
        result.sort((a, b) => (a.ratingAvg ?? 0) - (b.ratingAvg ?? 0));
        break;
      case "rating_desc":
        result.sort((a, b) => (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0));
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [parts, q, cat, minPrice, maxPrice, sort]);

  function clearFilters() {
    setQ("");
    setCat("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
          <div className="w-full lg:w-72 shrink-0">
            <FilterSidebar
              categories={categories}
              cat={cat}
              setCat={setCat}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sort={sort}
              setSort={setSort}
              clearFilters={clearFilters}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Browse</h1>
                <p className="mt-1 text-sm text-white/60">
                  Select 2 or 3 parts to compare.
                </p>
              </div>

              <div className="w-full sm:w-80">
                <SearchBar value={q} onChange={setQ} />
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="text-white/60">Loading parts…</div>
              ) : parts.length === 0 ? (
                <div className="text-white/60">
                  No parts loaded from backend.
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-white/60">No parts found.</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((p) => (
                    <PartCard key={p.id} part={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CompareBar />
    </>
  );
}


