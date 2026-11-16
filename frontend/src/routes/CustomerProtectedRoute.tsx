import type { ReactNode } from "react";
import { useCustomerAuth } from "../context/CustomerContext";
import { Navigate } from 'react-router-dom';
import { Spinner } from "../components/shared/Spinner";

export const CustomerProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { customer, isLoading } = useCustomerAuth();

  if (isLoading) return <Spinner />;
  if (!customer) return <Navigate to="/" replace />;

  return <>{children}</>;
};