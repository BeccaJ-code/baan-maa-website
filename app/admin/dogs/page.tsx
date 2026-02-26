import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDogsPage() {
  const dogs = await prisma.dog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-blue-900">Dogs</h1>
          <p className="text-sand-600 mt-1">Manage all dogs in the system</p>
        </div>
        <Link
          href="/admin/dogs/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Add New Dog
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 mb-6">
        <div className="px-6 py-4 flex gap-4 flex-wrap">
          <span className="text-sm text-sand-600">
            Total: <strong>{dogs.length}</strong> dogs
          </span>
          <span className="text-sm text-sand-600">
            Available: <strong>{dogs.filter(d => d.status === 'AVAILABLE').length}</strong>
          </span>
          <span className="text-sm text-sand-600">
            Adopted: <strong>{dogs.filter(d => d.status === 'ADOPTED').length}</strong>
          </span>
          <span className="text-sm text-sand-600">
            Sponsored: <strong>{dogs.filter(d => d.status === 'SPONSORED').length}</strong>
          </span>
        </div>
      </div>

      {/* Dogs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Dog
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Compatibility
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {dogs.map((dog) => (
                <tr key={dog.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {dog.featuredImage ? (
                        <img
                          src={dog.featuredImage}
                          alt={dog.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-sand-200 flex items-center justify-center">
                          <span className="text-sand-500 text-sm">🐕</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-blue-900">{dog.name}</p>
                        <p className="text-sm text-sand-500">{dog.breed || 'Mixed breed'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        dog.status === 'AVAILABLE'
                          ? 'bg-green-100 text-green-700'
                          : dog.status === 'ADOPTED'
                          ? 'bg-blue-100 text-blue-700'
                          : dog.status === 'SPONSORED'
                          ? 'bg-purple-100 text-purple-700'
                          : dog.status === 'MEDICAL'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-sand-100 text-sand-700'
                      }`}
                    >
                      {dog.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sand-700">
                    {dog.age || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sand-700">
                    {dog.size || 'Unknown'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {dog.goodWithKids && (
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                          Kids
                        </span>
                      )}
                      {dog.goodWithDogs && (
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                          Dogs
                        </span>
                      )}
                      {dog.goodWithCats && (
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded text-xs">
                          Cats
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dogs/${dog.slug}`}
                        target="_blank"
                        className="text-sand-600 hover:text-blue-700 text-sm"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/dogs/${dog.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {dogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sand-500">
                    No dogs yet.{' '}
                    <Link href="/admin/dogs/new" className="text-teal-600 hover:underline">
                      Add your first dog
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
