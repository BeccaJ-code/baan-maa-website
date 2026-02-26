import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageEvents } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string().transform(val => new Date(val)),
  endDate: z.string().optional().transform(val => val ? new Date(val) : null),
  location: z.string().optional(),
  isOnline: z.boolean().optional(),
  featuredImage: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canManageEvents(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
  });

  return NextResponse.json({ success: true, data: events });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canManageEvents(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createEventSchema.parse(body);

    let slug = slugify(data.title);
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        date: data.date,
        endDate: data.endDate,
        location: data.location,
        isOnline: data.isOnline ?? false,
        featuredImage: data.featuredImage,
        isPublished: data.isPublished ?? false,
      },
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Create event error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
