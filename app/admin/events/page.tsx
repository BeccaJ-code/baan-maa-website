import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
  });

  const now = new Date();
  const upcomingEvents = events.filter(e => e.date >= now);
  const pastEvents = events.filter(e => e.date < now);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-blue-900">Events</h1>
          <p className="text-sand-600 mt-1">Manage all events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Add New Event
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 mb-6">
        <div className="px-6 py-4 flex gap-4 flex-wrap">
          <span className="text-sm text-sand-600">
            Total: <strong>{events.length}</strong> events
          </span>
          <span className="text-sm text-sand-600">
            Upcoming: <strong>{upcomingEvents.length}</strong>
          </span>
          <span className="text-sm text-sand-600">
            Past: <strong>{pastEvents.length}</strong>
          </span>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {events.map((event) => {
                const isPast = event.date < now;
                return (
                  <tr key={event.id} className="hover:bg-sand-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {event.featuredImage ? (
                          <img
                            src={event.featuredImage}
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-sand-200 flex items-center justify-center">
                            <span className="text-sand-500 text-lg">📅</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-blue-900">{event.title}</p>
                          {event.description && (
                            <p className="text-sm text-sand-500 truncate max-w-xs">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sand-700">
                        {event.date.toLocaleDateString('en-GB', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      {event.endDate && (
                        <p className="text-sm text-sand-500">
                          to {event.endDate.toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sand-700">
                      {event.location || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isPast
                            ? 'bg-sand-100 text-sand-600'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {isPast ? 'Past' : 'Upcoming'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/events`}
                          target="_blank"
                          className="text-sand-600 hover:text-blue-700 text-sm"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sand-500">
                    No events yet.{' '}
                    <Link href="/admin/events/new" className="text-teal-600 hover:underline">
                      Add your first event
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
