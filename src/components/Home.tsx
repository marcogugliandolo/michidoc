import React from 'react';
import { CatProfile, HistoryRecord } from '../types';
import { Cat, Scale, PawPrint, Calendar, Sparkles } from 'lucide-react';
import { DailyTip } from './DailyTip';
import { cn } from './ui';
import { motion } from 'motion/react';

interface HomeProps {
  profile: CatProfile;
  records: HistoryRecord[];
  onNavigate: (view: 'home' | 'pain' | 'bcs' | 'history') => void;
}

export function Home({ profile, records, onNavigate }: HomeProps) {
  const painRecords = records.filter(r => r.type === 'pain');
  const bcsRecords = records.filter(r => r.type === 'bcs');
  
  const lastPainRecord = painRecords.length > 0 ? painRecords[painRecords.length - 1] : null;
  const lastBCSRecord = bcsRecords.length > 0 ? bcsRecords[bcsRecords.length - 1] : null;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      
      {/* Hero Welcome */}
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm shrink-0">
          <img 
            src={profile.photoUrl} 
            alt={profile.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center sm:text-left pt-2">
          <h1 className="text-[26px] sm:text-[32px] font-bold text-neutral-900 dark:text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
            Hola, {profile.name}
            <PawPrint className="text-orange-500/80 w-6 h-6 rotate-12" strokeWidth={2.5} />
          </h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-white dark:bg-[#121212] border border-neutral-200/60 dark:border-neutral-800/60 text-[13px] font-medium text-neutral-600 dark:text-neutral-400 shadow-sm">
              {profile.age} años
            </span>
            {profile.breed && (
              <span className="px-3 py-1 rounded-full bg-white dark:bg-[#121212] border border-neutral-200/60 dark:border-neutral-800/60 text-[13px] font-medium text-neutral-600 dark:text-neutral-400 shadow-sm">
                {profile.breed}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Pain Check Card */}
        <button 
          onClick={() => onNavigate('pain')}
          className="group relative overflow-hidden text-left bg-white dark:bg-[#121212] rounded-[32px] p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer min-h-[220px] flex flex-col justify-between"
        >
          {/* Subtle Watermark */}
          <div className="absolute -bottom-6 -right-6 text-neutral-100 dark:text-neutral-900/50 group-hover:text-orange-50 dark:group-hover:text-orange-900/20 transition-colors pointer-events-none z-0">
            <Cat size={140} strokeWidth={0.5} />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center mb-4">
              <Cat className="text-orange-500 w-6 h-6" strokeWidth={2} />
            </div>
            <h2 className="text-[20px] font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
              Chequeo de Dolor
            </h2>
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[280px]">
              Analiza su rostro mediante la Escala de Mueca Felina para detectar signos de malestar.
            </p>
          </div>
          
          <div className="relative z-10 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
            <span className="text-[12px] font-medium text-neutral-400">
              {lastPainRecord 
                ? `Último: Nivel ${lastPainRecord.result.level}`
                : 'Sin registros aún'
              }
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors text-neutral-400">
              <Sparkles size={14} />
            </div>
          </div>
        </button>

        {/* BCS Check Card */}
        <button 
          onClick={() => onNavigate('bcs')}
          className="group relative overflow-hidden text-left bg-white dark:bg-[#121212] rounded-[32px] p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer min-h-[220px] flex flex-col justify-between"
        >
          {/* Subtle Watermark */}
          <div className="absolute -bottom-6 -right-6 text-neutral-100 dark:text-neutral-900/50 group-hover:text-blue-50 dark:group-hover:text-blue-900/20 transition-colors pointer-events-none z-0">
            <Scale size={140} strokeWidth={0.5} />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-4">
              <Scale className="text-blue-500 w-6 h-6" strokeWidth={2} />
            </div>
            <h2 className="text-[20px] font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
              Condición Corporal
            </h2>
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[280px]">
              Evalúa su figura (BCS) con fotos superior y lateral para cuidar su peso ideal.
            </p>
          </div>
          
          <div className="relative z-10 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
            <span className="text-[12px] font-medium text-neutral-400">
              {lastBCSRecord 
                ? `Último: Score ${lastBCSRecord.result.score}/9`
                : 'Sin registros aún'
              }
            </span>
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors text-neutral-400">
              <Sparkles size={14} />
            </div>
          </div>
        </button>

      </section>

      {/* History Shortcut */}
      <section>
        <button
          onClick={() => onNavigate('history')}
          className="w-full bg-white dark:bg-[#121212] rounded-[24px] p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-center">
              <PawPrint className="text-neutral-500 w-5 h-5 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" strokeWidth={2} />
            </div>
            <div className="text-left">
              <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white">
                Álbum Clínico
              </h3>
              <p className="text-[13px] text-neutral-500">
                {records.length} {records.length === 1 ? 'registro guardado' : 'registros guardados'}
              </p>
            </div>
          </div>
          <div className="text-neutral-300 dark:text-neutral-600 group-hover:translate-x-1 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </button>
      </section>

      {/* Tip */}
      <section>
        <DailyTip />
      </section>

    </div>
  );
}
