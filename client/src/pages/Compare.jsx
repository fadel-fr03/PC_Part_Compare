import { useMemo } from "react";
import { useCompare } from "../context/CompareContext";
import ComparisonTable from "../components/ComparisonTable";

export default function Compare() {
  const { items, canCompare, clear } = useCompare();

  const normalizedItems = useMemo(() => {
    return items.map((p) => ({
      ...p,
      id: p.id ?? p._id,
      brand: p.brand ?? p.manufacturer ?? "—",
      ratingAvg: p.ratingAvg ?? p.averageRating ?? "—",
      specifications: p.specifications || {},
      summary:
        p.summary ??
        Object.values(p.specifications || {})
          .slice(0, 3)
          .join(" • "),
    }));
  }, [items]);

  if (!canCompare) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-white/70">
        Select at least <span className="text-white">2</span> items to compare.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Compare</h1>
          <p className="mt-1 text-sm text-white/60">
            Comparing {normalizedItems.length} item(s). (2 or 3 allowed)
          </p>
        </div>

        <button
          onClick={clear}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-white/80 bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
          type="button"
        >
          Clear All
        </button>
      </div>

      <div className="mt-6">
        <ComparisonTable parts={normalizedItems} />
      </div>
    </div>
  );
}
