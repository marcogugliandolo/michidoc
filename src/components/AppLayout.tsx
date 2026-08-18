import React from 'react';
import { CatProfile, HistoryRecord } from '../types';
import { Logo } from './Logo';
import { Home as HomeIcon, Cat, Scale, PawPrint, LogOut, Edit3 } from 'lucide-react';
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
  const navItems = [
    {
      id: 'home' as const,
      label: 'Inicio',
      icon: HomeIcon,
    },
    {
      id: 'pain' as const,
      label: 'Dolor',
      icon: Cat,
    },
    {
      id: 'bcs' as const,
      label: 'Peso',
      icon: Scale,
    },
    {
      id: 'history' as const,
      label: 'Historial',
      icon: PawPrint,
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0a0a0a] flex flex-col font-sans transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900 pb-20 md:pb-0 relative">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/60 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* Brand */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            >
              <Logo className="w-10 h-10 group-hover:scale-105 group-hover:-rotate-3 transition-transform" />
              <div className="hidden sm:block">
                <span className="text-[19px] font-bold tracking-tight text-neutral-900 dark:text-white transition-colors">
                  MichiDoc
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-neutral-200/40 dark:bg-neutral-800/40 rounded-full border border-neutral-200/60 dark:border-neutral-800/60">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-medium transition-all select-none cursor-pointer",
                      isActive
                        ? "text-neutral-900 dark:text-white"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    )}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavDesktop"
                        className="absolute inset-0 rounded-full bg-white dark:bg-[#121212] shadow-sm pointer-events-none -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <ThemeToggle />

              <button
                onClick={onEditProfile}
                className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer group"
                title="Editar perfil"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700 group-hover:scale-105 transition-transform">
                  <img
                    src={profile.photoUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[13px] font-semibold text-neutral-900 dark:text-white truncate max-w-[90px] leading-tight flex items-center gap-1">
                    {profile.name}
                  </div>
                </div>
              </button>

              <button
                onClick={onReset}
                className="p-2 rounded-full text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#faf8f5]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-neutral-200/60 dark:border-neutral-800/60 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-colors cursor-pointer",
                  isActive 
                    ? "text-orange-500" 
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={cn("mb-1 transition-transform", isActive && "-translate-y-0.5")} />
                <span className="text-[10px] font-medium tracking-wide">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavMobile"
                    className="absolute top-0 w-8 h-1 bg-orange-500 rounded-b-full pointer-events-none"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
