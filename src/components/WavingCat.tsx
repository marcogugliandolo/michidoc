import React from 'react';
import { motion } from 'motion/react';
import { cn } from './ui';

export function WavingCat({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 170 140" 
      className={cn("block select-none overflow-visible", className)}
    >
      <defs>
        <filter id="catShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#9a3412" floodOpacity="0.12" />
        </filter>
        
        <linearGradient id="gingerFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>

        <linearGradient id="creamFur" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF7ED" />
        </linearGradient>
      </defs>

      {/* Main Character Group */}
      <g filter="url(#catShadow)">
        
        {/* === BODY / CHEST (Deep fill with NO horizontal bottom cut stroke) === */}
        {/* Chest Fill */}
        <path 
          d="M 44 72 C 38 90, 36 112, 34 140 L 136 140 C 134 112, 132 90, 126 72 Z" 
          fill="url(#creamFur)" 
        />
        {/* Left body contour stroke (open bottom) */}
        <path 
          d="M 44 72 C 38 90, 36 112, 34 140" 
          fill="none" 
          stroke="#EA580C" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        {/* Right body contour stroke (open bottom) */}
        <path 
          d="M 126 72 C 132 90, 134 112, 136 140" 
          fill="none" 
          stroke="#EA580C" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />

        {/* === RIGHT ARM & WAVING PAW === */}
        <motion.g 
          style={{ transformOrigin: "128px 125px" }}
          animate={{ 
            rotate: [0, 16, -4, 16, -4, 0],
            y: [0, -2, 0, -2, 0, 0]
          }}
          transition={{ 
            duration: 1.6, 
            repeat: Infinity, 
            ease: "easeInOut", 
            repeatDelay: 0.7 
          }}
        >
          {/* Arm Fill extending down */}
          <path 
            d="M 116 140 L 118 84 C 120 62, 126 45, 138 42 C 150 39, 158 50, 154 66 C 148 84, 142 110, 138 140 Z" 
            fill="url(#gingerFur)" 
          />
          {/* Arm Left Stroke */}
          <path 
            d="M 116 140 L 118 84 C 120 62, 126 45, 138 42 C 150 39, 158 50, 154 66 C 148 84, 142 110, 138 140" 
            fill="none" 
            stroke="#EA580C" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* White mitten patch on the waving paw */}
          <path 
            d="M 126 60 C 130 46, 144 42, 152 50 C 156 58, 150 70, 140 72 C 130 72, 124 66, 126 60 Z" 
            fill="#FFF7ED" 
          />

          {/* Pink Paw Beans (Jelly pads) */}
          <ellipse cx="141" cy="59" rx="4.8" ry="3.8" fill="#FB7185" />
          <circle cx="134" cy="52" r="1.9" fill="#FB7185" />
          <circle cx="141" cy="49" r="2.1" fill="#FB7185" />
          <circle cx="148" cy="52" r="1.9" fill="#FB7185" />
        </motion.g>

        {/* === EARS === */}
        {/* Left Ear with cute micro-twitch */}
        <motion.g
          animate={{ rotate: [0, -4, 0, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
          style={{ transformOrigin: "55px 44px" }}
        >
          <path 
            d="M 42 48 C 36 32, 42 16, 56 20 C 64 24, 68 36, 70 44 Z" 
            fill="url(#gingerFur)" 
            stroke="#EA580C" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          <path 
            d="M 47 43 C 42 32, 46 22, 55 25 C 60 29, 63 36, 64 42 Z" 
            fill="#FDA4AF" 
            opacity="0.85" 
          />
        </motion.g>

        {/* Right Ear with cute micro-twitch */}
        <motion.g
          animate={{ rotate: [0, 4, 0, 2, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 1.5 }}
          style={{ transformOrigin: "115px 44px" }}
        >
          <path 
            d="M 128 48 C 134 32, 128 16, 114 20 C 106 24, 102 36, 100 44 Z" 
            fill="url(#gingerFur)" 
            stroke="#EA580C" 
            strokeWidth="2.5" 
            strokeLinejoin="round" 
          />
          <path 
            d="M 123 43 C 128 32, 124 22, 115 25 C 110 29, 107 36, 106 42 Z" 
            fill="#FDA4AF" 
            opacity="0.85" 
          />
        </motion.g>

        {/* === HEAD (Round, Chubby Kawaii Face) === */}
        <ellipse 
          cx="85" 
          cy="64" 
          rx="47" 
          ry="37" 
          fill="url(#creamFur)" 
          stroke="#EA580C" 
          strokeWidth="2.5" 
        />

        {/* Soft Ginger Forehead & Cheek Cap */}
        <path 
          d="M 49 44 C 55 31, 70 26, 85 26 C 100 26, 115 31, 121 44 C 113 36, 99 32, 85 33 C 71 32, 57 36, 49 44 Z" 
          fill="url(#gingerFur)" 
        />

        {/* Cute Forehead Tabby Stripes */}
        <g stroke="#EA580C" strokeWidth="2.2" strokeLinecap="round" opacity="0.65">
          <line x1="85" y1="32" x2="85" y2="40" />
          <line x1="78" y1="34" x2="80" y2="40" />
          <line x1="92" y1="34" x2="90" y2="40" />
        </g>

        {/* === EYES (Kawaii Eyes with Automatic Blinking) === */}
        <motion.g 
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }} 
          transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.93, 0.96, 1] }} 
          style={{ transformOrigin: "85px 61px" }}
        >
          {/* Left Eye */}
          <g>
            <ellipse cx="65" cy="61" rx="6.5" ry="7.5" fill="#1E1B4B" />
            <circle cx="63" cy="58.5" r="2.8" fill="white" />
            <circle cx="68" cy="64" r="1.3" fill="white" />
          </g>

          {/* Right Eye */}
          <g>
            <ellipse cx="105" cy="61" rx="6.5" ry="7.5" fill="#1E1B4B" />
            <circle cx="103" cy="58.5" r="2.8" fill="white" />
            <circle cx="108" cy="64" r="1.3" fill="white" />
          </g>
        </motion.g>

        {/* === ROSY CHEEKS === */}
        <ellipse cx="54" cy="69" rx="7" ry="4" fill="#FB7185" opacity="0.45" />
        <ellipse cx="116" cy="69" rx="7" ry="4" fill="#FB7185" opacity="0.45" />

        {/* === TINY NOSE & SWEET ':3' SMILE === */}
        <path 
          d="M 82.5 69.5 Q 85 68 87.5 69.5 Q 85 73 82.5 69.5 Z" 
          fill="#FB7185" 
          stroke="#FB7185" 
          strokeWidth="1"
          strokeLinejoin="round" 
        />
        <path 
          d="M 78.5 73.5 Q 82 77.5 85 73.5 Q 88 77.5 91.5 73.5" 
          fill="none" 
          stroke="#7C2D12" 
          strokeWidth="2.2" 
          strokeLinecap="round" 
        />

        {/* === DELICATE WHISKERS === */}
        {/* Left */}
        <path d="M 45 65 Q 31 64 23 68" fill="none" stroke="#C2410C" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
        <path d="M 43 71 Q 29 73 21 78" fill="none" stroke="#C2410C" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />

        {/* Right */}
        <path d="M 125 65 Q 139 64 147 68" fill="none" stroke="#C2410C" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />
        <path d="M 127 71 Q 141 73 149 78" fill="none" stroke="#C2410C" strokeWidth="1.6" strokeLinecap="round" opacity="0.45" />

        {/* === LEFT PAW (Resting softly on top of the card ledge) === */}
        <g>
          <ellipse cx="55" cy="94" rx="11" ry="8.5" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2.2" />
          <line x1="51" y1="90" x2="51" y2="97" stroke="#FDBA74" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="59" y1="90" x2="59" y2="97" stroke="#FDBA74" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}
