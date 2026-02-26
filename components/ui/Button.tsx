'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// =============================================================================
// Button Component
// =============================================================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-semibold rounded-lg',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',

          // Variants
          variant === 'primary' && [
            'bg-teal-600 text-white',
            'hover:bg-teal-700 hover:shadow-teal hover:-translate-y-0.5',
            'focus:ring-teal-500',
          ],
          variant === 'secondary' && [
            'bg-white text-teal-600 border-2 border-teal-600',
            'hover:bg-teal-50 hover:-translate-y-0.5',
            'focus:ring-teal-500',
          ],
          variant === 'outline' && [
            'bg-transparent text-white border-2 border-white',
            'hover:bg-white/10 hover:-translate-y-0.5',
            'focus:ring-white/50 focus:ring-offset-blue-700',
          ],
          variant === 'ghost' && [
            'bg-transparent text-sand-700',
            'hover:bg-sand-100',
            'focus:ring-teal-500',
          ],

          // Sizes
          size === 'sm' && 'py-2.5 px-5 text-sm min-h-[36px]',
          size === 'md' && 'py-3.5 px-7 text-base min-h-[48px]',
          size === 'lg' && 'py-4 px-8 text-lg min-h-[56px]',

          // Full width
          fullWidth && 'w-full',

          className
        )}
        {...props}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// =============================================================================
// Loading Spinner
// =============================================================================

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default Button;
