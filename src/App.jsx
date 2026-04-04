import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Wallet from './pages/Wallet';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Notes from './pages/Notes';
import Tasbih from './pages/Tasbih';
import PrayerTimes from './pages/PrayerTimes';
import Developer from './pages/Developer';
import PinLock from './components/PinLock';

const LockedRoute = ({ children, lockKey }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('lifetrack_settings') || '{}');
    if (settings.privacyPin && settings[lockKey]) {
      setIsLocked(true);
    }
  }, [lockKey]);

  if (isLocked && !unlocked) {
    return <PinLock onSuccess={() => setUnlocked(true)} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={
            <LockedRoute lockKey="lockTasks">
              <Tasks />
            </LockedRoute>
          } />
          <Route path="wallet" element={
            <LockedRoute lockKey="lockWallet">
              <Wallet />
            </LockedRoute>
          } />
          <Route path="notes" element={
            <LockedRoute lockKey="lockNotes">
              <Notes />
            </LockedRoute>
          } />
          <Route path="calendar" element={<Calendar />} />
          <Route path="tasbih" element={
            <LockedRoute lockKey="lockTasbih">
              <Tasbih />
            </LockedRoute>
          } />
          <Route path="prayer-times" element={<PrayerTimes />} />
          <Route path="developer" element={<Developer />} />
          <Route path="analytics" element={<div className="p-8 text-center text-slate-500">Analytics Coming Soon</div>} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
