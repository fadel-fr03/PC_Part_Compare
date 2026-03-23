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

  return (
    <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-4 hover:ring-white/20 transition">
      <div className="mb-4 w-full h-32 rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden flex items-center justify-center">
        {!imgError && image ? (
          <img
            src={image}
            alt={part.name}
            className="h-full w-full object-contain p-3"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="text-xs text-white/40 px-3 text-center">
            No image available
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-white font-semibold leading-snug truncate">
            {part.name}
          </h3>
          <p className="mt-1 text-xs text-white/55">
            {brand} • {category}
          </p>
        </div>

        <button
          onClick={() => toggle(part)}
          disabled={!selected && isFull}
          className={[
            "shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition",
            selected
              ? "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
              : "text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 hover:opacity-95",
            !selected && isFull ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
          type="button"
        >
          {selected ? "Selected" : "Compare"}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-white/70">{price}</span>
        <span className="text-xs text-white/60">⭐ {rating}</span>
      </div>

      <NavLink
        to={`/parts/${id}`}
        className="mt-4 block text-center rounded-xl px-3 py-2 text-xs font-semibold text-white/80 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition"
      >
        View Details
      </NavLink>
    </div>
  );
}


