
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type Usuario = {
  id?: number;
  nome?: string;
  matricula?: string;
  email?: string;
  patente?: string;
};

type AuthContextType = {
  user: Usuario | null;
  token: string | null;
  login: (token: string, user: Usuario | null, remember?: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "chama_auth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // load persisted auth (if any)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { token?: string; user?: Usuario } | null;
        if (parsed && parsed.token) {
          setToken(parsed.token);
          setUser(parsed.user || null);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const login = (newToken: string, newUser: Usuario | null, remember = false) => {
    setToken(newToken);
    setUser(newUser || null);
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }));
      } catch {
        // ignore storage errors
      }
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};