import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";

const emptyForm = {
  name: "",
  manufacturer: "",
  category: "CPU",
  price: "",
  imageUrl: "",
};

export default function Admin() {
  const { user, token, isAuthenticated, loading } = useAuth();

  const [parts, setParts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const categories = ["CPU", "GPU", "RAM", "Motherboard", "Storage", "PSU", "Case", "Cooling"];

  const showMessage = (text) => {
    setMessage(text);
    setError("");
    setTimeout(() => setMessage(""), 2500);
  };

  const showError = (text) => {
    setError(text);
    setMessage("");
  };

  const fetchParts = async () => {
    try {
      setFetching(true);
      const res = await fetch(API_ENDPOINTS.parts.list);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch parts");
      }

      setParts(data.data || []);
    } catch (err) {
      showError(err.message || "Failed to load parts");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-white/70">
        Loading admin panel...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="rounded-[28px] border border-red-500/20 bg-red-500/10 p-8 text-center">
          <h1 className="text-3xl font-bold text-red-200">Access Denied</h1>
          <p className="mt-3 text-sm text-red-100/70">
            This page is only available for admin users.
          </p>
        </div>
      </div>
    );
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return showError("Part name is required.");
    if (!form.manufacturer.trim()) return showError("Manufacturer is required.");
    if (!form.price || Number(form.price) < 0) return showError("Enter a valid price.");

    const payload = {
      name: form.name.trim(),
      manufacturer: form.manufacturer.trim(),
      category: form.category,
      price: Number(form.price),
      imageUrl: form.imageUrl.trim(),
      specifications: {},
    };

    try {
      setSaving(true);

      const url = editingId
        ? API_ENDPOINTS.parts.byId(editingId)
        : API_ENDPOINTS.parts.list;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Action failed");
      }

      showMessage(editingId ? "Part edited successfully!" : "Part added successfully!");
      resetForm();
      fetchParts();
    } catch (err) {
      showError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (part) => {
    setEditingId(part._id);
    setForm({
      name: part.name || "",
      manufacturer: part.manufacturer || "",
      category: part.category || "CPU",
      price: part.price ?? "",
      imageUrl: part.imageUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this part?");
    if (!confirmed) return;

    try {
      const res = await fetch(API_ENDPOINTS.parts.byId(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      showMessage("Part deleted successfully!");
      fetchParts();
    } catch (err) {
      showError(err.message || "Failed to delete part");
    }
  };

  return (
    <div className="relative px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-8 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.12),transparent_30%)]" />

          <div className="relative z-10">
            <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Admin Control Center
            </p>

            <h1 className="mt-4 text-3xl font-extrabold text-white md:text-5xl">
              Manage your
              <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
                PC parts catalog.
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              Add, edit, and delete hardware parts directly from this protected admin panel.
            </p>
          </div>
        </div>

        {(message || error) && (
          <div
            className={[
              "mb-6 rounded-2xl border px-4 py-3 text-sm font-medium",
              message
                ? "border-green-500/20 bg-green-500/10 text-green-200"
                : "border-red-500/20 bg-red-500/10 text-red-200",
            ].join(" ")}
          >
            {message || error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
          >
            <h2 className="text-xl font-bold text-white">
              {editingId ? "Edit Part" : "Add New Part"}
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Fill in the core details of the component.
            </p>

            <div className="mt-6 space-y-4">
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Part name"
                className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
              />

              <input
                value={form.manufacturer}
                onChange={(e) => updateField("manufacturer", e.target.value)}
                placeholder="Manufacturer"
                className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
              />

              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className="w-full rounded-xl bg-slate-950/80 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                placeholder="Price"
                type="number"
                className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
              />

              <input
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="Image URL"
                className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 hover:opacity-95 disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Add Part"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Current Parts</h2>
                <p className="text-sm text-white/50">
                  {fetching ? "Loading..." : `${parts.length} part${parts.length !== 1 ? "s" : ""} available`}
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/50">
                Catalog
              </span>
            </div>

            {fetching ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
                Loading parts...
              </div>
            ) : parts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
                No parts found.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {parts.map((part) => (
                  <div
                    key={part._id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                        {part.imageUrl ? (
                          <img
                            src={part.imageUrl}
                            alt={part.name}
                            className="h-full w-full object-contain p-2"
                          />
                        ) : (
                          <span className="text-xs text-white/35">No image</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-white">{part.name}</h3>
                        <p className="mt-1 text-xs text-white/50">
                          {part.manufacturer || "Unknown"} • {part.category}
                        </p>
                        <p className="mt-2 font-semibold text-cyan-300">
                          ${part.price ?? "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(part)}
                        className="flex-1 rounded-xl bg-yellow-400/15 px-3 py-2 text-sm font-semibold text-yellow-200 ring-1 ring-yellow-400/20 hover:bg-yellow-400/25"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(part._id)}
                        className="flex-1 rounded-xl bg-red-500/15 px-3 py-2 text-sm font-semibold text-red-200 ring-1 ring-red-500/20 hover:bg-red-500/25"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}