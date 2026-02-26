import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageDogs } from '@/lib/auth';

const updateDogSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(['AVAILABLE', 'ADOPTED', 'SPONSORED', 'FOSTERED', 'MEDICAL', 'DECEASED']).optional(),
  age: z.string().optional().nullable(),
  sex: z.enum(['MALE', 'FEMALE']).optional().nullable(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional().nullable(),
  breed: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  rescueStory: z.string().optional().nullable(),
  goodWithKids: z.boolean().optional(),
  goodWithDogs: z.boolean().optional(),
  goodWithCats: z.boolean().optional(),
  houseTrained: z.boolean().optional(),
  traits: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  featuredImage: z.string().optional().nullable(),
  sponsorshipGoal: z.number().optional().nullable(),
  sponsorshipTotal: z.number().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageDogs(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const dog = await prisma.dog.findUnique({ where: { id } });

  if (!dog) {
    return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: dog });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageDogs(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = updateDogSchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };

    // Convert arrays to JSON strings
    if (data.traits) {
      updateData.traits = JSON.stringify(data.traits);
    }
    if (data.images) {
      updateData.images = JSON.stringify(data.images);
    }

    const dog = await prisma.dog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: dog });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Update dog error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update dog' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageDogs(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.dog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete dog error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete dog' },
      { status: 500 }
    );
  }
}
