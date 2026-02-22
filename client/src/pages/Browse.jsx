import { useEffect, useMemo, useState } from "react";
import PartCard from "../components/PartCard";
import CompareBar from "../components/CompareBar";

export default function Browse() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  // ✅ Fetch parts from backend
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/parts");
        const data = await res.json();

        // 🔹 backend returns: { success: true, data: [parts] }
        const partsArray = data.data || [];

        // 🔹 normalize backend → frontend format
        const normalized = partsArray.map((p) => ({
          id: p._id,
          name: p.name,
          brand: p.manufacturer,
          category: p.category,
          price: p.price,
          ratingAvg: p.averageRating,
          imageUrl: p.imageUrl,
          summary: Object.values(p.specifications || {})
            .slice(0, 3)
            .join(" • "),
        }));

        setParts(normalized);
      } catch (err) {
        console.error("Failed to load parts:", err);
        setParts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ Categories from backend data
  const categories = useMemo(() => {
    const s = new Set(parts.map((p) => p.category));
    return ["All", ...Array.from(s)];
  }, [parts]);

  // ✅ Filter logic
  const filtered = useMemo(() => {
    return parts.filter((p) => {
      const okCat = cat === "All" || p.category === cat;
      const okQ =
        !q.trim() ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [parts, q, cat]);

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Browse</h1>
            <p className="mt-1 text-sm text-white/60">
              Select 2 or 3 parts to compare.
            </p>
          </div>

          {/* Search + Category */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or brand..."
              className="w-full sm:w-64 rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white outline-none focus:ring-white/25"
            />

            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="w-full sm:w-44 rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-sm text-white outline-none focus:ring-white/25"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6">
          {loading ? (
            <div className="text-white/60">Loading parts…</div>
          ) : filtered.length === 0 ? (
            <div className="text-white/60">No parts found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PartCard key={p.id} part={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare sticky bar */}
      <CompareBar />
    </>
  );
}


