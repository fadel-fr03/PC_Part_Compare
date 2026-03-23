import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Breadcrumbs from "../components/BreadCrumbs";
import ImageGallery from "../components/ImageGallery";
import SpecsTable from "../components/SpecsTable";
import { useCompare } from "../context/CompareContext";
import { API_ENDPOINTS } from "../config/api";

export default function PartDetail() {
  const { id } = useParams();
  const { toggle, isSelected, isFull } = useCompare();

  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(API_ENDPOINTS.parts.byId(id));
        const json = await res.json();

        if (!res.ok || !json.success) {
          setError(json.message || "Part not found");
          setPart(null);
          return;
        }

        const p = json.data;

        setPart({
          id: p._id,
          name: p.name,
          brand: p.manufacturer,
          category: p.category,
          price: p.price,
          ratingAvg: p.averageRating,
          images: p.imageUrl ? [p.imageUrl] : [],
          summary: Object.values(p.specifications || {})
            .slice(0, 3)
            .join(" • "),
          specs: p.specifications
            ? { Specifications: { ...p.specifications } }
            : {},
        });
      } catch (err) {
        setError("Failed to load part details");
        setPart(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const crumbs = useMemo(() => {
    return [
      { label: "Home", to: "/" },
      { label: "Browse", to: "/browse" },
      {
        label: part?.category || "Part",
        to: part
          ? `/browse?cat=${encodeURIComponent(part.category)}`
          : "/browse",
      },
      { label: part?.name || "Details" },
    ];
  }, [part]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-white/70">
        Loading part details…
      </div>
    );
  }

  if (!part) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Browse", to: "/browse" },
            { label: "Not found" },
          ]}
        />
        <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 text-white/70">
          {error || "Part not found."}
          <div className="mt-4">
            <NavLink className="text-white hover:underline" to="/browse">
              Back to Browse
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  const selected = isSelected(part.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={crumbs} />

      <div className="mt-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
        <ImageGallery images={part.images ?? []} alt={part.name} />

        <div className="mt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white leading-snug">
                {part.name}
              </h1>
              <p className="mt-2 text-sm text-white/60">
                {part.brand} • {part.category}
              </p>
            </div>

            <button
              onClick={() => toggle(part)}
              disabled={!selected && isFull}
              title={!selected && isFull ? "Max 3 items in comparison" : ""}
              type="button"
              className={[
                "rounded-xl px-4 py-2 text-sm font-semibold transition",
                selected
                  ? "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15"
                  : "text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 hover:opacity-95",
                !selected && isFull ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {selected ? "Selected" : "Add to Compare"}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-white/80 font-semibold">
              {part.price ? `$${part.price}` : "Price N/A"}
            </div>
            <div className="text-sm text-white/60">
              ⭐ {part.ratingAvg ?? "—"}
            </div>
          </div>

          {part.summary && (
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              {part.summary}
            </p>
          )}

          <div className="mt-8">
            <h2 className="text-white font-semibold">Specifications</h2>
            <p className="mt-1 text-xs text-white/50">
              Structured data from backend
            </p>

            <div className="mt-4">
              <SpecsTable specs={part.specs ?? {}} />
            </div>

            {/* ================= BACKEND CONTRACT =================
              specs must be structured as:

              specs: {
                "General": {
                  "Core / Threads": "6 / 12",
                  "Socket": "LGA1700"
                },
                "Performance": {
                  "Boost Clock": "Up to 4.40 GHz"
                }
              }

              images: string[]
            ===================================================== */}
          </div>
        </div>
      </div>
    </div>
  );
}

