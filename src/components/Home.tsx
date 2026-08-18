import { CatProfile, HistoryRecord, PainHistoryRecord, BCSHistoryRecord } from '../types';
import { Card, cn } from './ui';
import { ArrowRight, History, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { DailyTip } from './DailyTip';

interface HomeProps {
  profile: CatProfile;
  records: HistoryRecord[];
  onNavigate: (view: 'pain' | 'bcs' | 'history') => void;
  onReset: () => void;
  onEditProfile?: () => void;
}

export function Home({ profile, records, onNavigate, onEditProfile }: HomeProps) {
  const latestPainRecord = records.find((r): r is PainHistoryRecord => r.type === 'pain');
  const latestBcsRecord = records.find((r): r is BCSHistoryRecord => r.type === 'bcs');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-4xl mx-auto space-y-8 py-2 pb-24 md:pb-12"
    >
      {/* Minimalist & Friendly Hero Profile Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-5 px-1">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <button
            onClick={onEditProfile}
            className="relative shrink-0 group cursor-pointer"
            title="Toca para cambiar foto o datos"
          >
            <img 
              src={profile.photoUrl} 
              alt={profile.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-orange-300 dark:border-orange-600 shadow-sm group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-1 shadow-xs group-hover:scale-110 transition-transform">
              <Edit3 size={11} />
            </span>
          </button>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-orange-950 dark:text-orange-100">
                ¡Hola, {profile.name}!
              </h1>
              {onEditProfile && (
                <button
                  onClick={onEditProfile}
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 bg-orange-100/60 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit3 size={10} />
                  Editar
                </button>
              )}
            </div>
            <p className="text-sm text-orange-800/80 dark:text-orange-400 font-medium">
              {profile.age} {profile.breed ? `• ${profile.breed}` : ''} • ¿Qué chequeamos hoy?
            </p>
          </div>
        </div>

        {/* Quick History Pill */}
        <button
          onClick={() => onNavigate('history')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-neutral-900 border border-orange-200 dark:border-neutral-800 text-xs font-bold text-orange-900 dark:text-orange-300 hover:bg-orange-50/80 dark:hover:bg-neutral-800 transition-colors shadow-2xs cursor-pointer"
        >
          <History size={14} className="text-orange-500" />
          <span>Álbum Clínico</span>
          <span className="bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.2 rounded-full text-[10px]">
            {records.length}
          </span>
        </button>
      </motion.div>

      {/* Two Main Minimalist Action Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Pain Check Card */}
        <button
          onClick={() => onNavigate('pain')}
          className="group text-left p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border-2 border-rose-100/90 dark:border-rose-950/40 hover:border-rose-300 dark:hover:border-rose-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                🐱
              </div>
              {latestPainRecord && (
                <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full">
                  Último: {latestPainRecord.result.level}
                </span>
              )}
            </div>

            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              Chequeo de Dolor
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              Analiza la carita de tu gato con la Escala de Mueca Felina para detectar molestias tempranas.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-rose-50 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
            <span>Subir foto de su carita</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <ArrowRight size={14} />
            </div>
          </div>
        </button>

        {/* BCS Check Card */}
        <button
          onClick={() => onNavigate('bcs')}
          className="group text-left p-6 sm:p-7 rounded-3xl bg-white dark:bg-neutral-900 border-2 border-emerald-100/90 dark:border-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between h-full cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                ⚖️
              </div>
              {latestBcsRecord && (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                  Último: {latestBcsRecord.result.status} ({latestBcsRecord.result.score}/9)
                </span>
              )}
            </div>

            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Condición Corporal
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              Evalúa su peso óptimo, cintura y pancita mediante 2 fotos (vista superior y lateral).
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-50 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Evaluar silueta y figura</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <ArrowRight size={14} />
            </div>
          </div>
        </button>

      </motion.div>

      {/* Minimalist Daily Tip */}
      <motion.div variants={itemVariants} className="pt-2">
        <DailyTip />
      </motion.div>

    </motion.div>
  );
}
