import { useEffect, useState } from 'react';
import { HistoryRecord } from '../types';

export type ReminderFrequency = 'off' | 'weekly' | 'biweekly' | 'monthly';

const FREQUENCY_MS = {
  weekly: 7 * 24 * 60 * 60 * 1000,
  biweekly: 14 * 24 * 60 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};

export function useReminders(records: HistoryRecord[]) {
  const [frequency, setFrequency] = useState<ReminderFrequency>('off');
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPermission(Notification.permission);
      const saved = localStorage.getItem('reminderFrequency') as ReminderFrequency;
      if (saved && ['off', 'weekly', 'biweekly', 'monthly'].includes(saved)) {
        setFrequency(saved);
      }
    }
  }, []);

  const updateFrequency = async (newFrequency: ReminderFrequency) => {
    if (newFrequency !== 'off' && Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        alert('Debes permitir las notificaciones para activar los recordatorios.');
        return;
      }
    }
    
    setFrequency(newFrequency);
    localStorage.setItem('reminderFrequency', newFrequency);
  };

  // Check if a reminder should be triggered
  useEffect(() => {
    if (frequency === 'off' || permission !== 'granted') return;

    const checkAndNotify = () => {
      const lastRecordDate = records.length > 0 
        ? Math.max(...records.map(r => r.date)) 
        : null;

      const lastNotificationDate = Number(localStorage.getItem('lastNotificationDate')) || 0;
      const now = Date.now();

      // Ensure we don't spam notifications, max once per day
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      if (now - lastNotificationDate < ONE_DAY_MS) return;

      const timeSinceLastCheck = lastRecordDate ? (now - lastRecordDate) : Infinity;
      const threshold = FREQUENCY_MS[frequency];

      if (timeSinceLastCheck >= threshold) {
        new Notification('¡Es hora de revisar a tu michi!', {
          body: 'Han pasado varios días desde su última revisión de salud. Entra a MichiDoc para un chequeo rápido.',
          icon: '/favicon.ico'
        });
        localStorage.setItem('lastNotificationDate', now.toString());
      }
    };

    // Small delay to ensure everything is loaded before checking
    const timer = setTimeout(checkAndNotify, 3000);
    return () => clearTimeout(timer);
  }, [frequency, permission, records]);

  return { frequency, updateFrequency, permission };
}
