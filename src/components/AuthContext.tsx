import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { dataEncrypt } from "../utils/data-encrypt";
import { dataDecrypt } from "../utils/data-decrypt";

interface AuthContextType {
  isAuthenticated: boolean;
  role: number | null;
  verifiedOwner: boolean | null;
  opticalId: number | null;
  idUser: number | null;
  login: (
    token: string,
    role: number,
    opticalId?: number | null,
    idUser?: number | null,
    emailUser?: string | null,
    verifiedOwner?: boolean | null,
  ) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [opticalId, setOpticalId] = useState<number | null>(null);
  const [idUser, setIdUser] = useState<number | null>(null);
  const [verifiedOwner, setVerifiedOwner] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = dataDecrypt(localStorage.getItem("token"));
    const roleStr = dataDecrypt(localStorage.getItem("role"));
    const idUserStr = dataDecrypt(localStorage.getItem("idUser"));
    const opticalStr = dataDecrypt(localStorage.getItem("opticalId"));
    const verifiedOwnerStr = dataDecrypt(localStorage.getItem("verifiedOwner"));

    const parsedRole = Number.parseInt(roleStr || "");
    const parsedIdUser = Number.parseInt(idUserStr || "");
    const parsedOptical = opticalStr ? Number.parseInt(opticalStr) : null;

    if (token && !Number.isNaN(parsedRole)) {
      setIsAuthenticated(true);
      setUserRole(parsedRole);
      setIdUser(parsedIdUser);
      setOpticalId(parsedOptical);
      setVerifiedOwner(verifiedOwnerStr === "true");
    } else {
      localStorage.clear();
    }

    setLoading(false);
  }, []);

  const login = (
    token: string,
    role: number,
    opticalId?: number | null,
    idUser?: number | null,
    verifiedOwner?: boolean | null
  ) => {
    localStorage.setItem("token", dataEncrypt(token));
    localStorage.setItem("role", dataEncrypt(String(role)));
    localStorage.setItem("idUser", dataEncrypt(String(idUser)));
    localStorage.setItem("opticalId", dataEncrypt(String(opticalId)));
    localStorage.setItem("verifiedOwner", dataEncrypt(String(verifiedOwner)));

    setIsAuthenticated(true);
    setUserRole(role);
    setIdUser(idUser ?? null);
    setOpticalId(opticalId ?? null);
    setVerifiedOwner(verifiedOwner ?? null);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    setOpticalId(null);
    setIdUser(null);
    setVerifiedOwner(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role: userRole,
        verifiedOwner,
        opticalId,
        idUser,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
