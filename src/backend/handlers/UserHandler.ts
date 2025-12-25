import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/UserService';
import { JwtUtil } from '../utils/JwtUtil';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/Logger';

export class UserHandler {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async handleGetProfile(req: NextRequest): Promise<NextResponse> {
    try {
      const userId = await this.getUserIdFromRequest(req);
      const profile = await this.userService.getUserProfile(userId);

      return NextResponse.json({
        success: true,
        data: profile
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleUpdateProfile(req: NextRequest): Promise<NextResponse> {
    const startTime = Date.now();
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';

    try {
      const userId = await this.getUserIdFromRequest(req);
      const body = await req.json();

      // Validate input
      this.validateUpdateProfile(body);

      const updatedProfile = await this.userService.updateUserProfile(userId, body);

      // Log profile update
      logger.audit('PROFILE_UPDATED', {
        userId,
        ip: clientIp,
        success: true,
        metadata: { 
          fieldsUpdated: Object.keys(body).filter(k => k !== 'password'),
          passwordChanged: !!body.password 
        }
      });

      logger.logRequest('PUT', '/api/users/profile', 200, Date.now() - startTime, {
        userId,
        ip: clientIp
      });

      return NextResponse.json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private validateUpdateProfile(data: any) {
    if (data.name && (typeof data.name !== 'string' || data.name.trim().length < 2)) {
      throw new AppError('Name must be at least 2 characters long', 400);
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new AppError('Invalid email format', 400);
    }

    if (data.password && data.password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
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
      logger.logError(error, `User handler error: ${errorMessage}`, {
        context: 'UserHandler',
        metadata: { statusCode }
      });
    } else {
      logger.error(`User handler error: ${errorMessage}`, {
        context: 'UserHandler',
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
