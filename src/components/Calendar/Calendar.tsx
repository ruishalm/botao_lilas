import { useState, useEffect, useRef } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import styles from './Calendar.module.css';
import { Droplet, DropletOff } from 'lucide-react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showSecretButton, setShowSecretButton] = useState(false);
  const secretTimer = useRef<number | null>(null);
  
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const savedNotes = localStorage.getItem('calendarNotes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  const [periods, setPeriods] = useState<{ start: string; end: string | null }[]>(() => {
    const saved = localStorage.getItem('calendarPeriods');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
    if (auth.currentUser) {
      setDoc(doc(db, 'users', auth.currentUser.uid), { notes }, { merge: true }).catch(console.error);
    }
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('calendarPeriods', JSON.stringify(periods));
    if (auth.currentUser) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const recentPeriods = periods.filter(p => new Date(p.start) >= oneYearAgo);
      setDoc(doc(db, 'users', auth.currentUser.uid), { periods: recentPeriods }, { merge: true }).catch(console.error);
    }
  }, [periods]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            const dbData = docSnap.data();
            if (dbData.periods) setPeriods(dbData.periods);
            if (dbData.notes) setNotes(dbData.notes);
          }
        } catch (error) {
          console.error("Erro ao carregar calendário:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  
  // Calcular ciclo length
  let userCycleLength = 28;
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile);
      if (profile.cycleLength) userCycleLength = parseInt(profile.cycleLength, 10) || 28;
    } catch (e) {}
  }

  let cycleLength = userCycleLength;
  let hasPersonalizedPattern = false;

  const sortedPeriods = [...periods].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  
  // Se temos pelo menos 4 períodos, podemos calcular 3 ciclos e fazer a média
  if (sortedPeriods.length >= 4) {
    const last4 = sortedPeriods.slice(-4);
    let totalDays = 0;
    for (let i = 0; i < 3; i++) {
      const d1 = new Date(last4[i].start + 'T00:00:00').getTime();
      const d2 = new Date(last4[i+1].start + 'T00:00:00').getTime();
      totalDays += (d2 - d1) / (1000 * 60 * 60 * 24);
    }
    cycleLength = Math.round(totalDays / 3);
    hasPersonalizedPattern = true;
  }

  let daysToNext = 0;
  let currentCycleDay = 0;
  let isPeriodOpen = false;
  
  if (sortedPeriods.length > 0) {
    const lastP = sortedPeriods[sortedPeriods.length - 1];
    isPeriodOpen = lastP.end === null;
    
    const startD = new Date(lastP.start + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    currentCycleDay = Math.floor((today.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const nextP = new Date(startD);
    nextP.setDate(nextP.getDate() + cycleLength);
    daysToNext = Math.ceil((nextP.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  const handleToggleTodayPeriod = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (!isPeriodOpen) {
      // Iniciar hoje
      setPeriods([...sortedPeriods, { start: todayStr, end: null }]);
    } else {
      // Finalizar hoje
      const updated = [...sortedPeriods];
      updated[updated.length - 1].end = todayStr;
      setPeriods(updated);
    }
  };

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

      const sendTelegramAlert = (lat?: number, lng?: number) => {
        const locationText = lat && lng
          ? `https://maps.google.com/?q=${lat},${lng}`
          : "(Localização não disponível)";

        let profileText = `\n\nDados da Vítima:` +
                          `\nNome: Não informado` +
                          `\nIdade: Não informada` +
                          `\nEndereço: Rua não informada, S/N - Bairro não informado, Cidade não informada/UF` +
                          `\nContatos: Nenhum registrado`;

        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
          try {
            const profile = JSON.parse(savedProfile);
            profileText = `\n\nDados da Vítima:` +
                          `\nNome: ${profile.name || 'Não informado'}` +
                          `\nIdade: ${profile.age || 'Não informada'}` +
                          `\nEndereço: ${profile.street || 'Rua não informada'}, ${profile.number || 'S/N'} - ${profile.neighborhood || 'Bairro não informado'}, ${profile.city || 'Cidade não informada'}/${profile.state || 'UF'}` +
                          `\nContatos: ${profile.phones?.filter((p: any) => p.number).map((p: any) => `${p.number} (${p.observation || 'Sem obs'})`).join(', ') || 'Nenhum registrado'}`;
          } catch (e) {
            console.error("Erro ao ler perfil", e);
          }
        }

        const message = `🚨 ALERTA LILÁS ACIONADO! 🚨\nPreciso de ajuda urgente!\nLocalização: ${locationText}${profileText}`;
        const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
        const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

        if (botToken && chatId) {
          fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
          }).then(response => {
            if (response.ok) {
               console.log("Alerta enviado com sucesso via Telegram.");
            } else {
               console.error("Erro ao enviar alerta via Telegram.", response);
            }
          }).catch(error => {
            console.error("Erro na requisição para o Telegram.", error);
          });
        } else {
          console.warn("Tokens do Telegram não configurados. Simulação local:");
          console.log(message);
        }

        alert("Ajuda está a caminho!");
        setShowSecretButton(false);
      };
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => sendTelegramAlert(position.coords.latitude, position.coords.longitude),
          () => sendTelegramAlert()
        );
      } else {
        sendTelegramAlert();
      }
    }, 3000);
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

  const toggleSelectedDayPeriod = () => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    const lastP = sortedPeriods[sortedPeriods.length - 1];
    
    if (isPeriodOpen) {
      if (lastP && lastP.start === dateStr) {
        // Se clicou no dia que iniciou, desfaz (remove o período)
        const updated = sortedPeriods.slice(0, -1);
        setPeriods(updated);
      } else {
        // Fechar na data selecionada
        const updated = [...sortedPeriods];
        updated[updated.length - 1].end = dateStr;
        setPeriods(updated);
      }
    } else {
      if (lastP && lastP.end === dateStr) {
        // Se clicou no dia que fechou, reabre (desfaz o fechamento)
        const updated = [...sortedPeriods];
        updated[updated.length - 1].end = null;
        setPeriods(updated);
      } else if (lastP && lastP.start === dateStr && lastP.end === dateStr) {
        // Se começou e terminou no mesmo dia, deleta
        const updated = sortedPeriods.slice(0, -1);
        setPeriods(updated);
      } else {
        // Iniciar na data escolhida
        setPeriods([...sortedPeriods, { start: dateStr, end: null }]);
      }
    }
    setSelectedDate(null); // fecha o modal
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  // Variáveis para o botão do modal
  let modalButtonText = "DESCEU AQUI!";
  let modalButtonBg = "#fee2e2";
  let modalButtonColor = "#ef4444";
  let modalButtonIcon = <Droplet size={18} fill="#ef4444" />;

  if (selectedDate) {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const lastP = sortedPeriods[sortedPeriods.length - 1];

    if (isPeriodOpen) {
      if (lastP && lastP.start === dateStr) {
        modalButtonText = "DESFAZER INÍCIO";
        modalButtonBg = "#fce7f3";
        modalButtonColor = "#db2777";
        modalButtonIcon = <DropletOff size={18} />;
      } else {
        modalButtonText = "MARCAR FIM AQUI";
        modalButtonBg = "#fce7f3";
        modalButtonColor = "#db2777";
        modalButtonIcon = <DropletOff size={18} />;
      }
    } else {
      if (lastP && lastP.end === dateStr) {
        modalButtonText = "DESFAZER FIM";
        modalButtonBg = "#fee2e2";
        modalButtonColor = "#ef4444";
        modalButtonIcon = <Droplet size={18} fill="#ef4444" />;
      } else if (lastP && lastP.start === dateStr && lastP.end === dateStr) {
        modalButtonText = "DESFAZER MARCAÇÃO";
        modalButtonBg = "#fee2e2";
        modalButtonColor = "#ef4444";
        modalButtonIcon = <Droplet size={18} fill="#ef4444" />;
      } else {
        modalButtonText = "DESCEU AQUI!";
        modalButtonBg = "#fee2e2";
        modalButtonColor = "#ef4444";
        modalButtonIcon = <Droplet size={18} fill="#ef4444" />;
      }
    }
  }

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.statusCard}>
        <div className={styles.statusTitle}>Dia {currentCycleDay} do Ciclo</div>
        <div className={styles.statusSub}>
          {daysToNext > 0 ? `Faltam ${daysToNext} dias para a próxima menstruação` : daysToNext < 0 ? `Atrasado há ${Math.abs(daysToNext)} dias` : 'A menstruação deve descer hoje'}
        </div>
        <button 
          className={styles.logButton}
          onClick={handleToggleTodayPeriod}
          style={{ backgroundColor: isPeriodOpen ? '#f43f5e' : 'white', color: isPeriodOpen ? 'white' : '#db2777' }}
        >
          {isPeriodOpen ? 'Registrar Fim Hoje' : 'Registrar Início hoje'}
        </button>
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
          periods={sortedPeriods}
          cycleLength={cycleLength}
          notes={notes}
        />
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span style={{ fontWeight: 'bold', color: '#db2777' }}>
            Último ciclo calculado: {cycleLength} dias 
            {hasPersonalizedPattern ? ' (Seu padrão)' : ' (Padrão inicial)'}
          </span>
        </div>
      </div>

      {selectedDate && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              Anotações - {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </h3>
            
            <button 
              className={styles.desceuButton} 
              onClick={toggleSelectedDayPeriod}
              style={{ backgroundColor: modalButtonBg, color: modalButtonColor }}
            >
              {modalButtonIcon}
              <span>{modalButtonText}</span>
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