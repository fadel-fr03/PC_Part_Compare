import { motion } from "framer-motion";
import StarBackground from "./StarBackground";

import cpu from "../assets/icons/cpu.svg";
import gpu from "../assets/icons/gpu.svg";
import mobo from "../assets/icons/mobo.svg";

function IconBtn({ src, label }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      className="h-8 w-8 rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur
                 flex items-center justify-center text-white/80 hover:text-white transition"
      title={label}
    >
      <img src={src} alt={label} className="h-4 w-4 opacity-90" />
    </motion.div>
  );
}

/** Brand wordmark: Compariq */
function BrandWordmark({ size = "text-2xl" }) {
  return (
    <span className={`${size} font-extrabold tracking-tight leading-none`}>
      <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
        Compa
      </span>
      <span className="text-white">riq</span>
    </span>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      <StarBackground />

      <div className="relative mx-auto max-w-4xl px-4 py-5">
        <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 backdrop-blur p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Brand + tagline */}
            <div>
              <div className="flex items-center gap-3">
                <BrandWordmark size="text-2xl" />

                {/* tiny brand accent */}
                <span className="hidden sm:block h-[2px] w-16 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-80" />
              </div>

              <p className="mt-2 text-sm text-white/60 leading-relaxed max-w-xs">
                Intelligent PC part comparison — specs, reviews, and side-by-side clarity.
              </p>

              {/* pills */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                  Specs
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                  Reviews
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                  Compare
                </span>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2">
              <IconBtn src={cpu} label="CPU" />
              <IconBtn src={gpu} label="GPU" />
              <IconBtn src={mobo} label="Motherboard" />
            </div>
          </div>

          {/* Bottom line */}
          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/55">© {year} Compariq. All rights reserved.</p>

            <motion.p
              className="text-xs text-white/55"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              Team: Hazar • Fadel • Issa
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
}





