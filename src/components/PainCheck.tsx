import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Loader2, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button, cn } from './ui';
import { resizeImage } from '../imageUtils';
import { PainResult } from '../types';
import { motion } from 'motion/react';

export function PainCheck({ onBack, onSave }: { onBack: () => void, onSave: (photo: string, result: PainResult) => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PainResult | null>(null);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 800);
      setPhoto(resized);
      setResult(null);
      setError('');
      setIsSaved(false);
    }
  };

  const analyzePhoto = async () => {
    if (!photo) return;
    setLoading(true);
    setError('');
    
    try {
      const base64Data = photo.split(',')[1];
      const res = await fetch('/api/analyze-pain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data })
      });
      
      if (!res.ok) throw new Error('Error al analizar la imagen');
      
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError('No pudimos analizar la imagen. Intenta con una foto con buena luz y de frente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (photo && result && !isSaved) {
      onSave(photo, result);
      setIsSaved(true);
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Ninguno': return { 
        text: 'Sin dolor aparente', 
        cardBg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100',
        badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/40 border-emerald-200/50 dark:border-emerald-800/50', 
        icon: '✨' 
      };
      case 'Leve': return { 
        text: 'Leve tensión', 
        cardBg: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/40 text-amber-950 dark:text-amber-100',
        badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-900/40 border-amber-200/50 dark:border-amber-800/50', 
        icon: '⚠️' 
      };
      case 'Moderado': return { 
        text: 'Dolor moderado', 
        cardBg: 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200/50 dark:border-orange-800/40 text-orange-950 dark:text-orange-100',
        badgeColor: 'text-orange-700 dark:text-orange-300 bg-orange-100/50 dark:bg-orange-900/40 border-orange-200/50 dark:border-orange-800/50', 
        icon: '⚠️' 
      };
      case 'Alto': return { 
        text: 'Dolor significativo', 
        cardBg: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-800/40 text-rose-950 dark:text-rose-100',
        badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-100/50 dark:bg-rose-900/40 border-rose-200/50 dark:border-rose-800/50', 
        icon: '🚨' 
      };
      default: return { 
        text: level, 
        cardBg: 'bg-neutral-50 dark:bg-[#121212] border-neutral-200/50 dark:border-neutral-800/50 text-neutral-900 dark:text-neutral-100',
        badgeColor: 'text-neutral-700 dark:text-neutral-300 bg-neutral-100/50 dark:bg-neutral-800/50', 
        icon: 'ℹ️' 
      };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Sleek Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-neutral-900 dark:text-white tracking-tight">
              Chequeo de Dolor
            </h1>
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Escala de Mueca Felina
            </p>
          </div>
        </div>

        {photo && (
          <button
            onClick={() => {
              setPhoto(null);
              setResult(null);
              setError('');
              setIsSaved(false);
            }}
            className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 px-4 py-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Nueva Foto</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Photo Upload Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[28px] bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white mb-4">
              Fotografía facial
            </h3>

            {!photo ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square rounded-[20px] border-2 border-dashed border-neutral-200 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-800/20 flex flex-col items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-all p-6 text-center group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-4 group-hover:scale-105 transition-transform">
                  <Camera size={26} strokeWidth={1.5} />
                </div>
                <span className="font-semibold text-[15px] text-neutral-900 dark:text-white mb-1">
                  Subir fotografía
                </span>
                <span className="text-[13px] text-neutral-500 max-w-xs">
                  Asegúrate de que la cara esté bien iluminada y de frente.
                </span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-[20px] overflow-hidden shadow-sm aspect-square bg-neutral-100 dark:bg-neutral-800">
                  <img src={photo} alt="Rostro" className="w-full h-full object-cover" />
                </div>

                {!result && !loading && (
                  <button 
                    onClick={analyzePhoto} 
                    className="w-full py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-[15px] shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles size={18} />
                    Analizar imagen
                  </button>
                )}
              </div>
            )}

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handlePhoto}
            />

            {error && (
              <div className="mt-4 p-4 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl text-[13px] font-medium border border-rose-100 dark:border-rose-900/50">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Guide or Results */}
        <div className="lg:col-span-7 space-y-4">
          
          {loading && (
            <div className="rounded-[28px] bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 p-12 flex flex-col items-center justify-center h-full text-center shadow-sm min-h-[400px]">
              <Loader2 size={40} strokeWidth={2} className="animate-spin text-orange-500 mb-6" />
              <h3 className="font-bold text-[18px] text-neutral-900 dark:text-white mb-2">
                Analizando expresiones...
              </h3>
              <p className="text-[14px] text-neutral-500 max-w-sm">
                Evaluando la posición de las orejas, apertura ocular y tensión de los bigotes según el estándar FGS.
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="rounded-[28px] bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[400px] shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
                <Sparkles size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white mb-3">
                ¿Qué analizamos?
              </h3>
              <p className="text-[14px] text-neutral-500 max-w-md leading-relaxed mb-8">
                La Escala de Mueca Felina (FGS) evalúa microexpresiones que indican malestar o dolor, basándose en tres puntos clave:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="p-4 rounded-[20px] bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="font-bold text-neutral-900 dark:text-white text-[14px] mb-1">Orejas</div>
                  <div className="text-[12px] text-neutral-500">Posición y rotación</div>
                </div>
                <div className="p-4 rounded-[20px] bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="font-bold text-neutral-900 dark:text-white text-[14px] mb-1">Ojos</div>
                  <div className="text-[12px] text-neutral-500">Nivel de apertura</div>
                </div>
                <div className="p-4 rounded-[20px] bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="font-bold text-neutral-900 dark:text-white text-[14px] mb-1">Bigotes</div>
                  <div className="text-[12px] text-neutral-500">Tensión y ángulo</div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 h-full">
              {(() => {
                const badge = getLevelBadge(result.level);
                return (
                  <div className={cn("rounded-[28px] border p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between", badge.cardBg)}>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-current/10">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-1 block">
                            Diagnóstico FGS
                          </span>
                          <h2 className="text-[24px] sm:text-[28px] font-bold">
                            {result.level}
                          </h2>
                        </div>
                        <div className={cn("px-4 py-2 rounded-full font-semibold text-[13px] self-start sm:self-auto border flex items-center gap-2", badge.badgeColor)}>
                          <span>{badge.icon}</span>
                          <span>{badge.text}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-6 pt-6">
                        <div>
                          <h3 className="font-bold text-[15px] mb-2 opacity-90">Análisis visual</h3>
                          <p className="text-[14px] opacity-80 leading-relaxed">
                            {result.explanation}
                          </p>
                        </div>
                        
                        <div className="pt-4 border-t border-current/10">
                          <h3 className="font-bold text-[15px] mb-2 opacity-90">Recomendación</h3>
                          <p className="text-[14px] opacity-80 leading-relaxed">
                            {result.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleSave} 
                  className={cn(
                    "flex-1 py-4 rounded-2xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md",
                    isSaved 
                      ? "bg-emerald-500 text-white" 
                      : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-[1.02]"
                  )} 
                  disabled={isSaved}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 size={18} />
                      Guardado
                    </>
                  ) : (
                    'Guardar resultado'
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
