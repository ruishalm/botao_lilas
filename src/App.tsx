import { useState } from 'react';
import Layout from './components/Layout/Layout';
import Calendar from './components/Calendar/Calendar';
import Profile from './components/Profile/Profile';
import Health from './components/Health/Health';
import Contacts from './components/Contacts/Contacts';
import Tutorial from './components/Tutorial/Tutorial';
import Notes from './components/Notes/Notes';

function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem('hasSeenTutorial') !== 'true';
  });

  const requestLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Localização permitida:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Usuário negou ou ocorreu erro:", error.message);
        }
      );
    }
  };

  const closeTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setShowTutorial(false);
    requestLocationPermission();
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