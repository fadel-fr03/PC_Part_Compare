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
  
     await register({ name, email, password });
      navigate("/browse");
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Create account</h1>
      <p className="mt-1 text-sm text-white/60">Join Compariq.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-white/70">Name</label>
          <input
            className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-white outline-none focus:ring-white/25"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hazar"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Email</label>
          <input
            className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-white outline-none focus:ring-white/25"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Password</label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-white outline-none focus:ring-white/25"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">Confirm</label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-2 text-white outline-none focus:ring-white/25"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          disabled={submitting}
          className="w-full rounded-xl px-4 py-2 font-semibold text-slate-950
                     bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500
                     hover:opacity-95 disabled:opacity-60"
        >
          {submitting ? "Creating..." : "Sign up"}
        </button>

        <p className="text-sm text-white/60">
          Already have an account?{" "}
          <NavLink to="/login" className="text-white hover:underline">
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
}

