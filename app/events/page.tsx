import Link from 'next/link';
import { Container, Section } from '@/components/layout';
import prisma from '@/lib/prisma';
import { formatDate, formatDateTime } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming events at Baan Maa Dog Rescue. Join us for adoption days, fundraisers, and more.',
};

export default async function EventsPage() {
  const now = new Date();

  const [upcomingEvents, pastEvents] = await Promise.all([
    prisma.event.findMany({
      where: { date: { gte: now }, isPublished: true },
      orderBy: { date: 'asc' },
    }),
    prisma.event.findMany({
      where: { date: { lt: now }, isPublished: true },
      orderBy: { date: 'desc' },
      take: 6,
    }),
  ]);

  return (
    <>
      <Section background="blue" padding="lg">
        <Container size="md" className="text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Events
          </h1>
          <p className="text-lg text-white/90">
            Join us for adoption days, fundraisers, and community events.
            There&apos;s always a way to get involved!
          </p>
        </Container>
      </Section>

      <Section background="sand" padding="lg">
        <Container size="lg">
          <h2 className="font-display text-2xl font-bold text-blue-800 mb-8">
            Upcoming Events
          </h2>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-sand-600 mb-4">No upcoming events scheduled.</p>
              <p className="text-sm text-sand-500">
                Follow us on social media to be the first to know about new events!
              </p>
            </div>
          )}
        </Container>
      </Section>

      {pastEvents.length > 0 && (
        <Section background="white" padding="md">
          <Container size="lg">
            <h2 className="font-display text-2xl font-bold text-blue-800 mb-8">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastEvents.map(event => (
                <div key={event.id} className="bg-sand-50 rounded-xl p-6 opacity-80">
                  <p className="text-sm text-sand-500 mb-2">{formatDate(event.date)}</p>
                  <h3 className="font-semibold text-blue-800">{event.title}</h3>
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section background="blue" padding="md">
        <Container size="md" className="text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-4">
            Host an Event for Baan Maa
          </h2>
          <p className="text-white/80 mb-6">
            Want to organise a fundraiser or awareness event for our rescue?
            We&apos;d love to hear from you!
          </p>
          <Link href="/contact" className="inline-block">
            <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:-translate-y-0.5 transition-all">
              Get in Touch
            </button>
          </Link>
        </Container>
      </Section>
    </>
  );
}

function EventCard({ event }: { event: { slug: string; title: string; date: Date; endDate: Date | null; location: string | null; description: string | null; isOnline: boolean } }) {
  return (
    <Link href={`/events/${event.slug}`} className="block bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        <div className="w-16 text-center shrink-0">
          <div className="text-sm text-teal-600 font-medium">
            {event.date.toLocaleDateString('en-GB', { month: 'short' })}
          </div>
          <div className="text-3xl font-bold text-blue-800">
            {event.date.getDate()}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-blue-800 mb-2">{event.title}</h3>
          <div className="text-sm text-sand-600 space-y-1">
            <p>{formatDateTime(event.date)}</p>
            {event.location && (
              <p className="flex items-center gap-1">
                {event.isOnline ? '🌐' : '📍'} {event.location}
              </p>
            )}
          </div>
          {event.description && (
            <p className="text-sand-700 mt-3 text-sm line-clamp-2">{event.description}</p>
          )}
          <span className="inline-block mt-3 text-sm text-teal-600 font-medium">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
