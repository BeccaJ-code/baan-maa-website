import { cn } from '@/lib/utils';

// =============================================================================
// Badge Component
// =============================================================================

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'blue' | 'teal';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',

        // Sizes
        size === 'sm' && 'px-2 py-0.5 text-xs',
        size === 'md' && 'px-3 py-1 text-sm',

        // Variants
        variant === 'default' && 'bg-sand-100 text-sand-700',
        variant === 'success' && 'bg-green-100 text-green-800',
        variant === 'warning' && 'bg-amber-100 text-amber-800',
        variant === 'error' && 'bg-red-100 text-red-800',
        variant === 'blue' && 'bg-blue-100 text-blue-800',
        variant === 'teal' && 'bg-teal-100 text-teal-800',

        className
      )}
    >
      {children}
    </span>
  );
}

// =============================================================================
// Status Badge (for dogs)
// =============================================================================

export type DogStatusType = 'AVAILABLE' | 'ADOPTED' | 'SPONSORED' | 'FOSTERED' | 'MEDICAL' | 'DECEASED';

const STATUS_CONFIG: Record<DogStatusType, { label: string; variant: BadgeProps['variant'] }> = {
  AVAILABLE: { label: 'Available', variant: 'success' },
  ADOPTED: { label: 'Adopted', variant: 'blue' },
  SPONSORED: { label: 'Sponsored', variant: 'teal' },
  FOSTERED: { label: 'In Foster', variant: 'warning' },
  MEDICAL: { label: 'Medical Care', variant: 'error' },
  DECEASED: { label: 'In Memory', variant: 'default' },
};

export function StatusBadge({
  status,
  size = 'md',
  className,
}: {
  status: DogStatusType;
  size?: BadgeProps['size'];
  className?: string;
}) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.AVAILABLE;

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}
