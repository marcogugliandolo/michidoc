import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Trash2, X, AlertTriangle } from 'lucide-react';
import { Button } from './ui';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onClearAll: () => void;
  catName: string;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onLogout,
  onClearAll,
  catName
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-2xl border-2 border-orange-100 dark:border-neutral-800 z-10 text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 border border-orange-200 dark:border-orange-900/50 mx-auto flex items-center justify-center text-2xl mb-4 shadow-xs">
            🐾
          </div>

          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
            ¿Deseas cerrar sesión?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mb-6">
            Los datos de salud y registros de <strong className="text-orange-600 dark:text-orange-400">{catName}</strong> seguirán guardados.
          </p>

          <div className="space-y-2.5">
            <Button
              type="button"
              onClick={onLogout}
              className="w-full py-3 text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <LogOut size={15} />
              <span>Cerrar Sesión</span>
            </Button>

            <button
              type="button"
              onClick={onClearAll}
              className="w-full py-2.5 px-3 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Borrar datos y registrar otro gato</span>
            </button>

            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-full py-2 text-xs text-gray-500 dark:text-neutral-400 cursor-pointer"
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
