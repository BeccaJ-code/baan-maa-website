import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adopt a Dog',
  description: 'Learn about adopting a rescue dog from Baan Maa. We facilitate local and international adoptions to loving homes.',
};

export default function AdoptionPage() {
  return (
    <>
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Adopt a Dog
          </h1>
          <p className="text-lg text-white/90">
            Give a rescue dog the loving home they deserve. We facilitate adoptions
            both in Thailand and internationally.
          </p>
        </Container>
      </Section>

      <Section background="sand" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-blue-800 mb-6">
                The Adoption Process
              </h2>
              <div className="space-y-6">
                <ProcessStep number={1} title="Browse Our Dogs">
                  Start by looking through our available dogs. Each profile includes their
                  personality, compatibility, and story.
                </ProcessStep>
                <ProcessStep number={2} title="Submit an Application">
                  Found a dog you connect with? Complete our adoption application form
                  on their profile page.
                </ProcessStep>
                <ProcessStep number={3} title="Application Review">
                  Our team will review your application and contact you to discuss
                  your situation and answer questions.
                </ProcessStep>
                <ProcessStep number={4} title="Home Check">
                  For local adoptions, we conduct a home visit. For international adoptions,
                  we conduct a video call interview.
                </ProcessStep>
                <ProcessStep number={5} title="Welcome Home">
                  Once approved, we arrange the logistics. For international adoptions,
                  we handle all transport and documentation.
                </ProcessStep>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-blue-800 mb-6">
                Adoption Fees
              </h2>
              <div className="bg-white rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-800 mb-4">Local (Thailand)</h3>
                <p className="text-sand-700 mb-4">
                  All dogs are vaccinated, sterilised, and microchipped before adoption.
                </p>
                <p className="text-2xl font-bold text-teal-600">฿3,000 - ฿5,000</p>
                <p className="text-sm text-sand-600">(approximately £70 - £120)</p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-800 mb-4">International</h3>
                <p className="text-sand-700 mb-4">
                  Includes vaccinations, sterilisation, microchip, health certificate,
                  export documentation, and flight.
                </p>
                <p className="text-2xl font-bold text-teal-600">£800 - £1,200</p>
                <p className="text-sm text-sand-600">Varies by destination</p>
              </div>

              <div className="bg-teal-50 rounded-xl p-6">
                <h3 className="font-semibold text-teal-800 mb-2">What&apos;s Included</h3>
                <ul className="text-sm text-teal-700 space-y-1">
                  <li>✓ Full vaccination course</li>
                  <li>✓ Spay/neuter surgery</li>
                  <li>✓ Microchip registration</li>
                  <li>✓ Deworming & flea treatment</li>
                  <li>✓ Health certificate</li>
                  <li>✓ Post-adoption support</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="blue" padding="md">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-4">
            Ready to Find Your New Best Friend?
          </h2>
          <Link href="/dogs">
            <Button size="lg">
              Meet Our Dogs
            </Button>
          </Link>
        </Container>
      </Section>
    </>
  );
}

function ProcessStep({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-blue-800 mb-1">{title}</h3>
        <p className="text-sand-700">{children}</p>
      </div>
    </div>
  );
}
