function parseNumericValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return value;

  const str = String(value).replace(/,/g, "");
  const match = str.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function isHigherBetter(label = "") {
  const l = label.toLowerCase();

  if (
    l.includes("price") ||
    l.includes("tdp") ||
    l.includes("latency") ||
    l.includes("cas")
  ) {
    return false;
  }

  return true;
}

function getBestIndexes(parts, accessor, label) {
  const values = parts.map(accessor);
  const numeric = values.map((v) => parseNumericValue(v));

  if (numeric.every((v) => v === null)) return [];

  const valid = numeric
    .map((v, i) => ({ v, i }))
    .filter((x) => x.v !== null);

  if (!valid.length) return [];

  const betterHigh = isHigherBetter(label);
  const bestValue = betterHigh
    ? Math.max(...valid.map((x) => x.v))
    : Math.min(...valid.map((x) => x.v));

  return valid.filter((x) => x.v === bestValue).map((x) => x.i);
}

function formatCellValue(label, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (label.toLowerCase() === "price") return `$${value}`;
  return String(value);
}

export default function ComparisonTable({ parts = [] }) {
  if (!parts || parts.length < 2) {
    return (
      <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-white/60">
        Select at least 2 parts to compare.
      </div>
    );
  }

  const baseRows = [
    { label: "Brand", getValue: (p) => p.brand ?? p.manufacturer },
    { label: "Category", getValue: (p) => p.category },
    { label: "Price", getValue: (p) => p.price },
    { label: "Rating", getValue: (p) => p.ratingAvg ?? p.averageRating },
  ];

  const specKeys = Array.from(
    new Set(
      parts.flatMap((p) => Object.keys(p.specifications || {}))
    )
  );

  const specRows = specKeys.map((key) => ({
    label: key,
    getValue: (p) => p.specifications?.[key],
  }));

  const rows = [...baseRows, ...specRows];

  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-white/10 bg-white/5">
      <table className="min-w-[760px] w-full border-collapse">
        <thead className="bg-white/5">
          <tr>
            <th className="text-left text-xs text-white/60 font-semibold p-4 w-44">
              Spec
            </th>
            {parts.map((p) => (
              <th
                key={p.id ?? p._id}
                className="text-left text-sm text-white font-semibold p-4 min-w-[220px]"
              >
                <div className="space-y-1">
                  <div>{p.name}</div>
                  <div className="text-xs text-white/55">
                    {p.brand ?? p.manufacturer} • {p.category}
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const bestIndexes = getBestIndexes(parts, row.getValue, row.label);

            return (
              <tr key={row.label} className="border-t border-white/10">
                <td className="p-4 text-xs text-white/60 font-medium align-top">
                  {row.label}
                </td>

                {parts.map((p, idx) => {
                  const value = row.getValue(p);
                  const isBest = bestIndexes.includes(idx);

                  return (
                    <td
                      key={`${p.id ?? p._id}-${row.label}`}
                      className={[
                        "p-4 text-sm text-white/80 align-top transition",
                        isBest
                          ? "bg-emerald-500/10 text-emerald-200 font-semibold"
                          : "",
                      ].join(" ")}
                    >
                      {formatCellValue(row.label, value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
