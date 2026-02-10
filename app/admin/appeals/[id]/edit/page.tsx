'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Appeal {
  id: string;
  slug: string;
  title: string;
  dogName: string | null;
  summary: string;
  content: string | null;
  goalAmount: number;
  raisedAmount: number;
  featuredImage: string | null;
  isActive: boolean;
  isUrgent: boolean;
  priority: number;
  deadline: string | null;
}

export default function EditAppealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppeal = async () => {
      try {
        const res = await fetch(`/api/admin/appeals/${id}`);
        const data = await res.json();
        if (data.success) {
          setAppeal(data.data);
        } else {
          setError('Appeal not found');
        }
      } catch {
        setError('Failed to load appeal');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppeal();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const goalStr = formData.get('goalAmount') as string;
    const raisedStr = formData.get('raisedAmount') as string;

    const data = {
      title: formData.get('title') as string,
      dogName: formData.get('dogName') as string || null,
      summary: formData.get('summary') as string,
      content: formData.get('content') as string || null,
      goalAmount: parseFloat(goalStr),
      raisedAmount: raisedStr ? parseFloat(raisedStr) : 0,
      featuredImage: formData.get('featuredImage') as string || null,
      isActive: formData.get('isActive') === 'on',
      isUrgent: formData.get('isUrgent') === 'on',
      priority: parseInt(formData.get('priority') as string || '0', 10),
      deadline: formData.get('deadline') as string || null,
    };

    try {
      const res = await fetch(`/api/admin/appeals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to update appeal');
        setIsSaving(false);
        return;
      }

      router.push('/admin/appeals');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this appeal? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/appeals/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || 'Failed to delete appeal');
        setIsDeleting(false);
        return;
      }

      router.push('/admin/appeals');
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

  if (!appeal) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Appeal Not Found</h1>
        <Link href="/admin/appeals" className="text-teal-600 hover:underline">
          Back to Appeals
        </Link>
      </div>
    );
  }

  const deadlineStr = appeal.deadline
    ? new Date(appeal.deadline).toISOString().split('T')[0]
    : '';

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/appeals"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          &larr; Back to Appeals
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Edit Appeal</h1>
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
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={appeal.title}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Dog Name */}
          <div>
            <label htmlFor="dogName" className="block text-sm font-medium text-sand-700 mb-2">
              Dog Name
            </label>
            <input
              type="text"
              id="dogName"
              name="dogName"
              defaultValue={appeal.dogName || ''}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-sand-700 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              id="featuredImage"
              name="featuredImage"
              defaultValue={appeal.featuredImage || ''}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <label htmlFor="summary" className="block text-sm font-medium text-sand-700 mb-2">
              Summary *
            </label>
            <input
              type="text"
              id="summary"
              name="summary"
              required
              defaultValue={appeal.summary}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-sand-700 mb-2">
              Full Details
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              defaultValue={appeal.content || ''}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
            />
          </div>

          {/* Goal Amount */}
          <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-sand-700 mb-2">
              Goal Amount (£) *
            </label>
            <input
              type="number"
              id="goalAmount"
              name="goalAmount"
              required
              min="1"
              step="0.01"
              defaultValue={appeal.goalAmount}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Raised Amount */}
          <div>
            <label htmlFor="raisedAmount" className="block text-sm font-medium text-sand-700 mb-2">
              Raised Amount (£)
            </label>
            <input
              type="number"
              id="raisedAmount"
              name="raisedAmount"
              min="0"
              step="0.01"
              defaultValue={appeal.raisedAmount}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-sand-700 mb-2">
              Priority (higher = more prominent)
            </label>
            <input
              type="number"
              id="priority"
              name="priority"
              min="0"
              defaultValue={appeal.priority}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-sand-700 mb-2">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              defaultValue={deadlineStr}
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
                  name="isActive"
                  defaultChecked={appeal.isActive}
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isUrgent"
                  defaultChecked={appeal.isUrgent}
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Urgent</span>
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
            {isDeleting ? 'Deleting...' : 'Delete Appeal'}
          </button>
          <div className="flex gap-4">
            <Link
              href="/admin/appeals"
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
