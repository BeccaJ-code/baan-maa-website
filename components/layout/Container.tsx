import { cn } from '@/lib/utils';

// =============================================================================
// Container Component
// =============================================================================

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  as?: 'div' | 'section' | 'article' | 'main';
}

export default function Container({
  children,
  className,
  size = 'lg',
  as: Component = 'div',
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',     // 768px
    md: 'max-w-5xl',     // 1024px
    lg: 'max-w-6xl',     // 1152px
    xl: 'max-w-7xl',     // 1280px
    full: 'max-w-[90rem]', // 1440px
  };

  return (
    <Component
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  );
}
