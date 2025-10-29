import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  role: number | null;
  opticalId: number | null; // 👈 nuevo
  idUser: number | null;
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
  const [idUser, setIdUser] = useState<number|null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleStr = localStorage.getItem("role");
    const idUserStr = localStorage.getItem("idUser");
    const opticalStr = localStorage.getItem("opticalId");

    const parsedRole = parseInt(roleStr || "");
    const parsedIdUser = parseInt(idUserStr || "");
    const parsedOptical = opticalStr ? parseInt(opticalStr) : null;

    if (token && !isNaN(parsedRole)) {
      setIsAuthenticated(true);
      setUserRole(parsedRole);
      setOpticalId(parsedOptical);
      setIdUser(parsedIdUser);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setOpticalId(null);
      setIdUser(null);
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  const login = (token: string, role: number, opticalId?: number | null, idUser?: number | null) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", String(role));
    localStorage.setItem("idUser", String(idUser));
    if (opticalId !== null && opticalId !== undefined) localStorage.setItem("opticalId", String(opticalId));
    console.log("eSTE ES EL ID OPTICA",opticalId)
    setIsAuthenticated(true);
    setUserRole(role);
    setIdUser(idUser ?? null);
    setOpticalId(opticalId ?? null);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    setOpticalId(null);
    setIdUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role: userRole, opticalId, login, logout, loading, idUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
