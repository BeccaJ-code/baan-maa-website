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
      {/* Hero */}
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Adopt a Dog
          </h1>
          <p className="text-lg text-white/90">
            Give a rescue dog the loving home they deserve. We facilitate adoptions
            locally in Thailand and internationally to Europe, the UK, and the US.
          </p>
        </Container>
      </Section>

      {/* Important Information */}
      <Section background="sand" padding="lg">
        <Container size="lg">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-blue-800 text-center mb-10">
            Important Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Where We Adopt To */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-xl font-bold text-blue-800 mb-3">
                  Where We Can Arrange Adoptions
                </h3>
                <p className="text-sand-700">
                  At this time, we can arrange adoptions to Europe, the United Kingdom,
                  the United States, or locally within Thailand.
                </p>
              </div>

              {/* Flexible Applications */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-xl font-bold text-blue-800 mb-3">
                  Flexible Adoption Applications
                </h3>
                <p className="text-sand-700">
                  We know finding the right match matters. If during the process we feel
                  another dog may be an even better fit for your home and lifestyle,
                  we&apos;ll contact you to discuss. Our priority is always the best outcome
                  for both you and the dog.
                </p>
              </div>

              {/* Process */}
              <div>
                <h3 className="font-display text-xl font-bold text-blue-800 mb-6">
                  The Adoption Process
                </h3>
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
            </div>

            {/* Right Column - Costs */}
            <div className="space-y-8">
              {/* Free Adoption */}
              <div className="bg-teal-50 rounded-xl p-6 border border-teal-200">
                <h3 className="font-display text-xl font-bold text-teal-800 mb-3">
                  Adoption Is Always Free
                </h3>
                <p className="text-teal-700 mb-4">
                  Adopting a dog from Baan Maa is always free &mdash; we never charge an adoption
                  fee for our dogs. The only costs involved are those needed to prepare the
                  dog for travel and the travel itself.
                </p>
                <ul className="text-teal-700 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0">Local:</span>
                    We simply ask that you cover the travel cost. If you collect the dog
                    in person, there are no costs whatsoever.
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold shrink-0">International:</span>
                    Adopters are asked to cover the dog&apos;s travel, tests, and paperwork.
                  </li>
                </ul>
              </div>

              {/* International Costs */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-xl font-bold text-blue-800 mb-3">
                  International Adoption Costs
                </h3>
                <p className="text-sand-700 mb-4">
                  Adopting a dog internationally from Thailand typically costs between
                  <span className="font-bold text-blue-800"> £1,500 and £3,000</span>, depending on:
                </p>
                <ul className="text-sand-700 space-y-1 mb-4">
                  <li>• Destination country</li>
                  <li>• Weight of the dog</li>
                  <li>• Airline used</li>
                </ul>
                <p className="text-sand-600 text-sm">
                  We are committed to complete transparency and will notify you immediately
                  if there are any changes to the costs.
                </p>
              </div>

              {/* Deposit */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-display text-xl font-bold text-blue-800 mb-3">
                  Deposit &amp; Final Payment
                </h3>
                <p className="text-sand-700 mb-4">
                  A <span className="font-bold text-blue-800">£400 deposit</span> is required
                  once your application is successful. This covers:
                </p>
                <ul className="text-sand-700 space-y-1 mb-4">
                  <li>• Living arrangements until departure</li>
                  <li>• Vaccinations</li>
                  <li>• Required paperwork</li>
                </ul>
                <p className="text-sand-700 mb-3">
                  The remaining balance covers:
                </p>
                <ul className="text-sand-700 space-y-1 mb-4">
                  <li>• Travel crate</li>
                  <li>• Transportation to Bangkok (dogs stay 2&ndash;3 nights for a final vet visit and flight certificate)</li>
                  <li>• Flight to their forever home</li>
                </ul>
                <div className="bg-sand-50 rounded-lg p-4 border border-sand-200">
                  <p className="text-sand-700 text-sm">
                    <strong>Please note:</strong> These payments do not go to Baan Maa as profit.
                    They only cover the actual costs of preparing and transporting your new
                    family member safely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
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
