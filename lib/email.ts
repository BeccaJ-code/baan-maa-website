import nodemailer from 'nodemailer';
import type { ContactFormData, AdoptionFormData, VolunteerFormData } from '@/types';

// =============================================================================
// Email Configuration
// =============================================================================

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_ADDRESS = process.env.SMTP_FROM || 'noreply@baanmaa.org';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'beccaj@baanmaa.org';

// =============================================================================
// Email Templates
// =============================================================================

function wrapInTemplate(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #2d2a25; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e4a9e; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { background: #faf9f7; padding: 24px; border: 1px solid #e8e4dc; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 16px; }
    .label { font-weight: 600; color: #5c574e; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { margin-top: 4px; }
    .footer { text-align: center; padding: 16px; color: #787166; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Baan Maa Dog Rescue</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      This email was sent from the Baan Maa website.
    </div>
  </div>
</body>
</html>
`;
}

// =============================================================================
// Send Functions
// =============================================================================

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const content = `
    <h2>New Contact Form Submission</h2>
    <div class="field">
      <div class="label">Name</div>
      <div class="value">${escapeHtml(data.name)}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
    </div>
    <div class="field">
      <div class="label">Subject</div>
      <div class="value">${escapeHtml(data.subject)}</div>
    </div>
    <div class="field">
      <div class="label">Message</div>
      <div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
    </div>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: CONTACT_EMAIL,
    replyTo: data.email,
    subject: `[Contact] ${data.subject}`,
    html: wrapInTemplate(content, 'Contact Form Submission'),
    text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\n${data.message}`,
  });
}

export async function sendAdoptionEmail(data: AdoptionFormData): Promise<void> {
  const content = `
    <h2>New Adoption Enquiry</h2>

    <h3>Dog Information</h3>
    <div class="field">
      <div class="label">Dog</div>
      <div class="value">${escapeHtml(data.dogName)} (ID: ${escapeHtml(data.dogId)})</div>
    </div>

    <h3>Applicant Information</h3>
    <div class="field">
      <div class="label">Name</div>
      <div class="value">${escapeHtml(data.name)}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
    </div>
    <div class="field">
      <div class="label">Phone</div>
      <div class="value">${escapeHtml(data.phone)}</div>
    </div>
    <div class="field">
      <div class="label">Location</div>
      <div class="value">${escapeHtml(data.city)}, ${escapeHtml(data.country)}</div>
    </div>

    <h3>Living Situation</h3>
    <div class="field">
      <div class="label">Home Type</div>
      <div class="value">${escapeHtml(data.homeType)}</div>
    </div>
    <div class="field">
      <div class="label">Has Garden</div>
      <div class="value">${data.hasGarden ? 'Yes' : 'No'}${data.gardenFenced ? ' (Fenced)' : ''}</div>
    </div>
    <div class="field">
      <div class="label">Rent/Own</div>
      <div class="value">${escapeHtml(data.rentOrOwn)}${data.landlordApproval !== undefined ? ` (Landlord Approval: ${data.landlordApproval ? 'Yes' : 'No'})` : ''}</div>
    </div>

    <h3>Household</h3>
    <div class="field">
      <div class="label">Adults</div>
      <div class="value">${data.adultsInHome}</div>
    </div>
    <div class="field">
      <div class="label">Children</div>
      <div class="value">${data.childrenInHome}${data.childrenAges ? ` (Ages: ${escapeHtml(data.childrenAges)})` : ''}</div>
    </div>
    <div class="field">
      <div class="label">All Agree to Adoption</div>
      <div class="value">${data.allAgree ? 'Yes' : 'No'}</div>
    </div>

    <h3>Pet Experience</h3>
    <div class="field">
      <div class="label">Current Pets</div>
      <div class="value">${escapeHtml(data.currentPets) || 'None'}</div>
    </div>
    <div class="field">
      <div class="label">Previous Dog Experience</div>
      <div class="value">${data.previousDogs ? 'Yes' : 'No'}</div>
    </div>
    ${data.vetName ? `
    <div class="field">
      <div class="label">Vet Reference</div>
      <div class="value">${escapeHtml(data.vetName)} - ${escapeHtml(data.vetPhone || 'No phone')}</div>
    </div>
    ` : ''}

    <h3>Work & Lifestyle</h3>
    <div class="field">
      <div class="label">Work Schedule</div>
      <div class="value">${escapeHtml(data.workSchedule)}</div>
    </div>
    <div class="field">
      <div class="label">Hours Alone</div>
      <div class="value">${data.hoursAlone} hours per day</div>
    </div>
    <div class="field">
      <div class="label">Exercise Plan</div>
      <div class="value">${escapeHtml(data.exercisePlan)}</div>
    </div>

    <h3>Motivation</h3>
    <div class="field">
      <div class="label">Why Adopt</div>
      <div class="value">${escapeHtml(data.whyAdopt).replace(/\n/g, '<br>')}</div>
    </div>
    ${data.additionalInfo ? `
    <div class="field">
      <div class="label">Additional Information</div>
      <div class="value">${escapeHtml(data.additionalInfo).replace(/\n/g, '<br>')}</div>
    </div>
    ` : ''}
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: CONTACT_EMAIL,
    replyTo: data.email,
    subject: `[Adoption Enquiry] ${data.dogName} - ${data.name}`,
    html: wrapInTemplate(content, 'Adoption Enquiry'),
  });
}

