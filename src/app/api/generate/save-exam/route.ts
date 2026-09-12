export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userName, examScores, overallScore } = body;

    if (!userName || !examScores) {
      return NextResponse.json({ error: 'Missing required exam data.' }, { status: 400 });
    }

    // 1. Find or create the user
    let user = await prisma.user.findFirst({
      where: { name: userName },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { name: userName },
      });
    }

    // 2. Create the Exam Session record
    const examSession = await prisma.examSession.create({
      data: {
        userId: user.id,
        overallScore: overallScore || 0,
      },
    });

    // 3. Insert individual module scores (Only once)
    const moduleEntries = Object.entries(examScores).map(([moduleName, score]) => ({
      sessionId: examSession.id,
      moduleName,
      score: Number(score),
    }));

    await prisma.moduleScore.createMany({
      data: moduleEntries,
    });

    // 4. Generate a unique Certificate Code if it's a full exam
    const certCode = `TEPHDYTECH-BPO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const certificate = await prisma.certificate.create({
      data: {
        sessionId: examSession.id,
        certificateCode: certCode,
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: examSession.id,
      certificateCode: certificate.certificateCode,
    });

  } catch (error: any) {
    console.error('Database save error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}