import { Suspense } from 'react';
import { Container, Section } from '@/components/layout';
import SponsorDogSelector from '@/components/SponsorDogSelector';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsor a Dog',
  description: 'Sponsor a rescue dog at Baan Maa. Your monthly donation provides food, shelter, and medical care.',
};

export default async function SponsorshipPage() {
  const sponsorableDogs = await prisma.dog.findMany({
    where: {
      status: { in: ['AVAILABLE', 'SPONSORED', 'FOSTERED', 'MEDICAL'] },
      sponsorshipGoal: { not: null },
    },
    orderBy: { sponsorshipTotal: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      featuredImage: true,
      sponsorshipGoal: true,
    },
  });

  return (
    <>
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Sponsor a Dog
          </h1>
          <p className="text-lg text-white/90">
            Not everyone can adopt, but you can still change a dog&apos;s life.
            Monthly sponsorships provide ongoing care for our rescue dogs.
          </p>
        </Container>
      </Section>

      <Section background="sand" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-blue-800 mb-6">
                What Sponsorship Provides
              </h2>

              <div className="space-y-4 mb-8">
                <SponsorshipBenefit icon="🍖" title="Daily Food">
                  Nutritious meals to keep your sponsored dog healthy and happy
                </SponsorshipBenefit>
                <SponsorshipBenefit icon="🏠" title="Safe Shelter">
                  A clean, comfortable space in our sanctuary
                </SponsorshipBenefit>
                <SponsorshipBenefit icon="💊" title="Medical Care">
                  Regular check-ups, vaccinations, and any needed treatments
                </SponsorshipBenefit>
                <SponsorshipBenefit icon="❤️" title="Love & Attention">
                  Daily care, exercise, and socialisation from our team
                </SponsorshipBenefit>
              </div>

              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 mb-4">Sponsor Benefits</h3>
                <ul className="space-y-2 text-sand-700">
                  <li className="flex gap-2">
                    <span className="text-teal-600">✓</span>
                    Regular photo and video updates
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-600">✓</span>
                    Personalised sponsor certificate
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-600">✓</span>
                    Monthly email newsletter
                  </li>
                  <li className="flex gap-2">
                    <span className="text-teal-600">✓</span>
                    Visit your sponsored dog in Thailand
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <Suspense fallback={
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-pulse">
                  <div className="h-8 bg-sand-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-sand-200 rounded w-full mb-6" />
                  <div className="h-14 bg-sand-100 rounded-xl" />
                </div>
              }>
                <SponsorDogSelector dogs={sponsorableDogs} />
              </Suspense>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function SponsorshipBenefit({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 items-start">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-blue-800">{title}</h3>
        <p className="text-sand-700">{children}</p>
      </div>
    </div>
  );
}
