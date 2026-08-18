import { cn } from './ui';

export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={cn("w-10 h-10 select-none overflow-visible", className)}
    >
      <defs>
        {/* Soft badge gradient */}
        <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        <linearGradient id="logoCatFace" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF7ED" />
        </linearGradient>

        <linearGradient id="logoGinger" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>

        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#7c2d12" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* App Icon Rounded Squircle Badge */}
      <rect width="100" height="100" rx="26" fill="url(#logoBg)" />

      {/* Subtle inner highlight border */}
      <rect 
        x="1.5" 
        y="1.5" 
        width="97" 
        height="97" 
        rx="24.5" 
        fill="none" 
        stroke="rgba(255, 255, 255, 0.35)" 
        strokeWidth="2" 
      />

      {/* === CAT MASCOT (Cute Chubby Face with Resting Paws) === */}
      <g filter="url(#logoShadow)">
        
        {/* === EARS === */}
        {/* Left Ear */}
        <path 
          d="M 23 42 C 18 30, 22 17, 34 20 C 40 23, 44 32, 45 38 Z" 
          fill="url(#logoGinger)" 
          stroke="#C2410C" 
          strokeWidth="1.8" 
          strokeLinejoin="round" 
        />
        <path 
          d="M 27 38 C 23 29, 26 21, 33 24 C 37 27, 39 33, 40 37 Z" 
          fill="#FDA4AF" 
          opacity="0.9"
        />

        {/* Right Ear */}
        <path 
          d="M 77 42 C 82 30, 78 17, 66 20 C 60 23, 56 32, 55 38 Z" 
          fill="url(#logoGinger)" 
          stroke="#C2410C" 
          strokeWidth="1.8" 
          strokeLinejoin="round" 
        />
        <path 
          d="M 73 38 C 77 29, 74 21, 67 24 C 63 27, 61 33, 60 37 Z" 
          fill="#FDA4AF" 
          opacity="0.9"
        />

        {/* === HEAD (Chubby Round Face) === */}
        <ellipse 
          cx="50" 
          cy="56" 
          rx="32" 
          ry="25" 
          fill="url(#logoCatFace)" 
          stroke="#C2410C" 
          strokeWidth="2" 
        />

        {/* Ginger Forehead Patch */}
        <path 
          d="M 29 42 C 34 32, 44 28, 50 28 C 56 28, 66 32, 71 42 C 65 36, 57 33, 50 33 C 43 33, 35 36, 29 42 Z" 
          fill="url(#logoGinger)" 
        />

        {/* Forehead Stripes */}
        <g stroke="#C2410C" strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
          <line x1="50" y1="32" x2="50" y2="38" />
          <line x1="45" y1="34" x2="46.5" y2="38.5" />
          <line x1="55" y1="34" x2="53.5" y2="38.5" />
        </g>

        {/* === EYES (Sparkling Kawaii Eyes) === */}
        {/* Left Eye */}
        <g>
          <ellipse cx="38" cy="53" rx="4.8" ry="5.5" fill="#1E1B4B" />
          <circle cx="36.5" cy="51" r="2" fill="white" />
          <circle cx="40" cy="55.2" r="0.9" fill="white" />
        </g>

        {/* Right Eye */}
        <g>
          <ellipse cx="62" cy="53" rx="4.8" ry="5.5" fill="#1E1B4B" />
          <circle cx="60.5" cy="51" r="2" fill="white" />
          <circle cx="64" cy="55.2" r="0.9" fill="white" />
        </g>

        {/* === ROSY BLUSH === */}
        <ellipse cx="30" cy="59" rx="5" ry="3" fill="#FB7185" opacity="0.6" />
        <ellipse cx="70" cy="59" rx="5" ry="3" fill="#FB7185" opacity="0.6" />

        {/* === TINY NOSE & ':3' MOUTH === */}
        <path 
          d="M 48 59.5 Q 50 58 52 59.5 Q 50 62 48 59.5 Z" 
          fill="#FB7185" 
          stroke="#FB7185" 
          strokeWidth="0.8" 
          strokeLinejoin="round" 
        />
        <path 
          d="M 45 62.5 Q 47.5 65.5 50 62.5 Q 52.5 65.5 55 62.5" 
          fill="none" 
          stroke="#7C2D12" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
        />

        {/* === DELICATE WHISKERS === */}
        <path d="M 23 56 Q 14 55 8 58" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 22 61 Q 13 62 7 66" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 77 56 Q 86 55 92 58" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 78 61 Q 87 62 93 66" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" />

        {/* === RESTING LEFT PAW === */}
        <g>
          <ellipse cx="32" cy="74" rx="8" ry="6" fill="#FFF7ED" stroke="#C2410C" strokeWidth="1.8" />
          <line x1="29" y1="71" x2="29" y2="76" stroke="#FDBA74" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="35" y1="71" x2="35" y2="76" stroke="#FDBA74" strokeWidth="1.4" strokeLinecap="round" />
        </g>

        {/* === RESTING RIGHT PAW (Symmetrical, resting like the left paw) === */}
        <g>
          <ellipse cx="68" cy="74" rx="8" ry="6" fill="#FFF7ED" stroke="#C2410C" strokeWidth="1.8" />
          <line x1="65" y1="71" x2="65" y2="76" stroke="#FDBA74" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="71" y1="71" x2="71" y2="76" stroke="#FDBA74" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
