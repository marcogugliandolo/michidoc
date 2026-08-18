import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { cn } from './ui';
import { resizeImage } from '../imageUtils';
import { CatProfile } from '../types';
import { motion } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';

export function ProfileSetup({ onComplete }: { onComplete: (p: CatProfile) => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 500);
      setPhoto(resized);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age.trim() || !photo) return;
    onComplete({
      name: name.trim(),
      age: age.trim(),
      breed: breed.trim() || 'Mestizo / Común',
      photoUrl: photo
    });
  };

  const breedSuggestions = ['Común Europeo', 'Siamés', 'Persa', 'Mestizo'];

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-4 sm:p-8 relative selection:bg-orange-200 dark:selection:bg-orange-900 transition-colors duration-300">
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white dark:bg-[#121212] rounded-[32px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-neutral-100 dark:border-neutral-800/80 relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
            Conozcamos a tu michi
          </h1>
          <p className="text-[15px] text-neutral-500 dark:text-neutral-400">
            Añade su información para crear su diario clínico.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group ring-4 ring-white dark:ring-[#121212] shadow-sm cursor-pointer",
                  photo
                    ? "bg-neutral-100"
                    : "bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                {photo ? (
                  <img src={photo} alt="Avatar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-neutral-400 dark:text-neutral-500 group-hover:text-orange-500 transition-colors">
                    <Camera size={26} strokeWidth={1.5} />
                  </div>
                )}
              </button>
              {photo && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-2.5 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                >
                  <Camera size={14} />
                </button>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhoto} />
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                Nombre
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                placeholder="Ej. Pelusa"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                  Edad
                </label>
                <input
                  type="text"
                  required
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                  placeholder="Ej. 3 años"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                  Raza <span className="text-neutral-400 font-normal">(Opcional)</span>
                </label>
                <input
                  type="text"
                  value={breed}
                  onChange={e => setBreed(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                  placeholder="Ej. Mestizo"
                />
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {breedSuggestions.map(b => (
              <button
                type="button"
                key={b}
                onClick={() => setBreed(b)}
                className={cn(
                  "text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all cursor-pointer",
                  breed === b
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                    : "bg-white dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                )}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Action */}
          <div className="pt-4">
            <button
              type="submit"
              className={cn(
                "w-full py-4 rounded-2xl text-[15px] font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                (!name.trim() || !age.trim() || !photo)
                  ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 shadow-none cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_8px_20px_rgb(249,115,22,0.25)] hover:shadow-[0_8px_25px_rgb(249,115,22,0.35)] hover:-translate-y-0.5 cursor-pointer"
              )}
              disabled={!name.trim() || !age.trim() || !photo}
            >
              {name && photo ? `Comenzar con ${name}` : 'Comenzar'}
            </button>
            {!photo && (
              <p className="text-[12px] text-center text-neutral-500 mt-4 font-medium">
                📸 Por favor, sube una foto para continuar.
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
