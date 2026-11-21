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

export interface Issue {
  number: number;
  title: string;
  url: string;
}

export interface IssueListItem extends Issue {
  author: string;
}

export interface IssueInput {
  title: string;
  description: string;
}

export interface IssuesListProps {
  issues: IssueListItem[];
}

export interface IssuesFormProps {
  onCreated: () => void | Promise<void>
}