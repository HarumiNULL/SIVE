import React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  required_rol?: number | null;
}

export default function ProtectedRoute({ children, required_rol }: ProtectedRouteProps) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    // 💡 Puedes usar un componente de spinner o simplemente un div con texto
    return <div>Cargando autenticación...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if(required_rol != null && role != required_rol){
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
