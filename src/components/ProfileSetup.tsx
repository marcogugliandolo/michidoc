import React, { useState, useRef } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { Button, cn } from './ui';
import { resizeImage } from '../imageUtils';
import { CatProfile } from '../types';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

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
    <div className="min-h-screen bg-[#fff8f3] dark:bg-neutral-950 flex items-center justify-center p-4 sm:p-6 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md lg:max-w-3xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 shadow-xl border-2 border-orange-200/80 dark:border-neutral-800"
      >
        {/* Left Side: Friendly Cat Greeting Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 p-8 text-white flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12 drop-shadow-md" />
              <div>
                <h1 className="text-2xl font-black tracking-tight">MichiDoc</h1>
                <p className="text-xs text-orange-100 font-bold">🐾 Registro del Gatito</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-black leading-snug">
                ¡Vamos a conocer al rey o reina de la casa! 👑
              </h2>
              <p className="text-xs text-orange-50 font-medium leading-relaxed">
                Cuéntanos cómo se llama tu michi y sube su fotito favorita para personalizar todos sus chequeos y consejos diarios.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-orange-100 font-bold relative z-10 flex items-center gap-1">
            <span>❤️</span> Cuidados pensados para su felicidad
          </div>
        </div>

        {/* Right Side: Setup Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <div className="text-center lg:text-left mb-5">
            <div className="lg:hidden flex flex-col items-center mb-3">
              <Logo className="w-14 h-14 mb-1 drop-shadow-sm" />
            </div>
            <h2 className="text-2xl font-black text-orange-950 dark:text-orange-100">
              ¿Quién es tu michi? 🐱
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Completa su perfil para empezar su diario de salud
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Photo Avatar Picker */}
            <div className="flex flex-col items-center gap-1.5 pb-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-orange-200 dark:border-neutral-700 bg-orange-50/70 dark:bg-neutral-800/50 flex items-center justify-center text-orange-400 transition-all hover:border-orange-400 cursor-pointer shadow-sm group",
                  !photo && "border-dashed"
                )}
              >
                {photo ? (
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-center p-2">
                    <span className="text-2xl group-hover:scale-110 transition-transform mb-1">📸</span>
                    <span className="text-[11px] font-black text-orange-700 dark:text-orange-300">Subir Fotito</span>
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
              {!photo && (
                <span className="text-[11px] text-orange-600 dark:text-orange-400 font-bold">
                  Toca para elegir su mejor foto 🐾
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black text-orange-950 dark:text-orange-200 uppercase tracking-wider mb-1">
                  Nombre del gato *
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-3 text-sm transition-all outline-none"
                  placeholder="Ej. Pelusa, Garfield..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-orange-950 dark:text-orange-200 uppercase tracking-wider mb-1">
                  Edad *
                </label>
                <input 
                  type="text" 
                  required
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-3 text-sm transition-all outline-none"
                  placeholder="Ej. 2 años"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-orange-950 dark:text-orange-200 uppercase tracking-wider mb-1">
                Raza (Opcional)
              </label>
              <input 
                type="text" 
                value={breed}
                onChange={e => setBreed(e.target.value)}
                className="w-full rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-3 text-sm transition-all outline-none"
                placeholder="Ej. Común Europeo, Siamés, Mestizo..."
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full mt-3 shadow-md shadow-orange-500/20 py-3.5 text-sm"
              disabled={!name || !age || !photo}
            >
              🐾 Empezar a Cuidar de {name || 'mi Michi'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
