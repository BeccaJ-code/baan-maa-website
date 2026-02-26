'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { DogStatus, DogSize, DogSex } from '@/types';

// =============================================================================
// Dog Filters Component
// =============================================================================

interface FilterOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'SPONSORED', label: 'Sponsored' },
  { value: 'FOSTERED', label: 'In Foster' },
];

const SIZE_OPTIONS: FilterOption[] = [
  { value: 'SMALL', label: 'Small' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LARGE', label: 'Large' },
];

const SEX_OPTIONS: FilterOption[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

const COMPATIBILITY_OPTIONS: FilterOption[] = [
  { value: 'kids', label: 'Good with kids' },
  { value: 'dogs', label: 'Good with dogs' },
  { value: 'cats', label: 'Good with cats' },
];

export interface DogFiltersProps {
  className?: string;
}

export default function DogFilters({ className }: DogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentStatus = searchParams.get('status')?.split(',') || [];
  const currentSize = searchParams.get('size')?.split(',') || [];
  const currentSex = searchParams.get('sex') || '';
  const currentCompatibility = searchParams.get('compat')?.split(',') || [];

  // Update URL with new filters
  const updateFilters = useCallback((key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (values.length > 0) {
      params.set(key, values.join(','));
    } else {
      params.delete(key);
    }

    router.push(`/dogs?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const toggleFilter = (key: string, value: string, current: string[]) => {
    const newValues = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilters(key, newValues);
  };

  const setSingleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/dogs?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push('/dogs', { scroll: false });
  };

  const hasActiveFilters = currentStatus.length > 0 || currentSize.length > 0 || currentSex || currentCompatibility.length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Filter Sections */}
      <div className="flex flex-wrap gap-6">
        {/* Status */}
        <FilterGroup label="Status">
          {STATUS_OPTIONS.map(option => (
            <FilterChip
              key={option.value}
              label={option.label}
              isActive={currentStatus.includes(option.value)}
              onClick={() => toggleFilter('status', option.value, currentStatus)}
            />
          ))}
        </FilterGroup>

        {/* Size */}
        <FilterGroup label="Size">
          {SIZE_OPTIONS.map(option => (
            <FilterChip
              key={option.value}
              label={option.label}
              isActive={currentSize.includes(option.value)}
              onClick={() => toggleFilter('size', option.value, currentSize)}
            />
          ))}
        </FilterGroup>

        {/* Sex */}
        <FilterGroup label="Sex">
          {SEX_OPTIONS.map(option => (
            <FilterChip
              key={option.value}
              label={option.label}
              isActive={currentSex === option.value}
              onClick={() => setSingleFilter('sex', currentSex === option.value ? '' : option.value)}
            />
          ))}
        </FilterGroup>

        {/* Compatibility */}
        <FilterGroup label="Compatible with">
          {COMPATIBILITY_OPTIONS.map(option => (
            <FilterChip
              key={option.value}
              label={option.label}
              isActive={currentCompatibility.includes(option.value)}
              onClick={() => toggleFilter('compat', option.value, currentCompatibility)}
            />
          ))}
        </FilterGroup>
      </div>

      {/* Clear All */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// =============================================================================
// Filter Group
// =============================================================================

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-sand-600 mr-1">{label}:</span>
      {children}
    </div>
  );
}

// =============================================================================
// Filter Chip
// =============================================================================

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function FilterChip({ label, isActive, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
        isActive
          ? 'bg-teal-600 text-white'
          : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
      )}
    >
      {label}
    </button>
  );
}
