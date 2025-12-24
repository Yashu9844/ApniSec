export class RateLimiter {
  private requests: Map<string, number[]>;
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.requests = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async checkLimit(identifier: string): Promise<void> {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Filter out old requests outside the time window
    const recentRequests = requests.filter(time => now - time < this.windowMs);

    if (recentRequests.length >= this.maxRequests) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(time => now - time < this.windowMs);
    return recentRequests.length >= this.maxRequests;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter(time => now - time < this.windowMs);
    return Math.max(0, this.maxRequests - recentRequests.length);
  }
}
