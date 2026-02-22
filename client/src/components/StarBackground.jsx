export default function StarBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10" />

      {/* stars layer */}
      <div className="absolute -inset-40 opacity-[0.35] animate-[floatStars_12s_ease-in-out_infinite]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,.35) 1px, transparent 2px), " +
              "radial-gradient(circle at 80% 40%, rgba(255,255,255,.25) 1px, transparent 2px), " +
              "radial-gradient(circle at 50% 70%, rgba(255,255,255,.30) 1px, transparent 2px)",
            backgroundSize: "180px 180px",
          }}
        />
      </div>
    </div>
  );
}
