import { useEffect, useState } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ReviewsList from "../components/ReviewsList";
import { API_ENDPOINTS } from "../config/api";

export default function Dashboard() {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    updateProfile,
    deleteAccount,
  } = useAuth();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    setUsername(user?.username || "");
    setEmail(user?.email || "");
  }, [user]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-white/70">
        Loading dashboard...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!username.trim()) {
      setProfileError("Username is required.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setProfileError("Please enter a valid email.");
      return;
    }

    try {
      setProfileLoading(true);

      await updateProfile({
        username: username.trim(),
        email: email.trim(),
      });

      setProfileSuccess("Profile updated successfully!");
    } catch (err) {
      setProfileError(err.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    try {
      setPasswordLoading(true);

      const res = await fetch(API_ENDPOINTS.auth.changePassword, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      setCurrentPassword("");
      setNewPassword("");
      setPasswordSuccess("Password updated successfully!");
    } catch (err) {
      setPasswordError(err.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await deleteAccount();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err.message || "Failed to delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="relative px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* HERO */}
        <div className="relative mb-8 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.12),transparent_30%)]" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white md:text-4xl">
                Welcome back,
                <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent">
                  {user?.username || "User"}
                </span>
              </h1>

              <p className="mt-3 text-sm text-white/60">
                Manage your account, track your reviews, and keep your build
                decisions organized.
              </p>
            </div>

            <div className="flex gap-3">
              <NavLink
                to="/browse"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-950
                           bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500
                           hover:opacity-95"
              >
                Browse
              </NavLink>

              <NavLink
                to="/compare"
                className="rounded-xl px-4 py-2 text-sm font-semibold bg-white/10
                           text-white ring-1 ring-white/15 hover:bg-white/15"
              >
                Compare
              </NavLink>
            </div>
          </div>
        </div>

        {/* TOP GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* PROFILE CARD */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <h2 className="text-xl font-bold text-white">My Profile</h2>
            <p className="mt-2 text-sm text-white/60">
              Update your account information here.
            </p>

            <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (profileError) setProfileError("");
                  }}
                  className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (profileError) setProfileError("");
                  }}
                  className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
                  placeholder="Enter your email"
                />
              </div>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <span className="text-white/60">Role</span>
                  <span className="font-semibold text-cyan-300">
                    {user?.role || "user"}
                  </span>
                </div>
              </div>

              {profileError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {profileError}
                </div>
              )}

              {profileSuccess && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                  {profileSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-950
                           bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500
                           hover:opacity-95 disabled:opacity-60"
              >
                {profileLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          {/* QUICK ACTIONS */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>

            <div className="mt-6 flex flex-col gap-4">
              <NavLink
                to="/browse"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <p className="font-semibold text-white">Browse Parts</p>
                <p className="mt-1 text-xs text-white/50">
                  Explore CPUs, GPUs, RAM, storage, and more
                </p>
              </NavLink>

              <NavLink
                to="/compare"
                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <p className="font-semibold text-white">Compare Parts</p>
                <p className="mt-1 text-xs text-white/50">
                  Compare up to 3 parts side by side
                </p>
              </NavLink>
            </div>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <h2 className="text-xl font-bold text-white">Change Password</h2>
          <p className="mt-2 text-sm text-white/60">
            Keep your account secure by updating your password.
          </p>

          <form
            onSubmit={handlePasswordChange}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm text-white/70">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                className="w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3 text-white outline-none focus:ring-white/25"
                placeholder="Enter new password"
              />
            </div>

            <div className="md:col-span-2">
              {passwordError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                  {passwordSuccess}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-950
                           bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500
                           hover:opacity-95 disabled:opacity-60"
              >
                {passwordLoading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>

        {/* DELETE ACCOUNT */}
        <div className="mt-8 rounded-[28px] border border-red-500/20 bg-red-500/[0.06] p-6 backdrop-blur">
          <h2 className="text-xl font-bold text-red-200">Delete Account</h2>
          <p className="mt-2 text-sm text-red-100/70">
            This action is permanent and cannot be undone.
          </p>

          {deleteError && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {deleteError}
            </div>
          )}

          <div className="mt-5">
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="rounded-xl px-4 py-3 text-sm font-semibold bg-red-500/20 text-red-100 ring-1 ring-red-500/30 hover:bg-red-500/30 disabled:opacity-60"
            >
              {deleteLoading ? "Deleting Account..." : "Delete My Account"}
            </button>
          </div>
        </div>

        {/* MY REVIEWS */}
        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-xl font-bold text-white">My Reviews</h2>
          <p className="mt-2 text-sm text-white/60">
            Here you can view and manage the reviews you have written.
          </p>

          <div className="mt-5">
            <ReviewsList showOnlyMine />
          </div>
        </div>

        {/* STATUS */}
        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-center">
          <h2 className="text-xl font-bold text-white">Dashboard Status</h2>
          <p className="mt-3 text-sm text-white/60">
            This is a protected page. Only authenticated users can access it.
          </p>
        </div>
      </div>
    </div>
  );
}