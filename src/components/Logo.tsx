import React from 'react';
import styles from './Logo.module.css';

// Define as propriedades que o componente pode receber
interface LogoProps {
  /**
   * Define a variante de cor do logo.
   * 'default' para fundos claros (texto escuro).
   * 'inverse' para fundos escuros (texto claro).
   * @default 'default'
   */
  variant?: 'default' | 'inverse';
  /**
   * Define o tamanho do logo.
   * @default 'normal'
   */
  size?: 'normal' | 'small';
  /** O link de destino para o logo. */
  href?: string;
  /** O texto de ajuda exibido ao passar o mouse. */
  title?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'default', size = 'normal', href = '#', title = 'Página Inicial' }) => {
  // Combina a classe base com a classe da variante para aplicar as cores corretas
  const logoClassName = `${styles.rafaMunhozLogo} ${styles[variant]} ${styles[size]}`;

  return (
    <a href={href} className={styles.svgLogoLink} title={title} target="_blank" rel="noopener noreferrer">
      <svg className={logoClassName} viewBox="0 0 220 40" xmlns="http://www.w3.org/2000/svg">
        <rect className={styles.logoBgCapsule} x="-10" y="-5" width="240" height="50" rx="25"/>
        <path className={styles.logoFlair} transform="translate(-5, -5) scale(2.0)" d="M5,0.7 L9.33,7.5 L0.67,7.5 Z M5,9.3 L0.67,2.5 L9.33,2.5 Z" />
        <text x="20" y="27">
            <tspan className={styles.logoFirstName}>Rafa</tspan><tspan className={styles.logoLastName}> Munhoz</tspan>
        </text>
        <path className={styles.logoUnderline} d="M20 35 H 215" />
      </svg>
    </a>
  );
};

export default Logo;