'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewStoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      dogName: formData.get('dogName') as string,
      title: formData.get('title') as string,
      summary: formData.get('summary') as string || null,
      content: formData.get('content') as string,
      beforeImage: formData.get('beforeImage') as string || null,
      afterImage: formData.get('afterImage') as string || null,
      adoptedTo: formData.get('adoptedTo') as string || null,
      adoptedDate: formData.get('adoptedDate') as string || null,
      location: formData.get('location') as string || null,
      isFeatured: formData.get('isFeatured') === 'on',
      isPublished: formData.get('isPublished') === 'on',
    };

    try {
      const res = await fetch('/api/admin/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to create story');
        setIsLoading(false);
        return;
      }

      router.push('/admin/stories');
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
          href="/admin/stories"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          &larr; Back to Stories
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Add New Story</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-sand-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dog Name */}
          <div>
            <label htmlFor="dogName" className="block text-sm font-medium text-sand-700 mb-2">
              Dog Name *
            </label>
            <input
              type="text"
              id="dogName"
              name="dogName"
              required
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-sand-700 mb-2">
              Story Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., From Street to Sofa: Luna's Journey"
            />
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <label htmlFor="summary" className="block text-sm font-medium text-sand-700 mb-2">
              Summary
            </label>
            <input
              type="text"
              id="summary"
              name="summary"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Short summary for story cards"
            />
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-sand-700 mb-2">
              Story Content *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={8}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              placeholder="Write the full story here. Use double line breaks for paragraphs."
            />
          </div>

          {/* Before Image */}
          <div>
            <label htmlFor="beforeImage" className="block text-sm font-medium text-sand-700 mb-2">
              Before Image URL
            </label>
            <input
              type="url"
              id="beforeImage"
              name="beforeImage"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="https://example.com/before.jpg"
            />
          </div>

          {/* After Image */}
          <div>
            <label htmlFor="afterImage" className="block text-sm font-medium text-sand-700 mb-2">
              After Image URL
            </label>
            <input
              type="url"
              id="afterImage"
              name="afterImage"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="https://example.com/after.jpg"
            />
          </div>

          {/* Adopted To */}
          <div>
            <label htmlFor="adoptedTo" className="block text-sm font-medium text-sand-700 mb-2">
              Adopted To
            </label>
            <input
              type="text"
              id="adoptedTo"
              name="adoptedTo"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., The Smith Family"
            />
          </div>

          {/* Adopted Date */}
          <div>
            <label htmlFor="adoptedDate" className="block text-sm font-medium text-sand-700 mb-2">
              Adopted Date
            </label>
            <input
              type="date"
              id="adoptedDate"
              name="adoptedDate"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-sand-700 mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., Sweden, UK"
            />
          </div>

          {/* Checkboxes */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-sand-700 mb-3">Options</p>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-sand-200">
          <Link
            href="/admin/stories"
            className="px-4 py-2 text-sand-600 hover:text-sand-800 font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Story'}
          </button>
        </div>
      </form>
    </div>
  );
}
