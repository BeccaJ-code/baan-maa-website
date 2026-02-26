import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageDogs } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const createDogSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['AVAILABLE', 'ADOPTED', 'SPONSORED', 'FOSTERED', 'MEDICAL', 'DECEASED']).optional(),
  age: z.string().optional(),
  sex: z.enum(['MALE', 'FEMALE']).optional(),
  size: z.enum(['SMALL', 'MEDIUM', 'LARGE']).optional(),
  breed: z.string().optional(),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  rescueStory: z.string().optional(),
  goodWithKids: z.boolean().optional(),
  goodWithDogs: z.boolean().optional(),
  goodWithCats: z.boolean().optional(),
  houseTrained: z.boolean().optional(),
  traits: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  sponsorshipGoal: z.number().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canManageDogs(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dogs = await prisma.dog.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ success: true, data: dogs });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canManageDogs(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createDogSchema.parse(body);

    // Generate slug from name
    let slug = slugify(data.name);

    // Ensure unique slug
    const existing = await prisma.dog.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const dog = await prisma.dog.create({
      data: {
        name: data.name,
        slug,
        status: data.status || 'AVAILABLE',
        age: data.age,
        sex: data.sex,
        size: data.size,
        breed: data.breed,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        rescueStory: data.rescueStory,
        goodWithKids: data.goodWithKids ?? false,
        goodWithDogs: data.goodWithDogs ?? false,
        goodWithCats: data.goodWithCats ?? false,
        houseTrained: data.houseTrained ?? false,
        traits: data.traits ? JSON.stringify(data.traits) : null,
        images: data.images ? JSON.stringify(data.images) : null,
        featuredImage: data.featuredImage,
        sponsorshipGoal: data.sponsorshipGoal,
      },
    });

    return NextResponse.json({ success: true, data: dog }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Create dog error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create dog' },
      { status: 500 }
    );
  }
}
