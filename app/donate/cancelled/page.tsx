import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import type { Metadata } from 'next';

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Donation Cancelled',
  description: 'Your donation was cancelled. No charges were made to your account.',
};

// =============================================================================
// Donation Cancelled Page
// =============================================================================

export default function DonationCancelledPage() {
  return (
    <Section background="sand" padding="lg">
      <Container size="sm" className="text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-sand-200 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-sand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-800 mb-4">
          Donation Cancelled
        </h1>

        <p className="text-lg text-sand-700 mb-8">
          No worries! Your donation was cancelled and no charges were made to your account.
          If you encountered any issues or have questions, please don&apos;t hesitate to contact us.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/donate">
            <Button>Try Again</Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary">Contact Us</Button>
          </Link>
        </div>

        {/* Alternative ways to help */}
        <div className="bg-white rounded-xl p-6 text-left">
          <h2 className="font-semibold text-blue-800 mb-4">Other Ways to Help</h2>
          <ul className="space-y-3 text-sand-700">
            <li>
              <Link href="/sponsorship" className="text-teal-600 hover:text-teal-700 font-medium">
                Sponsor a specific dog →
              </Link>
              <p className="text-sm text-sand-600 mt-1">
                Support a dog&apos;s monthly care with a recurring donation
              </p>
            </li>
            <li>
              <Link href="/volunteering" className="text-teal-600 hover:text-teal-700 font-medium">
                Volunteer with us →
              </Link>
              <p className="text-sm text-sand-600 mt-1">
                Donate your time and skills to help our rescue efforts
              </p>
            </li>
            <li>
              <span className="text-teal-600 font-medium">Spread the word</span>
              <p className="text-sm text-sand-600 mt-1">
                Share our mission on social media to help us reach more supporters
              </p>
            </li>
          </ul>
        </div>
      </Container>
    </Section>
  );
}
