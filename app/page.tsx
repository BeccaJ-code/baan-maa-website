import Image from 'next/image';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button, FeatureCard } from '@/components/ui';
import DonationForm from '@/components/DonationForm';
import StoryCarousel, { type StoryData } from '@/components/StoryCarousel';
import { UrgentAppealsSection } from '@/components/UrgentAppeal';
import NewsletterSignup from '@/components/NewsletterSignup';
import prisma from '@/lib/prisma';
import { cn } from '@/lib/utils';

// =============================================================================
// Homepage
// =============================================================================

export default async function HomePage() {
  // Fetch upcoming published events (gracefully handle missing table)
  let upcomingEvents: Array<{
    id: string;
    slug: string;
    title: string;
    description: string | null;
    date: Date;
    endDate: Date | null;
    location: string | null;
    isOnline: boolean;
    featuredImage: string | null;
  }> = [];
  try {
    upcomingEvents = await prisma.event.findMany({
      where: {
        isPublished: true,
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 3,
    });
  } catch {
    // Events table may not exist in production yet
  }

  // Fetch published stories for the carousel
  let successStories: Awaited<ReturnType<typeof prisma.successStory.findMany>> = [];
  try {
    successStories = await prisma.successStory.findMany({
      where: { isPublished: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    // Gracefully handle missing table
  }

  // Transform to story data
  const stories: StoryData[] = successStories.map(story => ({
    id: story.id,
    slug: story.slug,
    name: story.dogName,
    images: [story.beforeImage, story.afterImage].filter(Boolean) as string[],
    beforeStory: story.summary || '',
    afterStory: '',
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-homepage.webp"
            alt="Dogs at Baan Maa sanctuary"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-blue-800/70 to-blue-700/50" />
        </div>

        {/* Content */}
        <Container size="xl" className="relative z-10 py-10 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text Content */}
            <div className="animate-fade-up">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 md:mb-6">
                Every Dog<br />
                Deserves Love.<br />
                <span className="text-teal-300">Not All Get It.</span>
              </h1>

              <p className="text-lg text-white/90 font-medium mb-4">
                We are the ONLY Outreach Dog Rescue Project in this region
              </p>

<Link href="/sponsorship">
                <Button size="lg">
                  Sponsor a dog today
                </Button>
              </Link>
            </div>

            {/* Right: Donation Form */}
            <div className="animate-modal-in stagger-2">
              <DonationForm />
            </div>
          </div>
        </Container>
      </section>

      {/* About Section */}
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8">
            About Baan Maa Dog Rescue
          </h2>
          <div className="space-y-6 text-lg text-white/90 leading-relaxed">
            <p>
              We are the ONLY Dog Rescue operating in Thayang, Phetchaburi, Thailand.
              Our co-founders Becca and Jok have over a decade of experience rescuing
              and rehabilitating street dogs.
            </p>
            <p>
              From our sanctuary in rural Thailand, we provide emergency medical care,
              daily feeding programmes, and facilitate local and international adoptions
              to loving homes all over the world.
            </p>
            <p className="font-medium text-white">
              Every dog deserves a chance. Your donation makes that chance possible.
            </p>
          </div>
        </Container>
      </Section>

      {/* Featured Events */}
      {upcomingEvents.length > 0 && (
        <Section background="sand" padding="md">
          <Container size="lg">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 text-center mb-8">
              Upcoming Events
            </h2>
            <div className={cn(
              'grid gap-6',
              upcomingEvents.length === 1
                ? 'grid-cols-1 max-w-lg mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            )}>
              {upcomingEvents.map(event => {
                const eventDate = new Date(event.date);
                const month = eventDate.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
                const day = eventDate.getDate();
                const timeStr = eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
                const endDateStr = event.endDate
                  ? ` – ${new Date(event.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                  : '';

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {event.featuredImage && (
                      <div className="relative aspect-[2/1]">
                        <Image
                          src={event.featuredImage}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5 flex gap-4">
                      {/* Date badge */}
                      <div className="shrink-0 w-14 h-14 bg-teal-50 rounded-lg flex flex-col items-center justify-center border border-teal-200">
                        <span className="text-xs font-bold text-teal-700 leading-none">{month}</span>
                        <span className="text-xl font-bold text-teal-800 leading-tight">{day}</span>
                      </div>
                      {/* Details */}
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-lg text-blue-800 mb-1 truncate group-hover:text-teal-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sand-600 text-sm flex items-center gap-1.5 mb-1">
                          <CalendarSmallIcon />
                          {eventDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {endDateStr} · {timeStr}
                        </p>
                        {(event.location || event.isOnline) && (
                          <p className="text-sand-600 text-sm flex items-center gap-1.5">
                            <LocationSmallIcon />
                            {event.isOnline ? 'Online Event' : event.location}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-sand-700 text-sm mt-2 line-clamp-2">
                            {event.description.replace(/<[^>]*>/g, '')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </Section>
      )}

      {/* What We Do Section */}
      <Section background="blue" padding="md">
        <Container size="lg">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">
            What We Do
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              image="/images/features/rescue-card.webp"
              title="Rescue"
              description="Every day, our small team responds to calls for help from dogs in distress. From busy roads to temple grounds, we bring them to safety and give them their first real chance at care and comfort."
            />
            <FeatureCard
              image="/images/features/medical-card.webp"
              title="Medical"
              description="At Baan Maa, every dog receives the treatment they need to heal: vaccinations, sterilisation, surgery, or just the patience to recover from trauma. Our trusted local vets work closely with us to make sure no dog is left to suffer."
            />
            <FeatureCard
              image="/images/features/adoption.webp"
              title="Adoption"
              description="When our dogs are healthy, confident, and ready for the next chapter, we help them find homes both in Thailand and overseas. From Phetchaburi to Scotland, our adopters become part of the Baan Maa family."
            />
          </div>
        </Container>
      </Section>

      {/* Urgent Appeals */}
      <UrgentAppealsSection />

      {/* Stories Carousel */}
      {stories.length > 0 && (
        <Section background="sand" padding="lg">
          <Container size="full">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-6 md:mb-8 px-4">
              Who You&apos;ve Helped So Far...
            </h2>
            <StoryCarousel stories={stories} />
          </Container>
        </Section>
      )}

      {/* CTA Section */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center py-12 md:py-20 px-5">
        <Image
          src="/images/jake-recovery.webp"
          alt="Jake recovering at Baan Maa sanctuary"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/60" />

        <div className="relative z-10 max-w-3xl text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            We can&apos;t save every dog in Thailand, but for the ones we reach,
            your kindness changes everything
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Make a lasting difference today!
          </p>
          <Link href="/donate">
            <Button variant="secondary" size="lg">
              Sponsor a rescue today
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <Section background="white" padding="md">
        <Container size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <div>
              <div className="font-display text-3xl md:text-5xl font-bold text-teal-600 mb-1 md:mb-2">
                500+
              </div>
              <div className="text-sand-600 text-sm md:text-base">Dogs Rescued</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-5xl font-bold text-teal-600 mb-1 md:mb-2">
                200+
              </div>
              <div className="text-sand-600 text-sm md:text-base">Adoptions</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-5xl font-bold text-teal-600 mb-1 md:mb-2">
                50+
              </div>
              <div className="text-sand-600 text-sm md:text-base">Dogs in Care</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-5xl font-bold text-teal-600 mb-1 md:mb-2">
                10+
              </div>
              <div className="text-sand-600 text-sm md:text-base">Years of Rescue</div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Newsletter / Final CTA */}
      <Section background="blue-dark" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Every donation, no matter how small, helps us save more lives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/donate">
                  <Button size="lg">
                    Donate Now
                  </Button>
                </Link>
                <Link href="/dogs">
                  <Button variant="outline" size="lg">
                    Meet Our Dogs
                  </Button>
                </Link>
              </div>
            </div>
            <NewsletterSignup source="homepage" />
          </div>
        </Container>
      </Section>
    </>
  );
}

// =============================================================================
// Small Icons for Event Cards
// =============================================================================

function CalendarSmallIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function LocationSmallIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
