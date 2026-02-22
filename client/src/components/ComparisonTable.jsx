export default function ComparisonTable({ parts = [], rows = [] }) {
  if (!parts || parts.length < 2) {
    return (
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-white/60">
        Select at least 2 parts to compare.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10">
      <table className="min-w-[820px] w-full border-collapse">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left text-xs text-white/60 font-semibold p-4 w-44">
              Spec
            </th>
            {parts.map((p) => (
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
              {parts.map((p) => (
                <td key={(p.id ?? p._id) + r.key} className="p-4 text-sm text-white/80">
                  {r.format ? r.format(p[r.key], p) : formatValue(r.key, p[r.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* BACKEND TODO:
          For real comparisons, fetch a normalized compare payload:
          GET /api/parts/compare?ids=...
          and generate rows dynamically from backend spec schema */}
    </div>
  );
}

function formatValue(key, value) {
  if (value == null || value === "") return "—";
  if (key === "price") return `$${value}`;
  return String(value);
}
