import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer style={{
      width: '100%',
      padding: '5px 15px 15px 15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 'auto',
      opacity: 0.7,
      boxSizing: 'border-box'
    }}>
      <p style={{ margin: 0, fontSize: '11px', color: '#db2777', flex: 1, textAlign: 'left' }}>
        © {new Date().getFullYear()} Botão Lilás
      </p>
      <div style={{ transform: 'scale(1)', transformOrigin: 'right center' }}>
        <Logo size="small" />
      </div>
    </footer>
  );
};

export default Footer;
