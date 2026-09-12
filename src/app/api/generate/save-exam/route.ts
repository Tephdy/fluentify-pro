export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Your save-exam logic here...

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save exam error:', error);
    return NextResponse.json({ error: 'Failed to save exam.' }, { status: 500 });
  }
}