import { Container, Section } from '@/components/layout';
import DonationForm from '@/components/DonationForm';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Make a donation to Baan Maa Dog Rescue. Your support helps us rescue, rehabilitate, and rehome street dogs in Thailand.',
};

// =============================================================================
// Donate Page
// =============================================================================

export default async function DonatePage() {
  // Fetch active priority projects
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: [{ isPriority: 'desc' }, { createdAt: 'desc' }],
    take: 3,
  });

  return (
    <>
      {/* Hero */}
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Make a Donation
          </h1>
          <p className="text-lg text-white/90">
            Your generosity directly funds rescue operations, medical care, food, and shelter
            for dogs in need. Every donation makes a difference.
          </p>
        </Container>
      </Section>

      {/* Donation Form */}
      <Section background="sand" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form */}
            <div>
              <DonationForm
                config={{
                  title: 'Save a Life Today',
                  description: 'Choose your donation amount and frequency.',
                  oneTimeAvailable: true,
                  monthlyAvailable: true,
                  defaultType: 'once',
                  allowCustomAmount: true,
                  presetAmounts: [
                    { amount: 25, label: 'Feeds 5 dogs' },
                    { amount: 50, label: 'Medical care' },
                    { amount: 100, label: 'Emergency surgery' },
                    { amount: 250, label: 'Full rehabilitation' },
                    { amount: 500, label: 'Save multiple dogs' },
                    { amount: 1000, label: 'Sponsor our shelter' },
                  ],
                }}
              />
            </div>

            {/* Impact Info */}
            <div className="lg:pt-8">
              <h2 className="font-display text-2xl font-bold text-blue-800 mb-6">
                Where Your Money Goes
              </h2>

              <div className="space-y-4">
                <ImpactItem
                  amount="£25"
                  impact="Feeds 5 dogs for a week with nutritious food"
                />
                <ImpactItem
                  amount="£50"
                  impact="Provides vaccinations and basic medical care for one dog"
                />
                <ImpactItem
                  amount="£100"
                  impact="Funds emergency surgery to save a dog's life"
                />
                <ImpactItem
                  amount="£250"
                  impact="Covers full rehabilitation including surgery and recovery"
                />
                <ImpactItem
                  amount="£500"
                  impact="Saves multiple dogs from the streets and provides care"
                />
                <ImpactItem
                  amount="£1,000"
                  impact="Sponsors our shelter operations for a month"
                />
              </div>

              <div className="mt-8 p-6 bg-white rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-2">100% Goes to the Dogs</h3>
                <p className="text-sand-700 text-sm">
                  We are a volunteer-run organisation. Every penny you donate goes directly
                  to dog care, medical treatment, and rescue operations. We maintain full
                  financial transparency and publish regular updates on how funds are used.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Current Projects */}
      {projects.length > 0 && (
        <Section background="white" padding="md">
          <Container size="lg">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-blue-800 text-center mb-8">
              Current Fundraising Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-sand-50 rounded-xl p-6">
                  <h3 className="font-semibold text-lg text-blue-800 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-sand-700 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  {project.goalAmount && (
                    <>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-sand-600">Raised</span>
                        <span className="font-semibold text-teal-700">
                          £{project.raisedAmount.toLocaleString()} / £{project.goalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-sand-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full"
                          style={{ width: `${Math.min((project.raisedAmount / project.goalAmount) * 100, 100)}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <a
                href="/projects"
                className="text-teal-600 hover:text-teal-700 font-medium"
              >
                View all projects →
              </a>
            </div>
          </Container>
        </Section>
      )}

      {/* Other Ways to Help */}
      <Section background="blue" padding="md">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-4">
            Other Ways to Help
          </h2>
          <p className="text-white/80 mb-6">
            Can&apos;t donate right now? There are other ways to support our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/sponsorship" className="inline-block">
              <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg transition-all hover:-translate-y-0.5">
                Sponsor a Dog
              </button>
            </a>
            <a href="/volunteering" className="inline-block">
              <button className="bg-transparent text-white border-2 border-white font-semibold px-6 py-3 rounded-lg transition-all hover:bg-white/10">
                Volunteer
              </button>
            </a>
          </div>
        </Container>
      </Section>
    </>
  );
}

// =============================================================================
// Impact Item
// =============================================================================

function ImpactItem({ amount, impact }: { amount: string; impact: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-16 shrink-0 font-bold text-teal-600">{amount}</div>
      <div className="text-sand-700">{impact}</div>
    </div>
  );
}
