import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// =============================================================================
// Base Card Component
// =============================================================================

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'article';
}

export function Card({
  children,
  className,
  hover = true,
  as: Component = 'div',
}: CardProps) {
  return (
    <Component
      className={cn(
        'bg-blue-100 rounded-xl shadow-md overflow-hidden',
        hover && [
          'transition-all duration-300 ease-out',
          'hover:shadow-lg hover:-translate-y-1',
        ],
        className
      )}
    >
      {children}
    </Component>
  );
}

// =============================================================================
// Card Image
// =============================================================================

export interface CardImageProps {
  src: string;
  alt: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';
  className?: string;
}

export function CardImage({
  src,
  alt,
  aspectRatio = '4:3',
  className,
}: CardImageProps) {
  const aspectClasses = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '3:4': 'aspect-[3/4]',
  };

  return (
    <div className={cn('relative overflow-hidden', aspectClasses[aspectRatio], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

// =============================================================================
// Card Content
// =============================================================================

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function CardContent({
  children,
  className,
  centered = false,
}: CardContentProps) {
  return (
    <div className={cn('p-5', centered && 'text-center', className)}>
      {children}
    </div>
  );
}

// =============================================================================
// Card Title
// =============================================================================

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'h4';
}

export function CardTitle({
  children,
  className,
  as: Component = 'h3',
}: CardTitleProps) {
  return (
    <Component className={cn('font-semibold text-xl text-blue-800 mb-2', className)}>
      {children}
    </Component>
  );
}

// =============================================================================
// Card Description
// =============================================================================

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className,
}: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-sand-700 leading-relaxed', className)}>
      {children}
    </p>
  );
}

// =============================================================================
// Feature Card (for "What We Do" section)
// =============================================================================

export interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  image,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card as="article" className={cn('group', className)}>
      <CardImage src={image} alt={title} aspectRatio="4:3" />
      <CardContent centered>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Link Card (clickable card)
// =============================================================================

export interface LinkCardProps extends CardProps {
  href: string;
}

export function LinkCard({
  children,
  href,
  className,
  ...props
}: LinkCardProps) {
  return (
    <Link href={href} className="block group">
      <Card className={className} {...props}>
        {children}
      </Card>
    </Link>
  );
}
