// src/components/SpecsGrid.jsx
export default function SpecsGrid({ specs = {} }) {
  const entries = Object.entries(specs || {});
  if (!entries.length) {
    return <div className="text-white/60">No specs available.</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {entries.map(([k, v]) => (
        <div
          key={k}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
        >
          <div className="text-xs uppercase tracking-wider text-white/55">{k}</div>
          <div className="mt-1 text-base text-white">{v}</div>
        </div>
      ))}
    </div>
  );
}
