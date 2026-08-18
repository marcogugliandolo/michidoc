import React, { useState, useRef } from 'react';
import { Camera, ArrowRight, X, Sparkles } from 'lucide-react';
import { cn } from './ui';
import { resizeImage } from '../imageUtils';
import { CatProfile } from '../types';
import { motion } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { WavingCat } from './WavingCat';

interface ProfileSetupProps {
  onComplete: (profile: CatProfile) => void;
  onCancel?: () => void;
  isAdditional?: boolean;
}

export function ProfileSetup({ onComplete, onCancel, isAdditional = false }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 500);
      setPhoto(resized);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age.trim() || !photo || isSubmitting) return;

    setIsSubmitting(true);
    const newProfile: CatProfile = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      age: age.trim(),
      breed: breed.trim() || 'Mestizo / Común Europeo',
      photoUrl: photo
    };

    setTimeout(() => {
      onComplete(newProfile);
    }, 300);
  };

  const quickAges = ['6 meses', '1 año', '2 años', '4 años', '7+ años'];
  const breedSuggestions = ['Común Europeo', 'Siamés', 'Persa', 'Bengalí', 'Maine Coon', 'Mestizo'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] via-[#fff5eb] to-[#ffeedb] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-x-hidden selection:bg-orange-200 dark:selection:bg-orange-900 transition-colors duration-300">
      
      {/* Top Controls */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-2 sm:p-2.5 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/60 dark:border-neutral-800/60 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
            title="Cancelar"
          >
            <X size={18} />
          </button>
        )}
        <ThemeToggle />
      </div>

      {/* Decorative Glows in Background */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/15 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-400/15 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Registration Card Wrapper */}
      <div className="w-full max-w-[430px] relative z-10 my-16 sm:my-14 flex flex-col items-center">
        
        {/* === GATO CONTENTO (WAVING CAT MASCOT) PEEKING SEAMLESSLY OVER THE CARD === */}
        <div className="absolute -top-[72px] sm:-top-[80px] left-1/2 -translate-x-1/2 w-[140px] sm:w-[155px] flex justify-center z-0 pointer-events-none">
          <motion.div
            initial={{ y: 35, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 140, damping: 14 }}
            className="w-full flex justify-center"
          >
            <WavingCat className="w-[130px] sm:w-[145px]" />
          </motion.div>
        </div>

        {/* Main Card (z-10 sits in front of the lower body of the cat for a perfect peeking illusion) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 pt-7 sm:pt-8 shadow-[0_12px_40px_rgb(234,88,12,0.08)] dark:shadow-[0_12px_40px_rgb(0,0,0,0.4)] border border-orange-100/80 dark:border-neutral-800/90 relative z-10"
        >
          {/* Card Title & Subtitle */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[12px] font-semibold mb-2 border border-orange-100 dark:border-orange-900/30">
              <Sparkles size={13} className="text-orange-500" />
              {isAdditional ? 'Nuevo Integrante' : 'Paso 1 de 1'}
            </div>
            <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-neutral-900 dark:text-white">
              {isAdditional ? 'Añade a otro Michi' : '¡Conozcamos a tu Michi!'}
            </h1>
            <p className="text-[13px] sm:text-[14px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-[310px] mx-auto leading-snug">
              {isAdditional 
                ? 'Registra a tu nuevo compañero para evaluarlo y llevar su carnet médico.'
                : 'Sube su foto y cuéntanos sobre él para comenzar a cuidar su salud.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Photo Avatar Upload with Cute Frame */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ring-4 cursor-pointer shadow-sm",
                    photo
                      ? "ring-orange-400 dark:ring-orange-500/80 bg-neutral-100"
                      : "ring-orange-200 dark:ring-neutral-800 bg-orange-50/60 dark:bg-neutral-900/80 border-2 border-dashed border-orange-300 dark:border-neutral-700 hover:border-orange-500 dark:hover:border-orange-500"
                  )}
                  title="Seleccionar foto del michi"
                >
                  {photo ? (
                    <img 
                      src={photo} 
                      alt="Foto del michi" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-neutral-400 dark:text-neutral-500 group-hover:text-orange-500 transition-colors p-2 text-center">
                      <Camera size={26} strokeWidth={1.5} className="text-orange-500 dark:text-orange-400 animate-bounce" />
                      <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-tight">
                        Toca para subir foto
                      </span>
                    </div>
                  )}
                </button>

                {/* Floating Camera Button badge */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-1 bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform cursor-pointer border-2 border-white dark:border-[#121212]"
                  title="Cambiar foto"
                >
                  <Camera size={14} />
                </button>
              </div>

              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handlePhoto} 
              />
            </div>

            {/* Input Fields */}
            <div className="space-y-3.5">
              
              {/* Name */}
              <div>
                <label className="block text-[13px] font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                  Nombre del michi <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 sm:py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                  placeholder="Ej. Pelusa, Michi, Salem..."
                />
              </div>

              {/* Age & Breed Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                    Edad <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 sm:py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    placeholder="Ej. 2 años, 8 meses"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                    Raza <span className="text-neutral-400 font-normal text-[11px]">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={breed}
                    onChange={e => setBreed(e.target.value)}
                    className="w-full bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 sm:py-3.5 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    placeholder="Ej. Común Europeo"
                  />
                </div>
              </div>

              {/* Quick Age helper pills */}
              <div>
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5 ml-1">
                  Sugerencias rápidas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickAges.map(item => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setAge(item)}
                      className={cn(
                        "text-[12px] font-medium px-3 py-1 rounded-full border transition-all cursor-pointer",
                        age === item
                          ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                          : "bg-white/80 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-neutral-700"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Breed Pills */}
              <div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {breedSuggestions.map(b => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBreed(b)}
                      className={cn(
                        "text-[11px] sm:text-[12px] font-medium px-2.5 sm:px-3 py-1 rounded-full border transition-all cursor-pointer",
                        breed === b
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                          : "bg-white/80 dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={!name.trim() || !age.trim() || !photo || isSubmitting}
                className={cn(
                  "w-full py-3.5 sm:py-4 rounded-2xl text-[15px] font-bold transition-all duration-300 flex items-center justify-center gap-2 select-none shadow-md",
                  (!name.trim() || !age.trim() || !photo || isSubmitting)
                    ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 shadow-none cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-[0_8px_20px_rgb(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgb(249,115,22,0.4)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Guardando michi...
                  </span>
                ) : (
                  <>
                    <span>{name ? `Registrar a ${name}` : 'Registrar Michi'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-2.5 rounded-2xl text-[14px] font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
                >
                  Volver atrás
                </button>
              )}

              {!photo && (
                <p className="text-[12px] text-center text-orange-600/90 dark:text-orange-400/90 font-medium">
                  📸 Por favor, sube una foto para completar el carnet de tu michi.
                </p>
              )}
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}
