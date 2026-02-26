import { Suspense } from 'react';
import { Container, Section } from '@/components/layout';
import DogCard, { DogGrid } from '@/components/DogCard';
import DogFilters from '@/components/DogFilters';
import prisma from '@/lib/prisma';
import { parseJSON } from '@/lib/utils';
import type { Metadata } from 'next';

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Our Dogs',
  description: 'Meet the rescue dogs at Baan Maa looking for their forever homes. Filter by size, compatibility, and more.',
};

// =============================================================================
// Dogs Page
// =============================================================================

interface DogsPageProps {
  searchParams: Promise<{
    status?: string;
    size?: string;
    sex?: string;
    compat?: string;
  }>;
}

export default async function DogsPage({ searchParams }: DogsPageProps) {
  const params = await searchParams;

  // Build filter conditions
  const where: Record<string, unknown> = {};

  // Status filter
  if (params.status) {
    const statuses = params.status.split(',');
    where.status = { in: statuses };
  } else {
    // Default: show available, sponsored, and fostered dogs
    where.status = { in: ['AVAILABLE', 'SPONSORED', 'FOSTERED'] };
  }

  // Size filter
  if (params.size) {
    const sizes = params.size.split(',');
    where.size = { in: sizes };
  }

  // Sex filter
  if (params.sex) {
    where.sex = params.sex;
  }

  // Compatibility filters
  if (params.compat) {
    const compatFilters = params.compat.split(',');
    if (compatFilters.includes('kids')) where.goodWithKids = true;
    if (compatFilters.includes('dogs')) where.goodWithDogs = true;
    if (compatFilters.includes('cats')) where.goodWithCats = true;
  }

  // Fetch dogs
  const dogs = await prisma.dog.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  // Transform for display
  const displayDogs = dogs.map(dog => ({
    ...dog,
    traits: parseJSON<string[]>(dog.traits, []),
    images: parseJSON<string[]>(dog.images, []),
  }));

  return (
    <>
      {/* Hero */}
      <Section background="blue" padding="md">
        <Container size="lg" className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Our Dogs
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Meet the rescue dogs currently in our care. Each one has a unique story
            and is waiting for their forever home.
          </p>
        </Container>
      </Section>

      {/* Filters & Grid */}
      <Section background="sand" padding="md">
        <Container size="xl">
          {/* Filters */}
          <Suspense fallback={<div className="h-12 bg-sand-200 rounded animate-pulse" />}>
            <DogFilters className="mb-8" />
          </Suspense>

          {/* Results count */}
          <p className="text-sand-600 mb-6">
            Showing {displayDogs.length} {displayDogs.length === 1 ? 'dog' : 'dogs'}
          </p>

          {/* Dog Grid */}
          <DogGrid dogs={displayDogs} />
        </Container>
      </Section>

      {/* CTA */}
      <Section background="blue-dark" padding="md">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            Can&apos;t Adopt Right Now?
          </h2>
          <p className="text-white/80 mb-6">
            You can still help by sponsoring a dog&apos;s care or making a one-time donation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/sponsorship" className="inline-block">
              <button className="bg-teal-600 text-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 hover:bg-teal-700 hover:-translate-y-0.5">
                Sponsor a Dog
              </button>
            </a>
            <a href="/donate" className="inline-block">
              <button className="bg-transparent text-white border-2 border-white font-semibold px-7 py-3.5 rounded-lg transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5">
                Donate
              </button>
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}
