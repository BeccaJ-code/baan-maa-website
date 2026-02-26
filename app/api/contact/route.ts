import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactEmail, isHoneypotFilled } from '@/lib/email';
import { formRateLimiter, getClientIP, checkRateLimit } from '@/lib/rate-limit';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  honeypot: z.string().optional(),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request.headers);
  const rateLimitResponse = checkRateLimit(formRateLimiter, ip);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Check honeypot
    if (isHoneypotFilled(data.honeypot)) {
      // Silently reject spam
      return NextResponse.json({ success: true });
    }

    // Send email
    await sendContactEmail({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Invalid data' },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
