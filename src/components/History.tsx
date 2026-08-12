import { ArrowLeft, Calendar, HeartPulse, Scale, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, cn } from './ui';
import { HistoryRecord } from '../types';
import { motion } from 'motion/react';

export function History({ onBack, records }: { onBack: () => void, records: HistoryRecord[] }) {
  
  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(new Date(ts));
  };

  const getPainColor = (level: string) => {
    switch (level) {
      case 'Ninguno': return 'text-green-500 bg-green-50 border-green-100';
      case 'Leve': return 'text-yellow-500 bg-yellow-50 border-yellow-100';
      case 'Moderado': return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'Alto': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  const getBcsColor = (status: string) => {
    switch (status) {
      case 'Peso ideal': return 'text-green-500 bg-green-50 border-green-100';
      case 'Bajo peso': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'Sobrepeso': return 'text-yellow-500 bg-yellow-50 border-yellow-100';
      case 'Obesidad': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  const getPainIcon = (level: string) => {
    if (level === 'Ninguno') return <CheckCircle2 size={24} />;
    return <AlertCircle size={24} />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 sm:p-8 max-w-md mx-auto space-y-6 pb-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-orange-50 text-orange-700 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-orange-950">Historial</h1>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p>Aún no hay registros en el historial.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-orange-100 ml-4 space-y-8 pb-8">
          {records.map((record) => {
            const isPain = record.type === 'pain';
            
            return (
              <div key={record.id} className="relative pl-6">
                {/* Timeline dot */}
                <div className={cn(
                  "absolute -left-[11px] top-4 w-5 h-5 rounded-full border-4 border-white flex items-center justify-center",
                  isPain ? "bg-rose-400" : "bg-emerald-400"
                )} />

                <Card className="p-4 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn(
                      "p-1.5 rounded-lg text-white",
                      isPain ? "bg-rose-400" : "bg-emerald-400"
                    )}>
                      {isPain ? <HeartPulse size={16} /> : <Scale size={16} />}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">
                      {formatDate(record.date)}
                    </span>
                  </div>

                  {isPain ? (
                    <div className={cn("p-3 rounded-2xl border", getPainColor((record.result as any).level))}>
                      <div className="flex items-center gap-2 mb-2 font-bold">
                        {getPainIcon((record.result as any).level)}
                        <span>Dolor: {(record.result as any).level}</span>
                      </div>
                      <p className="text-sm opacity-90">{(record.result as any).explanation}</p>
                    </div>
                  ) : (
                    <div className={cn("p-3 rounded-2xl border", getBcsColor((record.result as any).status))}>
                      <div className="flex items-center gap-2 mb-2 font-bold">
                        <Scale size={20} />
                        <span>{(record.result as any).status} ({(record.result as any).score}/9)</span>
                      </div>
                      <p className="text-sm opacity-90">{(record.result as any).explanation}</p>
                    </div>
                  )}

                  {/* Thumbnail snippet if available */}
                  {record.photoUrl && (
                    <div className="mt-3 flex gap-2">
                      <img src={record.photoUrl} alt="Registro" className="w-12 h-12 rounded-xl object-cover border border-black/5" />
                      {record.photoUrl2 && (
                        <img src={record.photoUrl2} alt="Registro lateral" className="w-12 h-12 rounded-xl object-cover border border-black/5" />
                      )}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
