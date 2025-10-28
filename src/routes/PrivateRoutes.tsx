import React, { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  if (!auth.user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

