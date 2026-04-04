import { useEffect } from 'react';
import { parseISO, subMinutes, isAfter, isBefore, differenceInMinutes, format } from 'date-fns';

const useNotificationManager = () => {
  useEffect(() => {
    const checkNotifications = async () => {
      const savedTasks = localStorage.getItem('lifetrack_tasks');
      const savedPrayer = localStorage.getItem('lifetrack_prayer_cache');
      const settings = JSON.parse(localStorage.getItem('lifetrack_settings') || '{}');
      
      const now = new Date();
      const currentTimeStr = format(now, 'HH:mm');
      let updated = false;

      // 1. Check Prayer Alarms
      if (settings.prayerNotifications && savedPrayer) {
        const timings = JSON.parse(savedPrayer);
        const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        
        prayerNames.forEach(name => {
          if (timings[name] === currentTimeStr) {
            const lastPrayerNotified = localStorage.getItem(`last_prayer_${name}`);
            const todayStr = format(now, 'yyyy-MM-dd');
            
            if (lastPrayerNotified !== todayStr) {
              triggerNotification(`Prayer Time: ${name}`, `It is time for ${name} prayer.`, 'prayer');
              localStorage.setItem(`last_prayer_${name}`, todayStr);
            }
          }
        });
      }

      // 2. Check Tasks
      if (savedTasks) {
        let tasks = JSON.parse(savedTasks);
        const updatedTasks = tasks.map(task => {
          if (task.completed || task.notified) return task;

          const taskDateTime = new Date(`${task.date}T${task.time}`);
          const reminderTime = subMinutes(taskDateTime, task.reminderMinutes);

          if (isAfter(now, reminderTime) && isBefore(now, taskDateTime)) {
            triggerNotification(`Reminder: ${task.text}`, `Starts in ${task.reminderMinutes}m`, 'task');
            updated = true;
            return { ...task, notified: true };
          }
          
          if (isAfter(now, taskDateTime) && differenceInMinutes(now, taskDateTime) <= 1) {
             triggerNotification(`Task Starting: ${task.text}`, `It is time to start!`, 'task');
             updated = true;
             return { ...task, notified: true };
          }
          return task;
        });

        if (updated) {
          localStorage.setItem('lifetrack_tasks', JSON.stringify(updatedTasks));
          window.dispatchEvent(new Event('storage'));
        }
      }
    };

    const triggerNotification = async (title, body, type) => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const registration = await navigator.serviceWorker.ready;
      const options = {
        body,
        icon: "/favicon.png",
        badge: "/favicon.png",
        vibrate: type === 'prayer' ? [500, 100, 500, 100, 500] : [200, 100, 200],
        tag: `${type}-${Date.now()}`,
        renotify: true
      };

      if (registration && registration.showNotification) {
        registration.showNotification(title, options);
      } else {
        new Notification(title, options);
      }
    };

    const interval = setInterval(checkNotifications, 30000);
    checkNotifications();
    return () => clearInterval(interval);
  }, []);
};

export default useNotificationManager;
