/**
 * Production-Ready Logger Utility
 * Provides structured logging with different log levels
 * Works in both development and production environments
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  userId?: string;
  requestId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableStructured: boolean;
  serviceName: string;
  environment: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private maxLogsInMemory = 1000;

  private constructor() {
    this.config = {
      minLevel: (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
      enableConsole: true,
      enableStructured: process.env.NODE_ENV === 'production',
      serviceName: process.env.SERVICE_NAME || 'apnisec',
      environment: process.env.NODE_ENV || 'development',
    };
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  }

  private formatEntry(entry: LogEntry): string {
    if (this.config.enableStructured) {
      // Production: JSON structured logs
      return JSON.stringify({
        ...entry,
        service: this.config.serviceName,
        env: this.config.environment,
      });
    }

    // Development: Human-readable format
    const levelColors: Record<LogLevel, string> = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
    };
    const reset = '\x1b[0m';
    const color = levelColors[entry.level];

    let output = `${color}[${entry.timestamp}] [${entry.level.toUpperCase()}]${reset}`;
    
    if (entry.context) {
      output += ` [${entry.context}]`;
    }
    
    output += ` ${entry.message}`;

    if (entry.method && entry.path) {
      output += ` | ${entry.method} ${entry.path}`;
    }

    if (entry.statusCode) {
      output += ` | Status: ${entry.statusCode}`;
    }

    if (entry.duration !== undefined) {
      output += ` | Duration: ${entry.duration}ms`;
    }

    if (entry.userId) {
      output += ` | User: ${entry.userId}`;
    }

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      output += ` | ${JSON.stringify(entry.metadata)}`;
    }

    if (entry.error) {
      output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack && this.config.environment !== 'production') {
        output += `\n  Stack: ${entry.error.stack}`;
      }
    }

    return output;
  }

  private log(level: LogLevel, message: string, options: Partial<Omit<LogEntry, 'timestamp' | 'level' | 'message'>> = {}): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...options,
    };

    // Store in memory (for audit trail)
    this.logs.push(entry);
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs.shift();
    }

    if (this.config.enableConsole) {
      const formatted = this.formatEntry(entry);
      switch (level) {
        case 'debug':
          console.debug(formatted);
          break;
        case 'info':
          console.info(formatted);
          break;
        case 'warn':
          console.warn(formatted);
          break;
        case 'error':
          console.error(formatted);
          break;
      }
    }
  }

  public debug(message: string, options?: Partial<Omit<LogEntry, 'timestamp' | 'level' | 'message'>>): void {
    this.log('debug', message, options);
  }

  public info(message: string, options?: Partial<Omit<LogEntry, 'timestamp' | 'level' | 'message'>>): void {
    this.log('info', message, options);
  }

  public warn(message: string, options?: Partial<Omit<LogEntry, 'timestamp' | 'level' | 'message'>>): void {
    this.log('warn', message, options);
  }

  public error(message: string, options?: Partial<Omit<LogEntry, 'timestamp' | 'level' | 'message'>>): void {
    this.log('error', message, options);
  }

  // Convenience method for logging errors with Error objects
  public logError(error: Error, message: string, options?: Partial<Omit<LogEntry, 'timestamp' | 'level' | 'message' | 'error'>>): void {
    this.error(message, {
      ...options,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }

  // HTTP Request logging
  public logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    options?: {
      userId?: string;
      ip?: string;
      userAgent?: string;
      requestId?: string;
      metadata?: Record<string, unknown>;
    }
  ): void {
    const level: LogLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    this.log(level, `HTTP ${method} ${path}`, {
      context: 'HTTP',
      method,
      path,
      statusCode,
      duration,
      ...options,
    });
  }

  // Audit logging for security events
  public audit(
    action: string,
    options: {
      userId?: string;
      ip?: string;
      success: boolean;
      metadata?: Record<string, unknown>;
    }
  ): void {
    this.info(`AUDIT: ${action}`, {
      context: 'AUDIT',
      userId: options.userId,
      ip: options.ip,
      metadata: {
        action,
        success: options.success,
        ...options.metadata,
      },
    });
  }

  // Security event logging
  public security(
    event: string,
    options: {
      userId?: string;
      ip?: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      metadata?: Record<string, unknown>;
    }
  ): void {
    const level: LogLevel = options.severity === 'critical' || options.severity === 'high' ? 'error' : 'warn';
    this.log(level, `SECURITY: ${event}`, {
      context: 'SECURITY',
      userId: options.userId,
      ip: options.ip,
      metadata: {
        event,
        severity: options.severity,
        ...options.metadata,
      },
    });
  }

  // Get recent logs (for debugging/admin purposes)
  public getRecentLogs(count: number = 100, level?: LogLevel): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = this.logs.filter(log => LOG_LEVELS[log.level] >= LOG_LEVELS[level]);
    }
    return filtered.slice(-count);
  }

  // Clear logs from memory
  public clearLogs(): void {
    this.logs = [];
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export class for testing purposes
export { Logger };
