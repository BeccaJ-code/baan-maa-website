import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageAppeals } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const createAppealSchema = z.object({
  title: z.string().min(1),
  dogName: z.string().optional().nullable(),
  summary: z.string().min(1),
  content: z.string().optional().nullable(),
  goalAmount: z.number().positive(),
  raisedAmount: z.number().optional(),
  featuredImage: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  priority: z.number().optional(),
  deadline: z.string().optional().nullable(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canManageAppeals(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const appeals = await prisma.appeal.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: appeals });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canManageAppeals(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createAppealSchema.parse(body);

    // Generate slug from title
    let slug = slugify(data.title);

    // Ensure unique slug
    const existing = await prisma.appeal.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const appeal = await prisma.appeal.create({
      data: {
        slug,
        title: data.title,
        dogName: data.dogName,
        summary: data.summary,
        content: data.content,
        goalAmount: data.goalAmount,
        raisedAmount: data.raisedAmount ?? 0,
        featuredImage: data.featuredImage,
        isActive: data.isActive ?? true,
        isUrgent: data.isUrgent ?? true,
        priority: data.priority ?? 0,
        deadline: data.deadline ? new Date(data.deadline) : null,
      },
    });

    return NextResponse.json({ success: true, data: appeal }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Create appeal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create appeal' },
      { status: 500 }
    );
  }
}
