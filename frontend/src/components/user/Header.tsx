import styles from '../../css/header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { CartIcon } from './CartIcon';
import api from '../../config/api';
import { useCustomerAuth } from '../../context/CustomerContext';

const LOGIN_URL = `${api.defaults.baseURL}/auth/google`;

export const Header = () => {
  const { customer, isLoading, logout } = useCustomerAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <Link className={`${styles.link} ${styles.logo}`} to={'/'}>Tea Garden</Link>
      <div className={styles.headerLinks}>
        <Link className={styles.link} to={'/shop/products'}>Produkter</Link>
        {!isLoading && (
          customer ? (
            <>
              <span className={styles.customerName}>{customer.name.split(' ')[0]}</span>
              <button type='button' className={styles.logoutButton} onClick={handleLogout}>
                Logga ut
              </button>
            </>
          ) : (
            <a className={styles.link} href={LOGIN_URL}>Logga in</a>
          )
        )}
        <CartIcon />
      </div>
    </header>
  );
};
