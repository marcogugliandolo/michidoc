import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, Button } from './ui';
import { Logo } from './Logo';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'marco' && password === 'marco2026') {
      setError('');
      onLogin();
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-8 max-w-md mx-auto pt-12"
    >
      <div className="text-center mb-10 flex flex-col items-center">
        <Logo className="w-24 h-24 mb-6 shadow-md rounded-[32px]" />
        <h1 className="text-3xl font-black text-orange-950 mb-2">MichiDoc</h1>
        <p className="text-orange-700 font-medium">Cuidando de tu compañero felino</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Iniciar Sesión</h2>
            <p className="text-sm text-gray-500 mt-1">Ingresa tus datos para continuar</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1">Usuario</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full rounded-xl bg-orange-50 border-transparent focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 p-3 transition-all"
              placeholder="Nombre de usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-orange-900 mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl bg-orange-50 border-transparent focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-200 p-3 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          <Button 
            type="submit" 
            size="lg" 
            className="w-full mt-4"
            disabled={!username || !password}
          >
            Entrar
          </Button>

        </form>
      </Card>
    </motion.div>
  );
}
