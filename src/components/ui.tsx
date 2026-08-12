import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost',
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        {
          'bg-orange-500 text-white hover:bg-orange-600 shadow-md': variant === 'primary',
          'bg-orange-100 text-orange-800 hover:bg-orange-200': variant === 'secondary',
          'border-2 border-orange-200 text-orange-700 hover:bg-orange-50': variant === 'outline',
          'text-orange-700 hover:bg-orange-100': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-white rounded-3xl p-6 shadow-sm border border-orange-50/50", className)}
      {...props}
    />
  );
}
