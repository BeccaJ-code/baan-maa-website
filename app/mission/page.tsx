import Image from 'next/image';
import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Mission',
  description: 'Learn about Baan Maa Dog Rescue\'s mission to save street dogs in Thayang, Thailand. Every rescue begins with one call.',
};

export default function MissionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-blue-100" />
          <div className="relative hidden lg:block">
            <Image
              src="/images/mission/rescue-call.webp"
              alt="Rescue worker carrying an injured dog"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
        <Container size="xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="py-16 lg:py-24 lg:pr-12">
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
                Every Rescue Begins With One Call.
              </h1>
              <p className="text-lg md:text-xl text-sand-700 mb-4">
                When a dog is hurt, abandoned or forgotten, our small team in Thayang steps in to give them a second chance.
              </p>
              <p className="text-lg md:text-xl text-sand-700 mb-8">
                Every life we save starts the same way – with care and compassion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dogs">
                  <Button size="lg" variant="outline" className="!text-teal-600 !border-teal-600 hover:!bg-teal-600/10">See Dogs Ready for Adoption</Button>
                </Link>
                <Link href="/donate">
                  <Button size="lg">Support a Rescue Dog</Button>
                </Link>
              </div>
            </div>
            {/* Mobile image */}
            <div className="relative aspect-[4/3] lg:hidden rounded-2xl overflow-hidden">
              <Image
                src="/images/mission/rescue-call.webp"
                alt="Rescue worker carrying an injured dog"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* What Rescue Means */}
      <Section background="white" padding="lg">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/mission/jok-dog-rescue.jpg"
                alt="Rescuing an injured dog from the street"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-6">
                What Rescue Means
              </h2>
              <div className="space-y-4 text-sand-700 text-lg leading-relaxed">
                <p>
                  At Baan Maa, &apos;rescue&apos; means more than taking a dog off the street. It means stepping in when no one else can.
                </p>
                <p>
                  We take in injured and neglected dogs, treat emergency medical cases, and give long-term shelter to those who have nowhere else to go.
                </p>
                <p>
                  Most of our work happens here in Thayang, but sometimes our rescues reach across neighbouring provinces when the need is urgent.
                </p>
              </div>
              <blockquote className="mt-8 p-6 bg-blue-600 text-white rounded-xl">
                <p className="text-lg font-medium">
                  Every dog deserves safety, comfort and a chance to heal, no matter where they come from.
                </p>
              </blockquote>
            </div>
          </div>
        </Container>
      </Section>

      {/* How Rescue Happens */}
      <Section background="blue-light" padding="lg">
        <Container size="xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              How Rescue Happens
            </h2>
            <p className="text-lg text-sand-700 max-w-3xl mx-auto">
              Our rescues begin with a message, a call, or a post online. Locals contact us when they see a dog in need, and sometimes we find them ourselves.
            </p>
          </div>

          {/* Process Flow */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <ProcessStep icon={<PhoneIcon />} label="Call/Report" />
            <ProcessStep icon={<TruckIcon />} label="Pick Up" />
            <ProcessStep icon={<MedicalIcon />} label="Vet Care" />
            <ProcessStep icon={<HomeIcon />} label="Quarantine + Vaccinations" />
            <ProcessStep icon={<DogIcon />} label="Rehabilitation" />
          </div>

          {/* Outcomes */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
            <p className="text-sand-700 text-lg max-w-md text-center md:text-left">
              We can usually take in 5–10 rescues a month depending on space at our current shelter and available foster help.
            </p>
            <div className="flex gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <ReturnIcon className="w-12 h-12 mx-auto mb-2 text-blue-700" />
                <p className="text-sm font-semibold text-blue-900">Returned to<br />Rescue Point</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <AdoptedIcon className="w-12 h-12 mx-auto mb-2 text-blue-700" />
                <p className="text-sm font-semibold text-blue-900">Adopted</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* The Reality */}
      <Section background="white" padding="lg">
        <Container size="xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              The Reality
            </h2>
            <p className="text-lg text-sand-700 max-w-3xl mx-auto">
              Our rescued dogs often come from heartbreaking situations. Cost, space and distance are just some of the challenges that we face.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RealityCard
              title="Reasons for Rescue"
              description="Road accidents, parasites, dog fights and abuse are common causes."
              imagePlaceholder="rescue-reasons"
              imageSrc="/images/mission/jake-vet-treatment.jpg"
            />
            <RealityCard
              title="Biggest Challenges"
              description="Cost, space at Baan Maa's current location, distance, manpower"
              imagePlaceholder="challenges"
              imageSrc="/images/mission/the-reality.webp"
            />
            <RealityCard
              title="Saying No"
              description="Some cases are too far away, we have no room, or they are not ready for us to intervene"
              imagePlaceholder="saying-no"
              imageSrc="/images/mission/big-mama.webp"
            />
          </div>
        </Container>
      </Section>

      {/* The Transformation */}
      <Section background="sand" padding="lg">
        <Container size="xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              The Transformation
            </h2>
            <p className="text-lg text-sand-700 max-w-3xl mx-auto">
              After rescue, dogs are given the medical care they need and are prepared for adoption or, in some cases, sanctuary life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TransformCard
              title="Medical Care"
              description="We provide essential veterinary treatment from amputations and wound care to physiotherapy in partnership with trusted local clinics."
              imagePlaceholder="medical"
              imageSrc="/images/mission/medical-care.jpg"
            />
            <TransformCard
              title="Emotional Rehabilitation"
              description="Socialisation, leash training, and gentle behaviour work help each dog rebuild trust and confidence after trauma."
              imagePlaceholder="rehab"
              imageSrc="/images/mission/emotioanl-rehabilitation.jpg"
            />
            <TransformCard
              title="Finding Homes"
              description="When a dog is ready, we help them find a safe, loving home where they can truly belong."
              imagePlaceholder="homes"
              imageSrc="/images/mission/finding-homes.JPG"
            />
            <TransformCard
              title="Sanctuary Life"
              description="For some dogs, the best life means staying at Baan Maa or returning to their familiar community under our ongoing care."
              imagePlaceholder="sanctuary"
              imageSrc="/images/mission/sanctuary-life.jpg"
            />
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Be Part of Their Journey
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Every rescue, every recovery, every new beginning is made possible by supporters like you. Join us in giving street dogs the second chance they deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button size="lg" variant="secondary">Make a Donation</Button>
            </Link>
            <Link href="/sponsorship">
              <Button size="lg" variant="outline">Sponsor a Dog</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

// Process Step Component
function ProcessStep({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
      <div className="w-12 h-12 mx-auto mb-3 text-blue-700">
        {icon}
      </div>
      <p className="text-xs sm:text-sm font-semibold text-blue-900 uppercase tracking-wide">{label}</p>
    </div>
  );
}

// Reality Card Component
function RealityCard({ title, description, imagePlaceholder, imageSrc }: { title: string; description: string; imagePlaceholder: string; imageSrc?: string }) {
  return (
    <div className="text-center">
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-sand-200">
        {imageSrc ? (
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sand-400">
            [{imagePlaceholder}]
          </div>
        )}
      </div>
      <h3 className="font-display text-xl font-bold text-blue-900 mb-2">{title}</h3>
      <p className="text-sand-700">{description}</p>
    </div>
  );
}

// Transform Card Component
function TransformCard({ title, description, imagePlaceholder, imageSrc }: { title: string; description: string; imagePlaceholder: string; imageSrc?: string }) {
  return (
    <div className="text-center">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-sand-200">
        {imageSrc ? (
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sand-400">
            [{imagePlaceholder}]
          </div>
        )}
      </div>
      <h3 className="font-display text-lg font-bold text-blue-900 mb-2">{title}</h3>
      <p className="text-sand-600 text-sm">{description}</p>
    </div>
  );
}

// Icons
function PhoneIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      <path d="M7 12V9H4v3h3zm5 0V9H9v3h3z" opacity=".3"/>
    </svg>
  );
}

function MedicalIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2z"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      <circle cx="12" cy="10" r="1.5" opacity=".5"/>
    </svg>
  );
}

function DogIcon() {
  return (
    <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 4c-1 0-2 .5-2.5 1L14 7h-4L8.5 5C8 4.5 7 4 6 4 3.8 4 2 5.8 2 8c0 1.5.8 2.8 2 3.5V18c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1h4v1c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-6.5c1.2-.7 2-2 2-3.5 0-2.2-1.8-4-4-4zM8 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm8 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
    </svg>
  );
}

function ReturnIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      <path d="M7 12l3-3v2h4v2h-4v2l-3-3z"/>
    </svg>
  );
}

function AdoptedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      <path d="M12 8c-1.1 0-2 .9-2 2v2h4v-2c0-1.1-.9-2-2-2z" opacity=".5"/>
    </svg>
  );
}
