import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageStories } from '@/lib/auth';

const updateStorySchema = z.object({
  dogName: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  summary: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  beforeImage: z.string().optional().nullable(),
  afterImage: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).optional(),
  adoptedTo: z.string().optional().nullable(),
  adoptedDate: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageStories(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const story = await prisma.successStory.findUnique({ where: { id } });

  if (!story) {
    return NextResponse.json({ error: 'Story not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: story });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageStories(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = updateStorySchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };

    if (data.galleryImages) {
      updateData.galleryImages = JSON.stringify(data.galleryImages);
    }
    if (data.adoptedDate !== undefined) {
      updateData.adoptedDate = data.adoptedDate ? new Date(data.adoptedDate) : null;
    }

    const story = await prisma.successStory.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: story });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Update story error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const user = await getCurrentUser();
  if (!user || !canManageStories(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.successStory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete story error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
