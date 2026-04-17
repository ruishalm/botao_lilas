import { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Calendar from './components/Calendar/Calendar';
import Profile from './components/Profile/Profile';
import Health from './components/Health/Health';
import Contacts from './components/Contacts/Contacts';
import Tutorial from './components/Tutorial/Tutorial';
import Notes from './components/Notes/Notes';

function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenTutorial');
    if (!hasSeen) {
      setShowTutorial(true);
    }
  }, []);

  const closeTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onOpenTutorial={() => setShowTutorial(true)}>
      {activeTab === 'calendar' && <Calendar />}
      {activeTab === 'health' && <Health />}
      {activeTab === 'profile' && <Profile />}
      {activeTab === 'notes' && <Notes />}
      {activeTab === 'contacts' && <Contacts />}
      
      {showTutorial && <Tutorial onClose={closeTutorial} />}
    </Layout>
  );
}

export default App;