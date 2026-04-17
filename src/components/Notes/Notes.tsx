import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { User } from 'firebase/auth';

const Notes = () => {
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const savedNotes = localStorage.getItem('calendarNotes');
    return savedNotes ? JSON.parse(savedNotes) : {};
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        try {
          const q = query(collection(db, 'users'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const dbData = querySnapshot.docs[0].data();
            if (dbData.notes) setNotes(dbData.notes);
          }
        } catch (error) {
          console.error("Erro ao carregar anotações:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const sortedNotes = Object.entries(notes)
    .filter(([_, text]) => text.trim() !== '')
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#a21caf', marginTop: 0, marginBottom: '20px' }}>Minhas Anotações</h2>
      
      {sortedNotes.length === 0 ? (
        <div style={{ padding: '15px', backgroundColor: '#fdf4ff', borderRadius: '8px', color: '#666', textAlign: 'center' }}>
          Você ainda não tem anotações no calendário.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {sortedNotes.map(([date, text]) => {
            const dateObj = new Date(date + 'T12:00:00'); // Evita problemas de fuso horário
            const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
            
            return (
              <div key={date} style={{ padding: '15px', border: '1px solid #fbcfe8', borderRadius: '8px', backgroundColor: '#fdf4ff' }}>
                <div style={{ fontWeight: 'bold', color: '#db2777', marginBottom: '8px', fontSize: '0.9rem' }}>
                  {formattedDate}
                </div>
                <div style={{ color: '#4b5563', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                  {text}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notes;