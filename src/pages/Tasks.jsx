import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle, Circle, Calendar, Clock, Bell, CalendarIcon  } from 'lucide-react'
import { format, isAfter, parseISO } from 'date-fns'

const Tasks = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lifetrack_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [reminder, setReminder] = useState('0');

  useEffect(() => {
    localStorage.setItem('lifetrack_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input,
      completed: false,
      date,
      time,
      reminderMinutes: parseInt(reminder),
      notified: false
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Task Planner</h2>
          <p className="text-slate-500">Manage your daily goals and stay productive.</p>
        </div>
        <div className="text-sm font-medium px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 self-start">
          {tasks.filter(t => t.completed).length} of {tasks.length} completed
        </div>
      </header>

      <form onSubmit={addTask} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all text-lg"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
            />
          </div>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
            />
          </div>
          <div className="relative">
            <Bell className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm appearance-none"
            >
              <option value="0">At time</option>
              <option value="5">5m before</option>
              <option value="15">15m before</option>
              <option value="30">30m before</option>
              <option value="60">1h before</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </form>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">Your planner is empty. Ready to start?</p>
            </motion.div>
          ) : (
            tasks.sort((a, b) => {
              if (!a.date || !b.date) return 0;
              const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
              const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
              return dateA - dateB;
            }).map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md ${
                  task.completed ? 'bg-slate-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
                  >
                    {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <div className="overflow-hidden">
                    <span className={`text-lg block truncate transition-all ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.text}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      {task.date && (
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {format(parseISO(task.date), 'MMM d, yyyy')}
                        </span>
                      )}
                      {task.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.time}
                        </span>
                      )}
                      {task.reminderMinutes > 0 && (
                        <span className="flex items-center gap-1 text-indigo-400">
                          <Bell className="w-3 h-3" />
                          {task.reminderMinutes}m before
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {tasks.length > 0 && tasks.some(t => t.completed) && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={() => setTasks(tasks.filter(t => !t.completed))}
            className="text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            Clear Completed Tasks
          </button>
        </div>
      )}
    </div>
  )
}

export default Tasks;
