export interface Customer {
  id: number;
  email: string;
  name: string;
}

export interface CustomerResponse {
  success: boolean;
  data: Customer;
}

export interface CustomerAuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}