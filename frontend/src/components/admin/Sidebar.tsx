import { useEffect, useState } from "react";
import styles from '../../css/sidebar.module.css';
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const logoutAdmin = async () => {
    try {
      await logout();
      setIsLoading(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Öppna meny"
        aria-expanded={isOpen}
      >
        <span className={`${styles.bar} ${isOpen ? styles.barOpen : ''}`}></span>
        <span className={`${styles.bar} ${isOpen ? styles.barOpen : ''}`}></span>
        <span className={`${styles.bar} ${isOpen ? styles.barOpen : ''}`}></span>
      </button>

      <div className={`${styles.backdrop} ${isOpen ? styles.visible : ''}`} onClick={toggleMenu} />

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>Tea Garden</div>
          <button className={styles.close} onClick={toggleMenu} aria-label="Stäng meny">
            &times;
          </button>
        </div>

        <nav aria-label="Admin Meny" className={styles.navLinks}>
          <Link className={styles.link} to="/admin/products">Produkter</Link>
          <Link className={styles.link} to="/admin/products/create">Skapa Produkt</Link>
          <Link className={styles.link} to="/admin/orders">Beställningar</Link>
          <button disabled={isLoading} onClick={logoutAdmin} className={styles.logout}>
            Logga Ut
          </button>
        </nav>

      </aside>
    </>
  );
};
