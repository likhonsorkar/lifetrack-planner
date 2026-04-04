import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, ChevronLeft } from 'lucide-react';

const PinLock = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [savedPin, setSavedPin] = useState('');

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('lifetrack_settings') || '{}');
    if (settings.privacyPin) {
      setSavedPin(settings.privacyPin);
    }
  }, []);

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === savedPin) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-[100] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-xs w-full text-center space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Enter PIN</h2>
          <p className="text-slate-500 text-sm">Please enter your 4-digit PIN to access this section.</p>
        </div>

        <div className={`flex justify-center gap-4 ${error ? 'animate-shake' : ''}`}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > i 
                  ? 'bg-indigo-600 border-indigo-600 scale-110' 
                  : 'bg-transparent border-slate-300'
              } ${error ? 'border-rose-500 bg-rose-500' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-2xl font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick(0)}
            className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-2xl font-bold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-all shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-all"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default PinLock;
