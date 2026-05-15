import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);

  const show = useCallback((text) => {
    setMsg(text);
    setTimeout(() => setMsg(null), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* Toast UI */}
      {msg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999]">
          <div className="rounded-xl px-4 py-2 text-sm font-medium
                          bg-slate-900/90 backdrop-blur ring-1 ring-white/10
                          text-white shadow-lg animate-fade-in">
            {msg}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
