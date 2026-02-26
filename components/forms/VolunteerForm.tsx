'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import HoneypotField from './HoneypotField';
import { cn } from '@/lib/utils';

// =============================================================================
// Volunteer Form Component
// =============================================================================

const SKILL_OPTIONS = [
  'Dog handling',
  'Veterinary/medical',
  'Photography',
  'Graphic design',
  'Social media',
  'Writing/content',
  'Fundraising',
  'Event planning',
  'Translation',
  'Web development',
  'Administration',
  'Driving/transport',
];

export interface VolunteerFormProps {
  className?: string;
}

export default function VolunteerForm({ className }: VolunteerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      country: formData.get('country'),
      volunteerType: formData.get('volunteerType'),
      availability: formData.get('availability'),
      startDate: formData.get('startDate'),
      experience: formData.get('experience'),
      skills: selectedSkills,
      motivation: formData.get('motivation'),
      additionalInfo: formData.get('additionalInfo'),
      honeypot: formData.get('website'),
    };

    try {
      const response = await fetch('/api/volunteer', {
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
          Application Received!
        </h3>
        <p className="text-teal-700">
          Thank you for wanting to volunteer with us. We&apos;ll review your application and be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <HoneypotField />

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input name="name" label="Full Name" required />
        <Input name="email" type="email" label="Email" required />
        <Input name="phone" type="tel" label="Phone Number" required />
        <Input name="country" label="Country" required />
      </div>

      {/* Volunteer Type */}
      <Select
        name="volunteerType"
        label="How would you like to volunteer?"
        options={[
          { value: 'onsite', label: 'On-site at our sanctuary in Thailand' },
          { value: 'remote', label: 'Remote/virtual support' },
          { value: 'foster', label: 'Foster a dog' },
          { value: 'transport', label: 'Help with transport/logistics' },
        ]}
        required
      />

      {/* Availability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Textarea
          name="availability"
          label="Your availability"
          placeholder="e.g., Weekends, 2-3 hours per week"
          rows={2}
          required
        />
        <Input
          name="startDate"
          type="date"
          label="Available from"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-sand-700 mb-3">
          Your skills (select all that apply)
        </label>
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-full transition-all',
                selectedSkills.includes(skill)
                  ? 'bg-teal-600 text-white'
                  : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
              )}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Experience */}
      <Textarea
        name="experience"
        label="Relevant experience"
        placeholder="Tell us about your experience with animals, volunteering, or any relevant skills..."
        rows={4}
        required
      />

      {/* Motivation */}
      <Textarea
        name="motivation"
        label="Why do you want to volunteer with Baan Maa?"
        rows={4}
        required
      />

      {/* Additional */}
      <Textarea
        name="additionalInfo"
        label="Anything else you'd like us to know?"
        rows={3}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" loading={isSubmitting} fullWidth>
        Submit Application
      </Button>
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
