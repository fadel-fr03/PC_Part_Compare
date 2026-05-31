import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const isAdmin = user?.role === "admin";

  const linkClass = ({ isActive }) =>
    [
      "relative px-4 py-2 text-sm font-semibold transition duration-200",
      isActive
        ? "text-white"
        : "text-white/65 hover:text-white",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-white/10">
      {/* top glow line */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <NavLink to="/">
            <BrandLogo />
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-1.5 shadow-[0_0_30px_rgba(0,0,0,0.25)]">
            {["/", "/browse", "/compare"].map((path, i) => {
              const label = ["Home", "Browse", "Compare"][i];
              return (
                <NavLink key={path} to={path} className={linkClass}>
                  {({ isActive }) => (
                    <span className="relative">
                      {label}
                      <span
                        className={[
                          "absolute left-0 -bottom-1 h-[2px] w-full rounded-full transition-all duration-300",
                          isActive
                            ? "bg-gradient-to-r from-cyan-400 to-fuchsia-500 opacity-100"
                            : "opacity-0 group-hover:opacity-100",
                        ].join(" ")}
                      />
                    </span>
                  )}
                </NavLink>
              );
            })}

            {isAuthenticated && (
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
            )}

            {isAuthenticated && isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  className="hidden sm:block text-sm text-white/70 hover:text-white transition"
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="rounded-2xl px-5 py-2 text-sm font-semibold text-slate-950
                             bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500
                             shadow-[0_10px_30px_rgba(99,102,241,0.35)]
                             hover:scale-[1.04] hover:opacity-95 transition"
                >
                  Sign up
                </NavLink>
              </>
            ) : (
              <>
                {/* user badge */}
                <div className="hidden sm:flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/10 px-3 py-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 text-sm font-bold">
                    {(user?.username || "U")[0].toUpperCase()}
                  </div>

                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">
                      {user?.username || "User"}
                    </p>
                    <p className="text-xs text-white/50">
                      {user?.role || "member"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden pb-3">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
            <NavLink to="/" className="px-3 py-2 text-sm text-white/70 hover:text-white">Home</NavLink>
            <NavLink to="/browse" className="px-3 py-2 text-sm text-white/70 hover:text-white">Browse</NavLink>
            <NavLink to="/compare" className="px-3 py-2 text-sm text-white/70 hover:text-white">Compare</NavLink>

            {isAuthenticated && (
              <NavLink to="/dashboard" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                Dashboard
              </NavLink>
            )}

            {isAuthenticated && isAdmin && (
              <NavLink to="/admin" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                Admin
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


