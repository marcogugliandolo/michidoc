import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Loader2, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button, cn } from './ui';
import { resizeImage } from '../imageUtils';
import { BCSResult } from '../types';
import { motion } from 'motion/react';

export function BCSCheck({ onBack, onSave }: { onBack: () => void, onSave: (photoTop: string, photoSide: string, result: BCSResult) => void }) {
  const [photoTop, setPhotoTop] = useState<string | null>(null);
  const [photoSide, setPhotoSide] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BCSResult | null>(null);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  const fileInputTopRef = useRef<HTMLInputElement>(null);
  const fileInputSideRef = useRef<HTMLInputElement>(null);

  const handlePhotoTop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 800);
      setPhotoTop(resized);
      setResult(null);
      setError('');
      setIsSaved(false);
    }
  };

  const handlePhotoSide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 800);
      setPhotoSide(resized);
      setResult(null);
      setError('');
      setIsSaved(false);
    }
  };

  const analyzePhotos = async () => {
    if (!photoTop || !photoSide) return;
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/analyze-bcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topImageBase64: photoTop.split(',')[1],
          sideImageBase64: photoSide.split(',')[1]
        })
      });
      
      if (!res.ok) throw new Error('Error al analizar las imágenes');
      
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError('No pudimos evaluar la silueta. Asegúrate de que el gatito esté de pie en ambas fotos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (photoTop && photoSide && result && !isSaved) {
      onSave(photoTop, photoSide, result);
      setIsSaved(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Peso ideal': return { 
        text: 'Peso ideal', 
        cardBg: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100',
        badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/50 dark:bg-emerald-900/40 border-emerald-200/50 dark:border-emerald-800/50', 
        icon: '✨' 
      };
      case 'Bajo peso': return { 
        text: 'Bajo peso', 
        cardBg: 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/50 dark:border-sky-800/40 text-sky-950 dark:text-sky-100',
        badgeColor: 'text-sky-700 dark:text-sky-300 bg-sky-100/50 dark:bg-sky-900/40 border-sky-200/50 dark:border-sky-800/50', 
        icon: 'ℹ️' 
      };
      case 'Sobrepeso': return { 
        text: 'Sobrepeso leve', 
        cardBg: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/40 text-amber-950 dark:text-amber-100',
        badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-100/50 dark:bg-amber-900/40 border-amber-200/50 dark:border-amber-800/50', 
        icon: '⚠️' 
      };
      case 'Obesidad': return { 
        text: 'Obesidad', 
        cardBg: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-800/40 text-rose-950 dark:text-rose-100',
        badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-100/50 dark:bg-rose-900/40 border-rose-200/50 dark:border-rose-800/50', 
        icon: '🚨' 
      };
      default: return { 
        text: status, 
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
              Condición Corporal
            </h1>
            <p className="text-[14px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Escala de BCS (1-9)
            </p>
          </div>
        </div>

        {(photoTop || photoSide) && (
          <button
            onClick={() => {
              setPhotoTop(null);
              setPhotoSide(null);
              setResult(null);
              setError('');
              setIsSaved(false);
            }}
            className="text-[13px] font-semibold text-neutral-600 dark:text-neutral-400 bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 px-4 py-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload Boxes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[28px] bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 p-6 shadow-sm space-y-4">
            
            {/* 1. Vista Superior */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-bold text-neutral-900 dark:text-white">
                  Vista Superior
                </span>
                {photoTop && <CheckCircle2 size={16} className="text-emerald-500" />}
              </div>

              {!photoTop ? (
                <button
                  onClick={() => fileInputTopRef.current?.click()}
                  className="w-full aspect-[2/1] rounded-[20px] border-2 border-dashed border-neutral-200 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-800/20 flex flex-col items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-all p-4 text-center cursor-pointer"
                >
                  <Camera size={24} className="mb-2 text-neutral-400" />
                  <span className="font-semibold text-[14px] text-neutral-900 dark:text-white block">Desde arriba</span>
                  <span className="text-[12px] text-neutral-500">Gato parado, lomo visible</span>
                </button>
              ) : (
                <div className="relative rounded-[20px] overflow-hidden aspect-[2/1] bg-neutral-100 dark:bg-neutral-800">
                  <img src={photoTop} alt="Vista superior" className="w-full h-full object-cover" />
                  {!loading && (
                    <button
                      onClick={() => fileInputTopRef.current?.click()}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 text-white text-[12px] font-semibold backdrop-blur-md hover:bg-black/80 transition-colors"
                    >
                      Cambiar
                    </button>
                  )}
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputTopRef} onChange={handlePhotoTop} />
            </div>

            {/* 2. Vista Lateral */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-bold text-neutral-900 dark:text-white">
                  Vista Lateral
                </span>
                {photoSide && <CheckCircle2 size={16} className="text-emerald-500" />}
              </div>

              {!photoSide ? (
                <button
                  onClick={() => fileInputSideRef.current?.click()}
                  className="w-full aspect-[2/1] rounded-[20px] border-2 border-dashed border-neutral-200 dark:border-neutral-700/50 bg-neutral-50/50 dark:bg-neutral-800/20 flex flex-col items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-all p-4 text-center cursor-pointer"
                >
                  <Camera size={24} className="mb-2 text-neutral-400" />
                  <span className="font-semibold text-[14px] text-neutral-900 dark:text-white block">De perfil</span>
                  <span className="text-[12px] text-neutral-500">Gato parado, panza visible</span>
                </button>
              ) : (
                <div className="relative rounded-[20px] overflow-hidden aspect-[2/1] bg-neutral-100 dark:bg-neutral-800">
                  <img src={photoSide} alt="Vista lateral" className="w-full h-full object-cover" />
                  {!loading && (
                    <button
                      onClick={() => fileInputSideRef.current?.click()}
                      className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 text-white text-[12px] font-semibold backdrop-blur-md hover:bg-black/80 transition-colors"
                    >
                      Cambiar
                    </button>
                  )}
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputSideRef} onChange={handlePhotoSide} />
            </div>

            {photoTop && photoSide && !result && !loading && (
              <button 
                onClick={analyzePhotos} 
                className="w-full py-3.5 mt-2 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-[15px] shadow-md hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={18} />
                Analizar silueta
              </button>
            )}

            {error && (
              <div className="mt-4 p-4 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl text-[13px] font-medium border border-rose-100 dark:border-rose-900/50">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7 space-y-4">
          
          {loading && (
            <div className="rounded-[28px] bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 p-12 flex flex-col items-center justify-center h-full text-center shadow-sm min-h-[400px]">
              <Loader2 size={40} strokeWidth={2} className="animate-spin text-blue-500 mb-6" />
              <h3 className="font-bold text-[18px] text-neutral-900 dark:text-white mb-2">
                Analizando silueta...
              </h3>
              <p className="text-[14px] text-neutral-500 max-w-sm">
                Evaluando el pliegue abdominal, costillas y cintura según la escala BCS de WSAVA.
              </p>
            </div>
          )}

          {!loading && !result && (
            <div className="rounded-[28px] bg-white dark:bg-[#121212] border border-neutral-200/80 dark:border-neutral-800/80 p-8 sm:p-12 flex flex-col items-center justify-center min-h-[400px] shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
                <Sparkles size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-[20px] font-bold text-neutral-900 dark:text-white mb-3">
                Score Corporal (BCS)
              </h3>
              <p className="text-[14px] text-neutral-500 max-w-md leading-relaxed mb-8">
                El Body Condition Score es el estándar veterinario para saber si tu gato está en un peso saludable.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="p-4 rounded-[20px] bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="font-bold text-neutral-900 dark:text-white text-[14px] mb-1">Delgado (1-3)</div>
                  <div className="text-[12px] text-neutral-500">Huesos visibles</div>
                </div>
                <div className="p-4 rounded-[20px] bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="font-bold text-neutral-900 dark:text-white text-[14px] mb-1">Ideal (4-5)</div>
                  <div className="text-[12px] text-neutral-500">Cintura definida</div>
                </div>
                <div className="p-4 rounded-[20px] bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="font-bold text-neutral-900 dark:text-white text-[14px] mb-1">Pesado (6-9)</div>
                  <div className="text-[12px] text-neutral-500">Panza redondeada</div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 h-full">
              {(() => {
                const badge = getStatusBadge(result.status);
                return (
                  <div className={cn("rounded-[28px] border p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between", badge.cardBg)}>
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-current/10">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-1 block">
                            Resultado BCS
                          </span>
                          <h2 className="text-[24px] sm:text-[28px] font-bold">
                            {result.score} / 9
                          </h2>
                        </div>
                        <div className={cn("px-4 py-2 rounded-full font-semibold text-[13px] self-start sm:self-auto border flex items-center gap-2", badge.badgeColor)}>
                          <span>{badge.icon}</span>
                          <span>{badge.text}</span>
                        </div>
                      </div>
                      
                      {/* Meter Bar */}
                      <div className="pt-6 pb-2">
                        <div className="flex justify-between text-[11px] font-bold mb-2 opacity-60">
                          <span>Delgado</span>
                          <span>Ideal</span>
                          <span>Sobrepeso</span>
                        </div>
                        <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-500 to-rose-500 transition-all duration-700 ease-out"
                            style={{ width: `${(result.score / 9) * 100}%` }}
                          />
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
