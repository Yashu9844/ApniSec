import { NextRequest } from 'next/server';
import { AuthHandler } from '@/backend/handlers/AuthHandler';
import { AuthService } from '@/backend/services/AuthService';
import { UserRepository } from '@/backend/repositories/UserRepository';
import { JwtUtil } from '@/backend/utils/JwtUtil';
import { EmailUtil } from '@/backend/utils/EmailUtil';
import { AuthValidator } from '@/backend/validators/AuthValidator';
import { RateLimiter } from '@/backend/utils/RateLimiter';

export async function GET(req: NextRequest) {
  const userRepository = new UserRepository();
  const authService = new AuthService(userRepository, new JwtUtil(), new EmailUtil());
  const authValidator = new AuthValidator();
  const rateLimiter = new RateLimiter();
  const authHandler = new AuthHandler(authService, authValidator, rateLimiter);

  return authHandler.handleGetMe(req);
}
