import React, { createContext, useState, useContext, type ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  role: number | null;
  login: (token: string, role: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roleStr = localStorage.getItem("role");

    const parsedRole = parseInt(roleStr, 10);

    if (token && !isNaN(parsedRole)) {
      setIsAuthenticated(true);
      setUserRole(parsedRole);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, []);

  const login = (token: string, role: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", String(role));
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role: userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
