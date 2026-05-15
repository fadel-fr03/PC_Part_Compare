export default function ComparisonTable({ parts }) {
  if (!parts || parts.length < 2) {
    return (
      <div className="text-center text-slate-400 mt-10">
        Select at least 2 parts to compare
      </div>
    );
  }

  // collect all specs keys
  const allSpecs = new Set();
  parts.forEach((p) => {
    Object.keys(p.specifications || {}).forEach((key) => {
      allSpecs.add(key);
    });
  });

  const specKeys = Array.from(allSpecs);

  // function to check numeric
  const getNumeric = (value) => {
    if (!value) return null;
    const num = parseFloat(value.toString().replace(/[^\d.]/g, ""));
    return isNaN(num) ? null : num;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-white/10">
        <thead>
          <tr className="bg-slate-900">
            <th className="p-3 text-left text-slate-300">Spec</th>
            {parts.map((p) => (
              <th key={p._id} className="p-3 text-white">
                {p.name}
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
                <td className="p-3 text-slate-300">{spec}</td>

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
                    <td key={i} className={`p-3 ${color}`}>
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
  );
}