import { useState } from 'react';
import Layout from './components/Layout/Layout';
import Calendar from './components/Calendar/Calendar';

// Mock de páginas
const HealthPage = () => {
  const pastCycles = [
    { month: 'Agosto', duration: 28, periodLength: 5 },
    { month: 'Julho', duration: 29, periodLength: 6 },
    { month: 'Junho', duration: 27, periodLength: 4 },
    { month: 'Maio', duration: 28, periodLength: 5 },
    { month: 'Abril', duration: 30, periodLength: 5 },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#a21caf', marginTop: 0 }}>Meu Histórico</h2>
      <p style={{ color: '#666', fontWeight: 'bold' }}>Duração média do ciclo: 28 dias</p>
      
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#333' }}>Últimos 5 Ciclos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pastCycles.map((cycle, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#fdf4ff', borderRadius: '8px' }}>
              <span style={{ fontWeight: '600', color: '#a21caf' }}>{cycle.month}</span>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Ciclo: {cycle.duration}d | Fluxo: {cycle.periodLength}d</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fdf4ff', borderRadius: '8px' }}>
        <strong>Sintomas recentes:</strong>
        <ul style={{ color: '#555', paddingLeft: '20px', marginBottom: 0 }}>
          <li>Cólicas leves</li>
          <li>Sensibilidade</li>
        </ul>
      </div>
    </div>
  );
};

const ContactsPage = () => (
  <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
    <h2 style={{ color: '#a21caf', marginTop: 0 }}>Meus Contatos Médicos</h2>
    <div style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
      <strong>Dra. Ana Silva (Ginecologista)</strong>
      <p style={{ margin: '5px 0', color: '#666' }}>(11) 98888-7777</p>
    </div>
    <div>
      <strong>Posto de Saúde Central</strong>
      <p style={{ margin: '5px 0', color: '#666' }}>(11) 3333-2222</p>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'calendar' && <Calendar />}
      {activeTab === 'health' && <HealthPage />}
      {activeTab === 'contacts' && <ContactsPage />}
    </Layout>
  );
}

export default App;