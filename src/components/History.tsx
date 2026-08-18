import { useState } from 'react';
import { ArrowLeft, Activity, Scale, History as HistoryIcon, PawPrint, Cat } from 'lucide-react';
import { HistoryRecord, BCSHistoryRecord, PainHistoryRecord, CatProfile } from '../types';
import { cn } from './ui';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'motion/react';

interface HistoryProps {
  onBack: () => void;
  records: HistoryRecord[];
  profiles?: CatProfile[];
  activeProfile?: CatProfile;
}

export function History({ onBack, records, profiles = [], activeProfile }: HistoryProps) {
  const [filter, setFilter] = useState<'all' | 'pain' | 'bcs'>('all');
  const [selectedCatId, setSelectedCatId] = useState<string>('all');

  const catFilteredRecords = records.filter(r => {
    if (selectedCatId === 'all') return true;
    return r.catId === selectedCatId || (!r.catId && activeProfile && activeProfile.id === selectedCatId);
  });

  const filteredRecords = catFilteredRecords.filter(r => {
    if (filter === 'all') return true;
    return r.type === filter;
  });

  const bcsData = (catFilteredRecords.filter((r): r is BCSHistoryRecord => r.type === 'bcs' && r.result?.score !== undefined))
    .sort((a, b) => a.date - b.date)
    .map(r => ({
      date: new Date(r.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
      score: r.result.score,
      status: r.result.status
    }));

  const painRecords = catFilteredRecords.filter((r): r is PainHistoryRecord => r.type === 'pain');
  const bcsRecords = catFilteredRecords.filter((r): r is BCSHistoryRecord => r.type === 'bcs');

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCatForRecord = (catId?: string) => {
    if (!catId) return activeProfile;
    return profiles.find(p => p.id === catId) || activeProfile;
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
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-xs cursor-pointer"
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
        <div className="flex items-center gap-2 p-1.5 bg-neutral-100/50 dark:bg-[#121212] rounded-full border border-neutral-200/60 dark:border-neutral-800/60 self-start sm:self-auto text-[13px] font-medium shadow-xs">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-4 py-2 rounded-full transition-all cursor-pointer",
              filter === 'all'
                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            Todos ({catFilteredRecords.length})
          </button>
          <button
            onClick={() => setFilter('pain')}
            className={cn(
              "px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer",
              filter === 'pain'
                ? "bg-white dark:bg-neutral-800 text-orange-600 dark:text-orange-400 shadow-xs"
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
                ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs"
                : "text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400"
            )}
          >
            <Scale size={14} /> Peso ({bcsRecords.length})
          </button>
        </div>
      </motion.div>

      {/* Cat Filter Chips (if user has multiple cats) */}
      {profiles.length > 1 && (
        <motion.div variants={itemVariants} className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1">
            Michi:
          </span>
          <button
            onClick={() => setSelectedCatId('all')}
            className={cn(
              "text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer",
              selectedCatId === 'all'
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                : "bg-white dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
            )}
          >
            Todos ({records.length})
          </button>
          {profiles.map(cat => (
            <button
              key={cat.id || cat.name}
              onClick={() => setSelectedCatId(cat.id || '')}
              className={cn(
                "flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all shrink-0 cursor-pointer",
                selectedCatId === cat.id
                  ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                  : "bg-white dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
              )}
            >
              <img src={cat.photoUrl} alt={cat.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{cat.name}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {filteredRecords.length === 0 ? (
            <motion.div variants={itemVariants} className="text-center py-20 bg-white dark:bg-[#121212] rounded-[28px] border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs">
              <div className="relative flex justify-center items-center mx-auto mb-6 w-16 h-16">
                <Cat size={64} strokeWidth={1} className="text-neutral-300 dark:text-neutral-700" />
              </div>
              <h3 className="text-[17px] font-bold text-neutral-900 dark:text-white mb-2">
                Sin evaluaciones registradas
              </h3>
              <p className="text-[14px] text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-6">
                Realiza un chequeo de dolor o peso para comenzar a registrar la evolución médica.
              </p>
              <button 
                onClick={onBack}
                className="px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[14px] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Hacer chequeo ahora
              </button>
            </motion.div>
          ) : (
            filteredRecords.map((record) => {
              const cat = getCatForRecord(record.catId);
              return (
                <motion.div 
                  key={record.id}
                  variants={itemVariants}
                  className="bg-white dark:bg-[#121212] rounded-[28px] p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        record.type === 'pain' ? "bg-orange-50 dark:bg-orange-950/30 text-orange-500" : "bg-blue-50 dark:bg-blue-950/30 text-blue-500"
                      )}>
                        {record.type === 'pain' ? <Activity size={20} /> : <Scale size={20} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-[16px] font-bold text-neutral-900 dark:text-white leading-tight">
                            {record.type === 'pain' ? 'Evaluación de Dolor' : 'Evaluación Corporal'}
                          </h4>
                          {cat && profiles.length > 1 && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                              <img src={cat.photoUrl} alt="" className="w-3 h-3 rounded-full object-cover" />
                              {cat.name}
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] text-neutral-400 mt-0.5">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    
                    <div>
                      {record.type === 'pain' ? (
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[12px] font-bold",
                          record.result.level === 'Ninguno' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
                          record.result.level === 'Leve' && "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
                          record.result.level === 'Moderado' && "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400",
                          record.result.level === 'Alto' && "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                        )}>
                          Nivel {record.result.level}
                        </span>
                      ) : (
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[12px] font-bold",
                          record.result.score === 5 && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
                          (record.result.score === 4 || record.result.score === 6) && "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
                          (record.result.score < 4 || record.result.score > 6) && "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
                        )}>
                          BCS {record.result.score}/9 • {record.result.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Photo Thumbnails */}
                  {(record.photoUrl || record.photoUrl2) && (
                    <div className="flex gap-2 pt-1">
                      {record.photoUrl && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
                          <img src={record.photoUrl} alt="Foto de evaluación" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {record.photoUrl2 && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
                          <img src={record.photoUrl2} alt="Foto lateral" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Explanation & Recommendation */}
                  <div className="space-y-2 text-[14px] bg-neutral-50/50 dark:bg-neutral-900/30 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/60">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {record.result.explanation}
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-[13px] leading-relaxed pt-1 border-t border-neutral-200/40 dark:border-neutral-800/40">
                      <span className="font-semibold text-neutral-700 dark:text-neutral-300">Recomendación:</span> {record.result.recommendation}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Right Column: BCS Chart */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div variants={itemVariants} className="bg-white dark:bg-[#121212] rounded-[28px] p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-[17px] font-bold text-neutral-900 dark:text-white">
                Curva de Condición Corporal
              </h3>
              <p className="text-[13px] text-neutral-400">
                Evolución del Score BCS (Escala 1 al 9)
              </p>
            </div>

            {bcsData.length > 0 ? (
              <div className="h-[220px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bcsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis domain={[1, 9]} ticks={[1, 3, 5, 7, 9]} stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl">
                <Scale className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mx-auto mb-2" />
                <p className="text-[13px] text-neutral-400">Sin datos de peso suficientes</p>
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
