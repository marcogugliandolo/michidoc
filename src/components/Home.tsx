import { CatProfile } from '../types';
import { Card, Button } from './ui';
import { HeartPulse, Scale, History, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

interface HomeProps {
  profile: CatProfile;
  onNavigate: (view: 'pain' | 'bcs' | 'history') => void;
  onReset: () => void;
}

export function Home({ profile, onNavigate, onReset }: HomeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-8 max-w-md mx-auto space-y-6 pb-24"
    >
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-orange-950 flex items-center gap-3">
          <Logo className="w-10 h-10 shadow-sm rounded-xl" />
          MichiDoc
        </h1>
        <button onClick={onReset} className="p-2 text-orange-400 hover:text-orange-600 bg-orange-50 rounded-full transition-colors">
          <LogOut size={20} />
        </button>
      </div>

      <Card className="flex items-center gap-4 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-100">
        <img 
          src={profile.photoUrl} 
          alt={profile.name} 
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
        />
        <div>
          <h2 className="text-xl font-bold text-orange-950">{profile.name}</h2>
          <p className="text-orange-700 font-medium">{profile.age}</p>
          {profile.breed && <p className="text-orange-600/80 text-sm">{profile.breed}</p>}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 mt-8">
        <h3 className="text-lg font-bold text-orange-900 mb-1">¿Qué quieres revisar hoy?</h3>
        
        <button 
          onClick={() => onNavigate('pain')}
          className="w-full text-left bg-white p-5 rounded-3xl shadow-sm border border-orange-50/50 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1 active:scale-95 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
            <HeartPulse size={28} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-lg">Chequeo de Dolor</h4>
            <p className="text-gray-500 text-sm">Analiza su carita con IA</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('bcs')}
          className="w-full text-left bg-white p-5 rounded-3xl shadow-sm border border-orange-50/50 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1 active:scale-95 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <Scale size={28} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-lg">Condición Corporal</h4>
            <p className="text-gray-500 text-sm">Verifica su peso ideal</p>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('history')}
          className="w-full text-left bg-white p-5 rounded-3xl shadow-sm border border-orange-50/50 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-1 active:scale-95 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <History size={28} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-lg">Historial</h4>
            <p className="text-gray-500 text-sm">Revisa los análisis previos</p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
