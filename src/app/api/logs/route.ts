import { NextRequest, NextResponse } from 'next/server';
import { logger, LogLevel } from '@/backend/utils/Logger';
import { JwtUtil } from '@/backend/utils/JwtUtil';

// Admin endpoint to retrieve logs
// In production, you would add proper admin authentication
export async function GET(req: NextRequest) {
  try {
    // Verify token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = JwtUtil.verify(token);
    
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const count = parseInt(searchParams.get('count') || '100');
    const level = searchParams.get('level') as LogLevel | null;

    // Get logs
    const logs = logger.getRecentLogs(count, level || undefined);

    logger.info('Logs retrieved', { 
      context: 'LogsAPI', 
      userId: decoded.id,
      metadata: { count: logs.length, level }
    });

    return NextResponse.json({
      success: true,
      data: {
        logs,
        total: logs.length,
        retrievedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.logError(error instanceof Error ? error : new Error('Unknown error'), 'Failed to retrieve logs', {
      context: 'LogsAPI'
    });

    return NextResponse.json(
      { success: false, error: 'Failed to retrieve logs' },
      { status: 500 }
    );
  }
}
