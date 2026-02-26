'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// =============================================================================
// Story Carousel Component
// =============================================================================

export interface StoryData {
  id: string;
  slug: string;
  name: string;
  images: string[];
  beforeStory: string;
  afterStory: string;
}

export interface StoryCarouselProps {
  stories: StoryData[];
  className?: string;
}

export default function StoryCarousel({ stories, className }: StoryCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll state
  const checkScrollState = useCallback(() => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Initialize scroll state
  useEffect(() => {
    checkScrollState();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollState);
      return () => carousel.removeEventListener('scroll', checkScrollState);
    }
  }, [checkScrollState]);

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const cards = carouselRef.current.children;
    if (cards[index]) {
      (cards[index] as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
      setActiveIndex(index);
    }
  };

  // Scroll navigation
  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Update active index on scroll
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const newIndex = Math.round(scrollLeft / (clientWidth * 0.85));
    setActiveIndex(Math.min(newIndex, stories.length - 1));
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [stories.length]);

  if (stories.length === 0) return null;

  return (
    <div className={cn('relative', className)}>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mb-4 scrollbar-hide"
      >
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Navigation Buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                     w-12 h-12 bg-white rounded-full shadow-lg
                     flex items-center justify-center
                     hover:shadow-xl transition-shadow
                     focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Previous story"
        >
          <ChevronLeftIcon />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
                     w-12 h-12 bg-white rounded-full shadow-lg
                     flex items-center justify-center
                     hover:shadow-xl transition-shadow
                     focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Next story"
        >
          <ChevronRightIcon />
        </button>
      )}

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={cn(
              'h-2.5 rounded-full transition-all',
              activeIndex === index
                ? 'bg-teal-600 w-8'
                : 'bg-sand-300 hover:bg-sand-400 w-2.5'
            )}
            aria-label={`Go to story ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Story Card
// =============================================================================

function StoryCard({ story }: { story: StoryData }) {
  return (
    <article className="snap-start shrink-0 w-[85vw] md:w-[600px] lg:w-[800px]">
      <div className="bg-blue-50 rounded-2xl p-6 h-full flex flex-col gap-4">
        {/* Images side by side */}
        <div className="grid grid-cols-2 gap-3">
          {story.images.slice(0, 2).map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`${story.name} ${index === 0 ? 'before' : 'after'}`}
                fill
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded">
                {index === 0 ? 'Before' : 'After'}
              </span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div>
          <h3 className="font-display text-2xl font-bold text-blue-700 mb-2">
            {story.name}&apos;s Story
          </h3>
          <p className="text-sand-800 leading-relaxed">{story.beforeStory}</p>
          {story.afterStory && (
            <p className="text-blue-700 font-medium mt-2">{story.afterStory}</p>
          )}
          <Link
            href={`/stories/${story.slug}`}
            className="inline-flex items-center gap-1 mt-3 text-teal-600 font-medium hover:text-teal-700 transition-colors"
          >
            Read more
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

// =============================================================================
// Icons
// =============================================================================

function ChevronLeftIcon() {
  return (
    <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
