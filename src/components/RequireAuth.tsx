import { type ReactNode, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // If auth context is undefined (shouldn't happen) treat as not authenticated
  const isAuthenticated = Boolean(auth && (auth.token || auth.user));

  if (!isAuthenticated) {
    // redirect to login, preserve attempted path in state
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export default RequireAuth;
