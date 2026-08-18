import { useMemo } from 'react';

const CAT_TIPS = [
  {
    emoji: "💧",
    title: "Agua en movimiento",
    tip: "A los michis les encanta el agua que fluye. Una fuente puede animarlo a beber mucho más y cuidar su salud renal."
  },
  {
    emoji: "🧶",
    title: "Hora de jugar",
    tip: "15 minutos de juego diario con un plumero mantienen su figura perfecta y estimulan su instinto."
  },
  {
    emoji: "✨",
    title: "Arenero impecable",
    tip: "Los gatos son muy limpios. Limpiar su arenero a diario reduce el estrés y mantiene su hogar feliz."
  },
  {
    emoji: "🐾",
    title: "Cepillado suave",
    tip: "Cepillar su pelaje no solo evita bolas de pelo, también fortalece el vínculo entre ustedes."
  },
  {
    emoji: "🐱",
    title: "El lenguaje de sus bigotes",
    tip: "Si sus bigotes están relajados hacia los lados, tu gatito está calmado y contento."
  },
  {
    emoji: "🐟",
    title: "Snacks seguros",
    tip: "Evita siempre la cebolla, el ajo o el chocolate. Prémialo con golosinas formuladas para felinos."
  },
  {
    emoji: "📦",
    title: "Refugio seguro",
    tip: "Una simple caja de cartón les da seguridad y un escondite perfecto para jugar y observar."
  },
  {
    emoji: "💤",
    title: "Siestas al sol",
    tip: "Tener una cama cómoda cerca de una ventana o una fuente de calor natural es su paraíso personal."
  },
  {
    emoji: "🩺",
    title: "Revisión anual",
    tip: "Una visita al veterinario de confianza al año ayuda a detectar a tiempo cualquier molestia."
  },
  {
    emoji: "🎶",
    title: "Terapia de ronroneo",
    tip: "El ronroneo libera endorfinas que calman tanto a tu michi como a ti."
  }
];

export function DailyTip() {
  const dailyTip = useMemo(() => {
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const tipIndex = daysSinceEpoch % CAT_TIPS.length;
    return CAT_TIPS[tipIndex];
  }, []);

  return (
    <div className="rounded-[28px] p-6 sm:p-8 bg-neutral-50/50 dark:bg-[#121212] border border-neutral-200/50 dark:border-neutral-800/80 transition-colors">
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        <div className="w-14 h-14 rounded-[20px] bg-white dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center text-[26px] shrink-0 shadow-sm">
          {dailyTip.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Consejo del día
            </span>
          </div>
          <h4 className="font-semibold text-neutral-900 dark:text-white text-[16px] mb-1">
            {dailyTip.title}
          </h4>
          <p className="text-[14px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {dailyTip.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
