'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is admin
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (res.status === 401) {
          router.push('/admin');
          return;
        }
        setIsAuthorized(true);
      } catch {
        router.push('/admin');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string || undefined,
      role: formData.get('role') as string,
    };

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to create user');
        setIsLoading(false);
        return;
      }

      router.push('/admin/users');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sand-600">Loading...</div>
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
        <h1 className="text-3xl font-display font-bold text-blue-900">Add New User</h1>
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
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="user@baanmaa.org"
            />
          </div>

          {/* Password */}
          <div className="md:col-span-2">
            <label htmlFor="password" className="block text-sm font-medium text-sand-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={8}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Minimum 8 characters"
            />
            <p className="text-xs text-sand-500 mt-1">Must be at least 8 characters long</p>
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
              defaultValue="DOG_MANAGER"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="DOG_MANAGER">Dog Manager</option>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        {/* Role descriptions */}
        <div className="mt-6 p-4 bg-sand-50 rounded-lg border border-sand-200">
          <h3 className="text-sm font-medium text-sand-700 mb-2">Role Permissions</h3>
          <ul className="text-sm text-sand-600 space-y-1">
            <li><strong>Dog Manager:</strong> Can only manage dogs</li>
            <li><strong>Editor:</strong> Can manage dogs, events, and projects</li>
            <li><strong>Admin:</strong> Full access including user management</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-sand-200">
          <Link
            href="/admin/users"
            className="px-4 py-2 text-sand-600 hover:text-sand-800 font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
}
