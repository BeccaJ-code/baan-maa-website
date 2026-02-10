import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageAppeals } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminAppealsPage() {
  const user = await getCurrentUser();
  if (!user || !canManageAppeals(user.role)) {
    redirect('/admin');
  }

  const appeals = await prisma.appeal.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const activeCount = appeals.filter(a => a.isActive).length;
  const urgentCount = appeals.filter(a => a.isUrgent).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-blue-900">Appeals</h1>
          <p className="text-sand-600 mt-1">
            {appeals.length} total, {activeCount} active, {urgentCount} urgent
          </p>
        </div>
        <Link
          href="/admin/appeals/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Add New Appeal
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-sand-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-sand-500 uppercase tracking-wider">
                Appeal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sand-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-sand-500 uppercase tracking-wider">
                Funding
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
            {appeals.map((appeal) => {
              const progress = Math.min(100, Math.round((appeal.raisedAmount / appeal.goalAmount) * 100));

              return (
                <tr key={appeal.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-blue-900">{appeal.title}</p>
                      {appeal.dogName && (
                        <p className="text-sm text-sand-500">{appeal.dogName}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appeal.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-sand-100 text-sand-600'
                        }`}
                      >
                        {appeal.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {appeal.isUrgent && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Urgent
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-sand-600">{progress}%</span>
                        <span className="text-sand-500">
                          £{appeal.raisedAmount.toLocaleString()} / £{appeal.goalAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-sand-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-sand-500">
                    {new Date(appeal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {appeal.isActive && (
                        <Link
                          href={`/appeals/${appeal.slug}`}
                          className="text-sm text-sand-500 hover:text-blue-700"
                          target="_blank"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/appeals/${appeal.id}/edit`}
                        className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {appeals.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sand-500">
                  No appeals yet.{' '}
                  <Link href="/admin/appeals/new" className="text-teal-600 hover:underline">
                    Create your first appeal
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
