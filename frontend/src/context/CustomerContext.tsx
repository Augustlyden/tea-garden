import { createContext, useContext, useEffect, useState } from "react";
import type { Customer, CustomerAuthContextType } from "../types/customerTypes";
import type { ReactNode } from 'react';
import { customerService } from "../services/customerService";

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within an CustomerAuthProvider');
  }
  return context;
}

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer ] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await customerService.checkMe();
        setCustomer(data.data);
      } catch (error) {
        setCustomer(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await customerService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setCustomer(null);
    }
  };

  const value = {
    customer,
    isLoading,
    logout
  };

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};