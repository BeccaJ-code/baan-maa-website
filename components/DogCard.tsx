import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Badge, { StatusBadge, type DogStatusType } from '@/components/ui/Badge';
import type { Dog } from '@/types';

// =============================================================================
// Dog Card Component
// =============================================================================

export interface DogCardProps {
  dog: Pick<Dog, 'name' | 'slug' | 'status' | 'age' | 'sex' | 'size' | 'shortDescription' | 'featuredImage' | 'traits'>;
  showStatus?: boolean;
  className?: string;
}

export default function DogCard({ dog, showStatus = true, className }: DogCardProps) {
  const { name, slug, status, age, sex, size, shortDescription, featuredImage, traits } = dog;

  return (
    <Link href={`/dogs/${slug}`} className={cn('group block', className)}>
      <article className="bg-blue-100 rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {featuredImage ? (
            <Image
              src={featuredImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-sand-200 flex items-center justify-center">
              <DogPlaceholderIcon />
            </div>
          )}

          {/* Status badge */}
          {showStatus && (
            <div className="absolute top-3 left-3">
              <StatusBadge status={status as DogStatusType} size="sm" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Name and basic info */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-xl text-blue-800 group-hover:text-blue-700 transition-colors">
              {name}
            </h3>
            {age && (
              <span className="text-sand-600 shrink-0">{age}</span>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-2 text-sand-600 mb-3">
            {sex && <span>{sex === 'MALE' ? 'Male' : 'Female'}</span>}
            {sex && size && <span>·</span>}
            {size && <span>{size.charAt(0) + size.slice(1).toLowerCase()}</span>}
          </div>

          {/* Description */}
          {shortDescription && (
            <p className="text-sand-700 line-clamp-2 mb-3">
              {shortDescription}
            </p>
          )}

          {/* Traits */}
          {traits.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {traits.slice(0, 3).map(trait => (
                <Badge key={trait} size="sm" variant="default">
                  {trait}
                </Badge>
              ))}
              {traits.length > 3 && (
                <Badge size="sm" variant="default">
                  +{traits.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

// =============================================================================
// Dog Grid Component
// =============================================================================

export interface DogGridProps {
  dogs: DogCardProps['dog'][];
  className?: string;
}

export function DogGrid({ dogs, className }: DogGridProps) {
  if (dogs.length === 0) {
    return (
      <div className="text-center py-12">
        <DogPlaceholderIcon className="w-16 h-16 mx-auto text-sand-300 mb-4" />
        <p className="text-sand-600">No dogs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
      className
    )}>
      {dogs.map(dog => (
        <DogCard key={dog.slug} dog={dog} />
      ))}
    </div>
  );
}

// =============================================================================
// Placeholder Icon
// =============================================================================

function DogPlaceholderIcon({ className = 'w-12 h-12 text-sand-400' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  );
}
