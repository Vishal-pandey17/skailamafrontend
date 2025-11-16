// import { useState } from 'react'
// import Header from './components/Header.jsx';
// import './App.css'

// function App() {
//     const [currentProfile, setCurrentProfile] = useState(null);
//     const [refreshTrigger, setRefreshTrigger] = useState(0); 
    
//     const handleProfileChange = (profile) => {
//       setCurrentProfile(profile);
//     };

    
//   return (
//     <div className="app">
//       <Header 
//         currentProfile={currentProfile}
//         setCurrentProfile={setCurrentProfile}
//         onProfileChange={handleProfileChange}
//       />
//     </div>
//   )
// }

// export default App

import { useState } from 'react'
import Header from './components/Header.jsx';
import CreateEvent from './components/CreateEvent.jsx';
import EventList from './components/EventList.jsx';
import './App.css'

function App() {
    const [currentProfile, setCurrentProfile] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0); 
    
    const handleProfileChange = (profile) => {
      setCurrentProfile(profile);
    };

    const handleEventCreated = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
  return (
    <div className="app">
      <Header 
        currentProfile={currentProfile}
        setCurrentProfile={setCurrentProfile}
        onProfileChange={handleProfileChange}
      />
      <div className="main-content">
        <div className="left-panel">
          <CreateEvent onEventCreated={handleEventCreated} />
        </div>
        <div className="right-panel">
          <EventList 
            currentProfile={currentProfile}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  )
}

export default App