import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import type { Metadata } from 'next';

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Thank You for Your Donation',
  description: 'Your donation to Baan Maa Dog Rescue has been received. Thank you for your generosity!',
};

// =============================================================================
// Donation Success Page
// =============================================================================

export default function DonationSuccessPage() {
  return (
    <Section background="sand" padding="lg">
      <Container size="sm" className="text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-teal-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-blue-800 mb-4">
          Thank You!
        </h1>

        <p className="text-lg text-sand-700 mb-8">
          Your generous donation has been received. On behalf of all the dogs at Baan Maa,
          thank you for making a difference in their lives.
        </p>

        {/* What happens next */}
        <div className="bg-white rounded-xl p-6 mb-8 text-left">
          <h2 className="font-semibold text-blue-800 mb-4">What happens next?</h2>
          <ul className="space-y-3 text-sand-700">
            <li className="flex gap-3">
              <span className="text-teal-600 font-bold">1.</span>
              You&apos;ll receive an email confirmation of your donation
            </li>
            <li className="flex gap-3">
              <span className="text-teal-600 font-bold">2.</span>
              Your donation will be used immediately to help dogs in need
            </li>
            <li className="flex gap-3">
              <span className="text-teal-600 font-bold">3.</span>
              Follow us on social media for updates on how your donation is helping
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dogs">
            <Button>Meet Our Dogs</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary">Return Home</Button>
          </Link>
        </div>

        {/* Social sharing */}
        <div className="mt-12 pt-8 border-t border-sand-200">
          <p className="text-sm text-sand-600 mb-4">
            Help spread the word about Baan Maa
          </p>
          <div className="flex gap-4 justify-center">
            <SocialButton
              href="https://facebook.com/sharer/sharer.php?u=https://baanmaa.org"
              label="Share on Facebook"
            >
              <FacebookIcon />
            </SocialButton>
            <SocialButton
              href="https://twitter.com/intent/tweet?text=I%20just%20donated%20to%20Baan%20Maa%20Dog%20Rescue!&url=https://baanmaa.org"
              label="Share on Twitter"
            >
              <TwitterIcon />
            </SocialButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// =============================================================================
// Social Button
// =============================================================================

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-sand-200 rounded-full flex items-center justify-center text-sand-600 hover:bg-teal-100 hover:text-teal-700 transition-colors"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );
}
