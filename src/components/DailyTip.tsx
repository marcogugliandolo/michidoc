import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

const CAT_TIPS = [
  {
    emoji: "💧",
    title: "Agua fresca en movimiento",
    tip: "A los michis les encanta el agua que fluye. Una fuente puede animarlo a beber mucho más y cuidar su salud renal."
  },
  {
    emoji: "🧶",
    title: "15 Minutos de juego diario",
    tip: "Un rato diario de persecución con un plumero mantiene su figura perfecta, quema energía y estimula su instinto cazador."
  },
  {
    emoji: "✨",
    title: "Arenero siempre limpio",
    tip: "Los gatos son extremadamente limpios. Retirar los restos a diario reduce el estrés y previene problemas urinarios."
  },
  {
    emoji: "🐾",
    title: "Cepillado suave y regular",
    tip: "Cepillar su pelaje no solo evita bolas de pelo en su estómago, también fortalece el vínculo afectivo entre ustedes."
  },
  {
    emoji: "🐱",
    title: "El lenguaje de sus bigotes",
    tip: "Si sus bigotes están relajados hacia los lados, tu gatito está en calma total. Si apuntan hacia adelante, está curioso."
  },
  {
    emoji: "🍗",
    title: "Snacks sanos y seguros",
    tip: "Evita siempre la cebolla, el ajo y el chocolate. Prémialo con golosinas o premios húmedos formulados especialmente para felinos."
  },
  {
    emoji: "📦",
    title: "El poder de las cajas",
    tip: "Una simple caja de cartón les da sensación de seguridad 360°, calidez y un escondite perfecto para descansar."
  },
  {
    emoji: "💤",
    title: "Rincones cálidos al sol",
    tip: "Tener un cojín cerca de una ventana donde entre el sol por las mañanas es su mayor momento de placer del día."
  },
  {
    emoji: "🩺",
    title: "Chequeo veterinario preventivo",
    tip: "Una visita anual al veterinario ayuda a prevenir cualquier malestar silencioso antes de que cause dolor."
  },
  {
    emoji: "🎶",
    title: "Terapia de ronroneo",
    tip: "El ronroneo a bajas frecuencias (20-140 Hz) estimula la regeneración celular y transmite calma a toda la casa."
  }
];

export function DailyTip() {
  const dailyTip = useMemo(() => {
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const tipIndex = daysSinceEpoch % CAT_TIPS.length;
    return CAT_TIPS[tipIndex];
  }, []);

  return (
    <div className="rounded-[28px] p-6 sm:p-7 bg-[#E6F7F0] dark:bg-[#073827] border-2 border-[#9EE2C4] dark:border-[#0E6647] shadow-[0_4px_20px_rgb(16,185,129,0.12)] dark:shadow-[0_4px_25px_rgb(0,0,0,0.4)] transition-all relative overflow-hidden group">
      
      {/* Decorative Vibrant Watermark */}
      <div className="absolute -right-6 -bottom-6 w-40 h-40 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
      
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center relative z-10">
        
        {/* Emoji Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#0c4733] border-2 border-[#A3E4C7] dark:border-[#147451] flex items-center justify-center text-[28px] shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          {dailyTip.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
              <Sparkles size={11} className="text-emerald-200" />
              Consejo del Día
            </span>
          </div>

          <h4 className="font-extrabold text-emerald-950 dark:text-emerald-100 text-[17px] mb-1 tracking-tight">
            {dailyTip.title}
          </h4>

          <p className="text-[14px] font-medium text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed max-w-[95%]">
            {dailyTip.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
