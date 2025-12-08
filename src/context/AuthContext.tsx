
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
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
  // Inicializa estado de auth a partir do localStorage SINCRO- NAMENTE
  // para evitar flashes de rota não-autenticada durante o primeiro render.
  const initial = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { token?: string; user?: Usuario } | null;
        if (parsed && parsed.token) {
          try {
            (window as unknown as Record<string, unknown>).__chama_token = parsed.token;
          } catch {
            // ignore
          }
          return { token: parsed.token || null, user: parsed.user || null };
        }
      }
    } catch {
      // ignore parse errors
    }
    return { token: null as string | null, user: null as Usuario | null };
  })();

  const [userState, setUserState] = useState<Usuario | null>(initial.user);
  const [tokenState, setTokenState] = useState<string | null>(initial.token);

  // keep original names for rest of file
  const user = userState;
  const token = tokenState;

  const login = (newToken: string, newUser: Usuario | null, remember = false) => {
    setTokenState(newToken);
    setUserState(newUser || null);
    try {
      (window as unknown as Record<string, unknown>).__chama_token = newToken;
    } catch { /* empty */ }
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
    setTokenState(null);
    setUserState(null);
    try {
      delete (window as unknown as Record<string, unknown>).__chama_token;
    } catch { /* empty */ }
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