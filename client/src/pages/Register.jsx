import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Name is required.";
    if (!email.trim()) return "Email is required.";
    if (!email.includes("@")) return "Enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) return setError(msg);

    try {
      setSubmitting(true);

      await register({
        username: name.trim(),
        email: email.trim(),
        password,
      });

      navigate("/browse");
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-96px)] overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] bottom-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[430px_1fr]">
        <section className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-1 rounded-[34px] bg-gradient-to-r from-fuchsia-500/40 via-indigo-500/30 to-cyan-400/40 blur-xl" />

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/85 p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400" />

            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 text-2xl ring-1 ring-white/10">
                ✨
              </div>

              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Create account
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Start comparing smarter with Compariq.
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Name
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-fuchsia-400 focus:bg-white/[0.08] sm:text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Hazar"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400 focus:bg-white/[0.08] sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-fuchsia-400 focus:bg-white/[0.08] sm:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Confirm
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cyan-400 focus:bg-white/[0.08] sm:text-base"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                disabled={submitting}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(217,70,239,0.25)] transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
              >
                {submitting ? "Creating..." : "Create Compariq Account"}
              </button>

              <p className="pt-2 text-center text-sm text-white/55">
                Already have an account?{" "}
                <NavLink
                  to="/login"
                  className="font-semibold text-white hover:underline"
                >
                  Login
                </NavLink>
              </p>
            </form>
          </div>
        </section>

        <section className="hidden lg:block">
          <p className="inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-fuchsia-300">
            Join Compariq
          </p>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-white">
            Build your account.
            <span className="block bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Compare with clarity.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-white/65">
            Create an account to write reviews, manage your profile, and make
            smarter hardware decisions with a cleaner comparison experience.
          </p>

          <div className="mt-8 grid max-w-xl grid-cols-3 gap-4">
            {["Browse", "Review", "Compare"].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur"
              >
                <p className="text-2xl font-black text-white">✦</p>
                <p className="mt-2 text-sm font-semibold text-white/75">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

