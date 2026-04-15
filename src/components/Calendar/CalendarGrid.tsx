import CalendarDay from './CalendarDay';
import styles from './Calendar.module.css';

interface CalendarGridProps {
  currentDate: Date;
  onSecretPress: () => void;
  onDayClick: (date: Date) => void;
  lastPeriodStart: Date;
  cycleLength: number;
  periodDuration: number;
  notes: Record<string, string>;
}

const CalendarGrid = ({ currentDate, onSecretPress, onDayClick, lastPeriodStart, cycleLength, periodDuration, notes }: CalendarGridProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Calcular o próximo ciclo
  const nextPeriodStart = new Date(lastPeriodStart);
  nextPeriodStart.setDate(lastPeriodStart.getDate() + cycleLength);

  const days = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className={styles.emptyDay} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateString = date.toISOString().split('T')[0];
    const isToday = new Date().toDateString() === date.toDateString();
    
    // Calcular se é um dia de menstruação (passado)
    const diffTimePeriod = date.getTime() - lastPeriodStart.getTime();
    const diffDaysPeriod = Math.ceil(diffTimePeriod / (1000 * 60 * 60 * 24));
    const isPeriodDay = diffDaysPeriod >= 0 && diffDaysPeriod < periodDuration;

    // Calcular se é previsão (futuro)
    const diffTimeNext = date.getTime() - nextPeriodStart.getTime();
    const diffDaysNext = Math.ceil(diffTimeNext / (1000 * 60 * 60 * 24));
    const isPredictedDay = diffDaysNext === 0; // Apenas 1 dia de previsão inicial

    // Os 5 dias antes é TPM
    const isTpmDay = diffDaysNext >= -5 && diffDaysNext < 0;
    
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