import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('lifetrack_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const stats = [
    { name: 'Completed', value: completedTasks, icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />, color: 'bg-emerald-50' },
    { name: 'Pending', value: pendingTasks, icon: <Clock className="w-6 h-6 text-amber-500" />, color: 'bg-amber-50' },
    { name: 'Total Tasks', value: tasks.length, icon: <Calendar className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-50' },
    { name: 'Efficiency', value: `${completionRate}%`, icon: <TrendingUp className="w-6 h-6 text-rose-500" />, color: 'bg-rose-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, Likhon!</h2>
        <p className="text-slate-500">Here's what's happening with your goals today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.name}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No tasks recorded yet.</p>
            ) : (
              tasks.slice(-5).reverse().map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {task.text}
                    </p>
                    <p className="text-xs text-slate-400">Today</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Pro Feature!</h3>
            <p className="text-indigo-100 text-sm">
              Upgrade to LifeTrack Pro to unlock advanced analytics and cloud sync.
            </p>
          </div>
          <button className="mt-8 w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:bg-indigo-50 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
