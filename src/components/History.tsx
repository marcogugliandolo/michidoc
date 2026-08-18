import { useState } from 'react';
import { ArrowLeft, Calendar, HeartPulse, Scale, Activity, TrendingUp } from 'lucide-react';
import { HistoryRecord, BCSHistoryRecord, PainHistoryRecord } from '../types';
import { Card, cn } from './ui';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'motion/react';

export function History({ onBack, records }: { onBack: () => void, records: HistoryRecord[] }) {
  const [filter, setFilter] = useState<'all' | 'pain' | 'bcs'>('all');

  const filteredRecords = records.filter(r => {
    if (filter === 'all') return true;
    return r.type === filter;
  });

  const bcsData = (records.filter((r): r is BCSHistoryRecord => r.type === 'bcs' && r.result?.score !== undefined))
    .sort((a, b) => a.date - b.date)
    .map(r => ({
      date: new Date(r.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      score: r.result.score,
      status: r.result.status
    }));

  const painRecords = records.filter((r): r is PainHistoryRecord => r.type === 'pain');
  const bcsRecords = records.filter((r): r is BCSHistoryRecord => r.type === 'bcs');

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-neutral-800 p-3 rounded-2xl shadow-lg border-2 border-emerald-100 dark:border-neutral-700 text-xs">
          <p className="font-bold text-gray-800 dark:text-gray-100">{label}</p>
          <p className="text-emerald-600 dark:text-emerald-400 font-black mt-1">Score: {data.score}/9</p>
          <p className="text-gray-500 dark:text-gray-400">{data.status}</p>
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-6 pb-24 md:pb-12"
    >
      {/* Friendly Header with Back & Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2.5 -ml-2 rounded-2xl bg-orange-100/60 hover:bg-orange-200/70 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-orange-800 dark:text-orange-300 transition-colors cursor-pointer"
            title="Volver a Mi Casita"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-orange-950 dark:text-orange-200 tracking-tight flex items-center gap-2">
              <span>🐾</span>
              <span>Álbum Clínico & Evolución</span>
            </h1>
            <p className="text-xs sm:text-sm text-orange-800/80 dark:text-orange-400 font-medium">
              El diario de chequeos, fotitos y evolución corporal de tu michi
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1.5 bg-orange-100/60 dark:bg-neutral-800 rounded-full border border-orange-200 dark:border-neutral-700 self-start sm:self-auto text-xs font-bold shadow-2xs">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
              filter === 'all'
                ? "bg-white dark:bg-neutral-900 text-orange-950 dark:text-orange-100 shadow-xs font-black"
                : "text-orange-900/70 dark:text-orange-300/70 hover:text-orange-950 dark:hover:text-orange-100"
            )}
          >
            🐾 Todos ({records.length})
          </button>
          <button
            onClick={() => setFilter('pain')}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer",
              filter === 'pain'
                ? "bg-white dark:bg-neutral-900 text-rose-700 dark:text-rose-400 shadow-xs font-black"
                : "text-orange-900/70 dark:text-orange-300/70 hover:text-rose-700 dark:hover:text-rose-400"
            )}
          >
            🐱 Dolor ({painRecords.length})
          </button>
          <button
            onClick={() => setFilter('bcs')}
            className={cn(
              "px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer",
              filter === 'bcs'
                ? "bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-black"
                : "text-orange-900/70 dark:text-orange-300/70 hover:text-emerald-700 dark:hover:text-emerald-400"
            )}
          >
            ⚖️ Pancita ({bcsRecords.length})
          </button>
        </div>
      </motion.div>

      {/* Main Grid: Left Column Timeline (7 cols) + Right Column Chart & Stats (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-7 space-y-5">
          {filteredRecords.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-16 text-gray-400 dark:text-gray-500 bg-white dark:bg-neutral-900 rounded-3xl p-8 border-2 border-orange-100/70 dark:border-neutral-800">
              <span className="text-5xl block mb-3 opacity-60">🐾</span>
              <h3 className="font-black text-gray-800 dark:text-gray-200 text-base mb-1">
                Aún no hay chequeos guardados
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto font-medium">
                {filter === 'all' 
                  ? 'Realiza tu primer chequeo de dolor o condición corporal para comenzar este lindo diario.' 
                  : 'No hay chequeos en esta categoría todavía.'}
              </p>
            </motion.div>
          ) : (
            <div className="relative border-l-2 border-orange-200 dark:border-neutral-800 ml-4 sm:ml-6 space-y-6">
              {filteredRecords.map((record) => {
                const isPain = record.type === 'pain';
                
                return (
                  <motion.div variants={itemVariants} key={record.id} className="relative pl-6 sm:pl-8">
                    {/* Paw Timeline Dot */}
                    <div className={cn(
                      "absolute -left-[14px] top-4 w-7 h-7 rounded-full border-2 border-[#fff9f3] dark:border-neutral-950 flex items-center justify-center text-xs shadow-xs",
                      isPain 
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300" 
                        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
                    )}>
                      🐾
                    </div>

                    <div className="rounded-3xl bg-white dark:bg-neutral-900 p-5 sm:p-6 border-2 border-orange-100/70 dark:border-neutral-800 shadow-xs hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{isPain ? '🐱' : '⚖️'}</span>
                          <span className="font-black text-sm sm:text-base text-gray-900 dark:text-gray-100">
                            {isPain ? 'Chequeo de Dolor Facial' : 'Condición de Pancita (BCS)'}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                          {formatDate(record.date)}
                        </span>
                      </div>

                      {record.type === 'pain' ? (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3.5">
                            {record.photoUrl && (
                              <img 
                                src={record.photoUrl} 
                                alt="Foto" 
                                className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl object-cover border border-orange-200 dark:border-neutral-700 shrink-0 shadow-2xs"
                              />
                            )}
                            <div className="space-y-1 flex-1">
                              <span className="text-[11px] text-gray-500 dark:text-neutral-400 font-bold uppercase">Resultado:</span>
                              <div>
                                <span className={cn(
                                  "inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider",
                                  record.result.level === 'Ninguno' && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/40",
                                  record.result.level === 'Leve' && "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/40",
                                  record.result.level === 'Moderado' && "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 dark:border dark:border-orange-800/40",
                                  record.result.level === 'Alto' && "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/40",
                                )}>
                                  Nivel {record.result.level}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-neutral-300 mt-1 font-medium line-clamp-2">
                                {record.result.explanation}
                              </p>
                            </div>
                          </div>
                          {record.result.recommendation && (
                            <div className="p-3 bg-orange-50/70 dark:bg-neutral-800/60 rounded-2xl text-xs text-orange-950 dark:text-orange-200 border border-orange-100 dark:border-neutral-700/50 font-medium">
                              <strong>💡 Consejo:</strong> {record.result.recommendation}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3.5">
                            <div className="flex gap-1.5 shrink-0">
                              {record.photoUrl && (
                                <img 
                                  src={record.photoUrl} 
                                  alt="Arriba" 
                                  title="Lomo / Arriba"
                                  className="w-14 h-20 sm:w-16 sm:h-22 rounded-2xl object-cover border border-orange-200 dark:border-neutral-700 shadow-2xs"
                                />
                              )}
                              {record.photoUrl2 && (
                                <img 
                                  src={record.photoUrl2} 
                                  alt="Perfil" 
                                  title="Perfil"
                                  className="w-14 h-20 sm:w-16 sm:h-22 rounded-2xl object-cover border border-orange-200 dark:border-neutral-700 shadow-2xs"
                                />
                              )}
                            </div>
                            <div className="space-y-1 flex-1">
                              <span className="text-[11px] text-gray-500 dark:text-neutral-400 font-bold uppercase">Estado:</span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={cn(
                                  "inline-block px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider",
                                  record.result.status === 'Peso ideal' && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/40",
                                  record.result.status === 'Bajo peso' && "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 dark:border dark:border-sky-800/40",
                                  record.result.status === 'Sobrepeso' && "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border dark:border-amber-800/40",
                                  record.result.status === 'Obesidad' && "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/40",
                                )}>
                                  {record.result.status}
                                </span>
                                <span className="text-xs font-black text-gray-600 dark:text-neutral-300">
                                  ({record.result.score}/9)
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-neutral-300 mt-1 font-medium line-clamp-2">
                                {record.result.explanation}
                              </p>
                            </div>
                          </div>
                          {record.result.recommendation && (
                            <div className="p-3 bg-emerald-50/70 dark:bg-neutral-800/60 rounded-2xl text-xs text-emerald-950 dark:text-emerald-200 border border-emerald-100 dark:border-neutral-700/50 font-medium">
                              <strong>🍲 Ración:</strong> {record.result.recommendation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Trend Chart & Mini-Summary */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          
          {/* BCS Chart Card */}
          {bcsData.length >= 2 ? (
            <motion.div variants={itemVariants}>
              <div className="rounded-3xl bg-white dark:bg-neutral-900 p-5 sm:p-6 border-2 border-emerald-100 dark:border-neutral-800 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-orange-950 dark:text-orange-200 flex items-center gap-1.5">
                    <span>📈</span>
                    <span>Curva de Condición (BCS)</span>
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
                    Escala 1 a 9
                  </span>
                </div>
                <div className="h-48 w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bcsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-neutral-800" vertical={false} strokeOpacity={0.6} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11, fill: '#9ca3af' }} 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <YAxis 
                        domain={[1, 9]} 
                        ticks={[1, 3, 5, 7, 9]} 
                        tick={{ fontSize: 11, fill: '#9ca3af' }} 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center mt-2 font-medium">
                  🌟 El score 5/9 representa el peso y masa muscular ideal.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <div className="rounded-3xl p-6 bg-white dark:bg-neutral-900 border-2 border-emerald-100/70 dark:border-neutral-800 text-center shadow-xs">
                <span className="text-3xl block mb-2">⚖️</span>
                <h4 className="font-black text-sm text-gray-800 dark:text-gray-200 mb-1">
                  Gráfico de Evolución
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto font-medium">
                  Guarda al menos 2 evaluaciones de pancita y figura para ver la línea de evolución en el tiempo.
                </p>
              </div>
            </motion.div>
          )}

          {/* Quick Metrics Summary */}
          <motion.div variants={itemVariants}>
            <div className="rounded-3xl bg-white dark:bg-neutral-900 p-5 space-y-3 border-2 border-orange-100/70 dark:border-neutral-800 shadow-xs">
              <h4 className="font-black text-xs text-orange-950 dark:text-orange-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>🐾</span>
                <span>Resumen de Cuidados</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-rose-50/70 dark:bg-neutral-800/60 border border-rose-100 dark:border-neutral-700">
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 block">
                    🐱 Dolor Facial
                  </span>
                  <span className="text-2xl font-black text-rose-800 dark:text-rose-300 mt-0.5 block">
                    {painRecords.length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-neutral-800/60 border border-emerald-100 dark:border-neutral-700">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
                    ⚖️ Revisiones BCS
                  </span>
                  <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300 mt-0.5 block">
                    {bcsRecords.length}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
