import { useEffect } from "react";

/**
 * Reusable confirmation dialog that replaces the native window.confirm()
 * popup with a styled modal matching the app theme.
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}) {
  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onCancel?.();
    };

    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  const confirmClasses = danger
    ? "bg-red-500/20 text-red-100 ring-1 ring-red-500/30 hover:bg-red-500/30"
    : "text-slate-950 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 hover:opacity-95";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
        onClick={() => !loading && onCancel?.()}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/90 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-fade-in">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />

        <h2
          id="confirm-dialog-title"
          className="text-xl font-bold text-white"
        >
          {title}
        </h2>

        {message && (
          <p className="mt-3 text-sm leading-7 text-white/65">{message}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onCancel?.()}
            disabled={loading}
            className="rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={() => onConfirm?.()}
            disabled={loading}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${confirmClasses}`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
