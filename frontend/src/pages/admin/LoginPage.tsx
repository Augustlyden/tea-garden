import { useState } from "react"
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import styles from "../../css/login.module.css";
import { Spinner } from "../../components/shared/Spinner";

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

  if (admin) {
    return <Navigate to={"/admin/products"} replace />;
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.container}>
          <div className={styles.loginBox}>
            <h1 className={styles.title}>Tea Garden</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="username">
                  <span className={styles.asterisk}>*</span>
                  Användarnamn:
                </label>
                <input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={styles.input}
                  id="username"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password"> 
                  <span className={styles.asterisk}>*</span>
                  Lösenord:
                </label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.input}
                  id="password"
                />
              </div>
              {error && <p className="error">{error} <br /> Prova att ladda om sidan.</p>}
              <button className={styles.button} type="submit"> Login </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;

