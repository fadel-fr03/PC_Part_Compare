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

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    const user = data.data.user;
    const token = data.data.token;

    setUser(user);
    setToken(token);

    return { user, token };
  }

  async function register({ name, email, password }) {
    const res = await fetch(API_ENDPOINTS.auth.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Register failed");
    }

    const user = data.data.user;
    const token = data.data.token;

    setUser(user);
    setToken(token);

    return { user, token };
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

