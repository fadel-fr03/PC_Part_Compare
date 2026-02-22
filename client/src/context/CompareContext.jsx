import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CompareContext = createContext(null);
const LS_KEY = "compariq_compare"; 

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]); 
  const [toast, setToast] = useState(""); 

 
  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 2500);
  }

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw) || []);
    } catch {
      // ignore
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
      if (exists) return prev.filter((p) => (p.id ?? p._id) !== id);

     
      if (prev.length >= 3) {
        showToast(" Whoa! Max 3 parts only — pick your favorites!");
        return prev;
      }

      
      if (prev.length > 0 && prev[0].category !== part.category) {
        showToast(" Oops! Compare parts from the same category only.");
        return prev;
      }

      return [...prev, part];
    });

    /**
     * ===================== BACKEND TODO =====================
     * If you want to save compare history per user:
     * POST /api/compare/save
     * body: { partIds: ["id1","id2","id3"] }
     *
     * Also optionally you can fetch normalized compare payload:
     * GET /api/parts/compare?ids=id1,id2,id3
     * ========================================================
     */
  }

  function remove(partId) {
    setItems((prev) => prev.filter((p) => (p.id ?? p._id) !== partId));
  }

  function clear() {
    setItems([]);
    showToast("🧹 Cleared! Start a fresh comparison.");

    /**
     * ===================== BACKEND TODO (optional) =====================
     * If backend supports clearing stored compare list for user:
     * DELETE /api/compare
     * ================================================================
     */
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
    }),
    [items]
  );

  return (
    <CompareContext.Provider value={value}>
      {children}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999]">
          <div
            className="rounded-xl px-4 py-2 text-sm font-medium
                       bg-slate-900/90 backdrop-blur ring-1 ring-white/10
                       text-white shadow-lg"
          >
            {toast}
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


