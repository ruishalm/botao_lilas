import { useState, useEffect, useRef } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import styles from './Calendar.module.css';
import { Droplet } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showSecretButton, setShowSecretButton] = useState(false);
  const secretTimer = useRef<number | null>(null);
  
  // Notas salvas no localStorage do navegador da usuária (Cookies locais)
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const savedNotes = localStorage.getItem('calendarNotes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
  }, [notes]);
  
  // Fictício: A última menstruação foi há 18 dias atrás
  const lastPeriodStart = new Date();
  lastPeriodStart.setDate(new Date().getDate() - 18);
  
  // Ciclo médio de 28 dias
  const cycleLength = 28; 
  const periodDuration = 5;

  const handleSecretPress = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setShowSecretButton(true);
  };

  const startSecretAlert = () => {
    secretTimer.current = window.setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300, 100, 300]);
      }
      alert("Ajuda está a caminho!");
      setShowSecretButton(false);
    }, 5000);
  };

  const endSecretAlert = () => {
    if (secretTimer.current) {
      clearTimeout(secretTimer.current);
      secretTimer.current = null;
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const dateString = date.toISOString().split('T')[0];
    setNoteText(notes[dateString] || '');
  };

  const saveNote = () => {
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const updatedNotes = { ...notes };
      
      if (noteText.trim() === '') {
        delete updatedNotes[dateString];
      } else {
        updatedNotes[dateString] = noteText;
      }
      
      setNotes(updatedNotes);
      setSelectedDate(null);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.statusCard}>
        <div className={styles.statusTitle}>Dia 18 do Ciclo</div>
        <div className={styles.statusSub}>Faltam 10 dias para a próxima menstruação</div>
        <button className={styles.logButton}>Registrar Início hoje</button>
      </div>

      <div className={styles.calendarContainer}>
        <CalendarHeader 
          currentDate={currentDate} 
          setCurrentDate={setCurrentDate} 
        />
        <CalendarGrid 
          currentDate={currentDate} 
          onSecretPress={handleSecretPress}
          onDayClick={handleDayClick}
          lastPeriodStart={lastPeriodStart}
          cycleLength={cycleLength}
          periodDuration={periodDuration}
          notes={notes}
        />
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span style={{ fontWeight: 'bold', color: '#db2777' }}>Último ciclo: 28 dias [intervalo de 28 dias]</span>
        </div>
      </div>

      {selectedDate && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              Anotações - {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </h3>
            
            <button className={styles.desceuButton} onClick={() => console.log('Desceu!')}>
              <Droplet size={18} color="#ef4444" fill="#ef4444" />
              <span>DESCEU!</span>
            </button>

            <textarea
              className={styles.modalTextarea}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Como você está se sentindo hoje? Sintomas, humor..."
            />
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancelar</button>
              <button className={styles.saveBtn} onClick={saveNote}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {showSecretButton && (
        <div className={styles.secretOverlay} onClick={() => setShowSecretButton(false)}>
          <button 
            className={styles.hugeSecretButton}
            onMouseDown={startSecretAlert}
            onMouseUp={endSecretAlert}
            onMouseLeave={endSecretAlert}
            onTouchStart={startSecretAlert}
            onTouchEnd={endSecretAlert}
            onClick={(e) => e.stopPropagation()}
          >
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;