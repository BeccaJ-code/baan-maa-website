'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import HoneypotField from './HoneypotField';
import { cn } from '@/lib/utils';

// =============================================================================
// Contact Form Component
// =============================================================================

export interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      honeypot: formData.get('website') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
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
          Message Sent!
        </h3>
        <p className="text-teal-700">
          Thank you for contacting us. We&apos;ll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <HoneypotField />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="name"
          label="Your Name"
          placeholder="John Smith"
          required
        />
        <Input
          name="email"
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          required
        />
      </div>

      <Input
        name="subject"
        label="Subject"
        placeholder="How can we help?"
        required
      />

      <Textarea
        name="message"
        label="Message"
        placeholder="Tell us more about your enquiry..."
        rows={6}
        required
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" loading={isSubmitting} fullWidth>
        Send Message
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
