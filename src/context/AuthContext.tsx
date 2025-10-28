import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

type User = {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  perfil: { id: number; nome: string };
  unidadeOperacional: { id: number; nome: string };
};

type AuthContextType = {
  user: User | null;
  login: (matricula: string, senha: string) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Função de login
  const login = async (matricula: string, senha: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", { matricula, senha });
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      setUser(user);
      console.log("✅ Login bem-sucedido:", user);
      return true; // sucesso
    } catch (error: any) {
      console.error("❌ Erro ao fazer login:", error.response?.data || error.message);
      alert("Usuário ou senha inválidos.");
      return false; // falha
    }
  };

  // 🔹 Função de logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔹 Mantém o login se o token existir
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("🔐 Usuário ainda autenticado (token encontrado).");
      // aqui você pode fazer uma requisição ao backend para validar o token
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
