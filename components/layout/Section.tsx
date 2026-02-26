import { cn } from '@/lib/utils';

// =============================================================================
// Section Component
// =============================================================================

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  background?: 'white' | 'sand' | 'blue' | 'blue-dark' | 'blue-light' | 'red' | 'red-light';
  id?: string;
}

export default function Section({
  children,
  className,
  padding = 'md',
  background = 'white',
  id,
}: SectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'py-section-sm',
    md: 'py-section-md',
    lg: 'py-section-lg',
  };

  const bgClasses = {
    white: 'bg-white',
    sand: 'bg-sand-50',
    blue: 'bg-blue-700',
    'blue-dark': 'bg-blue-900',
    'blue-light': 'bg-blue-50',
    red: 'bg-red-600',
    'red-light': 'bg-red-50',
  };

  const textClasses = {
    white: 'text-sand-900',
    sand: 'text-sand-900',
    blue: 'text-white',
    'blue-dark': 'text-white',
    'blue-light': 'text-sand-900',
    red: 'text-white',
    'red-light': 'text-sand-900',
  };

  return (
    <section
      id={id}
      className={cn(
        paddingClasses[padding],
        bgClasses[background],
        textClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
}
