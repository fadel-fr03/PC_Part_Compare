import { useCompare } from "../context/CompareContext";

export default function Compare() {
  const { items, canCompare, clear } = useCompare();

  if (!canCompare) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-white/70">
        Select at least <span className="text-white">2</span> items to compare.
      </div>
    );
  }

  // Collect all spec keys (simple demo)
  const rows = [
    { label: "Brand", key: "brand" },
    { label: "Category", key: "category" },
    { label: "Price", key: "price" },
    { label: "Rating", key: "ratingAvg" },
    { label: "Summary", key: "summary" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Compare</h1>
          <p className="mt-1 text-sm text-white/60">
            Comparing {items.length} item(s). (2 or 3 allowed)
          </p>
        </div>

        <button
          onClick={clear}
          className="rounded-xl px-3 py-2 text-xs font-semibold text-white/80 bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
          type="button"
        >
          Clear
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-white/10">
        <table className="min-w-[700px] w-full border-collapse">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left text-xs text-white/60 font-semibold p-4 w-44">Spec</th>
              {items.map((p) => (
                <th key={p.id ?? p._id} className="text-left text-sm text-white font-semibold p-4">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-white/10">
                <td className="p-4 text-xs text-white/60 font-medium">{r.label}</td>
                {items.map((p) => (
                  <td key={(p.id ?? p._id) + r.key} className="p-4 text-sm text-white/80">
                    {formatValue(r.key, p[r.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BACKEND TODO:
          When backend is ready, fetch full specs for selected IDs:
          GET /api/parts/compare?ids=id1,id2,id3
          and render specs dynamically (CPU cores, clocks, VRAM, etc.) */}
    </div>
  );
}

function formatValue(key, value) {
  if (value == null || value === "") return "—";
  if (key === "price") return `$${value}`;
  return String(value);
}
