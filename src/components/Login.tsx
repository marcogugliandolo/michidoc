import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui';
import { Logo } from './Logo';
import { setAuthState } from '../db';
import { ThemeToggle } from './ThemeToggle';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
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
    <div className="min-h-screen bg-[#fff8f3] dark:bg-neutral-950 flex items-center justify-center p-4 sm:p-6 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md lg:max-w-3xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 shadow-xl border-2 border-orange-200/80 dark:border-neutral-800"
      >
        {/* Left Side: Friendly Cat Banner on Desktop */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-orange-400 via-amber-400 to-rose-400 p-8 text-white flex-col justify-between relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12 drop-shadow-md" />
              <div>
                <h1 className="text-2xl font-black tracking-tight">MichiDoc</h1>
                <p className="text-xs text-orange-100 font-bold">🐾 Cuidados Felinos</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h2 className="text-xl font-black leading-snug">
                ¡Bienvenid@ a la casita de salud de tu gato!
              </h2>
              <ul className="space-y-2.5 text-xs text-orange-50 font-medium">
                <li className="flex items-center gap-2">
                  <span>🐱</span>
                  <span>Chequeo facial de dolor con IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>⚖️</span>
                  <span>Revisión de pancita y peso (BCS 1-9)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📅</span>
                  <span>Recordatorios y diario de salud</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-orange-100 font-bold relative z-10 flex items-center gap-1">
            <span>✨</span> Hecho con mucho amor para michis
          </div>
        </div>

        {/* Right Side: Friendly Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          <div className="text-center lg:text-left mb-6">
            <div className="lg:hidden flex flex-col items-center mb-4">
              <Logo className="w-16 h-16 mb-2 drop-shadow-sm" />
              <h1 className="text-2xl font-black text-orange-950 dark:text-orange-200">MichiDoc</h1>
              <p className="text-xs text-orange-700 dark:text-orange-400 font-semibold">Salud y bienestar con amor 🐾</p>
            </div>

            <h2 className="text-2xl font-black text-orange-950 dark:text-orange-100">¡Hola, humano! 👋</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
              Ingresa tus datos para cuidar a tu michi
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black text-orange-950 dark:text-orange-200 uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-3.5 text-sm transition-all outline-none"
                placeholder="Nombre de usuario"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-orange-950 dark:text-orange-200 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-3.5 text-sm transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-rose-600 text-xs text-center font-bold bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200">
                {error}
              </p>
            )}

            <Button 
              type="submit" 
              size="lg" 
              className="w-full mt-2 shadow-md shadow-orange-500/20 py-3.5 text-sm"
              disabled={!username || !password || loading}
            >
              {loading ? 'Entrando a la casita...' : '🐾 Entrar a MichiDoc'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
