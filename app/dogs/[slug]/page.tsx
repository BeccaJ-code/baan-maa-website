import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/layout';
import { Button, Badge, StatusBadge } from '@/components/ui';
import AdoptionForm from '@/components/forms/AdoptionForm';
import ImageLightbox from '@/components/ImageLightbox';
import prisma from '@/lib/prisma';
import { parseJSON, formatDate } from '@/lib/utils';
import type { Metadata } from 'next';
import type { DogStatusType } from '@/components/ui/Badge';

// =============================================================================
// Metadata
// =============================================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dog = await prisma.dog.findUnique({ where: { slug } });

  if (!dog) {
    return { title: 'Dog Not Found' };
  }

  return {
    title: dog.name,
    description: dog.shortDescription || `Meet ${dog.name}, a rescue dog at Baan Maa looking for a forever home.`,
    openGraph: {
      images: dog.featuredImage ? [{ url: dog.featuredImage }] : undefined,
    },
  };
}

// =============================================================================
// Dog Profile Page
// =============================================================================

export default async function DogProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const dog = await prisma.dog.findUnique({
    where: { slug },
  });

  if (!dog) {
    notFound();
  }

  const traits = parseJSON<string[]>(dog.traits, []);
  const images = parseJSON<string[]>(dog.images, []);
  const allImages = dog.featuredImage
    ? [dog.featuredImage, ...images.filter(img => img !== dog.featuredImage)]
    : images;

  const isAvailable = dog.status === 'AVAILABLE';
  const canSponsor = ['AVAILABLE', 'SPONSORED', 'FOSTERED', 'MEDICAL'].includes(dog.status);

  return (
    <>
      {/* Hero with Image Gallery */}
      <Section background="sand" padding="md">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery with Lightbox */}
            <ImageLightbox images={allImages} alt={dog.name} />

            {/* Dog Info */}
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800">
                  {dog.name}
                </h1>
                <StatusBadge status={dog.status as DogStatusType} />
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-sand-700 mb-6">
                {dog.age && <span>{dog.age}</span>}
                {dog.sex && <span>{dog.sex === 'MALE' ? 'Male' : 'Female'}</span>}
                {dog.size && <span>{dog.size.charAt(0) + dog.size.slice(1).toLowerCase()}</span>}
                {dog.breed && <span>{dog.breed}</span>}
              </div>

              {/* Description */}
              {dog.shortDescription && (
                <p className="text-lg text-sand-800 mb-6">
                  {dog.shortDescription}
                </p>
              )}

              {/* Traits */}
              {traits.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {traits.map(trait => (
                    <Badge key={trait} variant="teal">
                      {trait}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Compatibility */}
              <div className="bg-white rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-800 mb-4">Compatibility</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <CompatibilityItem label="Children" value={dog.goodWithKids} />
                  <CompatibilityItem label="Dogs" value={dog.goodWithDogs} />
                  <CompatibilityItem label="Cats" value={dog.goodWithCats} />
                  <CompatibilityItem label="House trained" value={dog.houseTrained} />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isAvailable && (
                  <Link href="#adoption-form" className="flex-1">
                    <Button fullWidth size="lg">
                      Enquire About Adopting
                    </Button>
                  </Link>
                )}
                {canSponsor && (
                  <Link href={`/sponsorship?dog=${dog.slug}`} className="flex-1">
                    <Button variant={isAvailable ? 'secondary' : 'primary'} fullWidth size="lg">
                      Sponsor {dog.name}
                    </Button>
                  </Link>
                )}
              </div>

              {/* Sponsorship Progress */}
              {canSponsor && dog.sponsorshipGoal && (
                <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                  <div className="flex justify-between text-sm text-teal-800 mb-2">
                    <span>Monthly sponsorship</span>
                    <span>
                      £{dog.sponsorshipTotal} / £{dog.sponsorshipGoal}
                    </span>
                  </div>
                  <div className="h-2 bg-teal-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all"
                      style={{
                        width: `${Math.min((dog.sponsorshipTotal / dog.sponsorshipGoal) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Full Story */}
      {(dog.fullDescription || dog.rescueStory) && (
        <Section background="white" padding="md">
          <Container size="md">
            {dog.rescueStory && (
              <div className="mb-12">
                <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
                  {dog.name}&apos;s Rescue Story
                </h2>
                <p className="text-sand-700 leading-relaxed whitespace-pre-line">
                  {dog.rescueStory}
                </p>
              </div>
            )}

            {dog.fullDescription && (
              <div>
                <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
                  About {dog.name}
                </h2>
                <p className="text-sand-700 leading-relaxed whitespace-pre-line">
                  {dog.fullDescription}
                </p>
              </div>
            )}

            {dog.intakeDate && (
              <p className="mt-8 text-sm text-sand-500">
                At Baan Maa since {formatDate(dog.intakeDate)}
              </p>
            )}
          </Container>
        </Section>
      )}

      {/* Adoption Form */}
      {isAvailable && (
        <Section background="sand" padding="lg" id="adoption-form">
          <Container size="md">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-blue-800 text-center mb-8">
              Interested in Adopting {dog.name}?
            </h2>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
              <AdoptionForm dogId={dog.id} dogName={dog.name} />
            </div>
          </Container>
        </Section>
      )}

      {/* Back Link */}
      <Section background="white" padding="sm">
        <Container size="lg">
          <Link
            href="/dogs"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all dogs
          </Link>
        </Container>
      </Section>
    </>
  );
}

// =============================================================================
// Compatibility Item
// =============================================================================

function CompatibilityItem({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {value ? (
        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-sand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className={value ? 'text-sand-800' : 'text-sand-500'}>{label}</span>
    </div>
  );
}
