//import React from 'react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer style={{ fontSize: '10px', textAlign: 'center', padding: '20px 0', marginTop: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span>Desenvolvido por</span>
        <Logo size="small" />
      </div>
    </footer>
  );
}