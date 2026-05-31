import { Routes, Route, NavLink } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StarBackground from "./components/StarBackground";
import BrandLogo from "./components/BrandLogo";

import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import PartDetail from "./pages/PartDetail";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

function Home() {
  const features = [
    {
      icon: "⚙️",
      title: "Browse PC parts",
      text: "Explore CPUs, GPUs, RAM, storage, power supplies, cases, and cooling components.",
    },
    {
      icon: "⚖️",
      title: "Compare side by side",
      text: "Select two or three similar parts and view their specs in a clean comparison table.",
    },
    {
      icon: "⭐",
      title: "Read & write reviews",
      text: "Logged-in users can share ratings and reviews to help others choose better parts.",
    },
  ];

  const steps = [
    "Choose a category",
    "Select 2 or 3 parts",
    "Compare specs clearly",
  ];

  return (
    <main className="relative overflow-hidden">
      <section className="relative min-h-[calc(100vh-96px)] px-4 py-12 sm:px-6 lg:px-8">
        <StarBackground />

        <div className="pointer-events-none absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] bottom-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              PC Part Compare
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Compare hardware
              <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
                without the confusion.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-white/65 sm:text-base">
              Compariq helps users browse PC components, compare similar parts
              side by side, and make smarter build decisions using specs,
              prices, ratings, and reviews.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <NavLink
                to="/browse"
                className="rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 px-6 py-3 text-center text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(99,102,241,0.35)] transition hover:scale-[1.02] hover:opacity-95"
              >
                Start Browsing
              </NavLink>

              <NavLink
                to="/compare"
                className="rounded-2xl bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15"
              >
                Open Compare
              </NavLink>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {["MERN Stack", "JWT Auth", "MongoDB", "React + Tailwind"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/65"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-r from-cyan-400/30 via-indigo-500/20 to-fuchsia-500/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/80 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex justify-center">
                  <BrandLogo />
                </div>

                <div className="mt-6 grid gap-4">
                  {[
                    ["CPU", "Intel Core i9", "24 cores • 6.0 GHz"],
                    ["GPU", "RTX 4090", "24GB • high performance"],
                    ["RAM", "Corsair DDR5", "32GB • 6000MHz"],
                  ].map(([type, name, spec]) => (
                    <div
                      key={name}
                      className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 transition hover:bg-white/[0.08]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                            {type}
                          </p>
                          <p className="mt-1 font-bold text-white">{name}</p>
                          <p className="mt-1 text-xs text-white/50">{spec}</p>
                        </div>

                        <div className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                          Compare
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
                  Select parts, compare specs, then choose with confidence.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_35px_rgba(15,23,42,0.25)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 text-2xl ring-1 ring-white/10">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_35px_rgba(15,23,42,0.25)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-300">
                  How it works
                </p>

                <h2 className="mt-3 text-3xl font-extrabold text-white">
                  Simple flow.
                  <span className="block bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    Clear decisions.
                  </span>
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  The project focuses on making PC part comparison less
                  overwhelming by keeping the user journey short and clean.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-center"
                  >
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white ring-1 ring-white/10">
                      {index + 1}
                    </div>

                    <p className="text-sm font-semibold text-white/75">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-400/10 via-indigo-500/10 to-fuchsia-500/10 p-6 text-center shadow-[0_0_35px_rgba(15,23,42,0.25)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              Built by Team Compariq
            </p>

            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              Hazar • Fadel • Issa
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/60">
              A MERN-based PC hardware comparison platform with authentication,
              reviews, filters, admin management, and side-by-side comparison.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/parts/:id" element={<PartDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}




