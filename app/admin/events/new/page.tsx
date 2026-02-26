'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      date: formData.get('date') as string,
      endDate: formData.get('endDate') as string || null,
      location: formData.get('location') as string || null,
      featuredImage: formData.get('featuredImage') as string || null,
      isOnline: formData.get('isOnline') === 'on',
      isPublished: formData.get('isPublished') === 'on',
    };

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to create event');
        setIsLoading(false);
        return;
      }

      router.push('/admin/events');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/events"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Add New Event</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-sand-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-sand-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., Adoption Day at Central Park"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-sand-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-sand-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
            <p className="text-xs text-sand-500 mt-1">Leave empty for single-day events</p>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label htmlFor="location" className="block text-sm font-medium text-sand-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., Central Park, Bangkok"
            />
          </div>

          {/* Featured Image */}
          <div className="md:col-span-2">
            <label htmlFor="featuredImage" className="block text-sm font-medium text-sand-700 mb-2">
              Featured Image URL
            </label>
            <input
              type="text"
              id="featuredImage"
              name="featuredImage"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="/images/events/example.jpg"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-sand-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              placeholder="Tell people about this event..."
            />
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-sand-700 mb-3">Settings</p>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isOnline"
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Online event</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Published (visible to public)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-sand-200">
          <Link
            href="/admin/events"
            className="px-4 py-2 text-sand-600 hover:text-sand-800 font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
