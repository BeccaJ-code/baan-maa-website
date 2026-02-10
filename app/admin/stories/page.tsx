import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageStories } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminStoriesPage() {
  const user = await getCurrentUser();
  if (!user || !canManageStories(user.role)) {
    redirect('/admin');
  }

  const stories = await prisma.successStory.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const publishedCount = stories.filter(s => s.isPublished).length;
  const featuredCount = stories.filter(s => s.isFeatured).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-blue-900">Success Stories</h1>
          <p className="text-sand-600 mt-1">
            {stories.length} total, {publishedCount} published, {featuredCount} featured
          </p>
        </div>
        <Link
          href="/admin/stories/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Add New Story
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-sand-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-sand-500 uppercase tracking-wider">
                Story
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sand-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sand-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-sand-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {stories.map((story) => (
              <tr key={story.id} className="hover:bg-sand-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-blue-900">{story.title}</p>
                    <p className="text-sm text-sand-500">{story.dogName}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        story.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-sand-100 text-sand-600'
                      }`}
                    >
                      {story.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {story.isFeatured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Featured
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-sand-500">
                  {new Date(story.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    {story.isPublished && (
                      <Link
                        href={`/stories/${story.slug}`}
                        className="text-sm text-sand-500 hover:text-blue-700"
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                    <Link
                      href={`/admin/stories/${story.id}/edit`}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {stories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sand-500">
                  No stories yet.{' '}
                  <Link href="/admin/stories/new" className="text-teal-600 hover:underline">
                    Create your first story
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
