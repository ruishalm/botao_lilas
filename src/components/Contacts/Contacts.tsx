import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('userContacts');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Dra. Ana Silva (Ginecologista)', phone: '(11) 98888-7777' },
      { id: '2', name: 'Posto de Saúde Central', phone: '(11) 3333-2222' }
    ];
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
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ color: '#a21caf', margin: 0 }}>Meus Contatos Médicos</h2>
        <button onClick={() => setIsEditing(!isEditing)} style={{ background: 'none', border: 'none', color: '#db2777', fontWeight: 'bold', cursor: 'pointer' }}>
          {isEditing ? 'Salvar' : 'Editar'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {contacts.map((contact) => (
          <div key={contact.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  type="text" 
                  value={contact.name} 
                  onChange={(e) => handleContactChange(contact.id, 'name', e.target.value)} 
                  placeholder="Nome do contato/local"
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={contact.phone} 
                    onChange={(e) => handleContactChange(contact.id, 'phone', e.target.value)} 
                    placeholder="Telefone"
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
                  />
                  <button onClick={() => removeContact(contact.id)} style={{ padding: '8px', borderRadius: '4px', border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}>Remover</button>
                </div>
              </div>
            ) : (
              <>
                <strong>{contact.name || 'Sem nome'}</strong>
                <p style={{ margin: '5px 0', color: '#666' }}>{contact.phone || 'Sem telefone'}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <button onClick={addContact} style={{ marginTop: '15px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px dashed #db2777', backgroundColor: '#fdf4ff', color: '#db2777', cursor: 'pointer', fontWeight: 'bold' }}>
          + Adicionar Contato
        </button>
      )}
    </div>
  );
};

export default Contacts;