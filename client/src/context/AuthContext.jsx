import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_ENDPOINTS } from "../config/api";

const AuthContext = createContext(null);
const LS_KEY = "compariq_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user ?? null);
        setToken(parsed.token ?? null);
      }
    } catch (e) {
      console.warn("Failed to parse auth state:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem(LS_KEY, JSON.stringify({ token, user }));
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [token, user]);

  async function login({ email, password }) {
    const res = await fetch(API_ENDPOINTS.auth.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!res.ok) {
      const msg =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors.length > 0
          ? data.errors[0].msg
          : null) ||
        "Login failed";
      throw new Error(msg);
    }

    const loggedInUser = data.data.user;
    const authToken = data.data.token;

    setUser(loggedInUser);
    setToken(authToken);

    return { user: loggedInUser, token: authToken };
  }

  async function register({ username, email, password }) {
    const payload = {
      username: username?.trim(),
      email: email?.trim(),
      password,
    };

    console.log("REGISTER PAYLOAD:", payload);

    const res = await fetch(API_ENDPOINTS.auth.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);

    if (!res.ok) {
      const msg =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors.length > 0
          ? data.errors[0].msg
          : null) ||
        "Register failed";
      throw new Error(msg);
    }

    const registeredUser = data.data.user;
    const authToken = data.data.token;

    setUser(registeredUser);
    setToken(authToken);

    return { user: registeredUser, token: authToken };
  }

  function logout() {
    setUser(null);
    setToken(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      loading,
      login,
      register,
      logout,
      setUser,
      setToken,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}