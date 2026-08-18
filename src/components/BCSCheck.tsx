import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Loader2, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button, Card, cn } from './ui';
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
      setError('Miau... No pudimos evaluar la silueta. Asegúrate de que el gatito esté de pie en ambas fotos.');
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
        text: '¡Figura y peso ideal!', 
        cardBg: 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100',
        badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700', 
        emoji: '🌟' 
      };
      case 'Bajo peso': return { 
        text: 'Por debajo de su peso óptimo', 
        cardBg: 'bg-sky-50/80 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/60 text-sky-950 dark:text-sky-100',
        badgeColor: 'text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-900/40 border-sky-200 dark:border-sky-700', 
        emoji: '🥣' 
      };
      case 'Sobrepeso': return { 
        text: 'Leve pancita / Sobrepeso', 
        cardBg: 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-100',
        badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700', 
        emoji: '🐟' 
      };
      case 'Obesidad': return { 
        text: 'Obesidad detectada', 
        cardBg: 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-100',
        badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-900/40 border-rose-200 dark:border-rose-700', 
        emoji: '⚠️' 
      };
      default: return { 
        text: status, 
        cardBg: 'bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-100',
        badgeColor: 'text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800', 
        emoji: '🐱' 
      };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6 pb-24 md:pb-12"
    >
      {/* Friendly Header with Back Button */}
      <div className="flex items-center justify-between">
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
              <span>⚖️</span>
              <span>Pancita y Figura Ideal</span>
            </h1>
            <p className="text-xs sm:text-sm text-orange-800/80 dark:text-orange-400 font-medium">
              Evaluamos la condición corporal (BCS 1-9) con 2 fotitos de su cuerpo
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
            className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100/60 dark:bg-neutral-800 px-3 py-1.5 rounded-full hover:bg-orange-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={13} />
            Reiniciar Fotos
          </button>
        )}
      </div>

      {/* Main Grid: Uploads on Left (5 cols) and Results / Guides on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Two Photo Upload Boxes */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-neutral-900 border-2 border-orange-100/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs space-y-4">
            
            {/* 1. Vista Superior (Desde arriba) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-orange-950 dark:text-orange-200 flex items-center gap-1.5">
                  <span>1️⃣</span> Vista Superior (Cintura desde arriba)
                </span>
                {photoTop && <CheckCircle2 size={15} className="text-emerald-500" />}
              </div>

              {!photoTop ? (
                <button
                  onClick={() => fileInputTopRef.current?.click()}
                  className="w-full aspect-2/1 rounded-2xl border-2 border-dashed border-orange-300 dark:border-neutral-700 bg-orange-50/60 dark:bg-neutral-800/50 flex items-center justify-center gap-3 text-orange-600 dark:text-orange-400 hover:bg-orange-100/60 dark:hover:bg-neutral-800 transition-all p-3 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 shadow-2xs flex items-center justify-center text-xl">
                    🔝
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-xs text-orange-950 dark:text-orange-200 block">Subir foto desde arriba</span>
                    <span className="text-[10px] text-orange-700/80 dark:text-neutral-400">Gato parado, viendo su lomo</span>
                  </div>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden aspect-2/1 bg-black/5 dark:bg-black/40">
                  <img src={photoTop} alt="Vista superior" className="w-full h-full object-cover" />
                  {!loading && (
                    <button
                      onClick={() => fileInputTopRef.current?.click()}
                      className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs hover:bg-black/80 transition-colors"
                    >
                      Cambiar
                    </button>
                  )}
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputTopRef} onChange={handlePhotoTop} />
            </div>

            {/* 2. Vista Lateral (De perfil) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-orange-950 dark:text-orange-200 flex items-center gap-1.5">
                  <span>2️⃣</span> Vista Lateral (Pancita de perfil)
                </span>
                {photoSide && <CheckCircle2 size={15} className="text-emerald-500" />}
              </div>

              {!photoSide ? (
                <button
                  onClick={() => fileInputSideRef.current?.click()}
                  className="w-full aspect-2/1 rounded-2xl border-2 border-dashed border-orange-300 dark:border-neutral-700 bg-orange-50/60 dark:bg-neutral-800/50 flex items-center justify-center gap-3 text-orange-600 dark:text-orange-400 hover:bg-orange-100/60 dark:hover:bg-neutral-800 transition-all p-3 text-center cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 shadow-2xs flex items-center justify-center text-xl">
                    ➡️
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-xs text-orange-950 dark:text-orange-200 block">Subir foto de lado</span>
                    <span className="text-[10px] text-orange-700/80 dark:text-neutral-400">Gato parado, viendo su panza</span>
                  </div>
                </button>
              ) : (
                <div className="relative rounded-2xl overflow-hidden aspect-2/1 bg-black/5 dark:bg-black/40">
                  <img src={photoSide} alt="Vista lateral" className="w-full h-full object-cover" />
                  {!loading && (
                    <button
                      onClick={() => fileInputSideRef.current?.click()}
                      className="absolute bottom-2 right-2 px-2.5 py-1 rounded-xl bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs hover:bg-black/80 transition-colors"
                    >
                      Cambiar
                    </button>
                  )}
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" ref={fileInputSideRef} onChange={handlePhotoSide} />
            </div>

            {photoTop && photoSide && !result && !loading && (
              <Button onClick={analyzePhotos} className="w-full shadow-md text-sm py-3.5 mt-2" size="lg">
                <Sparkles size={16} className="mr-2" />
                Evaluar Silueta con IA (BCS 1-9)
              </Button>
            )}

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold border border-rose-200 dark:border-rose-900">
                {error}
              </div>
            )}
          </div>

          {/* Tips for Body Condition */}
          <div className="rounded-3xl bg-amber-50/60 dark:bg-neutral-900 border-2 border-amber-100 dark:border-neutral-800 p-4 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
              <span>💡</span>
              <span>Recomendaciones</span>
            </h4>
            <p className="text-xs text-amber-900/80 dark:text-neutral-300 font-medium leading-relaxed">
              Para un resultado óptimo, asegúrate de que el gato esté de pie en cuatro patas y no acurrucado en una bolita.
            </p>
          </div>
        </div>

        {/* Right Column: BCS Scale explanation or Results */}
        <div className="lg:col-span-7 space-y-4">
          
          {loading && (
            <div className="rounded-3xl bg-white dark:bg-neutral-900 p-8 flex flex-col items-center justify-center py-16 text-emerald-600 dark:text-emerald-400 space-y-4 text-center border-2 border-emerald-100 dark:border-neutral-800 shadow-xs">
              <div className="relative">
                <Loader2 size={48} className="animate-spin text-emerald-500" />
                <span className="absolute inset-0 flex items-center justify-center text-lg">⚖️</span>
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-950 dark:text-gray-100">
                  Calculando Índice de Condición Corporal...
                </h3>
                <p className="text-xs text-gray-600 dark:text-neutral-300 mt-1 max-w-sm font-medium">
                  Comprobando el pliegue abdominal, costillas y definición de la cintura según el estándar WSAVA (1 al 9).
                </p>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border-2 border-emerald-100/80 dark:border-neutral-800 text-center flex flex-col items-center justify-center min-h-[340px] shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center text-3xl mb-4 shadow-xs">
                ⚖️
              </div>
              <h3 className="text-lg font-black text-gray-950 dark:text-gray-100 mb-2">
                ¿Qué es el Body Condition Score (BCS)?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-300 max-w-md leading-relaxed mb-6 font-medium">
                Es la escala oficial utilizada por veterinarios para evaluar si un gato está en su peso perfecto sin depender solo de la báscula:
              </p>
              
              <div className="grid grid-cols-3 gap-3 w-full max-w-md text-xs font-bold text-gray-700 dark:text-gray-200">
                <div className="p-3 rounded-2xl bg-sky-50/70 dark:bg-neutral-800/80 border border-sky-100 dark:border-neutral-700">
                  <div className="text-xl mb-1">🥣</div>
                  <div className="text-sky-700 dark:text-sky-300 font-bold">1 - 3: Delgado</div>
                  <div className="text-[10px] font-normal text-gray-500 dark:text-neutral-400">Costillas muy visibles</div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-neutral-800/80 border border-emerald-100 dark:border-neutral-700">
                  <div className="text-xl mb-1">🌟</div>
                  <div className="text-emerald-700 dark:text-emerald-300 font-bold">4 - 5: Ideal</div>
                  <div className="text-[10px] font-normal text-gray-500 dark:text-neutral-400">Cintura y peso perfecto</div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-neutral-800/80 border border-amber-100 dark:border-neutral-700">
                  <div className="text-xl mb-1">🐟</div>
                  <div className="text-amber-700 dark:text-amber-300 font-bold">6 - 9: Sobrepeso</div>
                  <div className="text-[10px] font-normal text-gray-500 dark:text-neutral-400">Pancita redondeada</div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {(() => {
                const badge = getStatusBadge(result.status);
                return (
                  <div className={cn("rounded-3xl border-2 p-6 sm:p-7 shadow-xs", badge.cardBg)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-current/15">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{badge.emoji}</span>
                          <span className="text-xs font-black uppercase tracking-wider opacity-75">
                            Resultado Corporal WSAVA
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black mt-1">
                          Puntuación: {result.score}/9 • {result.status}
                        </h2>
                      </div>
                      <div className={cn("px-3.5 py-1.5 rounded-full font-bold text-xs self-start sm:self-auto border", badge.badgeColor)}>
                        {badge.text}
                      </div>
                    </div>
                    
                    {/* Visual Meter Bar */}
                    <div className="pt-4 pb-1">
                      <div className="flex justify-between text-[11px] font-bold mb-1 opacity-80">
                        <span>Muy Delgado (1)</span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400">Óptimo (5)</span>
                        <span>Sobrepeso (9)</span>
                      </div>
                      <div className="h-3.5 rounded-full bg-black/10 dark:bg-white/10 p-0.5 relative overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-500 to-rose-500 transition-all duration-500"
                          style={{ width: `${(result.score / 9) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-5">
                      <div>
                        <h3 className="font-black text-sm mb-1 opacity-90 flex items-center gap-1.5">
                          <span>🔍</span>
                          <span>Evaluación de Silueta:</span>
                        </h3>
                        <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">
                          {result.explanation}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-current/15">
                        <h3 className="font-black text-sm mb-1 opacity-90 flex items-center gap-1.5">
                          <span>🥗</span>
                          <span>Plan Nutricional y Ejercicio Recomendado:</span>
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold opacity-90 leading-relaxed">
                          {result.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2.5 p-3.5 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 rounded-2xl text-xs items-start border border-emerald-200/60 dark:border-emerald-900/40 font-medium">
                <span className="text-base shrink-0">✨</span>
                <p>
                  Mantener a tu michi en un BCS de 4 a 5 previene la diabetes felina, cuida sus articulaciones y alarga sus años de vida feliz contigo.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleSave} 
                  className={cn(
                    "flex-1 shadow-md py-3 text-sm",
                    isSaved && "bg-emerald-600 hover:bg-emerald-700"
                  )} 
                  disabled={isSaved}
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 size={16} className="mr-2" />
                      ¡Guardado en su Álbum!
                    </>
                  ) : (
                    '🐾 Guardar en el Álbum Clínico'
                  )}
                </Button>
                <Button onClick={onBack} variant="secondary" className="text-sm py-3">
                  Volver a Mi Casita
                </Button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
