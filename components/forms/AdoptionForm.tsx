'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import HoneypotField from './HoneypotField';
import { cn } from '@/lib/utils';

// =============================================================================
// Adoption Form Component
// =============================================================================

export interface AdoptionFormProps {
  dogId: string;
  dogName: string;
  className?: string;
}

export default function AdoptionForm({ dogId, dogName, className }: AdoptionFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      dogId,
      dogName,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      city: formData.get('city'),
      homeType: formData.get('homeType'),
      hasGarden: formData.get('hasGarden') === 'yes',
      gardenFenced: formData.get('gardenFenced') === 'yes',
      rentOrOwn: formData.get('rentOrOwn'),
      landlordApproval: formData.get('landlordApproval') === 'yes',
      adultsInHome: parseInt(formData.get('adultsInHome') as string) || 1,
      childrenInHome: parseInt(formData.get('childrenInHome') as string) || 0,
      childrenAges: formData.get('childrenAges'),
      allAgree: formData.get('allAgree') === 'yes',
      currentPets: formData.get('currentPets'),
      previousDogs: formData.get('previousDogs') === 'yes',
      vetName: formData.get('vetName'),
      vetPhone: formData.get('vetPhone'),
      workSchedule: formData.get('workSchedule'),
      hoursAlone: parseInt(formData.get('hoursAlone') as string) || 0,
      exercisePlan: formData.get('exercisePlan'),
      whyAdopt: formData.get('whyAdopt'),
      additionalInfo: formData.get('additionalInfo'),
      honeypot: formData.get('website'),
    };

    try {
      const response = await fetch('/api/adoption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn('bg-teal-50 border border-teal-200 rounded-xl p-8 text-center', className)}>
        <SuccessIcon />
        <h3 className="font-display text-xl font-bold text-teal-800 mt-4 mb-2">
          Application Submitted!
        </h3>
        <p className="text-teal-700">
          Thank you for your interest in adopting {dogName}. We&apos;ll review your application and contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <HoneypotField />

      {/* Progress indicator */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={cn(
              'h-2 flex-1 rounded-full transition-colors',
              s <= step ? 'bg-teal-600' : 'bg-sand-200'
            )}
          />
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-6 animate-fade-up">
          <h3 className="font-display text-lg font-semibold text-blue-800">
            About You
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="name" label="Full Name" required />
            <Input name="email" type="email" label="Email" required />
            <Input name="phone" type="tel" label="Phone Number" required />
            <Input name="country" label="Country" required />
            <Input name="city" label="City" required />
          </div>
        </div>
      )}

      {/* Step 2: Living Situation */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-up">
          <h3 className="font-display text-lg font-semibold text-blue-800">
            Your Home
          </h3>

          <Select
            name="homeType"
            label="Type of Home"
            options={[
              { value: 'house', label: 'House' },
              { value: 'apartment', label: 'Apartment/Flat' },
              { value: 'farm', label: 'Farm/Rural Property' },
              { value: 'other', label: 'Other' },
            ]}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              name="hasGarden"
              label="Do you have a garden/yard?"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
              required
            />
            <Select
              name="gardenFenced"
              label="Is it securely fenced?"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'na', label: 'N/A' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              name="rentOrOwn"
              label="Do you rent or own?"
              options={[
                { value: 'own', label: 'Own' },
                { value: 'rent', label: 'Rent' },
              ]}
              required
            />
            <Select
              name="landlordApproval"
              label="Landlord approval for pets?"
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'na', label: 'N/A (I own)' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="adultsInHome" type="number" label="Adults in household" min={1} required />
            <Input name="childrenInHome" type="number" label="Children in household" min={0} required />
          </div>

          <Input name="childrenAges" label="Ages of children (if any)" />

          <Select
            name="allAgree"
            label="Does everyone in the household agree to the adoption?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            required
          />
        </div>
      )}

      {/* Step 3: Experience & Motivation */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-up">
          <h3 className="font-display text-lg font-semibold text-blue-800">
            Your Experience
          </h3>

          <Textarea
            name="currentPets"
            label="Current pets (type, age, how long owned)"
            placeholder="e.g., 1 cat (5 years old, had since kitten)"
            rows={3}
          />

          <Select
            name="previousDogs"
            label="Have you owned dogs before?"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="vetName" label="Vet name (for reference)" />
            <Input name="vetPhone" label="Vet phone number" />
          </div>

          <Input name="workSchedule" label="Your typical work schedule" required />

          <Input
            name="hoursAlone"
            type="number"
            label="Hours dog would be alone per day"
            min={0}
            max={24}
            required
          />

          <Textarea
            name="exercisePlan"
            label="How will you exercise the dog?"
            rows={3}
            required
          />

          <Textarea
            name="whyAdopt"
            label={`Why do you want to adopt ${dogName}?`}
            rows={4}
            required
          />

          <Textarea
            name="additionalInfo"
            label="Anything else you'd like us to know?"
            rows={3}
          />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {step > 1 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep(step - 1)}
          >
            Back
          </Button>
        )}
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {step < 3 ? 'Continue' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
}

// =============================================================================
// Success Icon
// =============================================================================

function SuccessIcon() {
  return (
    <svg className="w-16 h-16 mx-auto text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
