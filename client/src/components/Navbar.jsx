import { NavLink } from "react-router-dom";
import BrandLogo from "./BrandLogo";
import { useAuth } from "../context/AuthContext"; // ✅ auth state

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "relative px-3 py-2 text-sm font-medium transition",
          "text-slate-200 hover:text-white",
          isActive ? "text-white" : "",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          <span>{children}</span>
          <span
            className={[
              "absolute left-3 right-3 -bottom-1 h-[2px] rounded-full transition-all",
              isActive
                ? "bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 opacity-100"
                : "opacity-0",
            ].join(" ")}
          />
        </>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-slate-950/70 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="h-16 flex items-center justify-between">
            <BrandLogo />

            <nav className="flex items-center gap-1">
              <NavItem to="/">Home</NavItem>
              <NavItem to="/browse">Browse</NavItem>

              {/* Replace Login with Logout when logged in */}
              {!isAuthenticated ? (
                <NavItem to="/login">Login</NavItem>
              ) : (
                <button
                  onClick={() => {
                    /**
                     * BACKEND TODO (optional):
                     * If your backend has logout/token invalidation endpoint,
                     * call it inside AuthContext.logout() or here before clearing state.
                     */
                    logout();
                  }}
                  className="relative px-3 py-2 text-sm font-medium transition text-slate-200 hover:text-white"
                  type="button"
                  title={user?.email || "Logout"}
                >
                  Logout
                  <span className="absolute left-3 right-3 -bottom-1 h-[2px] rounded-full transition-all opacity-0 hover:opacity-100 bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400" />
                </button>
              )}

              {/* Show Sign up only when logged out */}
              {!isAuthenticated && (
                <NavLink
                  to="/register"
                  className="ml-2 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold
                             bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 text-slate-950
                             hover:opacity-95 transition shadow-[0_10px_30px_rgba(79,70,229,.25)]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z"
                      fill="currentColor"
                    />
                  </svg>
                  Sign up
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}




