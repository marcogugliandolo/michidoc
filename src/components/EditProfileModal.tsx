import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera } from 'lucide-react';
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
        breed: breed.trim() || 'Mestizo / Común',
        photoUrl: photo
      });
      setIsSaving(false);
      onClose();
    }, 250);
  };

  const breedSuggestions = ['Común Europeo', 'Siamés', 'Persa', 'Mestizo'];

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
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        />

        {/* Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-[420px] bg-white dark:bg-[#121212] rounded-[32px] p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-neutral-100 dark:border-neutral-800/80 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-neutral-100 dark:border-neutral-800/80 mb-6">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Editar Perfil
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Photo Avatar Editor */}
            <div className="flex justify-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group ring-4 ring-white dark:ring-[#121212] shadow-sm cursor-pointer border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
                >
                  <img
                    src={photo}
                    alt={name || "Michi"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 p-2.5 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer"
                  title="Cambiar foto"
                >
                  <Camera size={14} />
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handlePhoto}
              />
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                  placeholder="Ej. Pelusa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                    Edad
                  </label>
                  <input
                    type="text"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    placeholder="Ej. 3 años"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                    Raza
                  </label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                    placeholder="Ej. Mestizo"
                  />
                </div>
              </div>

              {/* Quick Breed Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {breedSuggestions.map(b => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBreed(b)}
                    className={cn(
                      "text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all cursor-pointer",
                      breed === b
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white"
                        : "bg-white dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
                    )}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!name.trim() || !age.trim() || isSaving}
                className="flex-1 py-3.5 rounded-2xl text-[14px] font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-[0_8px_20px_rgb(249,115,22,0.25)] hover:shadow-[0_8px_25px_rgb(249,115,22,0.35)] transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
