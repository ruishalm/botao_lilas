import { useState } from 'react';
import { CalendarIcon, AlertTriangle, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import styles from './Tutorial.module.css';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial = ({ onClose }: TutorialProps) => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {step === 1 && (
          <div className={styles.content}>
            <div className={styles.iconContainer}>
              <CalendarIcon size={48} color="#a21caf" />
            </div>
            <h2>Bem-vinda ao Calendário!</h2>
            <p>
              Use o calendário para acompanhar seu ciclo menstrual. Clique em qualquer dia para anotar seus sintomas, humor e marcar quando a menstruação começou ou terminou.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className={styles.content}>
            <div className={`${styles.iconContainer} ${styles.alertIcon}`}>
              <ShieldAlert size={48} color="#dc2626" />
            </div>
            <h2>Em Caso de Emergência</h2>
            <p>
              Este aplicativo possui um recurso de <strong>SOCORRO OCULTO</strong>.
            </p>
            <div className={styles.instructionBox}>
              <ol>
                <li><strong>Segure</strong> qualquer dia no calendário por <strong>3 segundos</strong>.</li>
                <li>Um <strong>Botão Lilás</strong> enorme aparecerá.</li>
                <li><strong>Segure</strong> esse botão por mais <strong>3 segundos</strong>.</li>
              </ol>
            </div>
            <p className={styles.warningText}>
              <AlertTriangle size={16} />
              As autoridades e seus contatos de emergência serão avisados com sua localização!
            </p>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.dots}>
            <div className={`${styles.dot} ${step === 1 ? styles.active : ''}`} />
            <div className={`${styles.dot} ${step === 2 ? styles.active : ''}`} />
          </div>
          <button className={styles.nextButton} onClick={nextStep}>
            {step === 1 ? (
              <>Próximo <ArrowRight size={20} /></>
            ) : (
              <>Entendi <Check size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;