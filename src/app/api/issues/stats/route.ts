import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { IssueHandler } from '@/backend/handlers/IssueHandler';
import { IssueService } from '@/backend/services/IssueService';
import { IssueRepository } from '@/backend/repositories/IssueRepository';
import { IssueValidator } from '@/backend/validators/IssueValidator';

export const dynamic = 'force-dynamic';

let prisma: PrismaClient;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

function getIssueHandler() {
  const issueRepository = new IssueRepository(getPrismaClient());
  const issueService = new IssueService(issueRepository);
  const issueValidator = new IssueValidator();
  return new IssueHandler(issueService, issueValidator);
}

export async function GET(req: NextRequest) {
  const handler = getIssueHandler();
  return handler.handleGetStats(req);
}