export async function sendVolunteerEmail(data: VolunteerFormData): Promise<void> {
  const volunteerTypes: Record<string, string> = {
    onsite: 'On-site at Sanctuary',
    remote: 'Remote/Virtual',
    foster: 'Foster Care',
    transport: 'Transport/Logistics',
  };

  const content = `
    <h2>New Volunteer Application</h2>

    <h3>Contact Information</h3>
    <div class="field">
      <div class="label">Name</div>
      <div class="value">${escapeHtml(data.name)}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
    </div>
    <div class="field">
      <div class="label">Phone</div>
      <div class="value">${escapeHtml(data.phone)}</div>
    </div>
    <div class="field">
      <div class="label">Country</div>
      <div class="value">${escapeHtml(data.country)}</div>
    </div>

    <h3>Volunteer Details</h3>
    <div class="field">
      <div class="label">Type</div>
      <div class="value">${volunteerTypes[data.volunteerType] || data.volunteerType}</div>
    </div>
    <div class="field">
      <div class="label">Availability</div>
      <div class="value">${escapeHtml(data.availability)}</div>
    </div>
    ${data.startDate ? `
    <div class="field">
      <div class="label">Start Date</div>
      <div class="value">${escapeHtml(data.startDate)}</div>
    </div>
    ` : ''}

    <h3>Experience & Skills</h3>
    <div class="field">
      <div class="label">Experience</div>
      <div class="value">${escapeHtml(data.experience).replace(/\n/g, '<br>')}</div>
    </div>
    <div class="field">
      <div class="label">Skills</div>
      <div class="value">${data.skills.map(s => escapeHtml(s)).join(', ')}</div>
    </div>

    <h3>Motivation</h3>
    <div class="field">
      <div class="value">${escapeHtml(data.motivation).replace(/\n/g, '<br>')}</div>
    </div>
    ${data.additionalInfo ? `
    <div class="field">
      <div class="label">Additional Information</div>
      <div class="value">${escapeHtml(data.additionalInfo).replace(/\n/g, '<br>')}</div>
    </div>
    ` : ''}
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: CONTACT_EMAIL,
    replyTo: data.email,
    subject: `[Volunteer Application] ${data.name} - ${volunteerTypes[data.volunteerType]}`,
    html: wrapInTemplate(content, 'Volunteer Application'),
  });
}

// =============================================================================
// Donation / Sponsorship Notification
// =============================================================================

export interface DonationNotificationData {
  amount: number;
  currency: string;
  donationType: 'once' | 'monthly' | string;
  projectName?: string;
  appealId?: string;
  customerEmail?: string;
}

export async function sendDonationNotification(data: DonationNotificationData): Promise<void> {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: data.currency.toUpperCase(),
  });
  const formattedAmount = formatter.format(data.amount);
  const isMonthly = data.donationType === 'monthly';
  const isSponsorship = data.projectName?.toLowerCase().startsWith('sponsorship');

  let typeLabel = 'One-time Donation';
  if (isSponsorship) {
    typeLabel = 'Monthly Sponsorship';
  } else if (isMonthly) {
    typeLabel = 'Monthly Donation';
  }

  const subject = isSponsorship
    ? `[Sponsorship] ${formattedAmount}/month - ${data.projectName}`
    : `[Donation] ${formattedAmount}${isMonthly ? '/month' : ''} received`;

  const content = `
    <h2>New ${typeLabel} Received!</h2>
    <div class="field">
      <div class="label">Amount</div>
      <div class="value" style="font-size: 24px; font-weight: bold; color: #0d9488;">${formattedAmount}${isMonthly ? ' / month' : ''}</div>
    </div>
    <div class="field">
      <div class="label">Type</div>
      <div class="value">${typeLabel}</div>
    </div>
    ${data.projectName ? `
    <div class="field">
      <div class="label">Allocated To</div>
      <div class="value">${escapeHtml(data.projectName)}</div>
    </div>
    ` : `
    <div class="field">
      <div class="label">Allocated To</div>
      <div class="value">General Fund</div>
    </div>
    `}
    ${data.customerEmail ? `
    <div class="field">
      <div class="label">Donor Email</div>
      <div class="value"><a href="mailto:${escapeHtml(data.customerEmail)}">${escapeHtml(data.customerEmail)}</a></div>
    </div>
    ` : ''}
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: CONTACT_EMAIL,
    subject,
    html: wrapInTemplate(content, typeLabel),
    text: `${typeLabel}: ${formattedAmount}${isMonthly ? '/month' : ''}\nAllocated to: ${data.projectName || 'General Fund'}\nDonor: ${data.customerEmail || 'Unknown'}`,
  });
}

// =============================================================================
// Newsletter Subscriber Notification
// =============================================================================

export async function sendSubscriberNotification(email: string, source?: string): Promise<void> {
  const content = `
    <h2>New Newsletter Subscriber</h2>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
    </div>
    <div class="field">
      <div class="label">Source</div>
      <div class="value">${escapeHtml(source || 'website')}</div>
    </div>
    <div class="field">
      <div class="label">Date</div>
      <div class="value">${new Date().toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</div>
    </div>
  `;

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: 'beccaj@baanmaa.org',
    subject: `[Newsletter] New subscriber: ${email}`,
    html: wrapInTemplate(content, 'New Subscriber'),
    text: `New newsletter subscriber: ${email}\nSource: ${source || 'website'}\nDate: ${new Date().toLocaleString('en-GB')}`,
  });
}

// =============================================================================
// Utilities
// =============================================================================

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// =============================================================================
// Spam Prevention
// =============================================================================

export function isHoneypotFilled(honeypot?: string): boolean {
  return !!honeypot && honeypot.trim().length > 0;
}
