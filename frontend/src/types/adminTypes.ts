export interface AdminData {
  id: number;
  username: string;
}

export interface AdminLoginResponse {
  success: boolean;
  data: AdminData;
}

export interface AuthContextType {
  admin: AdminData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}