const Contacts = () => (
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

export default Contacts;
