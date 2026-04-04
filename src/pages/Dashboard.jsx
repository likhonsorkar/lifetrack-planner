import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar, TrendingUp, Sun, Moon, Zap, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userName, setUserName] = useState('Likhon Sorkar');
  const [prayerCompletion, setPrayerCompletion] = useState({ 
    Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false, Tasbih10: false 
  });

  useEffect(() => {
    const loadData = () => {
      const savedTasks = localStorage.getItem('lifetrack_tasks');
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedTransactions = localStorage.getItem('lifetrack_transactions');
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      
      const savedSettings = localStorage.getItem('lifetrack_settings');
      if (savedSettings) setUserName(JSON.parse(savedSettings).userName);

      const savedPrayers = localStorage.getItem('lifetrack_prayer_completion');
      if (savedPrayers) {
        const parsed = JSON.parse(savedPrayers);
        if (parsed.date === format(new Date(), 'yyyy-MM-dd')) {
          setPrayerCompletion(parsed.data);
        }
      }
    };

    loadData();
    window.addEventListener('storage', loadData);
    const interval = setInterval(loadData, 5000); // Poll for changes
    return () => {
      window.removeEventListener('storage', loadData);
      clearInterval(interval);
    };
  }, []);

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const completedPrayers = Object.values(prayerCompletion).filter(Boolean).length;
  const totalPrayers = Object.keys(prayerCompletion).length;

  const calculateWalletStats = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    let dailyExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    
    const startOfCurrMonth = startOfMonth(new Date());
    const endOfCurrMonth = endOfMonth(new Date());

    transactions.forEach((t) => {
      const tDate = parseISO(t.date);
      const isThisMonth = isWithinInterval(tDate, { start: startOfCurrMonth, end: endOfCurrMonth });

      if (t.date === today && t.type === 'expense') {
        dailyExpense += t.amount;
      }

      if (isThisMonth) {
        if (t.type === 'income') {
          monthlyIncome += t.amount;
        } else {
          monthlyExpense += t.amount;
        }
      }
    });

    return { dailyExpense, balance: monthlyIncome - monthlyExpense };
  };

  const walletStats = calculateWalletStats();

  const stats = [
    { name: 'Completed Tasks', value: completedTasks, icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />, color: 'bg-emerald-50' },
    { name: "Today's Expense", value: `$${walletStats.dailyExpense.toFixed(2)}`, icon: <Wallet className="w-6 h-6 text-rose-500" />, color: 'bg-rose-50' },
    { name: 'Monthly Balance', value: `$${walletStats.balance.toFixed(2)}`, icon: <TrendingUp className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-50' },
    { name: 'Routine Progress', value: `${completedPrayers}/${totalPrayers}`, icon: <Zap className="w-6 h-6 text-amber-500" />, color: 'bg-amber-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, {userName.split(' ')[0]}!</h2>
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
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Daily Prayer & Routine</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {Object.entries(prayerCompletion).map(([name, completed]) => (
                    <div key={name} className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
                       completed ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100 opacity-60'
                    }`}>
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <CheckCircle2 className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">{name === 'Tasbih10' ? 'Daily' : 'Wakt'}</p>
                          <p className="font-bold text-slate-700">{name === 'Tasbih10' ? 'Tasbih' : name}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Tasks</h3>
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
                       <p className="text-xs text-slate-400">{task.isDaily ? 'Daily Routine' : 'One-time Task'}</p>
                     </div>
                   </div>
                 ))
               )}
             </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-indigo-600 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-2xl font-black mb-2">Daily Goal</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Complete all your daily routine tasks and prayers to maintain your streak!
                </p>
                <div className="mt-8">
                   <div className="flex justify-between text-xs font-bold mb-2">
                      <span>PROGRESS</span>
                      <span>{Math.round((completedPrayers / totalPrayers) * 100)}%</span>
                   </div>
                   <div className="w-full h-3 bg-indigo-900/30 rounded-full overflow-hidden">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(completedPrayers / totalPrayers) * 100}%` }}
                         className="h-full bg-white rounded-full"
                      />
                   </div>
                </div>
             </div>
             <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-indigo-500/20" />
           </div>

           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="font-bold text-slate-900 mb-4">Quick Tip</h4>
              <p className="text-sm text-slate-500 italic">
                "Small daily improvements are the key to staggering long-term results."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
