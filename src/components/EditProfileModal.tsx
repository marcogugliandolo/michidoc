import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, CheckCircle2, Sparkles, Heart } from 'lucide-react';
import { Button, cn } from './ui';
import { resizeImage } from '../imageUtils';
import { CatProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CatProfile;
  onSave: (updatedProfile: CatProfile) => void;
}

export function EditProfileModal({ isOpen, onClose, profile, onSave }: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [breed, setBreed] = useState(profile.breed || '');
  const [photo, setPhoto] = useState<string>(profile.photoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 500);
      setPhoto(resized);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age.trim()) return;

    setIsSaving(true);
    setTimeout(() => {
      onSave({
        name: name.trim(),
        age: age.trim(),
        breed: breed.trim(),
        photoUrl: photo
      });
      setIsSaving(false);
      onClose();
    }, 250);
  };

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
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-orange-100 dark:border-neutral-800 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-orange-100/70 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐱</span>
              <h2 className="text-lg sm:text-xl font-black text-orange-950 dark:text-orange-100">
                Editar Perfil del Michi
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Photo Avatar Editor */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-orange-300 dark:border-orange-600 bg-orange-100 shadow-sm">
                  <img
                    src={photo}
                    alt={name || "Michi"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white p-2 rounded-full shadow-md transition-all cursor-pointer"
                  title="Cambiar foto"
                >
                  <Camera size={16} />
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhoto}
              />
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                Toca la camarita para cambiar su foto 📸
              </span>
            </div>

            {/* Input Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black text-orange-950 dark:text-orange-200 uppercase tracking-wider mb-1">
                  Nombre del Michi *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-3 text-sm transition-all outline-none font-semibold text-gray-900 dark:text-gray-100"
                  placeholder="Ej. Pelusa"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-orange-950 dark:text-orange-200 uppercase tracking-wider mb-1">
                    Edad *
                  </label>
                  <input
                    type="text"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-3 text-sm transition-all outline-none font-semibold text-gray-900 dark:text-gray-100"
                    placeholder="Ej. 3 años"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-orange-950 dark:text-orange-200 uppercase tracking-wider mb-1">
                    Raza
                  </label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full rounded-2xl bg-orange-50/70 dark:bg-neutral-800/80 border border-orange-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 p-3 text-sm transition-all outline-none font-semibold text-gray-900 dark:text-gray-100"
                    placeholder="Ej. Común Europeo"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1 py-3 text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || !age.trim() || isSaving}
                className="flex-1 py-3 text-xs shadow-md shadow-orange-500/20"
              >
                {isSaving ? 'Guardando...' : '🐾 Guardar Cambios'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
