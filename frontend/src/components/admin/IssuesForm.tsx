import React, { useState } from "react";
import type { IssueInput, IssuesFormProps } from "../../types/adminTypes";
import { adminService } from "../../services/admin/adminService";
import styles from "../../css/issuesForm.module.css";

const emptyIssue: IssueInput = {
  title: '',
  description: '',
};

export const IssuesForm = ({ onCreated }: IssuesFormProps) => {
  const [formValues, setFormValues] = useState<IssueInput>(emptyIssue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = formValues.title.trim();
    const description = formValues.description.trim();

    if (title.length === 0) {
      setError('En titel krävs');
      return;
    }

    if (description.length === 0) {
      setError('En beskrivning behövs');
      return;
    }

    setError('');

    const data = {
      'title': title,
      'description': description,
    };

    setIsLoading(true);
    try {
      await adminService.createIssue(data);
      setFormValues(emptyIssue);
      onCreated();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Något gick fel');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Skapa GitHub Issue</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="title">Titel</label>
          <input 
            type="text"
            name="title"
            onChange={handleChange}
            value={formValues.title}
            id="title"
            disabled={isLoading}
            className={styles.input}
            maxLength={100}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="description">Beskrivning</label>
          <textarea 
            name="description"
            onChange={handleChange}
            value={formValues.description}
            id="description"
            disabled={isLoading}
            maxLength={2000}
            className={`${styles.input} ${styles.textarea} ${styles.codeFont}`}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className={styles.buttonGroup}>
          <button className={styles.button} disabled={isLoading} type="submit">
            Skapa Issue
          </button>
          <button type="button" className={styles.clear} disabled={isLoading} onClick={() => setFormValues(emptyIssue)}>
            Rensa
          </button>
        </div>
      </form>
    </div>
  );
};
