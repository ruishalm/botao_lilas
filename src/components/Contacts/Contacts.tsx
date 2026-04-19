import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from './Contacts.module.css';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('userContacts');
    return saved ? JSON.parse(saved) : [];
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('userContacts', JSON.stringify(contacts));
    if (auth.currentUser) {
      setDoc(doc(db, 'users', auth.currentUser.uid), { contacts }, { merge: true }).catch(console.error);
    }
  }, [contacts]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists() && docSnap.data().contacts) {
            setContacts(docSnap.data().contacts);
          }
        } catch (error) {
          console.error("Erro ao carregar contatos:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleContactChange = (id: string, field: keyof Contact, value: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addContact = () => {
    setContacts(prev => [...prev, { id: Date.now().toString(), name: '', phone: '' }]);
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Meus Contatos Médicos</h2>
        <button onClick={() => setIsEditing(!isEditing)} className={styles.editButton}>
          {isEditing ? 'Salvar' : 'Editar'}
        </button>
      </div>

      <div className={styles.list}>
        {contacts.map((contact) => (
          <div key={contact.id} className={styles.contactItem}>
            {isEditing ? (
              <div className={styles.editForm}>
                <input 
                  type="text" 
                  value={contact.name} 
                  onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)} 
                  placeholder="Nome do contato/local"
                  className={styles.input}
                />
                <div className={styles.inputRow}>
                  <input 
                    type="text" 
                    value={contact.phone} 
                    onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)} 
                    placeholder="Telefone"
                    className={`${styles.input} ${styles.inputFlex}`}
                  />
                  <button onClick={() => removeContact(contact.id)} className={styles.removeButton}>Remover</button>
                </div>
              </div>
            ) : (
              <>
                <strong className={styles.contactName}>{contact.name || 'Sem nome'}</strong>
                <p className={styles.contactPhone}>{contact.phone || 'Sem telefone'}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <button onClick={addContact} className={styles.addButton}>
          + Adicionar Contato
        </button>
      )}
    </div>
  );
};

export default Contacts;
