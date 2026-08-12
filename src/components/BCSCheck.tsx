import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Loader2, Info } from 'lucide-react';
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
  
  const fileInputTopRef = useRef<HTMLInputElement>(null);
  const fileInputSideRef = useRef<HTMLInputElement>(null);

  const handlePhotoTop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 800);
      setPhotoTop(resized);
      setResult(null);
      setError('');
    }
  };

  const handlePhotoSide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 800);
      setPhotoSide(resized);
      setResult(null);
      setError('');
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
      setError('Lo sentimos, no pudimos analizar las fotos. Intenta con imágenes más claras.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (photoTop && photoSide && result) {
      onSave(photoTop, photoSide, result);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Peso ideal': return 'text-green-600 bg-green-50 border-green-200';
      case 'Bajo peso': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Sobrepeso': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Obesidad': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
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
        <h1 className="text-2xl font-bold text-orange-950">Condición Corporal</h1>
      </div>

      <p className="text-gray-600">Para evaluar si su peso es ideal, necesitamos dos fotos donde el gato esté de pie.</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Top Photo */}
        <div>
          <p className="text-sm font-semibold text-orange-900 mb-2 text-center">Desde arriba</p>
          {!photoTop ? (
            <button
              onClick={() => fileInputTopRef.current?.click()}
              className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 flex flex-col items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors p-2 text-center"
            >
              <Camera size={32} className="mb-2" />
              <span className="text-xs font-medium">Añadir foto</span>
            </button>
          ) : (
            <div className="relative">
              <img src={photoTop} alt="Top view" className="w-full aspect-[3/4] object-cover rounded-2xl shadow-sm" />
              {!loading && !result && (
                <button 
                  onClick={() => fileInputTopRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full shadow-sm text-orange-600"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Side Photo */}
        <div>
          <p className="text-sm font-semibold text-orange-900 mb-2 text-center">De perfil</p>
          {!photoSide ? (
            <button
              onClick={() => fileInputSideRef.current?.click()}
              className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50 flex flex-col items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors p-2 text-center"
            >
              <Camera size={32} className="mb-2" />
              <span className="text-xs font-medium">Añadir foto</span>
            </button>
          ) : (
            <div className="relative">
              <img src={photoSide} alt="Side view" className="w-full aspect-[3/4] object-cover rounded-2xl shadow-sm" />
              {!loading && !result && (
                <button 
                  onClick={() => fileInputSideRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full shadow-sm text-orange-600"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <input type="file" accept="image/*" className="hidden" ref={fileInputTopRef} onChange={handlePhotoTop} />
      <input type="file" accept="image/*" className="hidden" ref={fileInputSideRef} onChange={handlePhotoSide} />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {photoTop && photoSide && !result && !loading && (
        <Button onClick={analyzePhotos} className="w-full" size="lg">
          Analizar condición
        </Button>
      )}

      {loading && (
        <Card className="flex flex-col items-center justify-center py-8 text-orange-600">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p className="font-medium">Evaluando su cinturita...</p>
        </Card>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card className={cn("border-2", getStatusColor(result.status))}>
            <div className="text-center mb-6">
              <span className="text-sm font-bold uppercase tracking-wider opacity-70">Estado Actual</span>
              <h2 className="text-3xl font-black mt-1">{result.status}</h2>
            </div>

            {/* Score Bar */}
            <div className="mb-6 px-2">
              <div className="flex justify-between text-xs font-bold opacity-60 mb-2">
                <span>Muy Delgado (1)</span>
                <span>Ideal (5)</span>
                <span>Obesidad (9)</span>
              </div>
              <div className="h-4 bg-black/5 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-current transition-all duration-1000 ease-out"
                  style={{ width: `${(result.score / 9) * 100}%` }}
                />
              </div>
              <p className="text-center mt-2 font-bold opacity-80">Score: {result.score}/9</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-1 opacity-90">¿Qué observamos?</h3>
                <p className="opacity-90">{result.explanation}</p>
              </div>
              
              <div className="pt-4 border-t border-current/10">
                <h3 className="font-bold mb-1 opacity-90">Recomendación</h3>
                <p className="font-medium">{result.recommendation}</p>
              </div>
            </div>
          </Card>
          
          <div className="flex gap-2 p-3 bg-blue-50 text-blue-800 rounded-2xl text-sm items-start">
            <Info size={16} className="mt-0.5 shrink-0" />
            <p>Esta es una guía orientativa basada en IA y no sustituye una evaluación veterinaria profesional.</p>
          </div>

          <Button onClick={handleSave} className="w-full" size="lg">
            Guardar en el historial
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
