import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Sun, Moon, Sunrise, Sunset, CloudSun, WifiOff, RefreshCw } from 'lucide-react';
import { format, parse, addMinutes, isAfter, isBefore } from 'date-fns';

const PrayerTimes = () => {
  const [timings, setTimings] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

    // Try to load from cache first if not forced
    const cached = localStorage.getItem('lifetrack_prayer_cache');
    const cachedDate = localStorage.getItem('lifetrack_prayer_date');
    const today = format(new Date(), 'yyyy-MM-dd');

    if (!force && cached && cachedDate === today) {
      setTimings(JSON.parse(cached));
      setLoading(false);
      return;
    }

    if (!navigator.onLine) {
      if (cached) {
        setTimings(JSON.parse(cached));
        setError("Working offline. Showing cached times.");
      } else {
        setError("Internet connection required for first-time setup.");
      }
      setLoading(false);
      return;
    }

    try {
      const settings = JSON.parse(localStorage.getItem('lifetrack_settings') || '{}');
      const asrMethod = settings.asrMethod || 0; // 0 = Standard, 1 = Hanafi
      const calcMethod = settings.calculationMethod || 2;

      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=${calcMethod}&school=${asrMethod}`
      );
      const data = await response.json();
      const newTimings = data.data.timings;
      
      setTimings(newTimings);
      localStorage.setItem('lifetrack_prayer_cache', JSON.stringify(newTimings));
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
              <h2 className="text-3xl font-bold text-slate-900">Prayer Schedule</h2>
              <div className="flex items-center gap-4 mt-2">
                <button onClick={updateLocation} className="flex items-center gap-1.5 text-sm text-indigo-600 font-bold hover:underline">
                  <MapPin className="w-4 h-4" /> Update Location
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-sm text-slate-500 font-medium">{format(new Date(), 'EEEE, MMMM do')}</span>
              </div>
            </div>
            {error && <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-xs font-bold">{error}</div>}
          </header>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.keys(prayerIcons).map((name, idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="mb-4">{prayerIcons[name].icon}</div>
                  <h3 className="font-bold text-slate-900">{name}</h3>
                  <div className="mt-4 space-y-1">
                    <p className="text-2xl font-black text-indigo-600">{timings[name]}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span>End:</span>
                      <span className="text-slate-600">{timings[prayerIcons[name].end]}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 text-slate-50 group-hover:text-indigo-50 transition-colors">
                   {prayerIcons[name].icon}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl overflow-hidden relative">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left space-y-2">
                   <h4 className="text-indigo-400 font-black uppercase tracking-widest text-xs">Current Wakt</h4>
                   <p className="text-4xl font-bold">In Progress</p>
                   <p className="text-slate-400 text-sm italic">"Prayer is the pillar of religion."</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                      <p className="text-xs text-slate-500 font-bold uppercase">Next: {prayerIcons['Fajr'].end}</p>
                      <p className="text-2xl font-mono">-- : --</p>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>
        </>
      )}
    </div>
  );
};

export default PrayerTimes;
