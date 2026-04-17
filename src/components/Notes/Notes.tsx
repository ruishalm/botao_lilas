import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { NoteItem } from './NoteItem';
import styles from './Notes.module.css';

const Notes = () => {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        try {
          const q = query(collection(db, 'users'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const dbData = querySnapshot.docs[0].data();
            // As notas podem estar em `dbData.notes` ou `dbData.profile.notes`
            if (dbData.profile?.notes) {
              setNotes(dbData.profile.notes);
            } else if (dbData.notes) {
              setNotes(dbData.notes);
            }
          }
        } catch (error) {
          console.error("Erro ao carregar anotações:", error);
        } finally {
          setLoading(false);
        }
      } else {
        const savedNotes = localStorage.getItem('calendarNotes');
        setNotes(savedNotes ? JSON.parse(savedNotes) : {});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const sortedNotes = Object.entries(notes)
    .map(([date, text]) => ({ id: date, date, text }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className={styles.notesContainer}>
      <h2 className={styles.title}>Minhas Anotações</h2>
      {loading ? (
        <p>Carregando anotações...</p>
      ) : (
        <div className={styles.listContainer}>
          {sortedNotes.length > 0 ? (
            sortedNotes.map(note => <NoteItem key={note.id} date={note.date} note={note.text} />)
          ) : (
            <p className={styles.emptyText}>Nenhuma anotação encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;