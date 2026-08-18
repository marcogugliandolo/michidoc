import { CatProfile, HistoryRecord } from '../types';
import { Card } from './ui';
import { Award, Sparkles, CheckCircle, Lock } from 'lucide-react';

interface CatParentBadgesProps {
  profile: CatProfile;
  records: HistoryRecord[];
}

export function CatParentBadges({ profile, records }: CatParentBadgesProps) {
  const hasPainRecord = records.some(r => r.type === 'pain');
  const hasBcsRecord = records.some(r => r.type === 'bcs');
  const hasMultipleRecords = records.length >= 3;

  const badges = [
    {
      id: 'welcome',
      title: 'Familia Michi',
      desc: `Registraste a ${profile.name} con mucho amor`,
      emoji: '🏠',
      unlocked: true,
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'pain',
      title: 'Guardián de Miradas',
      desc: 'Revisión de expresión y dolor facial (FGS)',
      emoji: '🐱',
      unlocked: hasPainRecord,
      color: 'from-rose-400 to-pink-500'
    },
    {
      id: 'bcs',
      title: 'Nutrición & Silueta',
      desc: 'Evaluación de figura y peso óptimo (BCS)',
      emoji: '⚖️',
      unlocked: hasBcsRecord,
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'loyal',
      title: 'Humano Ejemplar',
      desc: '3 o más chequeos guardados en su álbum',
      emoji: '🌟',
      unlocked: hasMultipleRecords,
      color: 'from-sky-400 to-blue-500'
    }
  ];

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <Card className="p-5 sm:p-6 bg-white dark:bg-neutral-900 border-2 border-orange-100/80 dark:border-neutral-800">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <h3 className="font-black text-sm text-orange-950 dark:text-orange-100">
              Medallas de Amor Felino
            </h3>
            <p className="text-[11px] text-orange-700/80 dark:text-orange-400 font-medium">
              Logros por cuidar de {profile.name}
            </p>
          </div>
        </div>

        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
          {unlockedCount} / {badges.length} desbloqueadas
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {badges.map(b => (
          <div
            key={b.id}
            className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
              b.unlocked
                ? 'bg-orange-50/50 dark:bg-neutral-800/60 border-orange-200/80 dark:border-neutral-700'
                : 'bg-gray-50/60 dark:bg-neutral-900/40 border-gray-200 dark:border-neutral-800 opacity-60'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-1.5 shadow-xs ${
              b.unlocked ? `bg-gradient-to-br ${b.color} text-white` : 'bg-gray-200 dark:bg-neutral-800 text-gray-400'
            }`}>
              {b.unlocked ? b.emoji : '🔒'}
            </div>

            <div>
              <h4 className="font-black text-xs text-gray-900 dark:text-gray-100 line-clamp-1">
                {b.title}
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 font-medium leading-tight">
                {b.desc}
              </p>
            </div>

            <div className="mt-2">
              {b.unlocked ? (
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle size={10} /> ¡Conseguida!
                </span>
              ) : (
                <span className="text-[9px] font-bold text-gray-400 flex items-center gap-0.5">
                  <Lock size={10} /> Por lograr
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
