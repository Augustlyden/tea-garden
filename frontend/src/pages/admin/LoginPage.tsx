import { useState } from "react"
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

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
    <div>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="">Användarnamn:</label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="">Lösenord:</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit"> Logga in </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

