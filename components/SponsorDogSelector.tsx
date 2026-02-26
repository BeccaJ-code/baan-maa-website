'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui';

interface SponsorableDog {
  id: string;
  name: string;
  slug: string;
  featuredImage: string | null;
  sponsorshipGoal: number | null;
}

interface SponsorDogSelectorProps {
  dogs: SponsorableDog[];
}

export default function SponsorDogSelector({ dogs }: SponsorDogSelectorProps) {
  const searchParams = useSearchParams();
  const [selectedDogs, setSelectedDogs] = useState<SponsorableDog[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pre-select dog from query param
  useEffect(() => {
    const dogSlug = searchParams.get('dog');
    if (dogSlug) {
      const found = dogs.find((d) => d.slug === dogSlug);
      if (found) {
        setSelectedDogs([found]);
      }
    }
  }, [searchParams, dogs]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const availableToSelect = dogs.filter(
    (d) => !selectedDogs.some((s) => s.id === d.id)
  );

  const getMonthlyAmount = (dog: SponsorableDog) => dog.sponsorshipGoal ?? 20;

  const total = selectedDogs.reduce((sum, dog) => sum + getMonthlyAmount(dog), 0);

  const addDog = (dog: SponsorableDog) => {
    setSelectedDogs((prev) => [...prev, dog]);
    setDropdownOpen(false);
    setError(null);
  };

  const removeDog = (dogId: string) => {
    setSelectedDogs((prev) => prev.filter((d) => d.id !== dogId));
  };

  const handleSubmit = async () => {
    if (selectedDogs.length === 0) {
      setError('Please select at least one dog to sponsor.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const dogNames = selectedDogs.map((d) => d.name).join(', ');

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'gbp',
          donationType: 'monthly',
          projectName: `Sponsorship: ${dogNames}`,
          successUrl: `${window.location.origin}/donate/success`,
          cancelUrl: `${window.location.origin}/sponsorship`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="font-display text-2xl font-bold text-blue-800 mb-2">
        Choose Dogs to Sponsor
      </h2>
      <p className="text-sand-600 mb-6">
        Select one or more dogs to sponsor with a monthly donation.
      </p>

      {/* Selected dogs */}
      {selectedDogs.length > 0 && (
        <div className="space-y-3 mb-6">
          {selectedDogs.map((dog) => (
            <div
              key={dog.id}
              className="flex items-center gap-4 p-3 bg-sand-50 rounded-xl border border-sand-200"
            >
              <div className="w-12 h-12 relative rounded-full overflow-hidden bg-sand-200 shrink-0">
                {dog.featuredImage ? (
                  <Image
                    src={dog.featuredImage}
                    alt={dog.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sand-400 text-lg">
                    🐕
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-blue-800 truncate">{dog.name}</p>
                <p className="text-sm text-sand-600">
                  £{getMonthlyAmount(dog)}/month
                </p>
              </div>
              <button
                onClick={() => removeDog(dog.id)}
                className="text-sand-400 hover:text-red-500 transition-colors p-1"
                aria-label={`Remove ${dog.name}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dog selector dropdown */}
      {availableToSelect.length > 0 && (
        <div className="relative mb-6" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-2 px-4 py-3 border-2 border-dashed border-sand-300 rounded-xl text-sand-600 hover:border-teal-400 hover:text-teal-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {selectedDogs.length === 0 ? 'Select a dog to sponsor' : 'Add another dog'}
          </button>

          {dropdownOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-sand-200 max-h-64 overflow-y-auto">
              {availableToSelect.map((dog) => (
                <button
                  key={dog.id}
                  onClick={() => addDog(dog)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sand-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 relative rounded-full overflow-hidden bg-sand-200 shrink-0">
                    {dog.featuredImage ? (
                      <Image
                        src={dog.featuredImage}
                        alt={dog.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sand-400 text-sm">
                        🐕
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-blue-800 truncate">{dog.name}</p>
                    <p className="text-xs text-sand-500">
                      £{getMonthlyAmount(dog)}/month
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Total */}
      {selectedDogs.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl mb-6">
          <span className="font-semibold text-blue-800">Monthly total</span>
          <span className="text-2xl font-bold text-teal-700">£{total}/month</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={selectedDogs.length === 0 || isLoading}
        loading={isLoading}
        fullWidth
        size="lg"
      >
        {selectedDogs.length === 0
          ? 'Select a dog to sponsor'
          : `Sponsor ${selectedDogs.length === 1 ? selectedDogs[0].name : `${selectedDogs.length} dogs`} — £${total}/month`
        }
      </Button>

      <p className="mt-4 text-center text-sm text-sand-500 flex items-center justify-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure payment via Stripe
      </p>
    </div>
  );
}
