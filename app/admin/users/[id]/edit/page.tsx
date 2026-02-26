'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        if (res.status === 401) {
          router.push('/admin');
          return;
        }
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          setError('User not found');
        }
      } catch {
        setError('Failed to load user');
      } finally {
        setIsLoading(false);
      }
    };

    // Get current user ID from cookie or session
    const getCurrentUserId = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        // The current user ID is set in the auth cookie
        // For now we'll detect it from the delete restriction
      } catch {
        // Ignore
      }
    };

    fetchUser();
    getCurrentUserId();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;

    const data: Record<string, string | undefined> = {
      email: formData.get('email') as string,
      name: formData.get('name') as string || undefined,
      role: formData.get('role') as string,
    };

    // Only include password if it was changed
    if (password) {
      data.password = password;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to update user');
        setIsSaving(false);
        return;
      }

      router.push('/admin/users');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to delete user');
        setIsDeleting(false);
        return;
      }

      router.push('/admin/users');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sand-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">User Not Found</h1>
        <Link href="/admin/users" className="text-teal-600 hover:underline">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/users"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Users
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Edit User</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-sand-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-sm font-medium text-sand-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              defaultValue={user.email}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Password */}
          <div className="md:col-span-2">
            <label htmlFor="password" className="block text-sm font-medium text-sand-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              minLength={8}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Leave blank to keep current password"
            />
            <p className="text-xs text-sand-500 mt-1">Leave empty to keep current password</p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-sand-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user.name || ''}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-sand-700 mb-2">
              Role *
            </label>
            <select
              id="role"
              name="role"
              required
              defaultValue={user.role}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="DOG_MANAGER">Dog Manager</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        {/* User info */}
        <div className="mt-6 p-4 bg-sand-50 rounded-lg border border-sand-200">
          <h3 className="text-sm font-medium text-sand-700 mb-2">Account Information</h3>
          <p className="text-sm text-sand-600">
            Created: {new Date(user.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="text-sm text-sand-600">
            Last updated: {new Date(user.updatedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-sand-200">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </button>
          <div className="flex gap-4">
            <Link
              href="/admin/users"
              className="px-4 py-2 text-sand-600 hover:text-sand-800 font-medium transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
