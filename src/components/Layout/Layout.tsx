import type { ReactNode } from 'react';
import { Calendar as CalendarIcon, HeartPulse, BookUser, User, HelpCircle, StickyNote } from 'lucide-react';
import logoMobile from '../../assets/logo_mobile.png';
import Footer from '../Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTutorial: () => void;
}

const Layout = ({ children, activeTab, setActiveTab, onOpenTutorial }: LayoutProps) => {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <img src={logoMobile} alt="Logo Saúde da Mulher" style={{ height: '36px', marginRight: 'auto' }} />
        <button className={styles.helpButton} onClick={onOpenTutorial} title="Como usar">
          <HelpCircle size={20} />
        </button>
      </header>

      <main className={styles.mainContent}>
        {children}
        <Footer />
      </main>

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
    </div>
    
  );
};

export default Layout;