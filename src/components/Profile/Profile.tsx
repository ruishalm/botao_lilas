import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import Auth from '../Auth/Auth';
import { auth, db } from '../../firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { User } from 'firebase/auth';

interface Phone {
  id: string;
  number: string;
  observation: string;
}

interface ProfileData {
  name: string;
  cpf: string;
  age: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  phones: Phone[];
  cycleLength: string;
  periodLength: string;
  ubs: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [backupData, setBackupData] = useState<ProfileData | null>(null);
  const [data, setData] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : {
      name: '',
      cpf: '',
      age: '',
      cep: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      phones: [{ id: Date.now().toString(), number: '', observation: '' }],
      cycleLength: '28',
      periodLength: '5',
      ubs: ''
    };
  });

  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(data));
    if (auth.currentUser && data.cpf) {
      const cleanCpf = data.cpf.replace(/\D/g, '');
      if (cleanCpf.length === 11) {
        setDoc(doc(db, 'users', cleanCpf), { uid: auth.currentUser.uid, profile: data }, { merge: true }).catch(console.error);
      }
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      if (user) {
        try {
          const q = query(collection(db, 'users'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            setData(querySnapshot.docs[0].data().profile);
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (id: string, field: keyof Phone, value: string) => {
    setData(prev => ({
      ...prev,
      phones: prev.phones.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const addPhone = () => {
    setData(prev => ({
      ...prev,
      phones: [...prev.phones, { id: Date.now().toString(), number: '', observation: '' }]
    }));
  };

  const removePhone = (id: string) => {
    if (data.phones.length > 1) {
      setData(prev => ({
        ...prev,
        phones: prev.phones.filter(p => p.id !== id)
      }));
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const result = await response.json();
        if (!result.erro) {
          setData(prev => ({
            ...prev,
            street: result.logradouro || '',
            neighborhood: result.bairro || '',
            city: result.localidade || '',
            state: result.uf || ''
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value;
    handleChange(e);
    if (newCep.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(newCep);
    }
  };

  const handleEdit = () => {
    setBackupData(data);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (backupData) setData(backupData);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Meu Perfil</h2>
      
      <Auth />

      <div className={styles.formGroup}>
        <div className={styles.actionsHeader}>
          {!isEditing ? (
            <button type="button" className={styles.editBtn} onClick={handleEdit}>Editar Dados</button>
          ) : (
            <div className={styles.actionButtons}>
              <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancelar</button>
              <button type="button" className={styles.saveBtn} onClick={handleSave}>Salvar</button>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label>Nome Completo</label>
          {isEditing ? (
            <input type="text" name="name" value={data.name} onChange={handleChange} placeholder="Ex: Maria Silva" />
          ) : (
            <div className={styles.readOnlyValue}>{data.name || 'Não informado'}</div>
          )}
        </div>

        <div className={styles.rowGroup}>
          <div className={styles.field}>
            <label>CPF</label>
            {isEditing ? (
              <input type="text" name="cpf" value={data.cpf} onChange={handleChange} placeholder="000.000.000-00" />
            ) : (
              <div className={styles.readOnlyValue}>{data.cpf || 'Não informado'}</div>
            )}
          </div>
          <div className={styles.field}>
            <label>Idade</label>
            {isEditing ? (
              <input type="number" name="age" value={data.age} onChange={handleChange} placeholder="Sua idade" />
            ) : (
              <div className={styles.readOnlyValue}>{data.age || 'Não informado'}</div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>Sua UBS</label>
          {isEditing ? (
            <input type="text" name="ubs" value={data.ubs} onChange={handleChange} placeholder="Nome da sua UBS" />
          ) : (
            <div className={styles.readOnlyValue}>{data.ubs || 'Não informado'}</div>
          )}
        </div>

        <div className={styles.addressSection}>
          <h3 className={styles.sectionTitle}>Endereço</h3>
          <div className={styles.rowGroup}>
            <div className={styles.field}>
              <label>CEP</label>
              {isEditing ? (
                <>
                  <input 
                    type="text" 
                    name="cep" 
                    value={data.cep} 
                    onChange={handleCepChange} 
                    placeholder="00000-000" 
                    maxLength={9}
                  />
                  {loadingCep && <small className={styles.loadingText}>Buscando endereço...</small>}
                </>
              ) : (
                <div className={styles.readOnlyValue}>{data.cep || 'Não informado'}</div>
              )}
            </div>
            <div className={styles.field} style={{ flex: 2 }}>
              <label>Rua</label>
              {isEditing ? (
                <input type="text" name="street" value={data.street} onChange={handleChange} placeholder="Digite sua rua" />
              ) : (
                <div className={styles.readOnlyValue}>{data.street || 'Não informado'}</div>
              )}
            </div>
          </div>
          
          <div className={styles.rowGroup}>
            <div className={styles.field}>
              <label>Número</label>
              {isEditing ? (
                <input type="text" name="number" value={data.number} onChange={handleChange} placeholder="Número" />
              ) : (
                <div className={styles.readOnlyValue}>{data.number || 'Não informado'}</div>
              )}
            </div>
            <div className={styles.field} style={{ flex: 2 }}>
              <label>Bairro</label>
              {isEditing ? (
                <input type="text" name="neighborhood" value={data.neighborhood} onChange={handleChange} placeholder="Bairro" />
              ) : (
                <div className={styles.readOnlyValue}>{data.neighborhood || 'Não informado'}</div>
              )}
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.field} style={{ flex: 2 }}>
              <label>Cidade</label>
              {isEditing ? (
                <input type="text" name="city" value={data.city} onChange={handleChange} placeholder="Cidade" />
              ) : (
                <div className={styles.readOnlyValue}>{data.city || 'Não informado'}</div>
              )}
            </div>
            <div className={styles.field}>
              <label>UF</label>
              {isEditing ? (
                <input type="text" name="state" value={data.state} onChange={handleChange} placeholder="Estado (UF)" maxLength={2} />
              ) : (
                <div className={styles.readOnlyValue}>{data.state || 'Não informado'}</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.phonesSection}>
          <h3 className={styles.sectionTitle}>Telefones</h3>
          {data.phones.map((phone, index) => (
            <div key={phone.id} className={styles.phoneEntry}>
              <div className={styles.phoneHeader}>
                <strong>Telefone {index + 1}</strong>
                {(isEditing && data.phones.length > 1) && (
                  <button type="button" className={styles.removeBtn} onClick={() => removePhone(phone.id)}>Remover</button>
                )}
              </div>
              <div className={styles.rowGroup}>
                <div className={styles.field}>
                  <label>Número</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={phone.number} 
                      onChange={(e) => handlePhoneChange(phone.id, 'number', e.target.value)} 
                      placeholder="(00) 00000-0000" 
                    />
                  ) : (
                    <div className={styles.readOnlyValue}>{phone.number || 'Não informado'}</div>
                  )}
                </div>
                <div className={styles.field} style={{ flex: 2 }}>
                  <label>Observação</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={phone.observation} 
                      onChange={(e) => handlePhoneChange(phone.id, 'observation', e.target.value)} 
                      placeholder="Ex: Pessoal, Trabalho, Mãe..." 
                    />
                  ) : (
                    <div className={styles.readOnlyValue}>{phone.observation || 'Não informado'}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isEditing && (
            <button type="button" className={styles.addPhoneBtn} onClick={addPhone}>+ Adicionar Novo Telefone</button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
