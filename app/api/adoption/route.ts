import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendAdoptionEmail, isHoneypotFilled } from '@/lib/email';
import { formRateLimiter, getClientIP, checkRateLimit } from '@/lib/rate-limit';

const adoptionSchema = z.object({
  dogId: z.string(),
  dogName: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  country: z.string().min(1),
  city: z.string().min(1),
  homeType: z.enum(['house', 'apartment', 'farm', 'other']),
  hasGarden: z.boolean(),
  gardenFenced: z.boolean(),
  rentOrOwn: z.enum(['rent', 'own']),
  landlordApproval: z.boolean().optional(),
  adultsInHome: z.number().min(1),
  childrenInHome: z.number().min(0),
  childrenAges: z.string().optional(),
  allAgree: z.boolean(),
  currentPets: z.string(),
  previousDogs: z.boolean(),
  vetName: z.string().optional(),
  vetPhone: z.string().optional(),
  workSchedule: z.string(),
  hoursAlone: z.number().min(0).max(24),
  exercisePlan: z.string(),
  whyAdopt: z.string().min(10),
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
    const data = adoptionSchema.parse(body);

    // Check honeypot
    if (isHoneypotFilled(data.honeypot)) {
      return NextResponse.json({ success: true });
    }

    // Send email
    await sendAdoptionEmail(data);

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

    console.error('Adoption form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
