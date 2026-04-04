import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react'

const Tasks = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('lifetrack_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('lifetrack_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
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

      <form onSubmit={addTask} className="relative group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full pl-4 pr-12 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all text-lg"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
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
            tasks.map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md ${
                  task.completed ? 'bg-slate-50/50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-400'}`}
                  >
                    {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                  <span className={`text-lg transition-all ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
