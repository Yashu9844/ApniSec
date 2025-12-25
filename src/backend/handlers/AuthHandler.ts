import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/AuthService';
import { AuthValidator } from '../validators/AuthValidator';
import { RateLimiter } from '../utils/RateLimiter';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/Logger';

export class AuthHandler {
  private authService: AuthService;
  private authValidator: AuthValidator;
  private rateLimiter: RateLimiter;

  constructor(
    authService: AuthService,
    authValidator: AuthValidator,
    rateLimiter: RateLimiter
  ) {
    this.authService = authService;
    this.authValidator = authValidator;
    this.rateLimiter = rateLimiter;
  }

  async handleRegister(req: NextRequest): Promise<NextResponse> {
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const startTime = Date.now();
    
    try {
      // Check rate limit
      await this.rateLimiter.checkLimit(clientIp);

      // Parse request body
      const body = await req.json();
      
      // Validate input
      this.authValidator.validateRegister(body);

      // Register user
      const result = await this.authService.register(
        body.name,
        body.email,
        body.password
      );

      // Log successful registration
      logger.audit('USER_REGISTERED', {
        userId: result.user.id,
        ip: clientIp,
        success: true,
        metadata: { email: body.email }
      });

      logger.logRequest('POST', '/api/auth/register', 201, Date.now() - startTime, {
        userId: result.user.id,
        ip: clientIp
      });

      const response = NextResponse.json({
        success: true,
        data: result
      }, { status: 201 });

      // Add rate limit headers
      this.addRateLimitHeaders(response, clientIp);
      return response;
    } catch (error) {
      return this.handleError(error, clientIp);
    }
  }

  async handleLogin(req: NextRequest): Promise<NextResponse> {
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const startTime = Date.now();
    
    try {
      // Check rate limit
      await this.rateLimiter.checkLimit(clientIp);

      // Parse request body
      const body = await req.json();
      
      // Validate input
      this.authValidator.validateLogin(body);

      // Login user
      const result = await this.authService.login(body.email, body.password);

      // Log successful login
      logger.audit('USER_LOGIN', {
        userId: result.user.id,
        ip: clientIp,
        success: true,
        metadata: { email: body.email }
      });

      logger.logRequest('POST', '/api/auth/login', 200, Date.now() - startTime, {
        userId: result.user.id,
        ip: clientIp
      });

      const response = NextResponse.json({
        success: true,
        data: result
      });

      // Add rate limit headers
      this.addRateLimitHeaders(response, clientIp);
      return response;
    } catch (error) {
      return this.handleError(error, clientIp);
    }
  }

  async handleGetMe(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract and verify token
      const token = this.extractToken(req);
      if (!token) {
        throw new AppError('Unauthorized', 401);
      }

      // Verify token and get user ID
      const decoded: any = require('../utils/JwtUtil').JwtUtil.verify(token);
      
      // Get user details
      const user = await this.authService.getUserById(decoded.id);

      return NextResponse.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleLogout(req: NextRequest): Promise<NextResponse> {
    try {
      // Extract token
      const token = this.extractToken(req);
      if (!token) {
        throw new AppError('Unauthorized', 401);
      }

      // Verify token and get user ID
      const decoded: any = require('../utils/JwtUtil').JwtUtil.verify(token);
      
      // Logout user (cleanup if needed)
      await this.authService.logout(decoded.id);

      return NextResponse.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: unknown, clientIp?: string): NextResponse {
    let response: NextResponse;
    let statusCode = 500;
    let errorMessage = 'Internal server error';

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      errorMessage = error.message;
      response = NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    } else if (error instanceof Error) {
      // Check if it's a rate limit error
      if (error.message.includes('Rate limit exceeded')) {
        statusCode = 429;
        errorMessage = 'Rate limit exceeded';
        response = NextResponse.json(
          { success: false, error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
        // Log rate limit security event
        logger.security('RATE_LIMIT_EXCEEDED', {
          ip: clientIp,
          severity: 'medium'
        });
      } else {
        statusCode = 400;
        errorMessage = error.message;
        response = NextResponse.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      }
    } else {
      response = NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Log the error
    if (error instanceof Error) {
      logger.logError(error, `Auth error: ${errorMessage}`, {
        context: 'AuthHandler',
        ip: clientIp,
        metadata: { statusCode }
      });
    } else {
      logger.error(`Auth error: ${errorMessage}`, {
        context: 'AuthHandler',
        ip: clientIp,
        metadata: { statusCode }
      });
    }

    // Add rate limit headers if we have clientIp
    if (clientIp) {
      this.addRateLimitHeaders(response, clientIp);
    }

    return response;
  }

  private addRateLimitHeaders(response: NextResponse, clientIp: string): void {
    const headers = this.rateLimiter.getRateLimitHeaders(clientIp);
    response.headers.set('X-RateLimit-Limit', headers['X-RateLimit-Limit']);
    response.headers.set('X-RateLimit-Remaining', headers['X-RateLimit-Remaining']);
    response.headers.set('X-RateLimit-Reset', headers['X-RateLimit-Reset']);
  }

  private extractToken(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

    return parts[1];
  }
}
