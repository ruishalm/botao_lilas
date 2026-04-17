import { useRef } from 'react';
import { Droplet } from 'lucide-react';
import styles from './CalendarDay.module.css';

interface CalendarDayProps {
  day: number;
  date: Date;
  isToday: boolean;
  isPeriodDay: boolean;
  isPredictedDay: boolean;
  isTpmDay: boolean;
  hasNote: boolean;
  onSecretPress: () => void;
  onDayClick: (date: Date) => void;
}

const CalendarDay = ({ day, date, isToday, isPeriodDay, isPredictedDay, isTpmDay, hasNote, onSecretPress, onDayClick }: CalendarDayProps) => {
  const pressTimer = useRef<number | null>(null);
  const isLongPress = useRef(false);

  const startPress = () => {
    isLongPress.current = false;
    pressTimer.current = window.setTimeout(() => {
      isLongPress.current = true;
      onSecretPress();
    }, 3000); 
  };

  const endPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (!isLongPress.current) {
      onDayClick(date);
    }
  };

  let dayClass = styles.dayBox;
  if (isPeriodDay) dayClass += ` ${styles.periodDay}`;
  else if (isPredictedDay) dayClass += ` ${styles.predictedDay}`;
  else if (isTpmDay) dayClass += ` ${styles.tpmDay}`;
  
  if (isToday) dayClass += ` ${styles.today}`;

  return (
    <button
      className={dayClass}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onClick={handleClick}
    >
      {day}
      {isPeriodDay && <Droplet size={12} className={styles.bloodDrop} fill="currentColor" />}
      {isPredictedDay && <Droplet size={12} className={styles.grayDrop} fill="currentColor" />}
      {isTpmDay && <span className={styles.tpmText}>TPM</span>}
      {isToday && <span className={styles.cycleDot} />}
      {hasNote && !isToday && <span className={styles.noteDot} />}
    </button>
  );
};

export default CalendarDay;