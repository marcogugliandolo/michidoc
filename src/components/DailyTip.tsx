import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

const CAT_TIPS = [
  {
    emoji: "💧",
    title: "¡Agüita fresca y en movimiento!",
    tip: "A los michis les encanta el agua que fluye. Una fuente puede animarlo a beber mucho más y cuidar sus riñoncitos."
  },
  {
    emoji: "🧶",
    title: "¡Hora de jugar y cazar!",
    tip: "15 minutitos de juego diario con un plumero o cañita mantienen su figura perfecta y liberan todo su instinto feliz."
  },
  {
    emoji: "✨",
    title: "El arenero impecable",
    tip: "Los gatos son súper limpios. Limpiar su cajita todos los días evita el estrés y mantiene su hogar feliz."
  },
  {
    emoji: "🐾",
    title: "Sesión de cepillado con mimos",
    tip: "Cepillar su pelaje no solo evita bolas de pelo, ¡también fortalece muchísimo vuestro vínculo de amor!"
  },
  {
    emoji: "🐱",
    title: "El lenguaje de sus bigotes",
    tip: "Si sus bigotes están relajados hacia los lados, tu gatito está calmado y contento. ¡Obsérvalos con cariño!"
  },
  {
    emoji: "🐟",
    title: "Snacks seguros y saludables",
    tip: "Evita siempre la cebolla, el ajo o el chocolate. Prémialo con golosinas formuladas especialmente para felinos."
  },
  {
    emoji: "📦",
    title: "¡El superpoder de las cajas!",
    tip: "Una simple caja de cartón les da seguridad y un escondite perfecto para jugar y observar su territorio."
  },
  {
    emoji: "💤",
    title: "Siestas al solecito",
    tip: "Los gatos duermen entre 12 y 16 horas al día. Tener una camita cerca de una ventana es su paraíso personal."
  },
  {
    emoji: "🩺",
    title: "Revisión preventiva anual",
    tip: "Una visita al veterinario de confianza al año ayuda a detectar a tiempo cualquier molestia antes de que empeore."
  },
  {
    emoji: "🎶",
    title: "El misterio del ronroneo",
    tip: "El ronroneo libera endorfinas que calman tanto a tu michi como a ti. ¡Es una verdadera terapia de amor!"
  }
];

export function DailyTip() {
  const dailyTip = useMemo(() => {
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const tipIndex = daysSinceEpoch % CAT_TIPS.length;
    return CAT_TIPS[tipIndex];
  }, []);

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-white dark:bg-neutral-900 border-2 border-amber-100 dark:border-neutral-800 shadow-xs transition-colors">
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/30 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
          {dailyTip.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-500/30">
              Miau-Consejo de Hoy
            </span>
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white text-base mb-1">
            {dailyTip.title}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-300 leading-relaxed font-normal">
            {dailyTip.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
