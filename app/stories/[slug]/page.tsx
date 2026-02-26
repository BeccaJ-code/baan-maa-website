import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await prisma.successStory.findUnique({
    where: { slug },
  });

  if (!story) {
    return { title: 'Story Not Found' };
  }

  return {
    title: story.title,
    description: story.summary || `Read ${story.dogName}'s rescue story`,
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;

  const story = await prisma.successStory.findUnique({
    where: { slug, isPublished: true },
  });

  if (!story) {
    notFound();
  }

  const galleryImages = story.galleryImages
    ? JSON.parse(story.galleryImages) as string[]
    : [];

  // Get other stories for "More Stories" section
  const otherStories = await prisma.successStory.findMany({
    where: {
      isPublished: true,
      id: { not: story.id }
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      {/* Hero */}
      <Section background="blue-light" padding="md">
        <Container size="lg">
          <Link
            href="/stories"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Stories
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900">
            {story.title}
          </h1>
          {story.adoptedTo && (
            <p className="text-sand-700 mt-2">
              {story.dogName} now lives with {story.adoptedTo}
              {story.location && ` in ${story.location}`}
            </p>
          )}
        </Container>
      </Section>

      {/* Before/After Images */}
      <Section background="white" padding="md">
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {story.beforeImage && (
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={story.beforeImage}
                    alt={`${story.dogName} before rescue`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-red-500 text-white font-semibold px-3 py-1 rounded-full text-sm">
                  Before
                </div>
              </div>
            )}
            {story.afterImage && (
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={story.afterImage}
                    alt={`${story.dogName} after rescue`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white font-semibold px-3 py-1 rounded-full text-sm">
                  After
                </div>
              </div>
            )}
          </div>

          {/* Story Content */}
          <div className="max-w-3xl mx-auto">
            <div className="space-y-5 text-lg text-sand-800 leading-relaxed">
              {story.content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Adoption Info */}
            {story.adoptedDate && (
              <div className="mt-8 p-6 bg-teal-50 rounded-xl border border-teal-100">
                <h3 className="font-display font-bold text-teal-800 mb-2">
                  Happy Ending
                </h3>
                <p className="text-teal-700">
                  {story.dogName} was adopted on {new Date(story.adoptedDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                  {story.adoptedTo && ` by ${story.adoptedTo}`}
                  {story.location && ` and now lives in ${story.location}`}.
                </p>
              </div>
            )}
          </div>

          {/* Gallery */}
          {galleryImages.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl font-bold text-blue-900 mb-6 text-center">
                More Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${story.dogName} photo ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Share & CTA */}
      <Section background="sand" padding="md">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl font-bold text-blue-900 mb-4">
            Share {story.dogName}&apos;s Story
          </h2>
          <p className="text-sand-700 mb-6">
            Help us spread the word about the amazing transformations happening at Baan Maa.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <ShareButton platform="facebook" url={`/stories/${story.slug}`} title={story.title} />
            <ShareButton platform="twitter" url={`/stories/${story.slug}`} title={story.title} />
            <ShareButton platform="whatsapp" url={`/stories/${story.slug}`} title={story.title} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button>Help More Dogs Like {story.dogName}</Button>
            </Link>
            <Link href="/dogs">
              <Button variant="outline">Meet Dogs Waiting for Homes</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* More Stories */}
      {otherStories.length > 0 && (
        <Section background="white" padding="lg">
          <Container size="xl">
            <h2 className="font-display text-2xl font-bold text-blue-900 mb-8 text-center">
              More Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherStories.map((otherStory) => (
                <Link
                  key={otherStory.id}
                  href={`/stories/${otherStory.slug}`}
                  className="group bg-sand-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-2">
                    <div className="relative aspect-square">
                      {otherStory.beforeImage ? (
                        <Image
                          src={otherStory.beforeImage}
                          alt={`${otherStory.dogName} before`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-sand-200" />
                      )}
                    </div>
                    <div className="relative aspect-square">
                      {otherStory.afterImage ? (
                        <Image
                          src={otherStory.afterImage}
                          alt={`${otherStory.dogName} after`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-sand-200" />
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-blue-900 group-hover:text-teal-600 transition-colors">
                      {otherStory.dogName}
                    </h3>
                    <p className="text-sand-600 text-sm line-clamp-1">
                      {otherStory.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function ShareButton({
  platform,
  url,
  title
}: {
  platform: 'facebook' | 'twitter' | 'whatsapp';
  url: string;
  title: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || '';
  const fullUrl = `${baseUrl}${url}`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`,
  };

  const icons = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    whatsapp: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  };

  return (
    <a
      href={shareUrls[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
      aria-label={`Share on ${platform}`}
    >
      {icons[platform]}
    </a>
  );
}
