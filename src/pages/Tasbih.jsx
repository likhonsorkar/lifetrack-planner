import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Plus, Fingerprint, ChevronUp, ChevronDown } from 'lucide-react';

const Tasbih = () => {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('lifetrack_tasbih');
    return saved ? parseInt(saved) : 0;
  });
  const [target, setTarget] = useState(33);

  useEffect(() => {
    localStorage.setItem('lifetrack_tasbih', count.toString());
    if (count > 0 && count % target === 0) {
      if ('vibrate' in navigator) navigator.vibrate(200);
    }
  }, [count, target]);

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Tasbih Counter</h2>
        <p className="text-slate-500">Keep track of your dhikr with ease.</p>
      </header>

      <div className="relative group">
        <motion.div 
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-64 h-64 rounded-full bg-white border-8 border-indigo-600 flex flex-col items-center justify-center shadow-2xl shadow-indigo-200 relative z-10"
        >
          <span className="text-6xl font-black text-indigo-600 font-mono">{count}</span>
          <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">
            Goal: {target}
          </span>
        </motion.div>
        
        {/* Decorative Ring */}
        <div className="absolute inset-[-20px] rounded-full border border-indigo-100 animate-pulse" />
      </div>

      <div className="flex flex-col items-center gap-8 w-full">
        <button
          onClick={() => setCount(count + 1)}
          className="w-full max-w-sm py-8 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex flex-col items-center gap-2 group"
        >
          <Plus className="w-12 h-12" />
          <span className="font-bold text-xl">Tap to Count</span>
          <Fingerprint className="w-6 h-6 text-indigo-300 group-hover:text-white transition-colors" />
        </button>

        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={() => setCount(0)}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-bold"
          >
            <RotateCcw className="w-5 h-5" /> Reset
          </button>
          
          <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex items-center justify-between px-4 py-2">
             <div className="flex flex-col">
               <span className="text-[10px] font-bold text-slate-400 uppercase">Target</span>
               <span className="font-bold text-slate-700">{target}</span>
             </div>
             <div className="flex flex-col gap-1">
                <button onClick={() => setTarget(t => t + 1)} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button onClick={() => setTarget(t => Math.max(1, t - 1))} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600">
                  <ChevronDown className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        {[33, 99, 100, 1000].map(val => (
          <button
            key={val}
            onClick={() => setTarget(val)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              target === val ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tasbih;
