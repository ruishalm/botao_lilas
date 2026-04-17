import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface CycleData {
  cycleLength: string;
  periodLength: string;
  pmsLength: string;
}

const Health = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [cycleData, setCycleData] = useState<CycleData>(() => {
    const saved = localStorage.getItem('userHealthCycle');
    return saved ? JSON.parse(saved) : {
      cycleLength: '28',
      periodLength: '5',
      pmsLength: '5'
    };
  });

  useEffect(() => {
    localStorage.setItem('userHealthCycle', JSON.stringify(cycleData));
    if (auth.currentUser) {
      setDoc(doc(db, 'users', auth.currentUser.uid), { health: cycleData }, { merge: true }).catch(console.error);
    }
  }, [cycleData]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists() && docSnap.data().health) {
            setCycleData(docSnap.data().health);
          }
        } catch (error) {
          console.error("Erro ao carregar dados de saúde:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCycleData((prev: CycleData) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#a21caf', marginTop: 0 }}>Minha Saúde</h2>
      
      <div style={{ marginBottom: '25px', padding: '15px', border: '1px solid #fbcfe8', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#a21caf', fontSize: '1.1rem' }}>Ciclo Menstrual</h3>
          <button onClick={() => setIsEditing(!isEditing)} style={{ background: 'none', border: 'none', color: '#db2777', fontWeight: 'bold', cursor: 'pointer' }}>
            {isEditing ? 'Salvar' : 'Editar'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '80px' }}>
            <label style={{ display: 'block', color: '#666', fontSize: '0.8rem', marginBottom: '5px' }}>Dias do Ciclo</label>
            {isEditing ? <input type="number" name="cycleLength" value={cycleData.cycleLength} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} /> : <div style={{ fontWeight: 'bold', color: '#333' }}>{cycleData.cycleLength} dias</div>}
          </div>
          <div style={{ flex: 1, minWidth: '80px' }}>
            <label style={{ display: 'block', color: '#666', fontSize: '0.8rem', marginBottom: '5px' }}>Duração do Fluxo</label>
            {isEditing ? <input type="number" name="periodLength" value={cycleData.periodLength} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} /> : <div style={{ fontWeight: 'bold', color: '#333' }}>{cycleData.periodLength} dias</div>}
          </div>
          <div style={{ flex: 1, minWidth: '80px' }}>
            <label style={{ display: 'block', color: '#666', fontSize: '0.8rem', marginBottom: '5px' }}>Duração da TPM</label>
            {isEditing ? <input type="number" name="pmsLength" value={cycleData.pmsLength} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} /> : <div style={{ fontWeight: 'bold', color: '#333' }}>{cycleData.pmsLength} dias</div>}
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#333' }}>Últimos 5 Ciclos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '10px', backgroundColor: '#fdf4ff', borderRadius: '8px', color: '#666', fontSize: '0.9rem' }}>
            Sem dados registrados ainda.
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fdf4ff', borderRadius: '8px' }}>
        <strong>Sintomas recentes:</strong>
        <p style={{ color: '#555', margin: '5px 0 0 0', fontSize: '0.9rem' }}>Sem dados registrados ainda.</p>
      </div>
    </div>
  );
};

export default Health;
