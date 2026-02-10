'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Story {
  id: string;
  slug: string;
  dogName: string;
  title: string;
  summary: string | null;
  content: string;
  beforeImage: string | null;
  afterImage: string | null;
  adoptedTo: string | null;
  adoptedDate: string | null;
  location: string | null;
  isFeatured: boolean;
  isPublished: boolean;
}

export default function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(`/api/admin/stories/${id}`);
        const data = await res.json();
        if (data.success) {
          setStory(data.data);
        } else {
          setError('Story not found');
        }
      } catch {
        setError('Failed to load story');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
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
      const res = await fetch(`/api/admin/stories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to update story');
        setIsSaving(false);
        return;
      }

      router.push('/admin/stories');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/stories/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || 'Failed to delete story');
        setIsDeleting(false);
        return;
      }

      router.push('/admin/stories');
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

  if (!story) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Story Not Found</h1>
        <Link href="/admin/stories" className="text-teal-600 hover:underline">
          Back to Stories
        </Link>
      </div>
    );
  }

  const adoptedDateStr = story.adoptedDate
    ? new Date(story.adoptedDate).toISOString().split('T')[0]
    : '';

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/stories"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          &larr; Back to Stories
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Edit Story</h1>
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
              defaultValue={story.dogName}
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
              defaultValue={story.title}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
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
              defaultValue={story.summary || ''}
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
              defaultValue={story.content}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
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
              defaultValue={story.beforeImage || ''}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
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
              defaultValue={story.afterImage || ''}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
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
              defaultValue={story.adoptedTo || ''}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
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
              defaultValue={adoptedDateStr}
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
              defaultValue={story.location || ''}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
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
                  defaultChecked={story.isPublished}
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  defaultChecked={story.isFeatured}
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Featured</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-sand-200">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Story'}
          </button>
          <div className="flex gap-4">
            <Link
              href="/admin/stories"
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
