import React, { useState, useRef } from 'react';
import { Camera, ArrowLeft, Loader2, Info } from 'lucide-react';
import { Button, Card, cn } from './ui';
import { resizeImage } from '../imageUtils';
import { PainResult } from '../types';
import { motion } from 'motion/react';

export function PainCheck({ onBack, onSave }: { onBack: () => void, onSave: (photo: string, result: PainResult) => void }) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PainResult | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 800);
      setPhoto(resized);
      setResult(null);
      setError('');
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
      setError('Lo sentimos, no pudimos analizar la foto. Intenta con una imagen más clara.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (photo && result) {
      onSave(photo, result);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Ninguno': return 'text-green-600 bg-green-50 border-green-200';
      case 'Leve': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Moderado': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Alto': return 'text-red-600 bg-red-50 border-red-200';
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
        <h1 className="text-2xl font-bold text-orange-950">Chequeo de Dolor</h1>
      </div>

      <p className="text-gray-600">Sube una foto clara de la carita de tu gato mirando al frente o ligeramente de lado.</p>

      {!photo ? (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-square rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50 flex flex-col items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors"
        >
          <Camera size={48} className="mb-4" />
          <span className="font-semibold text-lg">Tomar o subir foto</span>
        </button>
      ) : (
        <div className="relative">
          <img src={photo} alt="Cat face" className="w-full aspect-square object-cover rounded-3xl shadow-sm" />
          {!loading && !result && (
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
              size="sm"
              className="absolute bottom-4 right-4 shadow-sm"
            >
              Cambiar foto
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
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {photo && !result && !loading && (
        <Button onClick={analyzePhoto} className="w-full" size="lg">
          Analizar carita
        </Button>
      )}

      {loading && (
        <Card className="flex flex-col items-center justify-center py-8 text-orange-600">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p className="font-medium">El veterinario virtual está observando...</p>
        </Card>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card className={cn("border-2", getLevelColor(result.level))}>
            <div className="text-center mb-4">
              <span className="text-sm font-bold uppercase tracking-wider opacity-70">Nivel de Dolor</span>
              <h2 className="text-3xl font-black mt-1">{result.level}</h2>
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
            <p>Esta es una guía orientativa basada en IA y no sustituye una consulta veterinaria profesional.</p>
          </div>

          <Button onClick={handleSave} className="w-full" size="lg">
            Guardar en el historial
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
