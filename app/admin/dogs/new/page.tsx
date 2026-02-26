'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewDogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      breed: formData.get('breed') as string || null,
      age: formData.get('age') as string || null,
      sex: formData.get('sex') as string || null,
      size: formData.get('size') as string || null,
      status: formData.get('status') as string,
      shortDescription: formData.get('shortDescription') as string || null,
      fullDescription: formData.get('fullDescription') as string || null,
      featuredImage: formData.get('featuredImage') as string || null,
      goodWithKids: formData.get('goodWithKids') === 'on',
      goodWithDogs: formData.get('goodWithDogs') === 'on',
      goodWithCats: formData.get('goodWithCats') === 'on',
      houseTrained: formData.get('houseTrained') === 'on',
    };

    try {
      const res = await fetch('/api/admin/dogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to create dog');
        setIsLoading(false);
        return;
      }

      router.push('/admin/dogs');
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
          href="/admin/dogs"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Dogs
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Add New Dog</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-sand-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-sand-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Breed */}
          <div>
            <label htmlFor="breed" className="block text-sm font-medium text-sand-700 mb-2">
              Breed
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="Mixed breed"
            />
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-sand-700 mb-2">
              Age
            </label>
            <input
              type="text"
              id="age"
              name="age"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="e.g., 2 years, 6 months"
            />
          </div>

          {/* Sex */}
          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-sand-700 mb-2">
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="">Unknown</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-sand-700 mb-2">
              Size
            </label>
            <select
              id="size"
              name="size"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="">Unknown</option>
              <option value="SMALL">Small</option>
              <option value="MEDIUM">Medium</option>
              <option value="LARGE">Large</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-sand-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue="AVAILABLE"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="AVAILABLE">Available</option>
              <option value="ADOPTED">Adopted</option>
              <option value="SPONSORED">Sponsored</option>
              <option value="FOSTERED">Fostered</option>
              <option value="MEDICAL">Medical Hold</option>
              <option value="DECEASED">Deceased</option>
            </select>
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
              placeholder="/images/dogs/example.jpg"
            />
          </div>

          {/* Short Description */}
          <div className="md:col-span-2">
            <label htmlFor="shortDescription" className="block text-sm font-medium text-sand-700 mb-2">
              Short Description
            </label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              placeholder="One-liner for dog cards"
            />
          </div>

          {/* Full Description */}
          <div className="md:col-span-2">
            <label htmlFor="fullDescription" className="block text-sm font-medium text-sand-700 mb-2">
              Full Description
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
              placeholder="Tell us about this dog..."
            />
          </div>

          {/* Compatibility checkboxes */}
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-sand-700 mb-3">Compatibility</p>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="goodWithKids"
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Good with kids</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="goodWithDogs"
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Good with dogs</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="goodWithCats"
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Good with cats</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="houseTrained"
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">House trained</span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-sand-200">
          <Link
            href="/admin/dogs"
            className="px-4 py-2 text-sand-600 hover:text-sand-800 font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creating...' : 'Create Dog'}
          </button>
        </div>
      </form>
    </div>
  );
}
