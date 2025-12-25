import { NextRequest, NextResponse } from 'next/server';
import { IssueService } from '../services/IssueService';
import { IssueValidator } from '../validators/IssueValidator';
import { JwtUtil } from '../utils/JwtUtil';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/Logger';

export class IssueHandler {
  private issueService: IssueService;
  private issueValidator: IssueValidator;

  constructor(issueService: IssueService, issueValidator: IssueValidator) {
    this.issueService = issueService;
    this.issueValidator = issueValidator;
  }

  async handleCreateIssue(req: NextRequest): Promise<NextResponse> {
    const startTime = Date.now();
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';

    try {
      // Extract user from token
      const userId = await this.getUserIdFromRequest(req);

      // Parse request body
      const body = await req.json();

      // Validate input
      this.issueValidator.validateCreateIssue(body);

      // Create issue
      const issue = await this.issueService.createIssue({
        userId,
        type: body.type,
        title: body.title,
        description: body.description,
        priority: body.priority || 'medium',
        status: body.status || 'open'
      });

      // Log issue creation
      logger.audit('ISSUE_CREATED', {
        userId,
        ip: clientIp,
        success: true,
        metadata: { issueId: issue.id, type: body.type, priority: body.priority }
      });

      logger.logRequest('POST', '/api/issues', 201, Date.now() - startTime, {
        userId,
        ip: clientIp
      });

      return NextResponse.json(
        { success: true, data: issue },
        { status: 201 }
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleGetIssues(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract user from token
      const userId = await this.getUserIdFromRequest(req);

      // Get query parameters
      const { searchParams } = new URL(req.url);
      const type = searchParams.get('type');
      const status = searchParams.get('status');
      const search = searchParams.get('search');

      let issues;

      if (search) {
        issues = await this.issueService.searchIssues(userId, search);
      } else {
        const filters: any = {};
        if (type) filters.type = type;
        if (status) filters.status = status;
        
        issues = await this.issueService.getUserIssues(userId, filters);
      }

      return NextResponse.json({
        success: true,
        data: issues
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleGetIssueById(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      // Extract user from token
      const userId = await this.getUserIdFromRequest(req);

      // Get issue
      const issue = await this.issueService.getIssueById(id, userId);

      return NextResponse.json({
        success: true,
        data: issue
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleUpdateIssue(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      // Extract user from token
      const userId = await this.getUserIdFromRequest(req);

      // Parse request body
      const body = await req.json();

      // Validate input
      this.issueValidator.validateUpdateIssue(body);

      // Update issue
      const issue = await this.issueService.updateIssue(id, userId, body);

      return NextResponse.json({
        success: true,
        data: issue
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleDeleteIssue(req: NextRequest, id: string): Promise<NextResponse> {
    try {
      // Extract user from token
      const userId = await this.getUserIdFromRequest(req);

      // Delete issue
      await this.issueService.deleteIssue(id, userId);

      return NextResponse.json({
        success: true,
        message: 'Issue deleted successfully'
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleGetStats(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract user from token
      const userId = await this.getUserIdFromRequest(req);

      // Get stats
      const stats = await this.issueService.getIssueStats(userId);

      return NextResponse.json({
        success: true,
        data: stats
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async getUserIdFromRequest(req: NextRequest): Promise<string> {
    const token = this.extractToken(req);
    if (!token) {
      throw new AppError('Unauthorized', 401);
    }

    const decoded: any = JwtUtil.verify(token);
    if (!decoded || !decoded.id) {
      throw new AppError('Invalid token', 401);
    }

    return decoded.id;
  }

  private extractToken(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

    return parts[1];
  }

  private handleError(error: unknown): NextResponse {
    let statusCode = 500;
    let errorMessage = 'Internal server error';

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      errorMessage = error.message;
    } else if (error instanceof Error) {
      statusCode = 400;
      errorMessage = error.message;
    }

    // Log the error
    if (error instanceof Error) {
      logger.logError(error, `Issue error: ${errorMessage}`, {
        context: 'IssueHandler',
        metadata: { statusCode }
      });
    } else {
      logger.error(`Issue error: ${errorMessage}`, {
        context: 'IssueHandler',
        metadata: { statusCode }
      });
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
