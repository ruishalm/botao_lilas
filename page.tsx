import React from 'react';
import { NoteItem } from './NoteItem';

// Mocks para testar a UI. Substitua pela chamada ao banco de dados
const mockNotes = [
  { id: '1', date: '2024-04-01T10:00:00', text: 'Início do ciclo, cólicas leves.' },
  { id: '2', date: '2024-04-02T10:00:00', text: 'Fluxo intenso. Tomei remédio para dor.' },
];

export default function AnotacoesPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>Minhas Anotações</h2>
      
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {mockNotes.length > 0 ? mockNotes.map((note) => (
          <NoteItem key={note.id} date={note.date} note={note.text} />
        )) : (
          <p style={{ padding: '16px', textAlign: 'center', color: '#6b7280' }}>Nenhuma anotação encontrada.</p>
        )}
      </div>
    </div>
  );
}