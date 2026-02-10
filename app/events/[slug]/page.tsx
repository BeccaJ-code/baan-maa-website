import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/layout';
import { Button } from '@/components/ui';
import prisma from '@/lib/prisma';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event) {
    return { title: 'Event Not Found' };
  }

  return {
    title: event.title,
    description: event.description || `Join us for ${event.title} at Baan Maa Dog Rescue.`,
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug, isPublished: true },
  });

  if (!event) {
    notFound();
  }

  const isPast = event.date < new Date();

  // Get other upcoming events
  const otherEvents = await prisma.event.findMany({
    where: {
      isPublished: true,
      id: { not: event.id },
      date: { gte: new Date() },
    },
    take: 3,
    orderBy: { date: 'asc' },
  });

  return (
    <>
      {/* Hero */}
      <Section background="blue" padding="md">
        <Container size="lg">
          <Link
            href="/events"
            className="inline-flex items-center text-blue-200 hover:text-white mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
          <div className="flex items-start gap-3">
            {isPast && (
              <span className="mt-1 px-3 py-1 bg-sand-200/20 text-white/70 text-xs font-medium rounded-full">
                Past Event
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mt-2">
            {event.title}
          </h1>
        </Container>
      </Section>

      {/* Event Details */}
      <Section background="sand" padding="lg">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {event.featuredImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                  <Image
                    src={event.featuredImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {event.description && (
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
                  <h2 className="font-display text-xl font-bold text-blue-900 mb-4">
                    About This Event
                  </h2>
                  <div className="prose prose-sand max-w-none">
                    {event.description.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-sand-700 leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-display font-bold text-blue-900 mb-4">Event Details</h3>

                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex gap-3">
                    <CalendarIcon className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">{formatDate(event.date)}</p>
                      <p className="text-sm text-sand-600">{formatDateTime(event.date)}</p>
                      {event.endDate && (
                        <p className="text-sm text-sand-500">
                          Ends: {formatDateTime(event.endDate)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex gap-3">
                      <LocationIcon className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">
                          {event.isOnline ? 'Online Event' : 'Location'}
                        </p>
                        <p className="text-sm text-sand-600">{event.location}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              {!isPast && (
                <div className="bg-teal-50 rounded-xl p-6 border border-teal-100">
                  <h3 className="font-display font-bold text-teal-800 mb-2">
                    Want to attend?
                  </h3>
                  <p className="text-teal-700 text-sm mb-4">
                    Get in touch to register or learn more about this event.
                  </p>
                  <Link href="/contact">
                    <Button fullWidth>Contact Us</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Other Events */}
      {otherEvents.length > 0 && (
        <Section background="white" padding="md">
          <Container size="lg">
            <h2 className="font-display text-2xl font-bold text-blue-900 mb-8">
              More Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherEvents.map((otherEvent) => (
                <Link
                  key={otherEvent.id}
                  href={`/events/${otherEvent.slug}`}
                  className="bg-sand-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="w-14 text-center shrink-0">
                      <div className="text-sm text-teal-600 font-medium">
                        {otherEvent.date.toLocaleDateString('en-GB', { month: 'short' })}
                      </div>
                      <div className="text-2xl font-bold text-blue-800">
                        {otherEvent.date.getDate()}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">
                        {otherEvent.title}
                      </h3>
                      {otherEvent.location && (
                        <p className="text-sm text-sand-600 mt-1">
                          {otherEvent.isOnline ? '🌐' : '📍'} {otherEvent.location}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
