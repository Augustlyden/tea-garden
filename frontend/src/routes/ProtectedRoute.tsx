import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({children}: { children: ReactNode}) => {
  const { admin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Laddar...</div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace/>;
  }
  return children;
};
