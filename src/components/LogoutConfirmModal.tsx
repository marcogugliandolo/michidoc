import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Trash2, X, Cat } from 'lucide-react';
import { Button } from './ui';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onClearData: () => void;
  catName?: string;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onLogout,
  onClearData,
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
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-sm bg-white dark:bg-[#121212] rounded-3xl p-6 sm:p-7 shadow-2xl border border-neutral-100 dark:border-neutral-800 z-10 text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-500 border border-orange-200 dark:border-orange-900/40 mx-auto flex items-center justify-center mb-4 shadow-xs">
            <Cat size={26} />
          </div>

          <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-2">
            ¿Deseas cerrar sesión?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Los datos de salud y registros de tus michis seguirán a salvo en tu cuenta.
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-3.5 rounded-2xl text-[14px] font-bold bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>

            <button
              type="button"
              onClick={onClearData}
              className="w-full py-2.5 px-3 rounded-2xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={13} />
              <span>Borrar todos los datos y reiniciar</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-medium text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
