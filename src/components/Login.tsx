import React, { useState } from 'react';
import { User, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from './ui';
import { setAuthState } from '../db';
import { Logo } from './Logo';
import { WavingCat } from './WavingCat';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'motion/react';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState<'user' | 'pass' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        await setAuthState(true, data.userId);
        onLogin();
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Miau... Hubo un problema al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] via-[#fff5eb] to-[#ffeedb] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-300 select-none">
      
      {/* Playful Floating Ambient Lights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/20 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-400/20 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-300/10 dark:bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Floating Paws in Background */}
      <motion.div 
        animate={{ y: [0, -15, 0], opacity: [0.3, 0.5, 0.3] }} 
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-14 left-10 text-4xl pointer-events-none select-none opacity-40 dark:opacity-20 hidden sm:block"
      >
        🐾
      </motion.div>
      <motion.div 
        animate={{ y: [0, 14, 0], opacity: [0.2, 0.4, 0.2] }} 
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-16 left-16 text-2xl pointer-events-none select-none opacity-30 dark:opacity-15 hidden sm:block"
      >
        🐱
      </motion.div>
      <motion.div 
        animate={{ y: [0, -10, 0], opacity: [0.25, 0.45, 0.25] }} 
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-20 right-16 text-2xl pointer-events-none select-none opacity-30 dark:opacity-15 hidden sm:block"
      >
        ✨
      </motion.div>
      <motion.div 
        animate={{ y: [0, 12, 0], opacity: [0.2, 0.35, 0.2] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-20 right-12 text-3xl pointer-events-none select-none opacity-30 dark:opacity-15 hidden sm:block"
      >
        🐾
      </motion.div>

      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main Login Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px] z-10 mt-14 sm:mt-10"
      >
        {/* Waving Cat Peeking over the card */}
        <div className="absolute -top-[70px] sm:-top-[76px] left-1/2 -translate-x-1/2 w-[140px] sm:w-[155px] flex justify-center z-[-1] pointer-events-none">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 120, damping: 14 }}
            className="w-full flex justify-center"
          >
            <WavingCat className="w-[130px] sm:w-[145px]" />
          </motion.div>
        </div>

        <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 shadow-2xl shadow-orange-950/10 dark:shadow-black/40 border-2 border-orange-200/70 dark:border-neutral-800 relative">
        {/* Brand & Mascot Header */}
        <div className="text-center mb-6">
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center mb-3.5"
          >
            <Logo className="w-20 h-20 sm:w-22 sm:h-22 drop-shadow-md hover:scale-105 transition-transform" />
          </motion.div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-orange-950 dark:text-orange-100 flex items-center justify-center gap-1.5">
            <span>MichiDoc</span>
            <span className="text-xl">🐾</span>
          </h1>
          <p className="text-xs sm:text-sm text-orange-800/80 dark:text-neutral-400 font-medium mt-1">
            Salud, nutrición y mimos para tu michi
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username field */}
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300">
                Usuario
              </label>
              {username && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <CheckCircle2 size={11} /> Listo
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <div className={`absolute left-3.5 transition-colors duration-200 pointer-events-none ${isFocused === 'user' ? 'text-orange-500' : 'text-gray-400 dark:text-neutral-500'}`}>
                <User size={18} />
              </div>
              <input 
                type="text" 
                required
                value={username}
                onFocus={() => setIsFocused('user')}
                onBlur={() => setIsFocused(null)}
                onChange={e => setUsername(e.target.value)}
                className="w-full rounded-2xl bg-orange-50/60 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 dark:focus:ring-orange-500/20 pl-10 pr-4 py-3.5 text-sm text-gray-900 dark:text-white transition-all outline-none font-medium placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                placeholder="Nombre de usuario"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5 ml-1">
              <label className="block text-xs font-bold text-gray-700 dark:text-neutral-300">
                Contraseña
              </label>
              {password && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  <CheckCircle2 size={11} /> Listo
                </span>
              )}
            </div>
            <div className="relative flex items-center">
              <div className={`absolute left-3.5 transition-colors duration-200 pointer-events-none ${isFocused === 'pass' ? 'text-orange-500' : 'text-gray-400 dark:text-neutral-500'}`}>
                <Lock size={18} />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onFocus={() => setIsFocused('pass')}
                onBlur={() => setIsFocused(null)}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-2xl bg-orange-50/60 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-200/60 dark:focus:ring-orange-500/20 pl-10 pr-11 py-3.5 text-sm text-gray-900 dark:text-white transition-all outline-none font-medium placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors p-1 cursor-pointer"
                title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {/* Error Message with Shake */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-rose-700 dark:text-rose-300 text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl border border-rose-200 dark:border-rose-900 flex items-center gap-2"
              >
                <span className="text-base">😿</span>
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full mt-2 shadow-lg shadow-orange-500/25 dark:shadow-orange-950/30 py-4 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
            disabled={!username || !password || loading}
          >
            <span>{loading ? 'Abriendo la casita...' : 'Entrar a MichiDoc'}</span>
            {!loading && <ArrowRight size={16} />}
          </Button>
        </form>

        {/* Loving Footer Note */}
        <div className="mt-6 pt-5 border-t border-orange-100/70 dark:border-neutral-800 text-center">
          <p className="text-[11px] text-orange-800/70 dark:text-neutral-400 font-medium flex items-center justify-center gap-1.5">
            <span>✨</span>
            <span>Si es tu primera vez, ingresa cualquier usuario y contraseña</span>
          </p>
        </div>
        </div>
      </motion.div>
    </div>
  );
}
