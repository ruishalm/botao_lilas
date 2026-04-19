import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import styles from './Health.module.css';

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
    <div className={styles.container}>
      <h2 className={styles.title}>Minha Saúde</h2>
      
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Ciclo Menstrual</h3>
          <button onClick={() => setIsEditing(!isEditing)} className={styles.editButton}>
            {isEditing ? 'Salvar' : 'Editar'}
          </button>
        </div>
        <div className={styles.dataContainer}>
          <div className={styles.dataItem}>
            <label className={styles.label}>Dias do Ciclo</label>
            {isEditing ? <input type="number" name="cycleLength" value={cycleData.cycleLength} onChange={handleChange} className={styles.inputField} /> : <div className={styles.valueText}>{cycleData.cycleLength} dias</div>}
          </div>
          <div className={styles.dataItem}>
            <label className={styles.label}>Duração do Fluxo</label>
            {isEditing ? <input type="number" name="periodLength" value={cycleData.periodLength} onChange={handleChange} className={styles.inputField} /> : <div className={styles.valueText}>{cycleData.periodLength} dias</div>}
          </div>
          <div className={styles.dataItem}>
            <label className={styles.label}>Duração da TPM</label>
            {isEditing ? <input type="number" name="pmsLength" value={cycleData.pmsLength} onChange={handleChange} className={styles.inputField} /> : <div className={styles.valueText}>{cycleData.pmsLength} dias</div>}
          </div>
        </div>
      </div>
      
      <div className={styles.cyclesContainer}>
        <h3 className={styles.cyclesTitle}>Últimos 5 Ciclos</h3>
        <div className={styles.cyclesList}>
          <div className={styles.emptyItem}>
            Sem dados registrados ainda.
          </div>
        </div>
      </div>

      <div className={styles.symptomsContainer}>
        <strong>Sintomas recentes:</strong>
        <p className={styles.symptomsText}>Sem dados registrados ainda.</p>
      </div>
    </div>
  );
};

export default Health;