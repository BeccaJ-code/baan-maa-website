import { Container, Section } from '@/components/layout';
import VolunteerForm from '@/components/forms/VolunteerForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Volunteer',
  description: 'Volunteer with Baan Maa Dog Rescue. Help on-site in Thailand or support remotely.',
};

export default function VolunteeringPage() {
  return (
    <>
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Volunteer With Us
          </h1>
          <p className="text-lg text-white/90">
            Make a real difference in the lives of rescue dogs. Whether you can visit
            us in Thailand or help from home, we need you!
          </p>
        </Container>
      </Section>

      <Section background="sand" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h2 className="font-display text-2xl font-bold text-blue-800 mb-6">
                Ways to Volunteer
              </h2>

              <div className="space-y-6">
                <VolunteerType
                  title="On-Site in Thailand"
                  description="Join us at the sanctuary! Help with daily care, feeding, walking, socialisation, and more. Minimum stay of 2 weeks recommended."
                  items={['Dog walking & exercise', 'Feeding & cleaning', 'Socialisation', 'Medical assistance']}
                />

                <VolunteerType
                  title="Remote Support"
                  description="Help from anywhere in the world! We always need support with digital tasks and outreach."
                  items={['Social media management', 'Fundraising & events', 'Graphic design', 'Translation', 'Administrative support']}
                />

                <VolunteerType
                  title="Foster Care"
                  description="Provide a temporary home for dogs awaiting adoption or recovering from medical treatment."
                  items={['Short-term foster (1-4 weeks)', 'Long-term foster', 'Medical foster']}
                />

                <VolunteerType
                  title="Transport & Logistics"
                  description="Help us move dogs to vet appointments, adoption meetups, or international flights."
                  items={['Local transport', 'Airport runs', 'Flight volunteering']}
                />
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-blue-800 mb-6">
                Apply to Volunteer
              </h2>
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
                <VolunteerForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section background="blue" padding="md">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-4">
            Questions About Volunteering?
          </h2>
          <p className="text-white/80 mb-6">
            We&apos;re happy to answer any questions about volunteering opportunities.
          </p>
          <a href="/contact" className="inline-block">
            <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:-translate-y-0.5 transition-all">
              Contact Us
            </button>
          </a>
        </Container>
      </Section>
    </>
  );
}

function VolunteerType({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="font-semibold text-lg text-blue-800 mb-2">{title}</h3>
      <p className="text-sand-700 mb-4">{description}</p>
      <ul className="text-sm text-sand-600 space-y-1">
        {items.map(item => (
          <li key={item} className="flex gap-2">
            <span className="text-teal-600">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
