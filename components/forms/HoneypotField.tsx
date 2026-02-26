'use client';

// =============================================================================
// Honeypot Field Component (Spam Prevention)
// =============================================================================
// This hidden field catches bots that auto-fill all form fields.
// If this field has a value, the submission is likely spam.

export interface HoneypotFieldProps {
  name?: string;
}

export default function HoneypotField({ name = 'website' }: HoneypotFieldProps) {
  return (
    <div
      className="absolute -left-[9999px] -top-[9999px]"
      aria-hidden="true"
      tabIndex={-1}
    >
      <label htmlFor={name}>Leave this field empty</label>
      <input
        type="text"
        id={name}
        name={name}
        autoComplete="off"
        tabIndex={-1}
      />
    </div>
  );
}
