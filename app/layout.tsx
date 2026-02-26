import type { Metadata } from 'next';
import { DM_Sans, Fraunces } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import { UrgentAppealBanner } from '@/components/UrgentAppeal';

// =============================================================================
// Font Configuration
// =============================================================================

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: {
    default: 'Baan Maa Dog Rescue | Saving Street Dogs in Thailand',
    template: '%s | Baan Maa Dog Rescue',
  },
  description:
    'Baan Maa Dog Rescue is dedicated to rescuing, rehabilitating, and rehoming street dogs in Phetchaburi, Thailand. Support our mission through adoption, sponsorship, or donations.',
  keywords: [
    'dog rescue',
    'Thailand',
    'Phetchaburi',
    'adopt a dog',
    'sponsor a dog',
    'street dogs',
    'animal welfare',
    'rescue dogs',
  ],
  authors: [{ name: 'Baan Maa Dog Rescue' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: process.env.NEXT_PUBLIC_URL,
    siteName: 'Baan Maa Dog Rescue',
    title: 'Baan Maa Dog Rescue | Saving Street Dogs in Thailand',
    description:
      'Rescue, rehabilitate, and rehome street dogs in Thailand. Adopt, sponsor, or donate to help save lives.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Baan Maa Dog Rescue',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baan Maa Dog Rescue',
    description: 'Saving street dogs in Thailand through rescue, rehabilitation, and rehoming.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

// =============================================================================
// Root Layout
// =============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <UrgentAppealBanner />
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
