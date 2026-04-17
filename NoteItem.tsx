import React from 'react';

interface NoteItemProps {
  date: Date | string;
  note: string;
}

export const NoteItem: React.FC<NoteItemProps> = ({ date, note }) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#6b7280' }}>{formattedDate}</span>
      <p style={{ margin: 0, color: '#1f2937', fontSize: '1rem' }}>{note}</p>
    </div>
  );
};