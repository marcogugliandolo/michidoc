import React from 'react';
import { CatProfile, HistoryRecord } from '../types';
import { Logo } from './Logo';
import { Home as HomeIcon, HeartPulse, Scale, History as HistoryIcon, LogOut, Edit3 } from 'lucide-react';
import { cn } from './ui';
import { motion } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: 'home' | 'pain' | 'bcs' | 'history';
  onNavigate: (view: 'home' | 'pain' | 'bcs' | 'history') => void;
  profile: CatProfile;
  records: HistoryRecord[];
  onReset: () => void;
  onEditProfile?: () => void;
}

export function AppLayout({
  children,
  currentView,
  onNavigate,
  profile,
  records,
  onReset,
  onEditProfile
}: AppLayoutProps) {
  const painCount = records.filter(r => r.type === 'pain').length;
  const bcsCount = records.filter(r => r.type === 'bcs').length;

  const navItems = [
    {
      id: 'home' as const,
      label: 'Mi Casita',
      emoji: '🏠',
      icon: HomeIcon,
      badge: null,
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'pain' as const,
      label: 'Dolor Facial',
      emoji: '🐱',
      icon: HeartPulse,
      badge: painCount > 0 ? `${painCount}` : null,
      color: 'from-rose-400 to-pink-500'
    },
    {
      id: 'bcs' as const,
      label: 'Pancita & Peso',
      emoji: '⚖️',
      icon: Scale,
      badge: bcsCount > 0 ? `${bcsCount}` : null,
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'history' as const,
      label: 'Álbum Clínico',
      emoji: '🐾',
      icon: HistoryIcon,
      badge: records.length > 0 ? `${records.length}` : null,
      color: 'from-sky-400 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fff9f3] dark:bg-neutral-950 flex flex-col font-sans transition-colors duration-200 selection:bg-orange-200">
      
      {/* Top Friendly Header & Floating Navigation */}
      <header className="sticky top-0 z-40 bg-[#fff9f3]/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-orange-100/70 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* Brand Logo */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
            >
              <Logo className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-105 transition-transform drop-shadow-sm" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-orange-950 dark:text-orange-200 group-hover:text-orange-600 transition-colors">
                    MichiDoc
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full border border-orange-200/80 dark:border-orange-800 hidden sm:inline-block">
                    🐾 Miau
                  </span>
                </div>
                <p className="text-[11px] text-orange-700/80 dark:text-orange-400/80 font-medium hidden lg:block">
                  Cuidando a tu compañero felino con amor
                </p>
              </div>
            </div>

            {/* Desktop Unique Michi-Bar Nav Tabs (Floating Island Menu) */}
            <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-orange-100/50 dark:bg-neutral-900/80 rounded-full border border-orange-200/60 dark:border-neutral-800 shadow-inner">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all select-none cursor-pointer",
                      isActive
                        ? "bg-white dark:bg-neutral-800 text-orange-950 dark:text-orange-100 shadow-sm shadow-orange-500/10 scale-100"
                        : "text-orange-900/70 dark:text-orange-300/70 hover:text-orange-950 dark:hover:text-orange-100 hover:bg-white/60 dark:hover:bg-neutral-800/50"
                    )}
                  >
                    <span className="text-sm">{item.emoji}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.2 rounded-full font-black",
                        isActive 
                          ? "bg-orange-500 text-white" 
                          : "bg-orange-200/80 dark:bg-neutral-700 text-orange-900 dark:text-orange-200"
                      )}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 rounded-full border-2 border-orange-400/40 pointer-events-none"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Dark Mode Toggle, Editable Cat Profile Badge & Logout */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              
              {/* Integrated Dark Mode Toggle */}
              <ThemeToggle />

              {/* Cat Profile Badge (Clickable to Edit) */}
              <button
                onClick={onEditProfile}
                className="flex items-center gap-2 p-1 sm:p-1.5 pr-2.5 sm:pr-3 rounded-full bg-white dark:bg-neutral-900 border border-orange-200/70 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-neutral-700 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-left"
                title="Toca para editar el perfil de tu michi"
              >
                <div className="relative">
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-7 h-7 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-orange-300 dark:border-orange-600 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-2xs">
                    <Edit3 size={8} />
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="text-xs font-black text-orange-950 dark:text-orange-100 truncate max-w-[90px] group-hover:text-orange-600 transition-colors">
                    {profile.name}
                  </div>
                  <div className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">
                    {profile.age}
                  </div>
                </div>
              </button>

              {/* Logout button */}
              <button
                onClick={onReset}
                className="p-2 sm:p-2.5 rounded-full text-orange-400 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-neutral-800 dark:hover:text-orange-300 transition-all cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </main>

      {/* Mobile Floating Michi-Dock (Cozy Bottom Navigation for mobile screens) */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-lg border border-orange-200/70 dark:border-neutral-800 rounded-3xl p-1.5 shadow-xl shadow-orange-950/10 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-pointer flex-1",
                isActive 
                  ? "text-orange-600 dark:text-orange-400 font-black" 
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-700"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-2xl flex items-center justify-center text-lg transition-transform",
                isActive 
                  ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-xs scale-105" 
                  : "bg-orange-50/60 dark:bg-neutral-800"
              )}>
                {item.emoji}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-bold">
                {item.label}
              </span>
              {item.badge && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
}
