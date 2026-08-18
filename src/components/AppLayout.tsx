import React, { useState, useRef, useEffect } from 'react';
import { CatProfile, HistoryRecord } from '../types';
import { Logo } from './Logo';
import { Home as HomeIcon, Cat, Scale, PawPrint, LogOut, ChevronDown, Plus, Settings, Check } from 'lucide-react';
import { cn } from './ui';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: 'home' | 'pain' | 'bcs' | 'history';
  onNavigate: (view: 'home' | 'pain' | 'bcs' | 'history') => void;
  profile: CatProfile;
  profiles: CatProfile[];
  records: HistoryRecord[];
  onSelectProfile: (profile: CatProfile) => void;
  onAddNewCat: () => void;
  onManageCats: () => void;
  onReset: () => void;
}

export function AppLayout({
  children,
  currentView,
  onNavigate,
  profile,
  profiles = [],
  records,
  onSelectProfile,
  onAddNewCat,
  onManageCats,
  onReset
}: AppLayoutProps) {
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCatMenuOpen(false);
      }
    }
    if (isCatMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCatMenuOpen]);

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

  const catList = profiles.length > 0 ? profiles : [profile];

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-orange-200 dark:selection:bg-orange-900 pb-20 md:pb-0 relative">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#fffaf5]/85 dark:bg-neutral-950/85 backdrop-blur-xl border-b border-orange-100/70 dark:border-neutral-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            
            {/* Brand */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            >
              <Logo className="w-10 h-10 group-hover:scale-105 group-hover:-rotate-3 transition-transform" />
              <div className="hidden sm:block">
                <span className="text-[19px] font-black tracking-tight text-neutral-900 dark:text-white transition-colors flex items-center gap-1">
                  MichiDoc
                  <span className="text-sm">🐾</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-orange-100/50 dark:bg-neutral-900/60 rounded-full border border-orange-200/50 dark:border-neutral-800/80">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all select-none cursor-pointer",
                      isActive
                        ? "text-orange-950 dark:text-white"
                        : "text-neutral-500 hover:text-orange-900 dark:hover:text-white"
                    )}
                  >
                    <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavDesktop"
                        className="absolute inset-0 rounded-full bg-white dark:bg-[#181818] shadow-sm pointer-events-none -z-10 border border-orange-200/40 dark:border-neutral-700/60"
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

              {/* Multi-Cat Selector Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsCatMenuOpen(!isCatMenuOpen)}
                  className="flex items-center gap-2 p-1 pr-2.5 sm:pr-3 rounded-full bg-white/80 dark:bg-neutral-900/80 hover:bg-white dark:hover:bg-neutral-900 border border-orange-200/70 dark:border-neutral-800 transition-all cursor-pointer group shadow-2xs"
                  title="Cambiar o gestionar michis"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-300 dark:border-neutral-700 group-hover:scale-105 transition-transform shrink-0">
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-[13px] font-bold text-neutral-900 dark:text-white truncate max-w-[80px] sm:max-w-[100px] leading-tight">
                      {profile.name}
                    </div>
                  </div>
                  <ChevronDown 
                    size={14} 
                    className={cn(
                      "text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform duration-200",
                      isCatMenuOpen && "rotate-180"
                    )} 
                  />
                </button>

                {/* Popover Dropdown */}
                <AnimatePresence>
                  {isCatMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-[#141414]/95 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-orange-200/60 dark:border-neutral-800 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-1.5 border-b border-neutral-100 dark:border-neutral-800/80 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600/80 dark:text-neutral-400">
                          Michis en tu cuenta
                        </span>
                      </div>

                      {/* Cat list */}
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {catList.map((cat) => {
                          const isSelected = (cat.id && cat.id === profile.id) || (!cat.id && cat.name === profile.name);
                          return (
                            <button
                              key={cat.id || cat.name}
                              onClick={() => {
                                onSelectProfile(cat);
                                setIsCatMenuOpen(false);
                              }}
                              className={cn(
                                "w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer group",
                                isSelected
                                  ? "bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-200 font-bold"
                                  : "hover:bg-orange-50/50 dark:hover:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300"
                              )}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-200 dark:border-neutral-700 shrink-0">
                                  <img src={cat.photoUrl} alt={cat.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="truncate">
                                  <p className="text-[13px] font-bold truncate leading-tight">
                                    {cat.name}
                                  </p>
                                  <p className="text-[11px] text-neutral-400 truncate">
                                    {cat.age}
                                  </p>
                                </div>
                              </div>
                              {isSelected && (
                                <Check size={14} className="text-orange-500 shrink-0 mr-1" strokeWidth={2.5} />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-neutral-100 dark:border-neutral-800/80 my-1.5" />

                      {/* Actions */}
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setIsCatMenuOpen(false);
                            onAddNewCat();
                          }}
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[13px] font-bold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors cursor-pointer"
                        >
                          <Plus size={16} strokeWidth={2.5} />
                          <span>Añadir otro Michi</span>
                        </button>

                        <button
                          onClick={() => {
                            setIsCatMenuOpen(false);
                            onManageCats();
                          }}
                          className="w-full flex items-center gap-2.5 p-2 rounded-xl text-[13px] font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer"
                        >
                          <Settings size={15} />
                          <span>Gestionar Michis</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={onReset}
                className="p-2 rounded-full text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fffaf5]/90 dark:bg-neutral-950/90 backdrop-blur-xl border-t border-orange-100/70 dark:border-neutral-800/80 pb-[env(safe-area-inset-bottom)]">
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
                    ? "text-orange-600 dark:text-orange-400 font-bold" 
                    : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] mt-1">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavMobile"
                    className="absolute -top-1 w-8 h-1 rounded-full bg-orange-500"
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
