'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const goalAmountStr = formData.get('goalAmount') as string;
    const raisedAmountStr = formData.get('raisedAmount') as string;

    const data = {
      title: formData.get('title') as string,
      description: description || null,
      goalAmount: goalAmountStr ? parseFloat(goalAmountStr) : null,
      raisedAmount: raisedAmountStr ? parseFloat(raisedAmountStr) : 0,
      featuredImage: formData.get('featuredImage') as string || null,
      isActive: formData.get('isActive') === 'on',
      isPriority: formData.get('isPriority') === 'on',
    };

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to create project');
        setIsLoading(false);
        return;
      }

      router.push('/admin/projects');
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
          href="/admin/projects"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Projects
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Add New Project</h1>
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
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., New Medical Equipment Fund"
            />
          </div>

          {/* Goal Amount */}
          <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-sand-700 mb-2">
              Goal Amount (£)
            </label>
            <input
              type="number"
              id="goalAmount"
              name="goalAmount"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., 5000"
            />
            <p className="text-xs text-sand-500 mt-1">Leave empty for ongoing projects without a specific goal</p>
          </div>

          {/* Raised Amount */}
          <div>
            <label htmlFor="raisedAmount" className="block text-sm font-medium text-sand-700 mb-2">
              Amount Raised (£)
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
              placeholder="/images/projects/example.jpg"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-sand-700 mb-2">
              Description
            </label>
            <RichTextEditor content="" onChange={setDescription} />
          </div>

          {/* Status checkboxes */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-sand-700 mb-3">Settings</p>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Active (visible to public)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPriority"
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Priority (featured on homepage)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-sand-200">
          <Link
            href="/admin/projects"
            className="px-4 py-2 text-sand-600 hover:text-sand-800 font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
