import React from 'react';
import { Card } from './ui';
import { ReminderFrequency, useReminders } from '../hooks/useReminders';
import { HistoryRecord } from '../types';

export function ReminderSettings({ records }: { records: HistoryRecord[] }) {
  const { frequency, updateFrequency, permission } = useReminders(records);

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFrequency(e.target.value as ReminderFrequency);
  };

  return (
    <Card className="bg-white dark:bg-neutral-900 border-2 border-orange-100/70 dark:border-neutral-800 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 flex items-center justify-center text-xl shrink-0">
            {frequency === 'off' ? '🔕' : '🔔'}
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="font-black text-orange-950 dark:text-orange-100 text-sm">
                Recordatorios de Mimos
              </h4>
            </div>
            <p className="text-xs text-orange-800/70 dark:text-orange-300/70 font-medium">
              Te avisamos cuándo toca su próxima fotito de control
            </p>
          </div>
        </div>
        
        <select
          value={frequency}
          onChange={handleFrequencyChange}
          className="bg-orange-50 dark:bg-neutral-800 border border-orange-200 dark:border-neutral-700 rounded-2xl text-xs font-bold text-orange-950 dark:text-orange-200 py-2 px-3 focus:ring-2 focus:ring-orange-300 dark:focus:ring-orange-800 outline-none cursor-pointer"
        >
          <option value="off">🔕 Apagado</option>
          <option value="weekly">📅 Cada Semana</option>
          <option value="biweekly">📅 Cada 15 Días</option>
          <option value="monthly">📅 Cada Mes</option>
        </select>
      </div>
      
      {permission === 'denied' && frequency !== 'off' && (
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-3 font-semibold bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-100">
          😿 Las notificaciones están desactivadas en tu navegador. Actívalas en los ajustes del sitio para no perderte ningún recordatorio.
        </p>
      )}
    </Card>
  );
}
