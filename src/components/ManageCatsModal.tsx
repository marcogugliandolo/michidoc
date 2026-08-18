import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Plus, Trash2, Check, Edit2, Sparkles, Cat } from 'lucide-react';
import { resizeImage } from '../imageUtils';
import { CatProfile } from '../types';
import { cn } from './ui';

interface ManageCatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: CatProfile[];
  activeProfile: CatProfile;
  onSelectProfile: (profile: CatProfile) => void;
  onUpdateProfile: (updatedProfile: CatProfile) => void;
  onDeleteProfile: (catId: string) => void;
  onAddNewCat: () => void;
}

export function ManageCatsModal({
  isOpen,
  onClose,
  profiles,
  activeProfile,
  onSelectProfile,
  onUpdateProfile,
  onDeleteProfile,
  onAddNewCat
}: ManageCatsModalProps) {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  
  // Edit form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (cat: CatProfile) => {
    setEditingCatId(cat.id || activeProfile.id || 'cat_active');
    setName(cat.name);
    setAge(cat.age);
    setBreed(cat.breed || '');
    setPhoto(cat.photoUrl);
    setConfirmDeleteId(null);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const resized = await resizeImage(e.target.files[0], 500);
      setPhoto(resized);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age.trim() || !editingCatId) return;

    setIsSaving(true);
    const updated: CatProfile = {
      id: editingCatId,
      name: name.trim(),
      age: age.trim(),
      breed: breed.trim() || 'Mestizo / Común',
      photoUrl: photo
    };

    setTimeout(() => {
      onUpdateProfile(updated);
      setIsSaving(false);
      setEditingCatId(null);
    }, 200);
  };

  const handleDelete = (catId: string) => {
    onDeleteProfile(catId);
    setConfirmDeleteId(null);
    if (editingCatId === catId) {
      setEditingCatId(null);
    }
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
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        />

        {/* Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative w-full max-w-[460px] max-h-[90vh] flex flex-col bg-white dark:bg-[#121212] rounded-[32px] p-6 sm:p-7 shadow-2xl border border-neutral-100 dark:border-neutral-800/80 z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800/80 mb-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 flex items-center justify-center text-orange-500">
                <Cat size={18} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {editingCatId ? 'Editar Michi' : 'Mis Michis'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 pr-1 -mr-1">
            {editingCatId ? (
              /* === EDIT FORM === */
              <form onSubmit={handleSaveEdit} className="space-y-5 py-2">
                {/* Photo Avatar Editor */}
                <div className="flex justify-center">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 group ring-4 ring-orange-100 dark:ring-neutral-800 shadow-sm cursor-pointer border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
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
                      className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer border-2 border-white dark:border-[#121212]"
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

                {/* Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                      placeholder="Ej. Pelusa"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[13px] font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                        Edad
                      </label>
                      <input
                        type="text"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                        placeholder="Ej. 3 años"
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                        Raza
                      </label>
                      <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        className="w-full bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-4 py-3 text-[15px] text-neutral-900 dark:text-white focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                        placeholder="Ej. Mestizo"
                      />
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {breedSuggestions.map(b => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setBreed(b)}
                        className={cn(
                          "text-[11px] font-medium px-3 py-1 rounded-full border transition-all cursor-pointer",
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

                {/* Form Buttons */}
                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingCatId(null)}
                    className="flex-1 py-3 rounded-2xl text-[14px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={!name.trim() || !age.trim() || isSaving}
                    className="flex-1 py-3 rounded-2xl text-[14px] font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            ) : (
              /* === CATS LIST & MANAGEMENT === */
              <div className="space-y-3 py-1">
                <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-3">
                  Selecciona el michi que deseas consultar o administrar:
                </p>

                <div className="space-y-2">
                  {profiles.map((cat) => {
                    const isSelected = (cat.id && cat.id === activeProfile.id) || (!cat.id && cat.name === activeProfile.name);
                    const isDeleting = confirmDeleteId === cat.id;

                    return (
                      <div
                        key={cat.id || cat.name}
                        className={cn(
                          "flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all duration-200",
                          isSelected
                            ? "bg-orange-50/70 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40 shadow-xs"
                            : "bg-neutral-50/50 dark:bg-neutral-900/40 border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                        )}
                      >
                        {/* Avatar & Info */}
                        <div 
                          onClick={() => {
                            onSelectProfile(cat);
                            onClose();
                          }}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        >
                          <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
                              <img src={cat.photoUrl} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                            {isSelected && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center border-2 border-white dark:border-[#121212]">
                                <Check size={11} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[15px] text-neutral-900 dark:text-white truncate">
                                {cat.name}
                              </span>
                              {isSelected && (
                                <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-100/80 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">
                                  Activo
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-neutral-500 dark:text-neutral-400 truncate">
                              {cat.age} • {cat.breed || 'Mestizo'}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => startEditing(cat)}
                            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Editar datos de este michi"
                          >
                            <Edit2 size={16} />
                          </button>

                          {profiles.length > 1 && (
                            isDeleting ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(cat.id || '')}
                                  className="px-2 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  ¿Borrar?
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="p-1 text-neutral-400 hover:text-neutral-600 text-[11px]"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(cat.id || '')}
                                className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                title="Eliminar michi"
                              >
                                <Trash2 size={16} />
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add New Cat Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onAddNewCat();
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-orange-300 dark:border-orange-900/50 bg-orange-50/40 dark:bg-orange-950/10 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-bold text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus size={14} strokeWidth={2.5} />
                    </div>
                    <span>Añadir a otro Michi a la Familia</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
