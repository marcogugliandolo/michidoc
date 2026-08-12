import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { Button, Card, cn } from './ui';
import { resizeImage } from '../imageUtils';
import { CatProfile } from '../types';
import { motion } from 'motion/react';
import { Logo } from './Logo';

export function ProfileSetup({ onComplete }: { onComplete: (p: CatProfile) => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 400);
      setPhoto(resized);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !photo) return;
    onComplete({ name, age, breed, photoUrl: photo });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 max-w-md mx-auto pt-12"
    >
      <div className="text-center mb-10 flex flex-col items-center">
        <Logo className="w-20 h-20 mb-6 shadow-md rounded-[28px]" />
        <h1 className="text-3xl font-black text-orange-950 mb-2">¡Hola!</h1>
        <p className="text-orange-700 font-medium">Vamos a conocer a tu michi.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100 bg-orange-50 flex items-center justify-center text-orange-400 transition-colors hover:border-orange-200",
                !photo && "border-dashed"
              )}
            >
              {photo ? (
                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center">
                  <Camera size={32} />
                  <span className="text-xs font-medium mt-1">Cámara o</span>
                  <span className="text-xs font-medium">Galería</span>
                </div>
              )}
            </button>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handlePhoto}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1">Nombre *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-xl bg-orange-50 border-transparent focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 p-3 transition-all"
              placeholder="Ej. Garfield"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1">Edad *</label>
            <input 
              type="text" 
              required
              value={age}
              onChange={e => setAge(e.target.value)}
              className="w-full rounded-xl bg-orange-50 border-transparent focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 p-3 transition-all"
              placeholder="Ej. 3 años"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1">Raza (Opcional)</label>
            <input 
              type="text" 
              value={breed}
              onChange={e => setBreed(e.target.value)}
              className="w-full rounded-xl bg-orange-50 border-transparent focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 p-3 transition-all"
              placeholder="Ej. Mestizo"
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full mt-4"
            disabled={!name || !age || !photo}
          >
            Comenzar
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
