import Link from 'next/link';
import Image from 'next/image';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Urgent Appeals',
  description: 'Dogs in critical need of your help. Your donation can save a life today.',
};

export default async function AppealsPage() {
  const appeals = await prisma.appeal.findMany({
    where: { isActive: true },
    orderBy: [{ isUrgent: 'desc' }, { priority: 'desc' }, { createdAt: 'desc' }],
  });

  const urgentAppeals = appeals.filter(a => a.isUrgent);
  const otherAppeals = appeals.filter(a => !a.isUrgent);

  return (
    <>
      {/* Hero */}
      <Section background="red" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Urgent Appeals
          </h1>
          <p className="text-lg text-white/90">
            These dogs need your help right now. Every donation makes a difference.
          </p>
        </Container>
      </Section>

      {/* Urgent Appeals */}
      {urgentAppeals.length > 0 && (
        <Section background="red-light" padding="lg">
          <Container size="xl">
            <div className="flex items-center gap-3 mb-8">
              <HeartPulseIcon className="w-6 h-6 text-red-600 animate-pulse" />
              <h2 className="font-display text-2xl font-bold text-red-800">
                Critical Cases
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {urgentAppeals.map(appeal => (
                <AppealCard key={appeal.id} appeal={appeal} urgent />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Other Appeals */}
      {otherAppeals.length > 0 && (
        <Section background="white" padding="lg">
          <Container size="xl">
            <h2 className="font-display text-2xl font-bold text-blue-900 mb-8">
              Ongoing Appeals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherAppeals.map(appeal => (
                <AppealCard key={appeal.id} appeal={appeal} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Empty State */}
      {appeals.length === 0 && (
        <Section background="sand" padding="lg">
          <Container size="md" className="text-center">
            <div className="py-12">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeartIcon className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="font-display text-2xl font-bold text-blue-900 mb-2">
                No Urgent Appeals Right Now
              </h2>
              <p className="text-sand-700 mb-6">
                Thanks to supporters like you, all our dogs are currently stable!
                You can still help by donating to our general fund.
              </p>
              <Link href="/donate">
                <Button>Donate to General Fund</Button>
              </Link>
            </div>
          </Container>
        </Section>
      )}

      {/* How It Works */}
      <Section background="sand" padding="lg">
        <Container size="lg">
          <h2 className="font-display text-2xl font-bold text-blue-900 text-center mb-8">
            How Your Donation Helps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">Medical Treatment</h3>
              <p className="text-sand-600">
                Surgery, medication, and specialist care for injured and sick dogs.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">Emergency Rescue</h3>
              <p className="text-sand-600">
                Transport, quarantine, and immediate care for dogs in crisis.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="font-semibold text-blue-900 mb-2">Recovery & Return</h3>
              <p className="text-sand-600">
                Rehabilitation so dogs can be returned to their owners, released back to their packs, or rehomed.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Can&apos;t Decide Which Appeal?
          </h2>
          <p className="text-white/90 mb-8">
            Donate to our general fund and we&apos;ll direct it where it&apos;s needed most.
          </p>
          <Link href="/donate">
            <Button size="lg" variant="secondary">Donate to General Fund</Button>
          </Link>
        </Container>
      </Section>
    </>
  );
}

interface Appeal {
  id: string;
  slug: string;
  title: string;
  dogName: string | null;
  summary: string;
  goalAmount: number;
  raisedAmount: number;
  featuredImage: string | null;
  deadline: Date | null;
  isUrgent: boolean;
}

function AppealCard({ appeal, urgent = false }: { appeal: Appeal; urgent?: boolean }) {
  const progress = Math.min(100, Math.round((appeal.raisedAmount / appeal.goalAmount) * 100));
  const remaining = appeal.goalAmount - appeal.raisedAmount;

  return (
    <Link
      href={`/appeals/${appeal.slug}`}
      className={`group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${
        urgent ? 'ring-2 ring-red-300' : ''
      }`}
    >
      {appeal.featuredImage ? (
        <div className="relative aspect-video">
          <Image
            src={appeal.featuredImage}
            alt={appeal.title}
            fill
            className="object-cover"
          />
          {urgent && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              <HeartPulseIcon className="w-3 h-3 animate-pulse" />
              Urgent
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-sand-200 flex items-center justify-center">
          {urgent && (
            <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
              <HeartPulseIcon className="w-4 h-4 animate-pulse" />
              Urgent
            </div>
          )}
        </div>
      )}
      <div className="p-5">
        <h3 className="font-display font-bold text-blue-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
          {appeal.title}
        </h3>
        <p className="text-sand-600 mb-4 line-clamp-2">{appeal.summary}</p>

        <div className="space-y-2">
          <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                urgent ? 'bg-red-500' : 'bg-teal-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-sand-600">{progress}% funded</span>
            <span className={`font-semibold ${urgent ? 'text-red-600' : 'text-blue-900'}`}>
              £{remaining.toLocaleString()} needed
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HeartPulseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
