import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Breadcrumbs from "../components/BreadCrumbs";
import ImageGallery from "../components/ImageGallery";
import SpecsTable from "../components/SpecsTable";
import { useCompare } from "../context/CompareContext";

/**
 * ===================== BACKEND PLACEHOLDER =====================
 * TODO:
 * Replace frontend mock with:
 * GET /api/parts/:id
 *
 * Expected response:
 * {
 *   part: {
 *     id: string,
 *     name: string,
 *     brand: string,
 *     category: string,
 *     price?: number,
 *     ratingAvg?: number,
 *     summary?: string,
 *     images: string[],
 *     specs: {
 *       [groupName: string]: {
 *         [label: string]: string | number
 *       }
 *     }
 *   }
 * }
 * ===============================================================
 */

export default function PartDetail() {
  const { id } = useParams();
  const { toggle, isSelected, isFull } = useCompare();

  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      // ================= BACKEND TODO =================
      // const res = await fetch(`/api/parts/${id}`);
      // const { part } = await res.json();
      // setPart(part);
      // ================================================

      await sleep(250); // simulate API latency

      // FRONTEND MOCK (remove when backend is connected)
      const found = mockParts.find((p) => p.id === id) || null;
      setPart(found);
      setLoading(false);
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
          Part not found.
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

          {/* Summary */}
          {part.summary && (
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              {part.summary}
            </p>
          )}

          {/* ================= SPECS ================= */}
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * ================= FRONTEND MOCK ONLY =================
 * Remove once backend is connected
 * Images use placeholder URLs (Task 26)
 * =====================================================
 */
const mockParts = [
  {
    id: "cpu-i5-12400f",
    name: "Intel Core i5-12400F",
    brand: "Intel",
    category: "CPU",
    price: 155,
    ratingAvg: 4.6,
    summary: "6C/12T • up to 4.40 GHz • LGA1700",
    images: [
      "https://picsum.photos/seed/i5-12400f/900/700",
      "https://picsum.photos/seed/i5-12400f-2/900/700",
      "https://picsum.photos/seed/i5-12400f-3/900/700",
    ],
    specs: {
      General: {
        "Core / Threads": "6 / 12",
        Socket: "LGA1700",
        "Boost Clock": "Up to 4.40 GHz",
      },
      "Cache & Power": {
        Cache: "18 MB",
        TDP: "65W",
      },
    },
  },
];


