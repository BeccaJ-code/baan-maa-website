'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NewAppealPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const goalStr = formData.get('goalAmount') as string;
    const raisedStr = formData.get('raisedAmount') as string;

    const data = {
      title: formData.get('title') as string,
      dogName: formData.get('dogName') as string || null,
      summary: formData.get('summary') as string,
      content: content || null,
      goalAmount: parseFloat(goalStr),
      raisedAmount: raisedStr ? parseFloat(raisedStr) : 0,
      featuredImage: formData.get('featuredImage') as string || null,
      isActive: formData.get('isActive') === 'on',
      isUrgent: formData.get('isUrgent') === 'on',
      priority: parseInt(formData.get('priority') as string || '0', 10),
      deadline: formData.get('deadline') as string || null,
    };

    if (isNaN(data.goalAmount) || data.goalAmount <= 0) {
      setError('Goal amount must be a positive number');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to create appeal');
        setIsLoading(false);
        return;
      }

      router.push('/admin/appeals');
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
          href="/admin/appeals"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          &larr; Back to Appeals
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Add New Appeal</h1>
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
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., Help save Buddy - Emergency surgery needed"
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
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-sand-700 mb-2">
              Featured Image URL
            </label>
            <input
              type="text"
              id="featuredImage"
              name="featuredImage"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="/images/appeals/example.jpg"
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
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Short urgent message for banners and cards"
            />
          </div>

          {/* Content */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-sand-700 mb-2">
              Full Details
            </label>
            <RichTextEditor content="" onChange={setContent} />
          </div>

          {/* Goal Amount */}
          <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-sand-700 mb-2">
              Goal Amount (&pound;) *
            </label>
            <input
              type="number"
              id="goalAmount"
              name="goalAmount"
              required
              min="1"
              step="0.01"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="1000"
            />
          </div>

          {/* Raised Amount */}
          <div>
            <label htmlFor="raisedAmount" className="block text-sm font-medium text-sand-700 mb-2">
              Raised Amount (&pound;)
            </label>
            <input
              type="number"
              id="raisedAmount"
              name="raisedAmount"
              min="0"
              step="0.01"
              defaultValue="0"
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
              defaultValue="0"
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
                  defaultChecked
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isUrgent"
                  defaultChecked
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Urgent</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-sand-200">
          <Link
            href="/admin/appeals"
            className="px-4 py-2 text-sand-600 hover:text-sand-800 font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Appeal'}
          </button>
        </div>
      </form>
    </div>
  );
}
