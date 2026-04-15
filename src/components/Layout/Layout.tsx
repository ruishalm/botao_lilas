import { ReactNode } from 'react';
import { Calendar as CalendarIcon, HeartPulse, BookUser } from 'lucide-react';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Saúde da Mulher</h1>
      </header>

      <main className={styles.mainContent}>
        {children}
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
          <span>Sua Saúde</span>
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