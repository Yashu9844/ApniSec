import { NextRequest } from 'next/server';
import { UserHandler } from '@/backend/handlers/UserHandler';
import { UserService } from '@/backend/services/UserService';
import { UserRepository } from '@/backend/repositories/UserRepository';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

let prisma: PrismaClient;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

function getUserHandler() {
  const userRepository = new UserRepository(getPrismaClient());
  const userService = new UserService(userRepository);
  return new UserHandler(userService);
}

export async function GET(req: NextRequest) {
  const handler = getUserHandler();
  return handler.handleGetProfile(req);
}

export async function PUT(req: NextRequest) {
  const handler = getUserHandler();
  return handler.handleUpdateProfile(req);
}
