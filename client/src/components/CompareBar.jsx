import { NavLink } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function CompareBar() {
  const { items, remove, clear, canCompare } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="sticky bottom-3 z-40 px-3 sm:bottom-4">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-slate-950/80 p-3 shadow-[0_0_35px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold text-white/80">
                Selected: {items.length}/3
              </p>

              <div className="flex max-h-24 flex-wrap gap-2 overflow-y-auto pr-1">
                {items.map((p) => {
                  const id = p.id ?? p._id;

                  return (
                    <span
                      key={id}
                      className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10"
                    >
                      <span className="max-w-[180px] truncate sm:max-w-[240px]">
                        {p.name}
                      </span>

                      <button
                        onClick={() => remove(id)}
                        className="shrink-0 text-white/60 hover:text-white"
                        type="button"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                onClick={clear}
                className="rounded-xl bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 ring-1 ring-white/10 transition hover:bg-white/10"
                type="button"
              >
                Clear
              </button>

              <NavLink
                to="/compare"
                className={[
                  "rounded-xl px-4 py-2 text-center text-xs font-semibold transition",
                  canCompare
                    ? "bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 text-slate-950 hover:opacity-95"
                    : "pointer-events-none bg-white/5 text-white/50 ring-1 ring-white/10",
                ].join(" ")}
                title={
                  canCompare
                    ? "Compare selected parts"
                    : "Select at least 2 parts to compare"
                }
              >
                Compare
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
