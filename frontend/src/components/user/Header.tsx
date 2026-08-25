import styles from '../../css/header.module.css';
import { Link } from 'react-router-dom';
import { CartIcon } from './CartIcon';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link className={`${styles.link} ${styles.logo}`} to={'/'}>Tea Garden</Link>
      <div className={styles.headerLinks}>
        <Link className={styles.link} to={'/shop/products'}>Produkter</Link>
        <CartIcon />
      </div>
    </header>
  );
};
