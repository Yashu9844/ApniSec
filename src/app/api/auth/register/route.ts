import { NextRequest } from 'next/server';
import { AuthHandler } from '@/backend/handlers/AuthHandler';
import { AuthService } from '@/backend/services/AuthService';
import { UserRepository } from '@/backend/repositories/UserRepository';
import { JwtUtil } from '@/backend/utils/JwtUtil';
import { EmailUtil } from '@/backend/utils/EmailUtil';
import { AuthValidator } from '@/backend/validators/AuthValidator';
import { RateLimiter } from '@/backend/utils/RateLimiter';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

let prisma: PrismaClient;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function POST(req: NextRequest) {
  const userRepository = new UserRepository(getPrismaClient());
  const authService = new AuthService(userRepository, new JwtUtil(), EmailUtil);
  const authValidator = new AuthValidator();
  const rateLimiter = new RateLimiter();
  const authHandler = new AuthHandler(authService, authValidator, rateLimiter);

  return authHandler.handleRegister(req);
}
