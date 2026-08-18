import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Loader2, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button, Card, cn } from './ui';
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
      setError('Miau... No pudimos leer bien la carita. Intenta con una foto con buena luz y de frente.');
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
        text: '¡Carita relajada! Sin dolor aparente', 
        cardBg: 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100',
        badgeColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700', 
        emoji: '😺' 
      };
      case 'Leve': return { 
        text: 'Leve tensión o molestia', 
        cardBg: 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-100',
        badgeColor: 'text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700', 
        emoji: '😿' 
      };
      case 'Moderado': return { 
        text: 'Dolor moderado detectado', 
        cardBg: 'bg-orange-50/80 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/60 text-orange-950 dark:text-orange-100',
        badgeColor: 'text-orange-700 dark:text-orange-300 bg-orange-100/80 dark:bg-orange-900/40 border-orange-200 dark:border-orange-700', 
        emoji: '😿' 
      };
      case 'Alto': return { 
        text: 'Dolor significativo', 
        cardBg: 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-100',
        badgeColor: 'text-rose-700 dark:text-rose-300 bg-rose-100/80 dark:bg-rose-900/40 border-rose-200 dark:border-rose-700', 
        emoji: '🚨' 
      };
      default: return { 
        text: level, 
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
              <span>🐱</span>
              <span>¿Le duele la carita?</span>
            </h1>
            <p className="text-xs sm:text-sm text-orange-800/80 dark:text-orange-400 font-medium">
              Analizamos la Escala de Mueca Felina en sus ojitos, orejas y bigotes
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
            className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100/60 dark:bg-neutral-800 px-3 py-1.5 rounded-full hover:bg-orange-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={13} />
            Nueva Foto
          </button>
        )}
      </div>

      {/* Main Grid: Upload on Left (5 cols) and Results / Guides on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Photo Upload Box */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-white dark:bg-neutral-900 border-2 border-orange-100/80 dark:border-neutral-800 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-black text-orange-950 dark:text-orange-200 mb-3 flex items-center gap-2">
              <span>📸</span>
              <span>Fotito del Rostro</span>
            </h3>

            {!photo ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-square rounded-3xl border-2 border-dashed border-orange-300 dark:border-neutral-700 bg-orange-50/60 dark:bg-neutral-800/50 flex flex-col items-center justify-center text-orange-600 dark:text-orange-400 hover:bg-orange-100/60 dark:hover:bg-neutral-800 transition-all p-6 text-center group cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                  📷
                </div>
                <span className="font-black text-base text-orange-950 dark:text-orange-200">
                  Toca para tomar o subir fotito
                </span>
                <span className="text-xs text-orange-700/80 dark:text-orange-400/80 mt-1 max-w-xs font-medium">
                  Una foto clara y de frente de su linda carita
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-square bg-black/5 dark:bg-black/40">
                  <img src={photo} alt="Carita del gato" className="w-full h-full object-cover" />
                  {!loading && (
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-3 right-3 shadow-md backdrop-blur-md text-xs"
                    >
                      🔄 Cambiar fotito
                    </Button>
                  )}
                </div>

                {!result && !loading && (
                  <Button onClick={analyzePhoto} className="w-full shadow-md text-sm py-3.5" size="lg">
                    <Sparkles size={16} className="mr-2" />
                    Analizar carita con IA
                  </Button>
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
              <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold border border-rose-200 dark:border-rose-900">
                {error}
              </div>
            )}
          </div>

          {/* Quick Loving Tips */}
          <div className="rounded-3xl bg-amber-50/60 dark:bg-neutral-900 border-2 border-amber-100 dark:border-neutral-800 p-4 shadow-xs">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
              <span>💡</span>
              <span>Consejos para la mejor foto</span>
            </h4>
            <ul className="text-xs text-amber-900/80 dark:text-neutral-300 space-y-1.5 font-medium">
              <li className="flex items-center gap-1.5">
                <span>☀️</span>
                <span>Buena luz natural (evita el flash que lo asuste).</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>👀</span>
                <span>Que sus dos ojitos y orejas salgan despejados.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive FGS Guide or Detailed Loving Results */}
        <div className="lg:col-span-7 space-y-4">
          
          {loading && (
            <div className="rounded-3xl bg-white dark:bg-neutral-900 p-8 flex flex-col items-center justify-center py-16 text-orange-600 dark:text-orange-400 space-y-4 text-center border-2 border-orange-100 dark:border-neutral-800 shadow-xs">
              <div className="relative">
                <Loader2 size={48} className="animate-spin text-orange-500" />
                <span className="absolute inset-0 flex items-center justify-center text-lg">🐱</span>
              </div>
              <div>
                <h3 className="font-black text-lg text-orange-950 dark:text-orange-200">
                  Mirando con atención su carita...
                </h3>
                <p className="text-xs text-orange-800/80 dark:text-orange-400 mt-1 max-w-sm font-medium">
                  Examinando la posición de las orejitas, apertura de los ojos y caída de los bigotes con la Escala de Mueca Felina.
                </p>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border-2 border-orange-100/80 dark:border-neutral-800 text-center flex flex-col items-center justify-center min-h-[340px] shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center text-3xl mb-4 shadow-xs">
                🐱
              </div>
              <h3 className="text-lg font-black text-orange-950 dark:text-orange-200 mb-2">
                ¿Cómo descubrimos si le duele algo?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-300 max-w-md leading-relaxed mb-6 font-medium">
                Por instinto, los gatos ocultan sus debilidades. La Escala de Mueca Felina (FGS) es un estándar veterinario que analiza microexpresiones clave que ellos no pueden esconder:
              </p>
              
              <div className="grid grid-cols-3 gap-3 w-full max-w-md text-xs font-bold text-gray-700 dark:text-gray-200">
                <div className="p-3 rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-100 dark:border-neutral-700">
                  <div className="text-xl mb-1">👂</div>
                  <div className="text-gray-900 dark:text-white font-bold">Orejitas</div>
                  <div className="text-[10px] font-normal text-gray-500 dark:text-neutral-400">Hacia adelante o aplastadas</div>
                </div>
                <div className="p-3 rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-100 dark:border-neutral-700">
                  <div className="text-xl mb-1">👀</div>
                  <div className="text-gray-900 dark:text-white font-bold">Ojitos</div>
                  <div className="text-[10px] font-normal text-gray-500 dark:text-neutral-400">Abiertos o entrecerrados</div>
                </div>
                <div className="p-3 rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-100 dark:border-neutral-700">
                  <div className="text-xl mb-1">🐾</div>
                  <div className="text-gray-900 dark:text-white font-bold">Bigotitos</div>
                  <div className="text-[10px] font-normal text-gray-500 dark:text-neutral-400">Relajados o tensos</div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {(() => {
                const badge = getLevelBadge(result.level);
                return (
                  <div className={cn("rounded-3xl border-2 p-6 sm:p-7 shadow-xs", badge.cardBg)}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-current/15">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{badge.emoji}</span>
                          <span className="text-xs font-black uppercase tracking-wider opacity-75">
                            Diagnóstico de Bienestar Facial
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black mt-1">
                          Nivel de Dolor: {result.level}
                        </h2>
                      </div>
                      <div className={cn("px-3.5 py-1.5 rounded-full font-bold text-xs self-start sm:self-auto border", badge.badgeColor)}>
                        {badge.text}
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-5">
                      <div>
                        <h3 className="font-black text-sm mb-1 opacity-90 flex items-center gap-1.5">
                          <span>🔍</span>
                          <span>Lo que observamos en su carita:</span>
                        </h3>
                        <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-medium">
                          {result.explanation}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-current/15">
                        <h3 className="font-black text-sm mb-1 opacity-90 flex items-center gap-1.5">
                          <span>🩺</span>
                          <span>Recomendación de Cuidados:</span>
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold opacity-90 leading-relaxed">
                          {result.recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-2.5 p-3.5 bg-blue-50/80 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 rounded-2xl text-xs items-start border border-blue-200/60 dark:border-blue-900/40 font-medium">
                <span className="text-base shrink-0">ℹ️</span>
                <p>
                  Esta evaluación con visión computarizada es una guía cariñosa y orientativa. Si notas a tu michi decaído o con cambios de conducta, consulta siempre con un veterinario.
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
