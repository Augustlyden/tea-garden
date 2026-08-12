import { useState } from "react"
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import styles from "../../css/login.module.css";

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, admin } = useAuth();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const result = await login(username, password);

    if (!result.success) {
      setError(result.error ?? 'Inloggning misslyckades');
    }
  };

  if (isLoading) {
    return <div>Laddar...</div>
  }

  if (admin) {
    return <Navigate to={"/admin/products"} replace />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="">Användarnamn:</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="">Lösenord:</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          {error && <p className={error}>{error}</p>}
          <button className={styles.button} type="submit"> Logga in </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

