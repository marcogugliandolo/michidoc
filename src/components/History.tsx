import { useState } from 'react';
import { ArrowLeft, Activity, Scale, History as HistoryIcon } from 'lucide-react';
import { HistoryRecord, BCSHistoryRecord, PainHistoryRecord } from '../types';
import { cn } from './ui';
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
        <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.08)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] border border-neutral-100 dark:border-neutral-800 text-[13px]">
          <p className="font-semibold text-neutral-900 dark:text-white mb-1">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 font-bold">Score: {data.score}/9</p>
          <p className="text-neutral-500 dark:text-neutral-400">{data.status}</p>
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
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Sleek Header with Back & Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-neutral-900 dark:text-white tracking-tight">
              Historial Clínico
            </h1>
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Evolución y seguimiento
            </p>
          </div>
        </div>

        {/* Minimalist Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 dark:bg-[#121212] rounded-full border border-neutral-200/60 dark:border-neutral-800/60 self-start sm:self-auto text-[13px] font-medium shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 py-2 rounded-full transition-all cursor-pointer",
              filter === 'all'
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Todos ({records.length})
          </button>
          <button
            onClick={() => setFilter('pain')}
            className={cn(
              "px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer",
              filter === 'pain'
                ? "bg-white dark:bg-neutral-800 text-orange-600 dark:text-orange-400 shadow-sm"
                : "text-neutral-500 hover:text-orange-600 dark:hover:text-orange-400"
            )}
          >
            <Activity size={14} /> Dolor ({painRecords.length})
          </button>
          <button
            onClick={() => setFilter('bcs')}
            className={cn(
              "px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer",
              filter === 'bcs'
                ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400"
            )}
          >
            <Scale size={14} /> Peso ({bcsRecords.length})
          </button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {filteredRecords.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-20 bg-white dark:bg-[#121212] rounded-[28px] border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
              <HistoryIcon size={48} strokeWidth={1} className="mx-auto mb-4 text-neutral-300 dark:text-neutral-700" />
              <h3 className="font-semibold text-neutral-900 dark:text-white text-[16px] mb-2">
                Aún no hay registros
              </h3>
              <p className="text-[14px] text-neutral-500 max-w-xs mx-auto">
                {filter === 'all' 
                  ? 'Realiza el primer chequeo para comenzar el seguimiento.' 
                  : 'No hay chequeos en esta categoría todavía.'}
              </p>
            </motion.div>
          ) : (
            <div className="relative border-l-2 border-neutral-200/60 dark:border-neutral-800 ml-4 sm:ml-6 space-y-6 pt-2">
              {filteredRecords.map((record) => {
                const isPain = record.type === 'pain';
                
                return (
                  <motion.div variants={itemVariants} key={record.id} className="relative pl-6 sm:pl-8">
                    {/* Timeline Dot */}
                    <div className={cn(
                      "absolute -left-[9px] top-5 w-4 h-4 rounded-full border-2 border-[#faf8f5] dark:border-[#0a0a0a]",
                      isPain 
                        ? "bg-orange-500" 
                        : "bg-blue-500"
                    )} />

                    <div className="rounded-[24px] bg-white dark:bg-[#121212] p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            isPain ? "bg-orange-50/50 dark:bg-orange-900/20 text-orange-500" : "bg-blue-50/50 dark:bg-blue-900/20 text-blue-500"
                          )}>
                            {isPain ? <Activity size={16} /> : <Scale size={16} />}
                          </div>
                          <span className="font-semibold text-[15px] text-neutral-900 dark:text-white">
                            {isPain ? 'Chequeo de Dolor' : 'Condición Corporal'}
                          </span>
                        </div>
                        <span className="text-[12px] font-medium text-neutral-500">
                          {formatDate(record.date)}
                        </span>
                      </div>

                      {record.type === 'pain' ? (
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            {record.photoUrl && (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[16px] overflow-hidden shrink-0 border border-neutral-200/80 dark:border-neutral-700/80">
                                <img 
                                  src={record.photoUrl} 
                                  alt="Rostro" 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="space-y-2 flex-1">
                              <div>
                                <span className={cn(
                                  "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                                  record.result.level === 'Ninguno' && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                                  record.result.level === 'Leve' && "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                                  record.result.level === 'Moderado' && "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
                                  record.result.level === 'Alto' && "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
                                )}>
                                  Nivel: {record.result.level}
                                </span>
                              </div>
                              <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                                {record.result.explanation}
                              </p>
                            </div>
                          </div>
                          {record.result.recommendation && (
                            <div className="p-3.5 bg-neutral-50/50 dark:bg-neutral-800/40 rounded-[16px] text-[13px] text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200/50 dark:border-neutral-700/50">
                              <strong className="text-neutral-900 dark:text-white">Consejo:</strong> {record.result.recommendation}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="flex gap-2 shrink-0">
                              {record.photoUrl && (
                                <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-[12px] overflow-hidden border border-neutral-200/80 dark:border-neutral-700/80">
                                  <img src={record.photoUrl} alt="Lomo" className="w-full h-full object-cover" />
                                </div>
                              )}
                              {record.photoUrl2 && (
                                <div className="w-14 h-20 sm:w-16 sm:h-24 rounded-[12px] overflow-hidden border border-neutral-200/80 dark:border-neutral-700/80">
                                  <img src={record.photoUrl2} alt="Perfil" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-2 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={cn(
                                  "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                                  record.result.status === 'Peso ideal' && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                                  record.result.status === 'Bajo peso' && "bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400",
                                  record.result.status === 'Sobrepeso' && "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                                  record.result.status === 'Obesidad' && "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
                                )}>
                                  {record.result.status}
                                </span>
                                <span className="text-[12px] font-bold text-neutral-500">
                                  Score: {record.result.score}/9
                                </span>
                              </div>
                              <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                                {record.result.explanation}
                              </p>
                            </div>
                          </div>
                          {record.result.recommendation && (
                            <div className="p-3.5 bg-neutral-50/50 dark:bg-neutral-800/40 rounded-[16px] text-[13px] text-neutral-700 dark:text-neutral-300 font-medium border border-neutral-200/50 dark:border-neutral-700/50">
                              <strong className="text-neutral-900 dark:text-white">Ración recomendada:</strong> {record.result.recommendation}
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

        {/* Right Column: Chart & Stats */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          
          {/* Chart Card */}
          {bcsData.length >= 2 ? (
            <motion.div variants={itemVariants}>
              <div className="rounded-[28px] bg-white dark:bg-[#121212] p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white">
                    Curva de Condición
                  </h3>
                  <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                    Escala 1-9
                  </span>
                </div>
                <div className="h-48 w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bcsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="4 4" stroke="currentColor" className="text-neutral-100 dark:text-neutral-800" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11, fill: '#888' }} 
                        axisLine={false} 
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis 
                        domain={[1, 9]} 
                        ticks={[1, 3, 5, 7, 9]} 
                        tick={{ fontSize: 11, fill: '#888' }} 
                        axisLine={false} 
                        tickLine={false}
                        dx={-10}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#888', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'var(--bg-color, #fff)' }}
                        activeDot={{ r: 6, fill: '#3b82f6', stroke: 'var(--bg-color, #fff)', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[12px] text-neutral-500 text-center mt-4">
                  El score 5/9 representa el peso óptimo.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <div className="rounded-[28px] p-8 bg-neutral-50/50 dark:bg-[#121212] border border-neutral-200/50 dark:border-neutral-800/80 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center mx-auto mb-4">
                  <Scale size={20} className="text-neutral-400" />
                </div>
                <h4 className="font-semibold text-[14px] text-neutral-900 dark:text-white mb-2">
                  Gráfica de evolución
                </h4>
                <p className="text-[13px] text-neutral-500 max-w-xs mx-auto">
                  Guarda al menos 2 evaluaciones de figura para ver su tendencia en el tiempo.
                </p>
              </div>
            </motion.div>
          )}

          {/* Quick Metrics */}
          <motion.div variants={itemVariants}>
            <div className="rounded-[28px] bg-white dark:bg-[#121212] p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800/80 shadow-sm space-y-4">
              <h4 className="font-bold text-[14px] text-neutral-900 dark:text-white">
                Resumen de Evaluaciones
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-[20px] bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} className="text-orange-500" />
                    <span className="text-[12px] font-semibold text-neutral-600 dark:text-neutral-400">
                      Dolor
                    </span>
                  </div>
                  <span className="text-[28px] font-bold text-neutral-900 dark:text-white">
                    {painRecords.length}
                  </span>
                </div>
                <div className="p-4 rounded-[20px] bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale size={14} className="text-blue-500" />
                    <span className="text-[12px] font-semibold text-neutral-600 dark:text-neutral-400">
                      Peso
                    </span>
                  </div>
                  <span className="text-[28px] font-bold text-neutral-900 dark:text-white">
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
