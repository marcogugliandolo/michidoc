import { cn } from './ui';

export function Logo({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={cn("w-12 h-12", className)}>
      <rect width="100" height="100" rx="28" fill="#C27A4E" />
      <path 
        d="M25 45 C25 65 35 75 50 75 C65 75 75 65 75 45 C75 35 75 35 75 35 L75 25 L60 30 C55 28 45 28 40 30 L25 25 L25 35 C25 35 25 35 25 45 Z" 
        fill="none" 
        stroke="white" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Eyes */}
      <circle cx="38" cy="50" r="3.5" fill="white" />
      <circle cx="62" cy="50" r="3.5" fill="white" />
      {/* Nose */}
      <path d="M47 58 L53 58 L50 62 Z" fill="white" stroke="white" strokeLinejoin="round" />
    </svg>
  );
}
