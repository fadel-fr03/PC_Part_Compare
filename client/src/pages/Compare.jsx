import { useMemo } from "react";
import { NavLink } from "react-router-dom";
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
      <div className="relative min-h-[calc(100vh-96px)] overflow-hidden px-4 py-10 sm:px-6">
        <div className="pointer-events-none absolute left-[-120px] top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] bottom-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
          <div className="relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_0_45px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 text-3xl ring-1 ring-white/10">
              ⚖️
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              Compare Center
            </p>

            <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
              Select at least 2 parts
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
              Choose two or three parts from the catalog to unlock a clean
              side-by-side comparison table with specs, prices, and ratings.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <NavLink
                to="/browse"
                className="rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(99,102,241,0.3)] transition hover:scale-[1.01] hover:opacity-95"
              >
                Browse Parts
              </NavLink>

              <button
                type="button"
                onClick={clear}
                className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                Clear Selection
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Pick parts", "Same category", "Compare specs"].map((step) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xl">✦</p>
                  <p className="mt-2 text-sm font-semibold text-white/70">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-96px)] overflow-hidden px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute left-[-140px] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-140px] bottom-16 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_45px_rgba(15,23,42,0.35)] backdrop-blur sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Side-by-side comparison
              </p>

              <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                Compare
                <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
                  selected parts.
                </span>
              </h1>

              <p className="mt-3 text-sm leading-7 text-white/60">
                Comparing {normalizedItems.length} item
                {normalizedItems.length !== 1 ? "s" : ""}. You can compare 2
                or 3 parts from the same category.
              </p>
            </div>

            <button
              onClick={clear}
              className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 sm:w-auto"
              type="button"
            >
              Clear All
            </button>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {normalizedItems.map((part) => (
              <div
                key={part.id}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
              >
                <p className="truncate text-sm font-bold text-white">
                  {part.name}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {part.brand} • {part.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <ComparisonTable parts={normalizedItems} />
        </div>
      </div>
    </div>
  );
}