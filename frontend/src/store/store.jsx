import { createContext, useContext, useState } from "react";
import { api, setToken } from "../api.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("hc_user");
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  });

  function persist(token, u) {
    setToken(token);
    try { localStorage.setItem("hc_user", JSON.stringify(u)); } catch (e) { /* noop */ }
    setUser(u);
  }

  function updateUser(u) {
    try { localStorage.setItem("hc_user", JSON.stringify(u)); } catch (e) { /* noop */ }
    setUser(u);
  }

  async function login(credentials) {
    const d = await api("/auth/login", { method: "POST", body: credentials });
    persist(d.token, d.user);
  }

  async function register(data) {
    const d = await api("/auth/register", { method: "POST", body: data });
    persist(d.token, d.user);
  }

  function logout() {
    setToken(null);
    try { localStorage.removeItem("hc_user"); } catch (e) { /* noop */ }
    setUser(null);
  }

  return <AuthCtx.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
