import React from 'react';
import styles from './NoteItem.module.css';

interface NoteItemProps {
  date: Date | string;
  note: string;
}

export const NoteItem: React.FC<NoteItemProps> = ({ date, note }) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  return (
    <div className={styles.container}>
      <span className={styles.date}>{formattedDate}</span>
      <p className={styles.text}>{note}</p>
    </div>
  );
};
