import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCompare } from "../context/CompareContext";

export default function PartCard({ part }) {
  const { toggle, isSelected, isFull } = useCompare();

  if (!part) return null;

  const id = part._id || part.id;
  const selected = isSelected(id);
  const [imgError, setImgError] = useState(false);

  const brand = part.manufacturer || part.brand || "Unknown";
  const category = part.category || "Part";
  const price =
    part.price !== undefined && part.price !== null
      ? `$${part.price}`
      : "Price N/A";
  const rating = part.averageRating ?? part.ratingAvg ?? "—";
  const image = part.imageUrl || null;

  const categoryStyles = {
    CPU: "from-cyan-400/25 to-sky-500/10 text-cyan-300",
    GPU: "from-fuchsia-400/25 to-pink-500/10 text-fuchsia-300",
    RAM: "from-violet-400/25 to-indigo-500/10 text-violet-300",
    Motherboard: "from-emerald-400/25 to-teal-500/10 text-emerald-300",
    Storage: "from-amber-400/25 to-orange-500/10 text-amber-300",
    PSU: "from-rose-400/25 to-red-500/10 text-rose-300",
    Cooling: "from-blue-400/25 to-cyan-500/10 text-sky-300",
    Case: "from-slate-300/25 to-slate-500/10 text-slate-200",
    Part: "from-white/10 to-white/5 text-white/70",
  };

  const categoryClass =
    categoryStyles[category] || categoryStyles.Part;

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-[28px] border border-white/10",
        "bg-white/[0.04] p-4 backdrop-blur-md",
        "transition-all duration-300 ease-out",
        "shadow-[0_0_25px_rgba(15,23,42,0.3)]",
        "hover:-translate-y-2 hover:border-white/20",
        "hover:shadow-[0_0_60px_rgba(99,102,241,0.18)]",
        selected ? "ring-1 ring-cyan-400/40" : "",
      ].join(" ")}
    >
      {/* glow overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      {/* top */}
      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
        <span
          className={`inline-flex rounded-full border border-white/10 bg-gradient-to-r px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${categoryClass}`}
        >
          {category}
        </span>

        <button
          onClick={() => toggle(part)}
          disabled={!selected && isFull}
          className={[
            "shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200",
            selected
              ? "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
              : "text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 hover:scale-[1.05] hover:shadow-lg",
            !selected && isFull ? "cursor-not-allowed opacity-50" : "",
          ].join(" ")}
          type="button"
        >
          {selected ? "Selected" : "Compare"}
        </button>
      </div>

      {/* image */}
      <div className="relative z-10 mb-4 overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-white/8 to-white/[0.03]">
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-cyan-400/10 to-transparent" />

        <div className="flex h-44 w-full items-center justify-center p-4">
          {!imgError && image ? (
            <img
              src={image}
              alt={part.name}
              className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.06]"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 text-center text-xs text-white/40">
              No image available
            </div>
          )}
        </div>
      </div>

      {/* content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-white">
              {part.name}
            </h3>

            <p className="mt-1 text-sm text-white/55">
              {brand} • {category}
            </p>
          </div>

          <div className="rounded-xl border border-yellow-400/10 bg-yellow-400/10 px-2.5 py-1 text-xs font-semibold text-yellow-300">
            ⭐ {rating}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
              Price
            </p>
            <p className="mt-1 text-lg font-bold text-white">{price}</p>
          </div>

          {part.summary ? (
            <div className="hidden max-w-[48%] text-right md:block">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/35">
                Quick Specs
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-white/55">
                {part.summary}
              </p>
            </div>
          ) : null}
        </div>

        <NavLink
          to={`/parts/${id}`}
          className="mt-5 block rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-center text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-[0.98]"
        >
          View Details
        </NavLink>
      </div>
    </div>
  );
}

