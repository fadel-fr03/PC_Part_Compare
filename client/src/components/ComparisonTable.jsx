export default function ComparisonTable({ parts }) {
  if (!parts || parts.length < 2) {
    return (
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-8 text-center text-sm text-slate-400">
        Select at least 2 parts to compare
      </div>
    );
  }

  const allSpecs = new Set();

  parts.forEach((p) => {
    Object.keys(p.specifications || {}).forEach((key) => {
      allSpecs.add(key);
    });
  });

  const specKeys = Array.from(allSpecs);

  const getNumeric = (value) => {
    if (!value) return null;
    const num = parseFloat(value.toString().replace(/[^\d.]/g, ""));
    return isNaN(num) ? null : num;
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full">
          <thead>
            <tr className="bg-slate-900/90">
              <th className="sticky left-0 z-10 bg-slate-900/95 p-3 text-left text-xs font-bold uppercase tracking-[0.16em] text-slate-300 sm:p-4">
                Spec
              </th>

              {parts.map((p) => (
                <th
                  key={p._id || p.id}
                  className="min-w-[180px] p-3 text-left text-sm font-bold text-white sm:p-4"
                >
                  <span className="line-clamp-2">{p.name}</span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {specKeys.map((spec) => {
              const values = parts.map((p) => p.specifications?.[spec]);

              const numericValues = values.map(getNumeric);
              const validNums = numericValues.filter((v) => v !== null);

              const max = validNums.length ? Math.max(...validNums) : null;
              const min = validNums.length ? Math.min(...validNums) : null;

              return (
                <tr key={spec} className="border-t border-white/10">
                  <td className="sticky left-0 z-10 bg-slate-950/95 p-3 text-xs font-semibold text-slate-300 sm:p-4">
                    {spec}
                  </td>

                  {values.map((val, i) => {
                    let color = "text-slate-200";

                    if (numericValues[i] !== null && max !== null) {
                      if (numericValues[i] === max) {
                        color = "text-green-400 font-semibold";
                      } else if (numericValues[i] === min) {
                        color = "text-red-400";
                      }
                    }

                    return (
                      <td
                        key={i}
                        className={`p-3 text-sm sm:p-4 ${color}`}
                      >
                        {val || "-"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}