import { useEffect, useState, useCallback } from "react";
import type { IssueListItem } from "../../types/adminTypes";
import { adminService } from "../../services/admin/adminService";
import { Sidebar } from "../../components/admin/Sidebar";
import { Spinner } from "../../components/shared/Spinner";
import { IssuesList } from "../../components/admin/IssuesList";
import { IssuesForm } from "../../components/admin/IssuesForm";

export const IssuesPage = () => {
  const [issues, setIssues] = useState<IssueListItem[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchIssues = useCallback(async () => {
    try {
      setError('');
      const data = await adminService.getIssues();
      setIssues(data.data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return (
    <>
      <Sidebar />
      {isLoading ? (
        <Spinner />
      ) : (
        <main>
          {
            error 
              ? <p className="error">{error} <br /> Prova att ladda om sidan.</p> 
              : <IssuesList issues={issues} />
          }
          <IssuesForm onCreated={fetchIssues}/>
        </main>
      )}
    </>
  );
};