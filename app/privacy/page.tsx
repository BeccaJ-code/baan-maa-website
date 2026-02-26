import { Container, Section } from '@/components/layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Baan Maa Dog Rescue website.',
};

export default function PrivacyPage() {
  return (
    <>
      <Section background="blue" padding="md">
        <Container size="md" className="text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/90">
            Last updated: February 2026
          </p>
        </Container>
      </Section>

      <Section background="white" padding="lg">
        <Container size="md">
          <div className="prose prose-sand max-w-none">
            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              Introduction
            </h2>
            <p className="text-sand-700 mb-6">
              Baan Maa Dog Rescue (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting
              your privacy. This policy explains how we collect, use, and protect your
              personal information when you use our website.
            </p>

            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              Information We Collect
            </h2>
            <p className="text-sand-700 mb-4">We collect information that you provide directly to us:</p>
            <ul className="list-disc pl-6 text-sand-700 space-y-2 mb-6">
              <li>Name, email address, and contact details when you submit forms</li>
              <li>Adoption and volunteer application information</li>
              <li>Payment information when you make a donation (processed securely by Stripe)</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              Cookies and Analytics
            </h2>
            <p className="text-sand-700 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc pl-6 text-sand-700 space-y-2 mb-6">
              <li>Remember your preferences (like currency selection)</li>
              <li>Understand how visitors use our website (via Google Analytics)</li>
              <li>Improve our website and services</li>
            </ul>
            <p className="text-sand-700 mb-6">
              You can control cookie preferences using the cookie consent banner when you
              first visit our site, or through your browser settings.
            </p>

            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-sand-700 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-sand-700 space-y-2 mb-6">
              <li>Process donations and send receipts</li>
              <li>Respond to your enquiries and applications</li>
              <li>Send updates about our rescue work (if you opt in)</li>
              <li>Improve our website and services</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              Data Sharing
            </h2>
            <p className="text-sand-700 mb-6">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-sand-700 space-y-2 mb-6">
              <li>Stripe (for payment processing)</li>
              <li>Google Analytics (for website analytics, with your consent)</li>
              <li>Email service providers (for sending communications)</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              Data Security
            </h2>
            <p className="text-sand-700 mb-6">
              We take reasonable measures to protect your personal information from
              unauthorised access, alteration, or destruction. Payment information is
              processed securely by Stripe and is never stored on our servers.
            </p>

            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              Your Rights
            </h2>
            <p className="text-sand-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-sand-700 space-y-2 mb-6">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              Contact Us
            </h2>
            <p className="text-sand-700 mb-6">
              If you have any questions about this privacy policy or how we handle your
              data, please contact us at:{' '}
              <a href="mailto:beccaj@baanmaa.org" className="text-teal-600 hover:text-teal-700">
                beccaj@baanmaa.org
              </a>
            </p>

            <h2 className="font-display text-2xl font-bold text-blue-800 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-sand-700">
              We may update this policy from time to time. Any changes will be posted
              on this page with an updated revision date.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
