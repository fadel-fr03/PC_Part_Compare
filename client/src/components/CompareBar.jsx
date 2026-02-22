import { NavLink } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareBar() {
  const { items, remove, clear, canCompare } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="sticky bottom-4 z-40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-2xl bg-slate-950/70 backdrop-blur ring-1 ring-white/10 p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-white/80 font-medium">
              Selected: {items.length}/3
            </span>

            {items.map((p) => {
              const id = p.id ?? p._id;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-xs text-white/70"
                >
                  {p.name}
                  <button
                    onClick={() => remove(id)}
                    className="text-white/60 hover:text-white"
                    type="button"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clear}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-white/80 bg-white/5 ring-1 ring-white/10 hover:bg-white/10"
              type="button"
            >
              Clear
            </button>

            <NavLink
              to="/compare"
              className={[
                "rounded-xl px-4 py-2 text-xs font-semibold transition",
                canCompare
                  ? "text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 hover:opacity-95"
                  : "text-white/50 bg-white/5 ring-1 ring-white/10 pointer-events-none",
              ].join(" ")}
              title={canCompare ? "Compare selected parts" : "Select at least 2 parts to compare"}
            >
              Compare
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
