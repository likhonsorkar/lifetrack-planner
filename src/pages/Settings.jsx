import { useState, useEffect } from 'react';
import { Bell, Shield, RefreshCw , Trash2, Download, Upload, Info, User, Palette, Check, Save, Globe, Lock } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    userName: 'Your Name',
    notificationsEnabled: Notification.permission === 'granted',
    prayerNotifications: true,
    defaultReminder: '15',
    asrMethod: '0', // 0: Standard, 1: Hanafi
    calculationMethod: '1', // 2: ISNA, 1: Karachi, etc.
    privacyPin: '',
    lockTasks: false,
    lockNotes: false,
    lockWallet: false,
    lockTasbih: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveStatus] = useState(null);
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('lifetrack_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(prev => ({...prev, ...parsed}));
      if (parsed.privacyPin) setPinInput(parsed.privacyPin);
    }
  }, []);

  const handleSave = () => {
    if (pinInput && pinInput.length !== 4 && pinInput.length !== 0) {
      alert("PIN must be 4 digits or empty to disable.");
      return;
    }
    
    setIsSaving(true);
    const updatedSettings = { ...settings, privacyPin: pinInput };
    setSettings(updatedSettings);
    localStorage.setItem('lifetrack_settings', JSON.stringify(updatedSettings));
    window.dispatchEvent(new Event('storage'));
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 600);
  };

  const handleToggleNotifications = async () => {
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setSettings({ ...settings, notificationsEnabled: permission === 'granted' });
    } else if (Notification.permission === 'denied') {
      alert("Notifications are blocked by your browser.");
    } else {
      setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled });
    }
  };

  const handleExportAll = () => {
    const allData = {
      tasks: JSON.parse(localStorage.getItem('lifetrack_tasks') || '[]'),
      notes: JSON.parse(localStorage.getItem('lifetrack_notes') || '[]'),
      tasbih: localStorage.getItem('lifetrack_tasbih') || '0',
      settings: settings,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifetrack-full-backup.json`;
    a.click();
  };

  const handleImportAll = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (window.confirm('Overwrite current data?')) {
          if (data.tasks) localStorage.setItem('lifetrack_tasks', JSON.stringify(data.tasks));
          if (data.notes) localStorage.setItem('lifetrack_notes', JSON.stringify(data.notes));
          if (data.settings) localStorage.setItem('lifetrack_settings', JSON.stringify(data.settings));
          window.location.reload();
        }
      } catch (err) { alert('Invalid file.'); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
          <p className="text-slate-500">Configure your personal LifeTrack environment.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </header>

      {saveMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Profile */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> User Profile
            </h3>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Display Name</label>
              <input 
                type="text" 
                value={settings.userName}
                onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-semibold"
              />
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" /> Privacy & Security
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Privacy PIN (4 digits)</label>
                <input 
                  type="password" 
                  maxLength="4"
                  placeholder="Leave empty to disable"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all font-mono text-xl tracking-[1em] text-center"
                />
              </div>

              {pinInput.length === 4 && (
                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <p className="text-sm font-bold text-slate-700">Lock specific sections:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { key: 'lockTasks', label: 'Tasks' },
                      { key: 'lockNotes', label: 'Notes' },
                      { key: 'lockWallet', label: 'Wallet' }
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          settings[key] 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <span className="font-bold text-sm">{label}</span>
                        {settings[key] ? <Lock className="w-4 h-4" /> : <Shield className="w-4 h-4 opacity-30" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Prayer Configuration */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" /> Prayer Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700">Athan Notifications</p>
                  <p className="text-xs text-slate-500">Get alerted exactly when prayer time starts.</p>
                </div>
                <button 
                  onClick={() => setSettings({...settings, prayerNotifications: !settings.prayerNotifications})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.prayerNotifications ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.prayerNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Asr Calculation</label>
                  <select 
                    value={settings.asrMethod}
                    onChange={(e) => setSettings({...settings, asrMethod: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value="0">Standard (Shafi, Maliki, Hanbali)</option>
                    <option value="1">Hanafi School</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Calc Method</label>
                  <select 
                    value={settings.calculationMethod}
                    onChange={(e) => setSettings({...settings, calculationMethod: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value="2">Islamic Society of North America (ISNA)</option>
                    <option value="1">University of Islamic Sciences, Karachi</option>
                    <option value="3">Muslim World League</option>
                    <option value="4">Umm Al-Qura University, Makkah</option>
                    <option value="5">Egyptian General Authority of Survey</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Backup */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-600" /> Backup & Data
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={handleExportAll} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-colors text-sm font-bold text-slate-700">
                <Download className="w-5 h-5" /> Export Data
              </button>
              <label className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl transition-colors text-sm font-bold text-slate-700 cursor-pointer">
                <Upload className="w-5 h-5" /> Import Data
                <input type="file" accept=".json" onChange={handleImportAll} className="hidden" />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
           <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h4 className="font-bold flex items-center gap-2 mb-4"><Info className="w-4 h-4 text-indigo-400" /> Privacy Note</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All your settings and data are stored <strong>locally</strong>. We don't track your location or store any personal data on any server.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
