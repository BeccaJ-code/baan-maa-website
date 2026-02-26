import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendVolunteerEmail, isHoneypotFilled } from '@/lib/email';
import { formRateLimiter, getClientIP, checkRateLimit } from '@/lib/rate-limit';

const volunteerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  country: z.string().min(1),
  volunteerType: z.enum(['onsite', 'remote', 'foster', 'transport']),
  availability: z.string().min(1),
  startDate: z.string().optional(),
  experience: z.string().min(10),
  skills: z.array(z.string()),
  motivation: z.string().min(10),
  additionalInfo: z.string().optional(),
  honeypot: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request.headers);
  const rateLimitResponse = checkRateLimit(formRateLimiter, ip);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const data = volunteerSchema.parse(body);

    // Check honeypot
    if (isHoneypotFilled(data.honeypot)) {
      return NextResponse.json({ success: true });
    }

    // Send email
    await sendVolunteerEmail(data);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Invalid data' },
        { status: 400 }
      );
    }

    console.error('Volunteer form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
