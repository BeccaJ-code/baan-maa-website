import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageStories } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const createStorySchema = z.object({
  dogName: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional().nullable(),
  content: z.string().min(1),
  beforeImage: z.string().optional().nullable(),
  afterImage: z.string().optional().nullable(),
  galleryImages: z.array(z.string()).optional(),
  adoptedTo: z.string().optional().nullable(),
  adoptedDate: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canManageStories(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stories = await prisma.successStory.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: stories });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canManageStories(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createStorySchema.parse(body);

    // Generate slug from dog name + title
    let slug = slugify(`${data.dogName}-${data.title}`);

    // Ensure unique slug
    const existing = await prisma.successStory.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const story = await prisma.successStory.create({
      data: {
        slug,
        dogName: data.dogName,
        title: data.title,
        summary: data.summary,
        content: data.content,
        beforeImage: data.beforeImage,
        afterImage: data.afterImage,
        galleryImages: data.galleryImages ? JSON.stringify(data.galleryImages) : null,
        adoptedTo: data.adoptedTo,
        adoptedDate: data.adoptedDate ? new Date(data.adoptedDate) : null,
        location: data.location,
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? false,
      },
    });

    return NextResponse.json({ success: true, data: story }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Create story error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create story' },
      { status: 500 }
    );
  }
}
