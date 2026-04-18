import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, HeartPulse, BookUser, User, HelpCircle, StickyNote, Download } from 'lucide-react';
import logoMobile from '../../assets/logo_mobile.png';
import Footer from '../Footer';
import styles from './Layout.module.css';

// Interface para o evento de instalação do PWA
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Estendendo a interface global do Window para o PWA
declare global {
  interface Window {
    deferredPWAInstallPrompt: BeforeInstallPromptEvent | null;
  }
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTutorial: () => void;
}

const Layout = ({ children, activeTab, setActiveTab, onOpenTutorial }: LayoutProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      window.deferredPWAInstallPrompt = promptEvent;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = deferredPrompt || window.deferredPWAInstallPrompt;
    
    if (promptEvent && typeof promptEvent.prompt === 'function') {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        console.log('Usuário aceitou a instalação');
      }
      setDeferredPrompt(null);
      window.deferredPWAInstallPrompt = null;
    } else {
      alert('Para instalar o app, abra o menu do navegador e selecione "Adicionar à Tela Inicial" ou "Instalar Aplicativo".');
    }
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto', gap: '10px' }}>
          <img src={logoMobile} alt="Logo Saúde da Mulher" style={{ height: '36px' }} />
          <h1 className={styles.headerTitle}>Saúde da Mulher</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className={styles.helpButton} 
            onClick={handleInstallClick} 
            title="Baixar App"
            style={{ position: 'relative', right: '0' }}
          >
            <Download size={20} />
          </button>
          <button 
            className={styles.helpButton} 
            onClick={onOpenTutorial} 
            title="Como usar"
            style={{ position: 'relative', right: '0' }}
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div style={{ flex: '1 0 auto' }}>
          {children}
        </div>
      </main>

      <div className={styles.bottomSection}>
        <nav className={styles.bottomNav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'calendar' ? styles.active : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <CalendarIcon size={24} />
            <span>Calendário</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'health' ? styles.active : ''}`}
            onClick={() => setActiveTab('health')}
          >
            <HeartPulse size={24} />
            <span>Saúde</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={30} />
            <span>Perfil</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'notes' ? styles.active : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <StickyNote size={24} />
            <span>Anotações</span>
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'contacts' ? styles.active : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <BookUser size={24} />
            <span>Contatos</span>
          </button>
        </nav>
        <Footer />
      </div>
    </div>
    
  );
};

export default Layout;