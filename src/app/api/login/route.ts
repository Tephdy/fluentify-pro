export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
    }

    const trimmedName = name.trim();

    let user = await prisma.user.findFirst({
      where: { name: trimmedName },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { name: trimmedName },
      });
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Database error during login.' }, { status: 500 });
  }
}