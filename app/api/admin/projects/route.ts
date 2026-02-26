import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser, canManageProjects } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  goalAmount: z.number().optional(),
  raisedAmount: z.number().optional(),
  featuredImage: z.string().optional(),
  isActive: z.boolean().optional(),
  isPriority: z.boolean().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !canManageProjects(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ isPriority: 'desc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ success: true, data: projects });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canManageProjects(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = createProjectSchema.parse(body);

    let slug = slugify(data.title);
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        goalAmount: data.goalAmount,
        raisedAmount: data.raisedAmount ?? 0,
        featuredImage: data.featuredImage,
        isActive: data.isActive ?? true,
        isPriority: data.isPriority ?? false,
      },
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Create project error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
