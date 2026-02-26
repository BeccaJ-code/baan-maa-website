'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Dog {
  id: string;
  name: string;
  slug: string;
  breed: string | null;
  age: string | null;
  sex: string | null;
  size: string | null;
  status: string;
  shortDescription: string | null;
  fullDescription: string | null;
  featuredImage: string | null;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  houseTrained: boolean;
}

export default function EditDogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const res = await fetch(`/api/admin/dogs/${id}`);
        const data = await res.json();
        if (data.success) {
          setDog(data.data);
        } else {
          setError('Dog not found');
        }
      } catch {
        setError('Failed to load dog');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
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
      const res = await fetch(`/api/admin/dogs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Failed to update dog');
        setIsSaving(false);
        return;
      }

      router.push('/admin/dogs');
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this dog? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/dogs/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const result = await res.json();
        setError(result.error || 'Failed to delete dog');
        setIsDeleting(false);
        return;
      }

      router.push('/admin/dogs');
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

  if (!dog) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-blue-900 mb-4">Dog Not Found</h1>
        <Link href="/admin/dogs" className="text-teal-600 hover:underline">
          Back to Dogs
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/dogs"
          className="text-sand-600 hover:text-blue-700 text-sm mb-2 inline-block"
        >
          ← Back to Dogs
        </Link>
        <h1 className="text-3xl font-display font-bold text-blue-900">Edit {dog.name}</h1>
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
              defaultValue={dog.name}
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
              defaultValue={dog.breed || ''}
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
              defaultValue={dog.age || ''}
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
              defaultValue={dog.sex || ''}
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
              defaultValue={dog.size || ''}
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
              defaultValue={dog.status}
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
              defaultValue={dog.featuredImage || ''}
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
              defaultValue={dog.shortDescription || ''}
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
              defaultValue={dog.fullDescription || ''}
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
                  defaultChecked={dog.goodWithKids}
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Good with kids</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="goodWithDogs"
                  defaultChecked={dog.goodWithDogs}
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Good with dogs</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="goodWithCats"
                  defaultChecked={dog.goodWithCats}
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">Good with cats</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="houseTrained"
                  defaultChecked={dog.houseTrained}
                  className="w-4 h-4 rounded border-sand-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sand-700">House trained</span>
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
            {isDeleting ? 'Deleting...' : 'Delete Dog'}
          </button>
          <div className="flex gap-4">
            <Link
              href="/admin/dogs"
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
