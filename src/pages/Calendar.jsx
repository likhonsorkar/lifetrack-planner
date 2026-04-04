import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('lifetrack_tasks');
    if (saved) setTasks(JSON.parse(saved));

    const handleStorage = () => {
      const updated = localStorage.getItem('lifetrack_tasks');
      if (updated) setTasks(JSON.parse(updated));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{format(currentMonth, 'MMMM yyyy')}</h2>
        <p className="text-slate-500">Plan your events and track your time.</p>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-white rounded-xl border border-slate-200 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setCurrentMonth(new Date())}
          className="px-4 py-2 text-sm font-semibold hover:bg-white rounded-xl border border-slate-200 transition-colors shadow-sm"
        >
          Today
        </button>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-white rounded-xl border border-slate-200 transition-colors shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const rows = [];
    let days = [];

    calendarDays.forEach((day, i) => {
      const formattedDate = format(day, 'yyyy-MM-dd');
      const dayTasks = tasks.filter(t => t.date === formattedDate);
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());

      days.push(
        <div
          key={day.toString()}
          onClick={() => setSelectedDate(day)}
          className={`relative min-h-[100px] p-2 border border-slate-100 bg-white transition-all cursor-pointer hover:bg-slate-50 group ${
            !isCurrentMonth ? 'bg-slate-50/50' : ''
          } ${isSelected ? 'ring-2 ring-inset ring-indigo-500 z-10' : ''}`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-semibold ${
              !isCurrentMonth ? 'text-slate-300' : isToday ? 'text-indigo-600' : 'text-slate-700'
            } ${isToday ? 'bg-indigo-50 w-7 h-7 flex items-center justify-center rounded-full' : ''}`}>
              {format(day, 'd')}
            </span>
            {dayTasks.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            )}
          </div>
          <div className="mt-2 space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div 
                key={task.id} 
                className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                  task.completed ? 'bg-slate-100 text-slate-400 line-through' : 'bg-indigo-50 text-indigo-700'
                }`}
              >
                {task.text}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-[10px] text-slate-400 pl-1">
                + {dayTasks.length - 2} more
              </div>
            )}
          </div>
        </div>
      );

      if ((i + 1) % 7 === 0) {
        rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
        days = [];
      }
    });

    return <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">{rows}</div>;
  };

  const selectedDateTasks = tasks.filter(t => t.date === format(selectedDate, 'yyyy-MM-dd'));

  return (
    <div className="max-w-6xl mx-auto">
      {renderHeader()}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {renderDays()}
          {renderCells()}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <div className="space-y-4">
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No tasks for this day.</p>
                </div>
              ) : (
                selectedDateTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.text}
                      </p>
                      <p className="text-[10px] text-slate-400">{task.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button 
              onClick={() => navigate('/tasks')}
              className="w-full mt-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h4 className="font-bold mb-2">Did you know?</h4>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Using a calendar to visualize your workload can reduce stress by 33%. Keep tracking your progress!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
