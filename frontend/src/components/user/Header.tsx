import styles from '../../css/header.module.css';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className={styles.header}>
      <Link className={`${styles.link} ${styles.logo}`} to={'/shop/'}>Tea Garden</Link>
      <div className={styles.headerLinks}>
        <Link className={styles.link} to={'/shop/products'}>Produkter</Link>
      </div>
    </header>
  );
};
