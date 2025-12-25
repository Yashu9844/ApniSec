import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

export class JwtUtil {
  static sign(payload: object, expiresIn: string = '7d'): string {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verify(token: string): any {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }
}
