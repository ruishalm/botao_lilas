import Logo from '../Logo';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <p className={styles.footerText}>
        © {new Date().getFullYear()} Botão Lilás
      </p>
      <div className={styles.logoContainer}>
        <Logo size="small" />
      </div>
    </footer>
  );
};

export default Footer;
