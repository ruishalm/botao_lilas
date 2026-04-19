import CalendarDay from './CalendarDay';
import styles from './CalendarGrid.module.css';

interface Period {
  start: string;
  end: string | null;
}

interface CalendarGridProps {
  currentDate: Date;
  onSecretPress: () => void;
  onDayClick: (date: Date) => void;
  periods: Period[];
  cycleLength: number;
  notes: Record<string, string>;
}

const CalendarGrid = ({ currentDate, onSecretPress, onDayClick, periods, cycleLength, notes }: CalendarGridProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const sortedPeriods = [...periods].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const lastPeriod = sortedPeriods[sortedPeriods.length - 1];

  let nextPeriodStart: Date | null = null;
  if (lastPeriod) {
    nextPeriodStart = new Date(lastPeriod.start + 'T00:00:00');
    nextPeriodStart.setDate(nextPeriodStart.getDate() + cycleLength);
  }

  const days = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
  }

  const todayStr = new Date().toDateString();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    const isToday = todayStr === date.toDateString();
    
    let isPeriodDay = false;
    for (const p of periods) {
      const pStart = new Date(p.start + 'T00:00:00');
      const pEnd = p.end ? new Date(p.end + 'T00:00:00') : new Date(); // Se não tem fim, vai até hoje
      
      // Ajustar para não contar o futuro se for aberto
      if (date >= pStart && date <= pEnd) {
        isPeriodDay = true;
        break;
      }
    }

    let isPredictedDay = false;
    let isTpmDay = false;

    if (nextPeriodStart) {
      const diffTimeNext = date.getTime() - nextPeriodStart.getTime();
      const diffDaysNext = Math.round(diffTimeNext / (1000 * 60 * 60 * 24));
      
      // Dia previsto
      isPredictedDay = diffDaysNext === 0;
      
      // TPM: de 5 dias antes até o dia anterior
      isTpmDay = diffDaysNext >= -5 && diffDaysNext < 0;
    }
    
    const hasNote = !!notes[dateString];

    days.push(
      <CalendarDay 
        key={day} 
        day={day}
        date={date}
        isToday={isToday}
        isPeriodDay={isPeriodDay}
        isPredictedDay={isPredictedDay}
        isTpmDay={isTpmDay}
        hasNote={hasNote}
        onSecretPress={onSecretPress} 
        onDayClick={onDayClick}
      />
    );
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className={styles.gridContainer}>
      <div className={styles.weekDays}>
        {weekDays.map(day => (
          <span key={day} className={styles.weekDay}>{day}</span>
        ))}
      </div>
      <div className={styles.daysGrid}>
        {days}
      </div>
    </div>
  );
};

export default CalendarGrid;