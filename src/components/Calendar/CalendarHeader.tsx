import { Dispatch, SetStateAction } from 'react';
import styles from './Calendar.module.css';

interface CalendarHeaderProps {
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
}

const CalendarHeader = ({ currentDate, setCurrentDate }: CalendarHeaderProps) => {
  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long' });
  const year = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1, 1));
  };

  return (
    <div className={styles.header}>
      <button onClick={handlePrevMonth} className={styles.navButton}>&lt;</button>
      <h2 className={styles.monthTitle}>
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}
      </h2>
      <button onClick={handleNextMonth} className={styles.navButton}>&gt;</button>
    </div>
  );
};

export default CalendarHeader;