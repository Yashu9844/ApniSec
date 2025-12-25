import { Logger, logger, LogLevel, LogEntry } from '../src/backend/utils/Logger';

describe('Logger', () => {
  let testLogger: Logger;

  beforeEach(() => {
    // Get fresh instance and clear logs
    testLogger = Logger.getInstance();
    testLogger.clearLogs();
    // Configure for testing (disable console output)
    testLogger.configure({
      enableConsole: false,
      minLevel: 'debug'
    });
  });

  afterEach(() => {
    testLogger.clearLogs();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = Logger.getInstance();
      const instance2 = Logger.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Log Levels', () => {
    it('should log debug messages', () => {
      testLogger.debug('Debug message', { context: 'Test' });
      const logs = testLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('debug');
      expect(logs[0].message).toBe('Debug message');
    });

    it('should log info messages', () => {
      testLogger.info('Info message', { context: 'Test' });
      const logs = testLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('info');
    });

    it('should log warn messages', () => {
      testLogger.warn('Warning message', { context: 'Test' });
      const logs = testLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('warn');
    });

    it('should log error messages', () => {
      testLogger.error('Error message', { context: 'Test' });
      const logs = testLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].level).toBe('error');
    });

    it('should filter logs by minimum level', () => {
      testLogger.configure({ minLevel: 'warn', enableConsole: false });
      testLogger.debug('Debug - should be filtered');
      testLogger.info('Info - should be filtered');
      testLogger.warn('Warning - should appear');
      testLogger.error('Error - should appear');
      
      const logs = testLogger.getRecentLogs(10);
      expect(logs).toHaveLength(2);
      expect(logs[0].level).toBe('warn');
      expect(logs[1].level).toBe('error');
    });
  });

  describe('Error Logging', () => {
    it('should log errors with stack traces', () => {
      const error = new Error('Test error');
      testLogger.logError(error, 'An error occurred', { context: 'Test' });
      
      const logs = testLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].error).toBeDefined();
      expect(logs[0].error?.name).toBe('Error');
      expect(logs[0].error?.message).toBe('Test error');
      expect(logs[0].error?.stack).toBeDefined();
    });
  });

  describe('Request Logging', () => {
    it('should log HTTP requests', () => {
      testLogger.logRequest('POST', '/api/auth/login', 200, 150, {
        userId: 'user123',
        ip: '192.168.1.1'
      });
      
      const logs = testLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].method).toBe('POST');
      expect(logs[0].path).toBe('/api/auth/login');
      expect(logs[0].statusCode).toBe(200);
      expect(logs[0].duration).toBe(150);
      expect(logs[0].userId).toBe('user123');
      expect(logs[0].ip).toBe('192.168.1.1');
    });

    it('should log 4xx errors as warnings', () => {
      testLogger.logRequest('GET', '/api/issues', 404, 50);
      
      const logs = testLogger.getRecentLogs(1);
      expect(logs[0].level).toBe('warn');
    });

    it('should log 5xx errors as errors', () => {
      testLogger.logRequest('POST', '/api/issues', 500, 100);
      
      const logs = testLogger.getRecentLogs(1);
      expect(logs[0].level).toBe('error');
    });
  });

  describe('Audit Logging', () => {
    it('should log audit events', () => {
      testLogger.audit('USER_LOGIN', {
        userId: 'user123',
        ip: '192.168.1.1',
        success: true,
        metadata: { email: 'test@example.com' }
      });
      
      const logs = testLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].context).toBe('AUDIT');
      expect(logs[0].metadata?.action).toBe('USER_LOGIN');
      expect(logs[0].metadata?.success).toBe(true);
    });
  });

  describe('Security Logging', () => {
    it('should log security events with appropriate level', () => {
      testLogger.security('BRUTE_FORCE_ATTEMPT', {
        ip: '192.168.1.1',
        severity: 'high',
        metadata: { attempts: 10 }
      });
      
      const logs = testLogger.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].context).toBe('SECURITY');
      expect(logs[0].level).toBe('error'); // high severity = error level
    });

    it('should log low severity security events as warnings', () => {
      testLogger.security('SUSPICIOUS_ACTIVITY', {
        ip: '192.168.1.1',
        severity: 'low'
      });
      
      const logs = testLogger.getRecentLogs(1);
      expect(logs[0].level).toBe('warn');
    });
  });

  describe('Log Retrieval', () => {
    it('should retrieve recent logs with count limit', () => {
      for (let i = 0; i < 10; i++) {
        testLogger.info(`Log ${i}`);
      }
      
      const logs = testLogger.getRecentLogs(5);
      expect(logs).toHaveLength(5);
      expect(logs[0].message).toBe('Log 5');
      expect(logs[4].message).toBe('Log 9');
    });

    it('should filter logs by level when retrieving', () => {
      testLogger.debug('Debug');
      testLogger.info('Info');
      testLogger.warn('Warn');
      testLogger.error('Error');
      
      const errorLogs = testLogger.getRecentLogs(10, 'error');
      expect(errorLogs).toHaveLength(1);
      expect(errorLogs[0].level).toBe('error');
    });
  });

  describe('Log Entry Structure', () => {
    it('should include timestamp in ISO format', () => {
      testLogger.info('Test');
      const logs = testLogger.getRecentLogs(1);
      expect(logs[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should include all optional fields', () => {
      testLogger.info('Test', {
        context: 'TestContext',
        userId: 'user123',
        requestId: 'req456',
        method: 'POST',
        path: '/api/test',
        statusCode: 200,
        duration: 100,
        ip: '127.0.0.1',
        userAgent: 'TestAgent',
        metadata: { key: 'value' }
      });
      
      const log = testLogger.getRecentLogs(1)[0];
      expect(log.context).toBe('TestContext');
      expect(log.userId).toBe('user123');
      expect(log.requestId).toBe('req456');
      expect(log.method).toBe('POST');
      expect(log.path).toBe('/api/test');
      expect(log.statusCode).toBe(200);
      expect(log.duration).toBe(100);
      expect(log.ip).toBe('127.0.0.1');
      expect(log.userAgent).toBe('TestAgent');
      expect(log.metadata).toEqual({ key: 'value' });
    });
  });
});
