import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Notes from './pages/Notes';
import Tasbih from './pages/Tasbih';
import PrayerTimes from './pages/PrayerTimes';
import Developer from './pages/Developer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="notes" element={<Notes />} />
          <Route path="tasbih" element={<Tasbih />} />
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
