import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageDogs, canManageEvents, canManageProjects, canManageUsers, canManageStories, canManageAppeals } from '@/lib/auth';

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  // Fetch stats
  const [dogCount, eventCount, projectCount, userCount, storyCount, appealCount] = await Promise.all([
    prisma.dog.count(),
    prisma.event.count(),
    prisma.project.count(),
    prisma.user.count(),
    prisma.successStory.count(),
    prisma.appeal.count(),
  ]);

  const [availableDogs, adoptedDogs, sponsoredDogs] = await Promise.all([
    prisma.dog.count({ where: { status: 'AVAILABLE' } }),
    prisma.dog.count({ where: { status: 'ADOPTED' } }),
    prisma.dog.count({ where: { status: 'SPONSORED' } }),
  ]);

  const upcomingEvents = await prisma.event.count({
    where: { date: { gte: new Date() } },
  });

  const activeProjects = await prisma.project.count({
    where: { isActive: true },
  });

  const publishedStories = await prisma.successStory.count({
    where: { isPublished: true },
  });

  const activeAppeals = await prisma.appeal.count({
    where: { isActive: true },
  });

  const recentDogs = await prisma.dog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
    },
  });

  const stats = [
    ...(user && canManageDogs(user.role) ? [{
      name: 'Total Dogs',
      value: dogCount,
      href: '/admin/dogs',
      details: `${availableDogs} available, ${adoptedDogs} adopted, ${sponsoredDogs} sponsored`,
    }] : []),
    ...(user && canManageEvents(user.role) ? [{
      name: 'Events',
      value: eventCount,
      href: '/admin/events',
      details: `${upcomingEvents} upcoming`,
    }] : []),
    ...(user && canManageProjects(user.role) ? [{
      name: 'Projects',
      value: projectCount,
      href: '/admin/projects',
      details: `${activeProjects} active`,
    }] : []),
    ...(user && canManageStories(user.role) ? [{
      name: 'Stories',
      value: storyCount,
      href: '/admin/stories',
      details: `${publishedStories} published`,
    }] : []),
    ...(user && canManageAppeals(user.role) ? [{
      name: 'Appeals',
      value: appealCount,
      href: '/admin/appeals',
      details: `${activeAppeals} active`,
    }] : []),
    ...(user && canManageUsers(user.role) ? [{
      name: 'Users',
      value: userCount,
      href: '/admin/users',
      details: 'Admin accounts',
    }] : []),
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-blue-900">Dashboard</h1>
        <p className="text-sand-600 mt-1">Welcome back, {user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl p-6 shadow-sm border border-sand-200 hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-sand-600">{stat.name}</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{stat.value}</p>
            <p className="text-sm text-sand-500 mt-1">{stat.details}</p>
          </Link>
        ))}
      </div>

      {/* Recent Dogs */}
      {user && canManageDogs(user.role) && (
        <div className="bg-white rounded-xl shadow-sm border border-sand-200">
          <div className="px-6 py-4 border-b border-sand-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-blue-900">Recent Dogs</h2>
            <Link
              href="/admin/dogs/new"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              Add new dog →
            </Link>
          </div>
          <div className="divide-y divide-sand-100">
            {recentDogs.map((dog) => (
              <Link
                key={dog.id}
                href={`/admin/dogs/${dog.id}/edit`}
                className="px-6 py-4 flex items-center justify-between hover:bg-sand-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-blue-900">{dog.name}</p>
                  <p className="text-sm text-sand-500">
                    Added {new Date(dog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    dog.status === 'AVAILABLE'
                      ? 'bg-green-100 text-green-700'
                      : dog.status === 'ADOPTED'
                      ? 'bg-blue-100 text-blue-700'
                      : dog.status === 'SPONSORED'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-sand-100 text-sand-700'
                  }`}
                >
                  {dog.status}
                </span>
              </Link>
            ))}
            {recentDogs.length === 0 && (
              <div className="px-6 py-8 text-center text-sand-500">
                No dogs yet.{' '}
                <Link href="/admin/dogs/new" className="text-teal-600 hover:underline">
                  Add your first dog
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
