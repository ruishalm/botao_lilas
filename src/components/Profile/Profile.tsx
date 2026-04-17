import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';

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
}

const Profile = () => {
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
      periodLength: '5'
    };
  });

  const [loadingCep, setLoadingCep] = useState(false);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(data));
  }, [data]);

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

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Meu Perfil</h2>
      
      <div className={styles.formGroup}>
        <div className={styles.field}>
          <label>Nome Completo</label>
          <input type="text" name="name" value={data.name} onChange={handleChange} placeholder="Ex: Maria Silva" />
        </div>

        <div className={styles.rowGroup}>
          <div className={styles.field}>
            <label>CPF</label>
            <input type="text" name="cpf" value={data.cpf} onChange={handleChange} placeholder="000.000.000-00" />
          </div>
          <div className={styles.field}>
            <label>Idade</label>
            <input type="number" name="age" value={data.age} onChange={handleChange} placeholder="Sua idade" />
          </div>
        </div>

        <div className={styles.addressSection}>
          <h3 className={styles.sectionTitle}>Endereço</h3>
          <div className={styles.rowGroup}>
            <div className={styles.field}>
              <label>CEP</label>
              <input 
                type="text" 
                name="cep" 
                value={data.cep} 
                onChange={handleCepChange} 
                placeholder="00000-000" 
                maxLength={9}
              />
              {loadingCep && <small className={styles.loadingText}>Buscando endereço...</small>}
            </div>
            <div className={styles.field} style={{ flex: 2 }}>
              <label>Rua</label>
              <input type="text" name="street" value={data.street} onChange={handleChange} placeholder="Digite sua rua" />
            </div>
          </div>
          
          <div className={styles.rowGroup}>
            <div className={styles.field}>
              <label>Número</label>
              <input type="text" name="number" value={data.number} onChange={handleChange} placeholder="Número" />
            </div>
            <div className={styles.field} style={{ flex: 2 }}>
              <label>Bairro</label>
              <input type="text" name="neighborhood" value={data.neighborhood} onChange={handleChange} placeholder="Bairro" />
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.field} style={{ flex: 2 }}>
              <label>Cidade</label>
              <input type="text" name="city" value={data.city} onChange={handleChange} placeholder="Cidade" />
            </div>
            <div className={styles.field}>
              <label>UF</label>
              <input type="text" name="state" value={data.state} onChange={handleChange} placeholder="Estado (UF)" maxLength={2} />
            </div>
          </div>
        </div>

        <div className={styles.phonesSection}>
          <h3 className={styles.sectionTitle}>Telefones</h3>
          {data.phones.map((phone, index) => (
            <div key={phone.id} className={styles.phoneEntry}>
              <div className={styles.phoneHeader}>
                <strong>Telefone {index + 1}</strong>
                {data.phones.length > 1 && (
                  <button type="button" className={styles.removeBtn} onClick={() => removePhone(phone.id)}>Remover</button>
                )}
              </div>
              <div className={styles.rowGroup}>
                <div className={styles.field}>
                  <label>Número</label>
                  <input 
                    type="text" 
                    value={phone.number} 
                    onChange={(e) => handlePhoneChange(phone.id, 'number', e.target.value)} 
                    placeholder="(00) 00000-0000" 
                  />
                </div>
                <div className={styles.field} style={{ flex: 2 }}>
                  <label>Observação</label>
                  <input 
                    type="text" 
                    value={phone.observation} 
                    onChange={(e) => handlePhoneChange(phone.id, 'observation', e.target.value)} 
                    placeholder="Ex: Pessoal, Trabalho, Mãe..." 
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className={styles.addPhoneBtn} onClick={addPhone}>+ Adicionar Novo Telefone</button>
        </div>

        <div className={styles.cycleSection}>
           <h3 className={styles.sectionTitle}>Ciclo</h3>
           <div className={styles.rowGroup}>
              <div className={styles.field}>
                <label>Duração média do ciclo</label>
                <input type="number" name="cycleLength" value={data.cycleLength} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Duração do fluxo</label>
                <input type="number" name="periodLength" value={data.periodLength} onChange={handleChange} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
