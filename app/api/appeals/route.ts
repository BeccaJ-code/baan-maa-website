import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const urgent = searchParams.get('urgent') === 'true';
  const active = searchParams.get('active') === 'true';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const appeals = await prisma.appeal.findMany({
      where: {
        ...(active && { isActive: true }),
        ...(urgent && { isUrgent: true, isActive: true }),
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return NextResponse.json({ success: true, data: appeals });
  } catch (error) {
    console.error('Fetch appeals error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch appeals' },
      { status: 500 }
    );
  }
}
