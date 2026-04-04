import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, Fingerprint, ChevronUp, ChevronDown, CheckCircle2, ListFilter, Infinity } from 'lucide-react';

const Tasbih = () => {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('lifetrack_tasbih');
    return saved ? parseInt(saved) : 0;
  });
  
  const [mode, setMode] = useState('session'); // 'session' or 'manual' or 'unlimited'
  const [target, setTarget] = useState(33);
  const [sessionIndex, setSessionIndex] = useState(0);

  const sessionTargets = [
    { name: 'Subhanallah', target: 33 },
    { name: 'Alhamdulillah', target: 33 },
    { name: 'Allahu Akbar', target: 34 },
  ];

  useEffect(() => {
    localStorage.setItem('lifetrack_tasbih', count.toString());
    
    let currentTarget = target;
    if (mode === 'session') currentTarget = sessionTargets[sessionIndex].target;

    if (count > 0 && count === currentTarget && mode !== 'unlimited') {
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
    }
  }, [count, target, mode, sessionIndex]);

  const handleIncrement = () => {
    let currentTarget = target;
    if (mode === 'session') currentTarget = sessionTargets[sessionIndex].target;

    if (mode !== 'unlimited' && count >= currentTarget) {
      if (mode === 'session' && sessionIndex < sessionTargets.length - 1) {
        setSessionIndex(sessionIndex + 1);
        setCount(1);
      } else {
        // Finished session or manual target
        setCount(0);
        if (mode === 'session') setSessionIndex(0);
      }
    } else {
      setCount(count + 1);
    }
  };

  const getProgress = () => {
    if (mode === 'unlimited') return 0;
    let currentTarget = target;
    if (mode === 'session') currentTarget = sessionTargets[sessionIndex].target;
    return (count / currentTarget) * 100;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Digital Tasbih</h2>
          <p className="text-slate-500">Stay mindful with focused dhikr sessions.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start">
          {[
            { id: 'session', icon: <ListFilter className="w-4 h-4" />, label: 'Session' },
            { id: 'manual', icon: <ChevronUp className="w-4 h-4" />, label: 'Manual' },
            { id: 'unlimited', icon: <Infinity className="w-4 h-4" />, label: 'Free' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setCount(0); setSessionIndex(0); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                mode === m.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-12 space-y-12">
        {/* Main Counter Display */}
        <div className="relative">
          {/* Progress Ring */}
          <svg className="w-80 h-80 transform -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            {mode !== 'unlimited' && (
              <motion.circle
                cx="160"
                cy="160"
                r="150"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 150}
                animate={{ strokeDashoffset: (2 * Math.PI * 150) * (1 - getProgress() / 100) }}
                strokeLinecap="round"
                className="text-indigo-600"
              />
            )}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-black text-slate-900 font-mono"
              >
                {count}
              </motion.span>
            </AnimatePresence>
            
            {mode === 'session' && (
              <div className="mt-2 text-center">
                <p className="text-indigo-600 font-bold uppercase tracking-[0.2em] text-sm">
                  {sessionTargets[sessionIndex].name}
                </p>
                <p className="text-slate-400 text-xs font-bold mt-1">
                  Goal: {sessionTargets[sessionIndex].target}
                </p>
              </div>
            )}

            {mode === 'manual' && (
              <div className="mt-2 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Goal: {target}
                </p>
              </div>
            )}

            {mode === 'unlimited' && (
              <p className="mt-2 text-indigo-400 text-sm font-bold uppercase tracking-[0.2em]">
                Free Flow
              </p>
            )}
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 shadow-sm">
            <Fingerprint className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-6">
          <button
            onClick={handleIncrement}
            className="w-full py-10 bg-white border-2 border-slate-200 rounded-[3rem] shadow-xl hover:shadow-2xl hover:border-indigo-200 transition-all group relative active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center gap-2">
               <Plus className="w-10 h-10 text-indigo-600 group-hover:scale-110 transition-transform" />
               <span className="text-lg font-black text-slate-700 uppercase tracking-widest">Count Dhikr</span>
            </div>
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => { setCount(0); setSessionIndex(0); }}
              className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <RotateCcw className="w-5 h-5" /> Reset
            </button>
            
            {mode === 'manual' && (
              <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex items-center justify-between px-4 py-2">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Target</span>
                   <span className="font-bold text-slate-700">{target}</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <button onClick={() => setTarget(t => t + 1)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => setTarget(t => Math.max(1, t - 1))} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Session Progress List */}
      {mode === 'session' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sessionTargets.map((st, idx) => (
            <div 
              key={st.name}
              className={`p-4 rounded-2xl border transition-all ${
                idx === sessionIndex 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                  : idx < sessionIndex
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest opacity-80">Phase {idx + 1}</span>
                {idx < sessionIndex && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <p className="font-bold">{st.name}</p>
              <p className="text-[10px] mt-1 font-bold opacity-60">{st.target} Repetitions</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasbih;
