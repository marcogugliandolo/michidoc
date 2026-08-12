import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-3 bg-white dark:bg-neutral-800 text-orange-500 dark:text-orange-400 rounded-full shadow-lg border border-orange-100 dark:border-neutral-700 hover:scale-110 transition-transform z-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}
