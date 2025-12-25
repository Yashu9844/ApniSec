import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { EmailUtil } from '@/backend/utils/EmailUtil';
import { JwtUtil } from '@/backend/utils/JwtUtil';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

let prisma: PrismaClient;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  const db = getPrismaClient();
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.',
      });
    }

    // Generate reset token (expires in 1 hour)
    const resetToken = JwtUtil.sign(
      { id: user.id, email: user.email, type: 'password-reset' },
      '1h'
    );

    // Send password reset email
    await EmailUtil.sendPasswordResetEmail(user.email, user.name, resetToken);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.',
    });

  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
