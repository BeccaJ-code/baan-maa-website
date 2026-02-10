import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageAppeals } from '@/lib/auth';

const updateAppealSchema = z.object({
  title: z.string().min(1).optional(),
  dogName: z.string().optional().nullable(),
  summary: z.string().min(1).optional(),
  content: z.string().optional().nullable(),
  goalAmount: z.number().positive().optional(),
  raisedAmount: z.number().optional(),
  featuredImage: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
  priority: z.number().optional(),
  deadline: z.string().optional().nullable(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageAppeals(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const appeal = await prisma.appeal.findUnique({ where: { id } });

  if (!appeal) {
    return NextResponse.json({ error: 'Appeal not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: appeal });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageAppeals(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = updateAppealSchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };

    if (data.deadline !== undefined) {
      updateData.deadline = data.deadline ? new Date(data.deadline) : null;
    }

    const appeal = await prisma.appeal.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: appeal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Update appeal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update appeal' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageAppeals(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.appeal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete appeal error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete appeal' },
      { status: 500 }
    );
  }
}
