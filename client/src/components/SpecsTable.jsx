export default function SpecsTable({ specs }) {
  // specs format: { SectionName: { key: value, ... }, ... }
  if (!specs || Object.keys(specs).length === 0) {
    return (
      <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4 text-sm text-white/60">
        No specifications available yet.
        {/* BACKEND TODO: ensure backend provides a specs object */}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(specs).map(([section, entries]) => (
        <div key={section} className="rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
          <div className="px-4 py-2 text-sm font-semibold text-white/85 bg-white/5">
            {section}
          </div>

          <div className="divide-y divide-white/10">
            {Object.entries(entries).map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 px-4 py-3">
                <div className="text-xs text-white/60 font-medium">{k}</div>
                <div className="text-sm text-white/80 text-right">{String(v)}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

