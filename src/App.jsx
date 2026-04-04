import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="calendar" element={<div className="p-8 text-center text-slate-500">Calendar Coming Soon</div>} />
          <Route path="analytics" element={<div className="p-8 text-center text-slate-500">Analytics Coming Soon</div>} />
          <Route path="settings" element={<div className="p-8 text-center text-slate-500">Settings Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
