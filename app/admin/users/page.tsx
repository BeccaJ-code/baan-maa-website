import Link from 'next/link';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser, isAdmin } from '@/lib/auth';

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  // Only admins can access this page
  if (!currentUser || !isAdmin(currentUser.role)) {
    redirect('/admin');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    EDITOR: 'bg-blue-100 text-blue-700',
    DOG_MANAGER: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-blue-900">Users</h1>
          <p className="text-sand-600 mt-1">Manage admin accounts</p>
        </div>
        <Link
          href="/admin/users/new"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          Add New User
        </Link>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 mb-6">
        <div className="px-6 py-4 flex gap-4 flex-wrap">
          <span className="text-sm text-sand-600">
            Total: <strong>{users.length}</strong> users
          </span>
          <span className="text-sm text-sand-600">
            Admins: <strong>{users.filter(u => u.role === 'ADMIN').length}</strong>
          </span>
          <span className="text-sm text-sand-600">
            Editors: <strong>{users.filter(u => u.role === 'EDITOR').length}</strong>
          </span>
          <span className="text-sm text-sand-600">
            Dog Managers: <strong>{users.filter(u => u.role === 'DOG_MANAGER').length}</strong>
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-sand-50 border-b border-sand-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-sand-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">
                          {user.name || user.email.split('@')[0]}
                        </p>
                        <p className="text-sm text-sand-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        roleColors[user.role] || 'bg-sand-100 text-sand-700'
                      }`}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sand-700">
                    {new Date(user.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      {user.id === currentUser.userId && (
                        <span className="text-xs text-sand-400 ml-2">(You)</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sand-500">
                    No users yet.{' '}
                    <Link href="/admin/users/new" className="text-teal-600 hover:underline">
                      Add your first user
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Info */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-sand-200 p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <h3 className="font-medium text-red-700 mb-2">Admin</h3>
            <ul className="text-sm text-red-600 space-y-1">
              <li>• Manage all dogs, events, projects</li>
              <li>• Manage users and permissions</li>
              <li>• Full system access</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-700 mb-2">Editor</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Manage dogs, events, projects</li>
              <li>• Cannot manage users</li>
              <li>• Content management access</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h3 className="font-medium text-green-700 mb-2">Dog Manager</h3>
            <ul className="text-sm text-green-600 space-y-1">
              <li>• Manage dogs only</li>
              <li>• View dashboard</li>
              <li>• Limited access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
