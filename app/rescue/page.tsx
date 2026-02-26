import Image from 'next/image';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Rescue',
  description: 'Learn about Baan Maa Dog Rescue and our mission to save street dogs in Thailand.',
};

export default function RescuePage() {
  return (
    <>
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            About Our Rescue
          </h1>
          <p className="text-lg text-white/90">
            We are the only dog rescue operating in Tha Yang, Phetchaburi, Thailand.
            Every day, we work to save lives and give street dogs a second chance.
          </p>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold text-blue-800 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-sand-700 leading-relaxed">
                <p>
                  Baan Maa Dog Rescue was founded by Becca and Jok, who have dedicated
                  over a decade to rescuing and rehabilitating street dogs in rural Thailand.
                </p>
                <p>
                  What started as helping a few dogs in their neighbourhood has grown into
                  a full sanctuary caring for over 50 dogs at any given time.
                </p>
                <p>
                  &quot;Baan Maa&quot; means &quot;Dog House&quot; in Thai, and that&apos;s exactly what
                  we provide - a safe home for dogs who have known nothing but hardship.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-sand-200">
              <div className="w-full h-full flex items-center justify-center text-sand-400">
                [Founders photo]
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="sand" padding="lg">
        <Container size="lg">
          <h2 className="font-display text-3xl font-bold text-blue-800 text-center mb-8 md:mb-12">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              title="Rescue"
              description="We respond to calls about injured, abandoned, and at-risk dogs throughout Phetchaburi province."
            />
            <ServiceCard
              title="Medical Care"
              description="Every dog receives vaccinations, sterilisation, and any medical treatment they need."
            />
            <ServiceCard
              title="Rehabilitation"
              description="Dogs who have experienced trauma receive the time and care they need to heal."
            />
            <ServiceCard
              title="Rehoming"
              description="We find loving forever homes for our dogs, both locally and internationally."
            />
          </div>
        </Container>
      </Section>

      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-6">
            The Problem We Face
          </h2>
          <div className="space-y-4 text-white/90">
            <p>
              Thailand has an estimated 8 million street dogs. Many suffer from
              malnutrition, disease, and abuse. Government resources are limited,
              and most dogs receive no help at all.
            </p>
            <p>
              In our region of Phetchaburi, we are the only organisation responding
              to dogs in need. Without us, these dogs have no one.
            </p>
          </div>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container size="lg">
          <h2 className="font-display text-3xl font-bold text-blue-800 text-center mb-8 md:mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
            <Stat number="500+" label="Dogs Rescued" />
            <Stat number="200+" label="Successful Adoptions" />
            <Stat number="1,000+" label="Dogs Sterilised" />
            <Stat number="50+" label="Dogs Currently in Care" />
          </div>
        </Container>
      </Section>

      <Section background="blue-dark" padding="lg">
        <Container size="md" className="text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Join Our Mission
          </h2>
          <p className="text-white/80 mb-8">
            Every dog we save is thanks to people like you. Together, we can make
            a difference in the lives of Thailand&apos;s street dogs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg">Donate Now</Button>
            </Link>
            <Link href="/dogs">
              <Button variant="outline" size="lg">Meet Our Dogs</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

function ServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <h3 className="font-semibold text-lg text-blue-800 mb-2">{title}</h3>
      <p className="text-sand-700 text-sm">{description}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl font-bold text-teal-600 mb-2">{number}</div>
      <div className="text-sand-600">{label}</div>
    </div>
  );
}
