import Image from 'next/image';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Success Stories',
  description: 'Read heartwarming stories of rescued dogs who found their forever homes. Every dog deserves a second chance.',
};

export default async function StoriesPage() {
  const stories = await prisma.successStory.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });

  const featuredStory = stories.find(s => s.isFeatured);
  const otherStories = stories.filter(s => !s.isFeatured);

  return (
    <>
      {/* Hero Section */}
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Success Stories
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Every rescue has a story. These dogs went from struggle to safety,
            and many have found loving forever homes around the world.
          </p>
        </Container>
      </Section>

      {/* Featured Story */}
      {featuredStory && (
        <Section background="white" padding="lg">
          <Container size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="grid grid-cols-2 gap-4">
                {featuredStory.beforeImage && (
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={featuredStory.beforeImage}
                      alt={`${featuredStory.dogName} before rescue`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Before
                    </div>
                  </div>
                )}
                {featuredStory.afterImage && (
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={featuredStory.afterImage}
                      alt={`${featuredStory.dogName} after rescue`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      After
                    </div>
                  </div>
                )}
              </div>
              <div>
                <span className="inline-block bg-teal-100 text-teal-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
                  Featured Story
                </span>
                <h2 className="font-display text-3xl font-bold text-blue-900 mb-4">
                  {featuredStory.title}
                </h2>
                <p className="text-sand-700 text-lg mb-4">
                  {featuredStory.summary}
                </p>
                {featuredStory.adoptedTo && (
                  <p className="text-sand-600 mb-6">
                    <span className="font-medium">Now living with:</span> {featuredStory.adoptedTo}
                    {featuredStory.location && ` in ${featuredStory.location}`}
                  </p>
                )}
                <Link href={`/stories/${featuredStory.slug}`}>
                  <Button>Read Full Story</Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* All Stories Grid */}
      <Section background="sand" padding="lg">
        <Container size="xl">
          <h2 className="font-display text-2xl font-bold text-blue-900 mb-8 text-center">
            More Happy Endings
          </h2>

          {otherStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sand-600 mb-4">
                We&apos;re working on sharing our success stories. Check back soon!
              </p>
              <Link href="/dogs">
                <Button variant="outline">Meet Our Dogs</Button>
              </Link>
            </div>
          ) : null}
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Help Write More Happy Endings
          </h2>
          <p className="text-white/90 mb-8">
            Every donation helps us rescue, rehabilitate, and rehome more dogs in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" variant="secondary">Donate Now</Button>
            </Link>
            <Link href="/dogs">
              <Button size="lg" variant="outline">Adopt a Dog</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

interface Story {
  id: string;
  slug: string;
  dogName: string;
  title: string;
  summary: string | null;
  beforeImage: string | null;
  afterImage: string | null;
  adoptedTo: string | null;
  location: string | null;
}

function StoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.slug}`} className="group">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="grid grid-cols-2">
          <div className="relative aspect-square">
            {story.beforeImage ? (
              <Image
                src={story.beforeImage}
                alt={`${story.dogName} before`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-sand-200 flex items-center justify-center">
                <span className="text-sand-400">Before</span>
              </div>
            )}
            <div className="absolute bottom-1 left-1 bg-red-500/90 text-white text-xs px-1.5 py-0.5 rounded">
              Before
            </div>
          </div>
          <div className="relative aspect-square">
            {story.afterImage ? (
              <Image
                src={story.afterImage}
                alt={`${story.dogName} after`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-sand-200 flex items-center justify-center">
                <span className="text-sand-400">After</span>
              </div>
            )}
            <div className="absolute bottom-1 left-1 bg-green-500/90 text-white text-xs px-1.5 py-0.5 rounded">
              After
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-display font-bold text-blue-900 mb-1 group-hover:text-teal-600 transition-colors">
            {story.dogName}
          </h3>
          <p className="text-sand-600 text-sm line-clamp-2 mb-2">
            {story.summary || story.title}
          </p>
          {story.location && (
            <p className="text-xs text-sand-500">
              Now in {story.location}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
