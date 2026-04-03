import { useState, useEffect } from 'react'

function App() {
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
  // Show a confirmation dialog to the user
  const isConfirmed = window.confirm("Are you sure you want to delete this task?");

  if (isConfirmed) {
    // If they click 'OK', filter the list and update state
    setTasks(tasks.filter(task => task.id !== id));
  }
  // If they click 'Cancel', nothing happens!
};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">LifeTrack</h1>
          <p className="text-slate-500 mt-2">Plan your day, track your life.</p>
        </header>

        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Add
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-400">Your planner is empty. Start by adding a task!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-xl bg-white border border-slate-100 shadow-sm transition-all ${
                  task.completed ? 'opacity-60 grayscale' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className={`text-lg ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  aria-label="Delete task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {tasks.length > 0 && (
          <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-4 text-sm text-slate-500">
            <div className="flex justify-between items-center">
              <span>{tasks.filter(t => t.completed).length} of {tasks.length} tasks completed</span>
              <button 
                onClick={() => setTasks(tasks.filter(t => !t.completed))}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear Completed
              </button>
            </div>
            
            <div className="flex justify-center mt-4">
              <button
                onClick={async () => {
                  if (!("Notification" in window)) {
                    alert("This browser does not support desktop notification");
                    return;
                  }

                  let permission = Notification.permission;
                  if (permission !== "granted" && permission !== "denied") {
                    permission = await Notification.requestPermission();
                  }

                  if (permission === "granted") {
                    const registration = await navigator.serviceWorker.ready;
                    if (registration && registration.showNotification) {
                      registration.showNotification("LifeTrack PWA!", {
                        body: "Push notification check via Service Worker successful.",
                        icon: "/favicon.png",
                        badge: "/favicon.png",
                      });
                    } else {
                      new Notification("LifeTrack Test!", { 
                        body: "Push notification check successful (Local API)." 
                      });
                    }
                  } else {
                    alert("Notification permission denied.");
                  }
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Test Notifications
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  )
}

export default App
