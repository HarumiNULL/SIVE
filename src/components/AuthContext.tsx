import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  role: number | null;
  opticalId: number | null; // 👈 nuevo
  login: (token: string, role: number, opticalId?: number | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [opticalId, setOpticalId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleStr = localStorage.getItem("role");
    const opticalStr = localStorage.getItem("opticalId");

    const parsedRole = parseInt(roleStr || "");
    const parsedOptical = opticalStr ? parseInt(opticalStr) : null;

    if (token && !isNaN(parsedRole)) {
      setIsAuthenticated(true);
      setUserRole(parsedRole);
      setOpticalId(parsedOptical);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setOpticalId(null);
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  const login = (token: string, role: number, opticalId?: number | null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", String(role));
    if (opticalId) localStorage.setItem("opticalId", String(opticalId));
    setIsAuthenticated(true);
    setUserRole(role);
    setOpticalId(opticalId ?? null);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    setOpticalId(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role: userRole, opticalId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
