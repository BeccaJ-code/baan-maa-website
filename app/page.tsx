import Image from 'next/image';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button, FeatureCard } from '@/components/ui';
import DonationForm from '@/components/DonationForm';
import StoryCarousel, { type StoryData } from '@/components/StoryCarousel';
import { UrgentAppealsSection } from '@/components/UrgentAppeal';
import NewsletterSignup from '@/components/NewsletterSignup';
import prisma from '@/lib/prisma';

// =============================================================================
// Homepage
// =============================================================================

export default async function HomePage() {
  // Fetch published stories for the carousel
  const successStories = await prisma.successStory.findMany({
    where: { isPublished: true },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

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
      <section className="relative min-h-[90vh] flex items-center">
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
        <Container size="xl" className="relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="animate-fade-up">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Every Dog<br />
                Deserves Love.<br />
                <span className="text-teal-300">Not All Get It.</span>
              </h1>

              <p className="text-lg text-white/90 font-medium mb-4">
                We are the ONLY Outreach Dog Rescue Project in this region
              </p>

              <p className="text-white/80 mb-8">
                59/3 Moo 9 Tambon Thalaeng<br />
                Tha Yang, Phetchaburi 76130, Thailand
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
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
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

      {/* What We Do Section */}
      <Section background="blue" padding="md">
        <Container size="lg">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white text-center mb-12">
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
            <h2 className="font-display text-3xl md:text-4xl font-bold text-blue-700 mb-8 px-4">
              Who You&apos;ve Helped So Far...
            </h2>
            <StoryCarousel stories={stories} />
          </Container>
        </Section>
      )}

      {/* CTA Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center py-20 px-6">
        <Image
          src="/images/jake-recovery.webp"
          alt="Jake recovering at Baan Maa sanctuary"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/60" />

        <div className="relative z-10 max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                500+
              </div>
              <div className="text-sand-600">Dogs Rescued</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                200+
              </div>
              <div className="text-sand-600">Adoptions</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                50+
              </div>
              <div className="text-sand-600">Dogs in Care</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl font-bold text-teal-600 mb-2">
                10+
              </div>
              <div className="text-sand-600">Years of Rescue</div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Newsletter / Final CTA */}
      <Section background="blue-dark" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
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
