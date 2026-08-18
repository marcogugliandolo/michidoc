import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from './ui';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 sm:p-2.5 rounded-full bg-white dark:bg-neutral-900 text-orange-500 dark:text-orange-400 border border-orange-200/70 dark:border-neutral-800 hover:bg-orange-50 dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs focus:outline-none flex items-center justify-center shrink-0",
        className
      )}
      title={theme === 'dark' ? 'Cambiar a modo claro ☀️' : 'Cambiar a modo noche 🌙'}
      aria-label="Alternar modo día y noche"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-amber-400" />
      ) : (
        <Moon size={18} className="text-orange-600" />
      )}
    </button>
  );
}
