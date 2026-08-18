import React, { useState } from 'react';
import { CatProfile } from '../types';
import { playPurrSound, playHappyChirp } from '../soundUtils';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Volume2, VolumeX, Smile } from 'lucide-react';
import { Card, cn } from './ui';

const CAT_MESSAGES = [
  "¡Prrrr... qué rico rascado detrás de las orejitas! 😻",
  "¡Miau! Gracias por cuidarme con tanto amor ❤️",
  "¡Eres mi humano favorito del universo entero! 🐾",
  "¿Viste lo limpias que tengo mis patitas hoy? ✨",
  "¡Prrr... hoy me siento lleno de energía y salud! 🧶",
  "Unos mimos más y me echo una buena siesta al solecito ☀️",
  "¡Ronroneo de pura felicidad a tu lado! 💖",
  "¡Gracias por revisar mis ojitos y mi pancita! 🩺"
];

const MOODS = [
  { id: 'happy', emoji: '😺', label: '¡Feliz y mimoso!', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'playful', emoji: '🧶', label: '¡Con ganas de jugar!', color: 'bg-rose-100 text-rose-900 border-rose-300' },
  { id: 'sleepy', emoji: '😴', label: 'En modo siestita rica', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'hungry', emoji: '🥣', label: '¡Esperando su comidita!', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'royal', emoji: '👑', label: 'Modo Rey de la Casa', color: 'bg-purple-100 text-purple-900 border-purple-300' }
];

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  icon: string;
}

export function CatInteractiveWidget({ profile }: { profile: CatProfile }) {
  const [petCount, setPetCount] = useState(0);
  const [message, setMessage] = useState<string>("¡Tócame para recibir ronroneos y mimos! 🐾");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string>('happy');
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  const handlePet = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : 50;
    const y = e.clientY ? e.clientY - rect.top : 50;

    const newPetCount = petCount + 1;
    setPetCount(newPetCount);

    // Random sweet message
    const randomMsg = CAT_MESSAGES[Math.floor(Math.random() * CAT_MESSAGES.length)];
    setMessage(randomMsg);

    // Play gentle purr or chirp
    if (soundEnabled) {
      if (newPetCount % 3 === 0) {
        playHappyChirp();
      } else {
        playPurrSound();
      }
    }

    // Spawn floating particles (hearts & paws)
    const icons = ['❤️', '🐾', '💖', '✨', '😻'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const newParticle = { id: Date.now() + Math.random(), x, y, icon: randomIcon };
    
    setParticles(prev => [...prev.slice(-6), newParticle]);

    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1200);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-orange-50/70 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 border-2 border-rose-200/70 dark:border-neutral-800 p-5 sm:p-6 shadow-sm">
      
      {/* Sound Toggle Pill */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐱</span>
          <div>
            <h3 className="font-black text-sm text-orange-950 dark:text-orange-100">
              Rincón de Mimos & Ronroneos
            </h3>
            <p className="text-[11px] text-orange-700/80 dark:text-orange-400 font-medium">
              Interactúa con {profile.name} en tiempo real
            </p>
          </div>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={cn(
            "flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer",
            soundEnabled 
              ? "bg-white dark:bg-neutral-800 text-orange-700 border-orange-200 shadow-2xs"
              : "bg-gray-100 dark:bg-neutral-800 text-gray-400 border-gray-200"
          )}
          title={soundEnabled ? "Silenciar ronroneo" : "Activar ronroneo"}
        >
          {soundEnabled ? <Volume2 size={13} className="text-orange-500" /> : <VolumeX size={13} />}
          <span>{soundEnabled ? 'Sonido ON' : 'Sonido OFF'}</span>
        </button>
      </div>

      {/* Interactive Avatar Area with Speech Bubble */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
        
        {/* Cat Avatar with Pet Button */}
        <div className="relative group shrink-0">
          <button
            onClick={handlePet}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white dark:border-neutral-700 bg-orange-100 shadow-md transition-all active:scale-90 hover:scale-105 hover:border-rose-300 cursor-pointer relative select-none"
            title="¡Toca para acariciar!"
          >
            <img 
              src={profile.photoUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Soft overlay on hover */}
            <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Heart size={28} className="text-white drop-shadow-md animate-ping" />
            </div>
          </button>

          {/* Badge counter */}
          <div className="absolute -bottom-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 pointer-events-none">
            <Heart size={10} className="fill-white" />
            <span>{petCount} mimos</span>
          </div>

          {/* Floating Heart Particles */}
          <AnimatePresence>
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 0.5, y: 0 }}
                animate={{ opacity: 0, scale: 1.8, y: -70 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute text-xl pointer-events-none z-30 font-bold select-none"
                style={{ left: `${Math.max(10, Math.min(80, p.x))}px`, top: `${Math.max(0, Math.min(80, p.y))}px` }}
              >
                {p.icon}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Dynamic Speech Bubble from Cat */}
        <div className="flex-1 text-center sm:text-left space-y-2 w-full">
          <div className="relative p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-rose-100 dark:border-neutral-700 shadow-xs">
            {/* Little speech tail */}
            <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-neutral-800 border-l-2 border-b-2 border-rose-100 dark:border-neutral-700 rotate-45" />
            
            <p className="text-xs sm:text-sm font-bold text-orange-950 dark:text-orange-100 leading-snug">
              {message}
            </p>
          </div>

          <button
            onClick={handlePet}
            className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-black text-xs shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🐾</span>
            <span>¡Darle caricias y mimos a {profile.name}!</span>
          </button>
        </div>

      </div>

      {/* Cat Daily Mood Selector */}
      <div className="pt-4 mt-3 border-t border-rose-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5 mb-2">
          <Smile size={13} className="text-amber-500" />
          <span className="text-[11px] font-black uppercase tracking-wider text-orange-950/80 dark:text-orange-200">
            ¿Cómo está {profile.name} en este momento?
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {MOODS.map(m => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer",
                  isSelected
                    ? `${m.color} shadow-xs scale-102 font-black`
                    : "bg-white/70 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-neutral-700 hover:bg-white"
                )}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </Card>
  );
}
