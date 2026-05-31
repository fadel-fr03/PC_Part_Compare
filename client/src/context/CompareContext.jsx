import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CompareContext = createContext(null);
const LS_KEY = "compariq_compare";

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "info") {
    setToast({ message, type });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2600);
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw) || []);
    } catch {
      //
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  function isSelected(partId) {
    return items.some((p) => (p.id ?? p._id) === partId);
  }

  function toggle(part) {
    const id = part.id ?? part._id;

    setItems((prev) => {
      const exists = prev.some((p) => (p.id ?? p._id) === id);

      if (exists) {
        showToast("Removed from comparison.", "info");
        return prev.filter((p) => (p.id ?? p._id) !== id);
      }

      if (prev.length >= 3) {
        showToast("Max 3 parts only.", "error");
        return prev;
      }

      if (prev.length > 0 && prev[0].category !== part.category) {
        showToast("Compare parts from the same category only.", "error");
        return prev;
      }

      showToast("Added to comparison.", "success");
      return [...prev, part];
    });
  }

  function remove(partId) {
    setItems((prev) => prev.filter((p) => (p.id ?? p._id) !== partId));
    showToast("Removed from comparison.", "info");
  }

  function clear() {
    setItems([]);
    showToast("Comparison cleared.", "info");
  }

  const value = useMemo(
    () => ({
      items,
      toggle,
      remove,
      clear,
      isSelected,
      canCompare: items.length >= 2,
      isFull: items.length >= 3,
      showToast,
    }),
    [items]
  );

  const toastStyle =
    toast?.type === "success"
      ? "border-green-400/25 bg-green-500/15 text-green-100"
      : toast?.type === "error"
      ? "border-red-400/25 bg-red-500/15 text-red-100"
      : "border-cyan-400/25 bg-cyan-500/15 text-cyan-100";

  const icon =
    toast?.type === "success" ? "✅" : toast?.type === "error" ? "⚠️" : "✨";

  return (
    <CompareContext.Provider value={value}>
      {children}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[999] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-fade-in px-2">
          <div
            className={[
              "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium",
              "shadow-[0_15px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl",
              toastStyle,
            ].join(" ")}
          >
            <span className="text-base">{icon}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}


