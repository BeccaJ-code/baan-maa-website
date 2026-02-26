import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import prisma from '@/lib/prisma';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const appeal = await prisma.appeal.findUnique({
    where: { slug },
  });

  if (!appeal) {
    return { title: 'Appeal Not Found' };
  }

  return {
    title: `${appeal.title} | Urgent Appeal`,
    description: appeal.summary,
  };
}

export default async function AppealPage({ params }: Props) {
  const { slug } = await params;
  const appeal = await prisma.appeal.findUnique({
    where: { slug, isActive: true },
  });

  if (!appeal) {
    notFound();
  }

  const progress = Math.min(100, Math.round((appeal.raisedAmount / appeal.goalAmount) * 100));
  const remaining = appeal.goalAmount - appeal.raisedAmount;

  // Fetch other active appeals for sidebar
  const otherAppeals = await prisma.appeal.findMany({
    where: {
      isActive: true,
      id: { not: appeal.id },
    },
    orderBy: [{ isUrgent: 'desc' }, { priority: 'desc' }],
    take: 3,
  });

  return (
    <>
      {/* Hero */}
      <Section background={appeal.isUrgent ? 'red' : 'blue'} padding="lg">
        <Container size="lg">
          <div className="flex items-center gap-2 mb-4">
            {appeal.isUrgent && (
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <HeartPulseIcon className="w-4 h-4 animate-pulse" />
                Urgent
              </span>
            )}
            <Link
              href="/appeals"
              className="text-white/80 hover:text-white text-sm transition-colors"
            >
              ← Back to Appeals
            </Link>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {appeal.title}
          </h1>
          {appeal.dogName && (
            <p className="text-xl text-white/90">
              Help {appeal.dogName} get the care they need
            </p>
          )}
        </Container>
      </Section>

      {/* Main Content */}
      <Section background="white" padding="lg">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-8">
              {appeal.featuredImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={appeal.featuredImage}
                    alt={appeal.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-sand-700 leading-relaxed">
                  {appeal.summary}
                </p>
                {appeal.content && (
                  <div
                    className="mt-6 text-sand-700"
                    dangerouslySetInnerHTML={{
                      __html: appeal.content.startsWith('<')
                        ? appeal.content
                        : appeal.content.replace(/\n/g, '<br />')
                    }}
                  />
                )}
              </div>

              {/* How Your Donation Helps */}
              <div className="bg-sand-50 rounded-xl p-6">
                <h2 className="font-display text-xl font-bold text-blue-900 mb-4">
                  How Your Donation Helps
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                    <span className="text-sand-700">Immediate medical care and treatment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                    <span className="text-sand-700">Safe shelter, food, and round-the-clock care</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                    <span className="text-sand-700">Recovery and return to owners, their packs, or rehoming</span>
                  </li>
                </ul>
              </div>

              {/* Share */}
              <div className="border-t border-sand-200 pt-6">
                <p className="text-sand-600 mb-3">Share this appeal:</p>
                <div className="flex gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://baanmaa.org/appeals/${appeal.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://baanmaa.org/appeals/${appeal.slug}`)}&text=${encodeURIComponent(appeal.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <XIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(appeal.title)}&body=${encodeURIComponent(`Help support this appeal: https://baanmaa.org/appeals/${appeal.slug}`)}`}
                    className="p-2 bg-sand-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <EmailIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Donation Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Progress Card */}
                <div className={`rounded-xl p-6 ${appeal.isUrgent ? 'bg-red-50 border-2 border-red-200' : 'bg-blue-50'}`}>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-semibold text-blue-900">
                          £{appeal.raisedAmount.toLocaleString()} raised
                        </span>
                        <span className="text-sand-600">
                          of £{appeal.goalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            appeal.isUrgent ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-teal-400 to-teal-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <p className={`text-2xl font-bold ${appeal.isUrgent ? 'text-red-600' : 'text-blue-900'}`}>
                        £{remaining.toLocaleString()}
                      </p>
                      <p className="text-sand-600 text-sm">still needed</p>
                    </div>

                    {appeal.deadline && (
                      <div className="flex items-center justify-center gap-2 text-sand-600 text-sm">
                        <ClockIcon className="w-4 h-4" />
                        <span>
                          Deadline: {new Date(appeal.deadline).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    <Link href={`/donate?appealId=${appeal.id}&appealName=${encodeURIComponent(appeal.title)}`}>
                      <Button
                        fullWidth
                        size="lg"
                        className={appeal.isUrgent ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        Donate Now
                      </Button>
                    </Link>

                    <p className="text-xs text-sand-500 text-center">
                      100% of donations go directly to {appeal.dogName || 'this appeal'}
                    </p>
                  </div>
                </div>

                {/* Other Appeals */}
                {otherAppeals.length > 0 && (
                  <div className="bg-sand-50 rounded-xl p-6">
                    <h3 className="font-display font-bold text-blue-900 mb-4">
                      Other Appeals
                    </h3>
                    <div className="space-y-3">
                      {otherAppeals.map(other => (
                        <Link
                          key={other.id}
                          href={`/appeals/${other.slug}`}
                          className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            {other.isUrgent && (
                              <HeartPulseIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-blue-900 text-sm line-clamp-2">
                                {other.title}
                              </p>
                              <p className="text-xs text-sand-600 mt-1">
                                £{(other.goalAmount - other.raisedAmount).toLocaleString()} needed
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      href="/appeals"
                      className="block text-center text-teal-600 text-sm font-semibold mt-4 hover:text-teal-700"
                    >
                      View All Appeals →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="sand" padding="lg">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl font-bold text-blue-900 mb-4">
            Every Donation Makes a Difference
          </h2>
          <p className="text-sand-700 mb-6">
            Whether you can give £5 or £500, your donation helps us save more dogs like {appeal.dogName || 'those in need'}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/donate?appealId=${appeal.id}&appealName=${encodeURIComponent(appeal.title)}`}>
              <Button size="lg">Donate to This Appeal</Button>
            </Link>
            <Link href="/donate">
              <Button size="lg" variant="outline">Donate to General Fund</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}

// Icons
function HeartPulseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function EmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}
