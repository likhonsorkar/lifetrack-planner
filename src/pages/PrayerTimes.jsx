import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Sun, Moon, Sunrise, Sunset, CloudSun, WifiOff, RefreshCw, CheckCircle2, Circle, Utensils, Coffee, Zap, ChevronRight } from 'lucide-react';
import { format, parse, addDays } from 'date-fns';

const PrayerTimes = () => {
  const [timings, setTimings] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Daily Tracking State
  const [prayerCompletion, setPrayerCompletion] = useState(() => {
    const saved = localStorage.getItem('lifetrack_prayer_completion');
    const today = format(new Date(), 'yyyy-MM-dd');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) return parsed.data;
    }
    return { Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false, Tasbih10: false };
  });

  useEffect(() => {
    localStorage.setItem('lifetrack_prayer_completion', JSON.stringify({
      date: format(new Date(), 'yyyy-MM-dd'),
      data: prayerCompletion
    }));
  }, [prayerCompletion]);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const fetchPrayerTimes = useCallback(async (lat, lng, force = false) => {
    setLoading(true);
    setError(null);

    const cached = localStorage.getItem('lifetrack_prayer_cache');
    const cachedDate = localStorage.getItem('lifetrack_prayer_date');
    const today = format(new Date(), 'yyyy-MM-dd');

    if (!force && cached && cachedDate === today) {
      setTimings(JSON.parse(cached));
      const cachedCal = localStorage.getItem('lifetrack_prayer_calendar');
      if (cachedCal) setCalendar(JSON.parse(cachedCal));
      setLoading(false);
      return;
    }

    if (!navigator.onLine) {
      if (cached) {
        setTimings(JSON.parse(cached));
        const cachedCal = localStorage.getItem('lifetrack_prayer_calendar');
        if (cachedCal) setCalendar(JSON.parse(cachedCal));
        setError("Working offline. Showing cached times.");
      } else {
        setError("Internet connection required for first-time setup.");
      }
      setLoading(false);
      return;
    }

    try {
      const settings = JSON.parse(localStorage.getItem('lifetrack_settings') || '{}');
      const asrMethod = settings.asrMethod || 0;
      const calcMethod = settings.calculationMethod || 2;

      // Current Day
      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${calcMethod}&school=${asrMethod}`
      );
      const data = await response.json();
      const newTimings = data.data.timings;
      
      // Calendar for 7 days
      const date = new Date();
      const calRes = await fetch(
        `https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lng}&method=${calcMethod}&school=${asrMethod}&month=${date.getMonth()+1}&year=${date.getFullYear()}`
      );
      const calData = await calRes.json();
      const todayIdx = date.getDate() - 1;
      const next7Days = calData.data.slice(todayIdx, todayIdx + 7);

      setTimings(newTimings);
      setCalendar(next7Days);
      localStorage.setItem('lifetrack_prayer_cache', JSON.stringify(newTimings));
      localStorage.setItem('lifetrack_prayer_calendar', JSON.stringify(next7Days));
      localStorage.setItem('lifetrack_prayer_date', today);
      localStorage.setItem('lifetrack_last_loc', JSON.stringify({ lat, lng }));
    } catch (err) {
      setError("Failed to fetch new times. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLocation = () => {
    if (!navigator.onLine) {
      alert("Internet connection required to update location.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchPrayerTimes(latitude, longitude, true);
      },
      () => {
        setError("Location access denied. Using default (Dhaka).");
        const defaultLoc = { latitude: 23.8103, longitude: 90.4125 };
        setLocation(defaultLoc);
        fetchPrayerTimes(defaultLoc.latitude, defaultLoc.longitude, true);
      }
    );
  };

  useEffect(() => {
    const lastLoc = localStorage.getItem('lifetrack_last_loc');
    if (lastLoc) {
      const { lat, lng } = JSON.parse(lastLoc);
      setLocation({ latitude: lat, longitude: lng });
      fetchPrayerTimes(lat, lng);
    } else {
      updateLocation();
    }
  }, [fetchPrayerTimes]);

  const togglePrayer = (name) => {
    setPrayerCompletion(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const prayerIcons = {
    Fajr: { icon: <Sunrise className="text-indigo-400" />, end: 'Sunrise' },
    Dhuhr: { icon: <Sun className="text-amber-500" />, end: 'Asr' },
    Asr: { icon: <CloudSun className="text-orange-400" />, end: 'Maghrib' },
    Maghrib: { icon: <Sunset className="text-rose-400" />, end: 'Isha' },
    Isha: { icon: <Moon className="text-indigo-600" />, end: 'Fajr' },
  };

  if (loading && !timings) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="text-slate-500 font-medium">Fetching Wakt Times...</p>
    </div>
  );

  const completedCount = Object.values(prayerCompletion).filter(Boolean).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {!isOnline && !timings && (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-center space-y-4">
          <WifiOff className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-xl font-bold text-amber-900">No Connection</h3>
          <p className="text-amber-700 max-w-sm mx-auto">
            We need internet access to download prayer times for your location. Please connect and try again.
          </p>
          <button onClick={updateLocation} className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold">
            Try Connecting
          </button>
        </div>
      )}

      {timings && (
        <>
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Prayer & Routine Tracker</h2>
              <div className="flex items-center gap-4 mt-2">
                <button onClick={updateLocation} className="flex items-center gap-1.5 text-sm text-indigo-600 font-bold hover:underline">
                  <MapPin className="w-4 h-4" /> Update Location
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-sm text-slate-500 font-medium">{format(new Date(), 'EEEE, MMMM do')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {completedCount} Tasks Done
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-xs font-black uppercase tracking-widest">Sahri Ends</p>
                <p className="text-2xl font-bold text-emerald-900">{timings.Imsak}</p>
              </div>
              <Coffee className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100 flex items-center justify-between">
              <div>
                <p className="text-rose-600 text-xs font-black uppercase tracking-widest">Iftar Time</p>
                <p className="text-2xl font-bold text-rose-900">{timings.Maghrib}</p>
              </div>
              <Utensils className="w-8 h-8 text-rose-400" />
            </div>
            <motion.div 
               whileTap={{ scale: 0.98 }}
               onClick={() => togglePrayer('Tasbih10')}
               className={`p-6 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
                  prayerCompletion.Tasbih10 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-900'
               }`}
            >
              <div>
                <p className={`text-xs font-black uppercase tracking-widest ${prayerCompletion.Tasbih10 ? 'text-indigo-200' : 'text-indigo-600'}`}>Daily Tasbih</p>
                <p className="text-2xl font-bold">10 Times</p>
              </div>
              <Zap className={`w-8 h-8 ${prayerCompletion.Tasbih10 ? 'text-indigo-200' : 'text-indigo-400'}`} />
            </motion.div>
            <div className="bg-slate-900 p-6 rounded-3xl text-white flex items-center justify-between shadow-lg">
               <div>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Next Prayer</p>
                  <p className="text-2xl font-bold">Fajr</p>
               </div>
               <Clock className="w-8 h-8 text-slate-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.keys(prayerIcons).map((name, idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => togglePrayer(name)}
                className={`p-6 rounded-3xl border shadow-sm relative overflow-hidden group cursor-pointer transition-all ${
                  prayerCompletion[name] ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/20' : 'bg-white border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-50 rounded-xl">{prayerIcons[name].icon}</div>
                    {prayerCompletion[name] ? (
                      <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-200" />
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900">{name}</h3>
                  <div className="mt-4 space-y-1">
                    <p className={`text-2xl font-black ${prayerCompletion[name] ? 'text-indigo-600' : 'text-slate-700'}`}>{timings[name]}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span>Ends:</span>
                      <span className="text-slate-600">{timings[prayerIcons[name].end]}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
             <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="text-xl font-bold text-slate-900">7-Day Iftar & Sahri Schedule</h3>
                   <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                      <Calendar className="w-4 h-4" />
                      Upcoming
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50">
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-emerald-600">Sahri End</th>
                            <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-rose-600">Iftar Time</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {calendar.map((day, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                               <td className="px-6 py-4">
                                  <p className="font-bold text-slate-700">{day.date.readable.split(' ').slice(0, 2).join(' ')}</p>
                                  <p className="text-[10px] font-bold text-slate-400">{day.date.gregorian.weekday.en}</p>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     <Coffee className="w-4 h-4 text-emerald-400" />
                                     <span className="font-mono font-bold text-emerald-700">{day.timings.Imsak.split(' ')[0]}</span>
                                  </div>
                               </td>
                               <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                     <Utensils className="w-4 h-4 text-rose-400" />
                                     <span className="font-mono font-bold text-rose-700">{day.timings.Maghrib.split(' ')[0]}</span>
                                  </div>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
                   <div className="relative z-10">
                      <h4 className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-4">Ramadan Reminder</h4>
                      <p className="text-lg font-bold leading-snug">"Fasting is a shield with which a servant protects himself from the Fire."</p>
                      <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
                         <span className="text-xs text-slate-500 font-bold">Sahih Al-Jami'</span>
                         <div className="p-2 bg-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Zap className="w-4 h-4" />
                         </div>
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl" />
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                   <h4 className="font-bold text-slate-900 mb-4">Location Settings</h4>
                   <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-slate-500 font-medium">Auto-Update</span>
                         <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                         </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-slate-500 font-medium">Prayer Alerts</span>
                         <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                         </div>
                      </div>
                   </div>
                   <button onClick={updateLocation} className="w-full mt-6 py-3 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Refresh All Times
                   </button>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PrayerTimes;
